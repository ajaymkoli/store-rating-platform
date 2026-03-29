const pool = require('../db');
const bcrypt = require('bcryptjs');
const { validateEmail, validatePassword } = require('../utils/validations');

// Get Admin Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const usersCount = await pool.query('SELECT COUNT(*) FROM users');
        const storesCount = await pool.query('SELECT COUNT(*) FROM stores');
        const ratingsCount = await pool.query('SELECT COUNT(*) FROM ratings');

        res.json({
            totalUsers: parseInt(usersCount.rows[0].count), // [cite: 19]
            totalStores: parseInt(storesCount.rows[0].count), // [cite: 20]
            totalRatings: parseInt(ratingsCount.rows[0].count) // [cite: 21]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// Admin adds a new user (Normal, Admin, or Store Owner)
exports.addUser = async (req, res) => {
    const { name, email, password, address, role } = req.body; // [cite: 22, 24, 25, 26, 27]

    try {
        // Validations
        if (!name || name.length < 20 || name.length > 60) return res.status(400).json({ error: "Name must be 20-60 characters." });
        if (!validateEmail(email)) return res.status(400).json({ error: "Invalid email format." });
        if (!validatePassword(password)) return res.status(400).json({ error: "Password must meet strict criteria." });

        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) return res.status(400).json({ error: "Email already registered." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Ensure a valid role is provided, otherwise default to normal
        const userRole = ['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'].includes(role) ? role : 'NORMAL_USER';

        const newUser = await pool.query(
            "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
            [name, email, hashedPassword, address, userRole]
        );

        res.status(201).json({ message: "User created successfully", user: newUser.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// Admin adds a new store
exports.addStore = async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    try {
        const newStore = await pool.query(
            "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, email, address, owner_id]
        );
        res.status(201).json({ message: "Store created successfully", store: newStore.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// Get all users (with rating if they are a Store Owner)
exports.getUsers = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id, u.name, u.email, u.address, u.role,
                CASE 
                    WHEN u.role = 'STORE_OWNER' THEN (
                        SELECT COALESCE(ROUND(AVG(r.rating), 1), 0)
                        FROM stores s
                        LEFT JOIN ratings r ON s.id = r.store_id
                        WHERE s.owner_id = u.id
                    )
                    ELSE NULL
                END as rating
            FROM users u
            ORDER BY u.name ASC
        `;
        const users = await pool.query(query);
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// Get all stores for Admin
exports.getStores = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id, s.name, s.email, s.address,
                COALESCE(ROUND(AVG(r.rating), 1), 0) as rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
            ORDER BY s.name ASC
        `;
        const stores = await pool.query(query);
        res.json(stores.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};