const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) // Append extension
    }
});
const upload = multer({ storage: storage });

router.use(authenticateToken);
router.use(checkRole(['STUDENT']));

// Get current student profile
router.get('/profile', async (req, res) => {
    try {
        const studentResult = await db.query(
            `SELECT s.*, d.name as department_name
             FROM Students s
             LEFT JOIN Departments d ON s.department_id = d.id
             WHERE s.user_id = $1`,
            [req.user.id]
        );
        if(studentResult.rows.length === 0) return res.status(404).json({message: 'Student not found'});
        res.json(studentResult.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload fee receipt
router.post('/fee-receipt', upload.single('receipt_document'), async (req, res) => {
    try {
        const { student_register_number, receipt_number, fee_category, amount, payment_date } = req.body;
        const document_url = req.file ? `/uploads/${req.file.filename}` : null;

        if(!document_url) return res.status(400).json({message: 'Document is required'});

        const query = `
            INSERT INTO FeeReceipts (student_register_number, receipt_number, fee_category, amount, payment_date, document_url)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
        `;
        const values = [student_register_number, receipt_number, fee_category, amount, payment_date, document_url];
        const result = await db.query(query, values);

        // create notification
        await db.query(`INSERT INTO Notifications (user_id, title, message) VALUES ($1, $2, $3)`, [req.user.id, 'Fee Receipt Uploaded', `Fee receipt ${receipt_number} has been uploaded and is pending verification.`]);

        res.status(201).json({ message: 'Fee receipt uploaded successfully', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Submit bank transaction
router.post('/bank-transaction', upload.single('screenshot'), async (req, res) => {
    try {
        const { student_register_number, bank_name, account_holder_name, utr_number, transaction_date, amount, payment_type, fee_receipt_id } = req.body;
        const screenshot_url = req.file ? `/uploads/${req.file.filename}` : null;

        if(!screenshot_url) return res.status(400).json({message: 'Screenshot is required'});

        const query = `
            INSERT INTO BankTransactions (student_register_number, bank_name, account_holder_name, utr_number, transaction_date, amount, payment_type, screenshot_url, fee_receipt_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `;
        const values = [student_register_number, bank_name, account_holder_name, utr_number, transaction_date, amount, payment_type, screenshot_url, fee_receipt_id || null];
        const result = await db.query(query, values);

        res.status(201).json({ message: 'Bank transaction submitted successfully', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get eligible semesters for registration
router.get('/semesters', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Semesters WHERE is_active = true');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get subjects for a semester
router.get('/semesters/:id/subjects', async (req, res) => {
    try {
        // Here we could filter by student's department but we'll fetch all for demo
        const result = await db.query('SELECT * FROM Subjects WHERE semester_id = $1', [req.params.id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Register for semester
router.post('/register-semester', async (req, res) => {
    try {
        const { student_register_number, semester_id, subject_ids } = req.body;

        // Start transaction
        await db.query('BEGIN');

        // Insert registration
        const regResult = await db.query(
            `INSERT INTO Registrations (student_register_number, semester_id, status, registration_date)
             VALUES ($1, $2, 'Submitted', CURRENT_TIMESTAMP) RETURNING id`,
            [student_register_number, semester_id]
        );
        const registrationId = regResult.rows[0].id;

        // Insert subjects securely
        if (subject_ids && subject_ids.length > 0) {
            // Generate parameterized query for multiple inserts
            const placeholders = subject_ids.map((_, i) => `($1, $${i + 2})`).join(', ');
            const values = [registrationId, ...subject_ids];
            await db.query(`INSERT INTO RegistrationSubjects (registration_id, subject_id) VALUES ${placeholders}`, values);
        }

        await db.query('COMMIT');
        res.status(201).json({ message: 'Semester registration submitted successfully', registration_id: registrationId });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
