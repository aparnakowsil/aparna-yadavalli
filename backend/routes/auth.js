const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const userResult = await db.query('SELECT * FROM Users WHERE username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        let profile = {};
        if (user.role === 'STUDENT') {
            const studentResult = await db.query('SELECT * FROM Students WHERE user_id = $1', [user.id]);
            if (studentResult.rows.length > 0) {
                 profile = studentResult.rows[0];
                 // Fetch department name
                 const deptResult = await db.query('SELECT name FROM Departments WHERE id = $1', [profile.department_id]);
                 if(deptResult.rows.length > 0) profile.department = deptResult.rows[0].name;
            }
        } else if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
             const adminResult = await db.query('SELECT * FROM Admins WHERE user_id = $1', [user.id]);
             if(adminResult.rows.length > 0) profile = adminResult.rows[0];
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                ...profile
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
