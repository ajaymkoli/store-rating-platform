const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { validateEmail, validatePassword } = require('../utils/validations');

// Register Normal User
exports.register = async (req, res) => {
    const { name, email, password, address } = req.body; // Signup fields [cite: 38, 39, 40, 41, 42]

    try {
        // 1. Strict Form Validations
        if (!name || name.length < 20 || name.length > 60) {
            return res.status(400).json({ error: "Name must be between 20 and 60 characters." }); // [cite: 63]
        }
        if (!address || address.length > 400) {
            return res.status(400).json({ error: "Address cannot exceed 400 characters." }); // [cite: 64]
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ error: "Invalid email format." }); // [cite: 67]
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ error: "Password must be 8-16 characters, with at least one uppercase letter and one special character." }); // [cite: 65, 66]
        }

        // 2. Check if user exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: "Email already registered." });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Insert into database (Role defaults to NORMAL_USER per our schema)
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, address) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
            [name, email, hashedPassword, address]
        );

        res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find User
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // 2. Check Password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        // 3. Generate JWT Token
        // Based on their roles, users will have access to different functionalities [cite: 9]
        const payload = {
            user: {
                id: user.rows[0].id,
                role: user.rows[0].role
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.rows[0].role }); 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};