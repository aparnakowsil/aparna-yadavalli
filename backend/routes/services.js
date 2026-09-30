const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

router.use(authenticateToken);

// === STUDENT ROUTES (Requires STUDENT role) ===

// Apply for hostel
router.post('/hostel/apply', checkRole(['STUDENT']), async (req, res) => {
    try {
        const { student_register_number, preference } = req.body;
        const result = await db.query(
            `INSERT INTO HostelApplications (student_register_number, preference) VALUES ($1, $2) RETURNING *`,
            [student_register_number, preference]
        );
        res.status(201).json({ message: 'Hostel application submitted', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get bus routes
router.get('/bus/routes', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM BusRoutes');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Apply for bus pass
router.post('/bus/apply', checkRole(['STUDENT']), async (req, res) => {
    try {
        const { student_register_number, route_id, pickup_point } = req.body;
        const result = await db.query(
            `INSERT INTO BusApplications (student_register_number, route_id, pickup_point) VALUES ($1, $2, $3) RETURNING *`,
            [student_register_number, route_id, pickup_point]
        );
        res.status(201).json({ message: 'Bus application submitted', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Request certificate
router.post('/certificates/request', checkRole(['STUDENT']), async (req, res) => {
    try {
        const { student_register_number, certificate_type } = req.body;
        const result = await db.query(
            `INSERT INTO Certificates (student_register_number, certificate_type) VALUES ($1, $2) RETURNING *`,
            [student_register_number, certificate_type]
        );
        res.status(201).json({ message: 'Certificate requested', data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


// === ADMIN ROUTES (Requires ADMIN/SUPERADMIN role) ===

// Get pending hostel applications
router.get('/admin/hostel/applications', checkRole(['ADMIN', 'SUPERADMIN']), async (req, res) => {
    try {
        const result = await db.query(`
            SELECT h.*, s.name as student_name
            FROM HostelApplications h
            JOIN Students s ON h.student_register_number = s.register_number
            ORDER BY h.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get pending bus applications
router.get('/admin/bus/applications', checkRole(['ADMIN', 'SUPERADMIN']), async (req, res) => {
    try {
        const result = await db.query(`
            SELECT b.*, s.name as student_name, r.route_name
            FROM BusApplications b
            JOIN Students s ON b.student_register_number = s.register_number
            JOIN BusRoutes r ON b.route_id = r.id
            ORDER BY b.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
