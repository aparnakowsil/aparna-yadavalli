const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, checkRole } = require('../middleware/auth');

router.use(authenticateToken);
router.use(checkRole(['ADMIN', 'SUPERADMIN']));

// Get dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const studentsCount = await db.query('SELECT COUNT(*) FROM Students');
        const pendingFeesCount = await db.query("SELECT COUNT(*) FROM FeeReceipts WHERE status = 'Pending'");
        const pendingBankCount = await db.query("SELECT COUNT(*) FROM BankTransactions WHERE status = 'Pending'");
        const totalVerifiedFees = await db.query("SELECT SUM(amount) FROM FeeReceipts WHERE status = 'Verified'");

        res.json({
            total_students: parseInt(studentsCount.rows[0].count),
            pending_fees: parseInt(pendingFeesCount.rows[0].count),
            pending_bank_transactions: parseInt(pendingBankCount.rows[0].count),
            total_verified_fees: parseFloat(totalVerifiedFees.rows[0].sum || 0)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all pending fee receipts
router.get('/fee-receipts/pending', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT f.*, s.name as student_name, s.department_id
            FROM FeeReceipts f
            JOIN Students s ON f.student_register_number = s.register_number
            WHERE f.status = 'Pending' OR f.status = 'Under Review'
            ORDER BY f.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify/Reject fee receipt
router.put('/fee-receipts/:id/status', async (req, res) => {
    try {
        const { status, rejection_reason } = req.body;
        const result = await db.query(
            `UPDATE FeeReceipts SET status = $1, rejection_reason = $2 WHERE id = $3 RETURNING *`,
            [status, rejection_reason || null, req.params.id]
        );

        if (result.rows.length === 0) return res.status(404).json({ message: 'Receipt not found' });

        // Add notification for student
        const receipt = result.rows[0];
        const studentResult = await db.query(`SELECT user_id FROM Students WHERE register_number = $1`, [receipt.student_register_number]);
        if(studentResult.rows.length > 0){
            await db.query(`INSERT INTO Notifications (user_id, title, message) VALUES ($1, $2, $3)`,
                [studentResult.rows[0].user_id, 'Fee Receipt Update', `Your fee receipt ${receipt.receipt_number} has been ${status.toLowerCase()}.`]);
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Get all pending bank transactions
router.get('/bank-transactions/pending', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT b.*, s.name as student_name
            FROM BankTransactions b
            JOIN Students s ON b.student_register_number = s.register_number
            WHERE b.status = 'Pending' OR b.status = 'Under Review'
            ORDER BY b.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify/Reject bank transaction
router.put('/bank-transactions/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const result = await db.query(
            `UPDATE BankTransactions SET status = $1 WHERE id = $2 RETURNING *`,
            [status, req.params.id]
        );

        if (result.rows.length === 0) return res.status(404).json({ message: 'Transaction not found' });

        const transaction = result.rows[0];
        const studentResult = await db.query(`SELECT user_id FROM Students WHERE register_number = $1`, [transaction.student_register_number]);
        if(studentResult.rows.length > 0){
            await db.query(`INSERT INTO Notifications (user_id, title, message) VALUES ($1, $2, $3)`,
                [studentResult.rows[0].user_id, 'Bank Transaction Update', `Your bank transaction (${transaction.utr_number}) status is now ${status}.`]);
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// Get all pending semester registrations
router.get('/registrations/pending', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.*, s.name as student_name, sem.semester_number, sem.academic_year
            FROM Registrations r
            JOIN Students s ON r.student_register_number = s.register_number
            JOIN Semesters sem ON r.semester_id = sem.id
            WHERE r.status = 'Submitted'
            ORDER BY r.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve/Reject semester registration
router.put('/registrations/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const result = await db.query(
            `UPDATE Registrations SET status = $1 WHERE id = $2 RETURNING *`,
            [status, req.params.id]
        );

        if (result.rows.length === 0) return res.status(404).json({ message: 'Registration not found' });

        const registration = result.rows[0];
        const studentResult = await db.query(`SELECT user_id FROM Students WHERE register_number = $1`, [registration.student_register_number]);
        if(studentResult.rows.length > 0){
            await db.query(`INSERT INTO Notifications (user_id, title, message) VALUES ($1, $2, $3)`,
                [studentResult.rows[0].user_id, 'Semester Registration Update', `Your semester registration has been ${status.toLowerCase()}.`]);
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
