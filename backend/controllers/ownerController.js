const pool = require('../db');

exports.getOwnerDashboard = async (req, res) => {
    const ownerId = req.user.id; // From JWT

    try {
        // 1. Find the store owned by this user
        const storeResult = await pool.query('SELECT id, name FROM stores WHERE owner_id = $1', [ownerId]);

        if (storeResult.rows.length === 0) {
            return res.status(404).json({ message: "No store assigned to your account yet." });
        }

        const storeId = storeResult.rows[0].id;

        // 2. Get average rating
        const avgRatingResult = await pool.query(
            'SELECT COALESCE(ROUND(AVG(rating), 1), 0) as average_rating FROM ratings WHERE store_id = $1', 
            [storeId]
        );

        // 3. Get list of users who submitted ratings for this store
        const usersResult = await pool.query(`
            SELECT u.name, u.email, r.rating
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = $1
            ORDER BY r.created_at DESC
        `, [storeId]);

        res.json({
            storeName: storeResult.rows[0].name,
            averageRating: parseFloat(avgRatingResult.rows[0].average_rating),
            ratingHistory: usersResult.rows
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};