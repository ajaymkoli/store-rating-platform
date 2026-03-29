const pool = require('../db');

// Get all stores with search functionality and ratings
exports.getStores = async (req, res) => {
    try {
        const { search } = req.query;
        const userId = req.user.id; // From the JWT token

        let query = `
            SELECT 
                s.id as store_id, 
                s.name as store_name, 
                s.address,
                COALESCE(ROUND(AVG(r.rating), 1), 0) as overall_rating,
                (SELECT rating FROM ratings WHERE user_id = $1 AND store_id = s.id) as user_submitted_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
        `;
        
        const queryParams = [userId];

        // Add search filter if provided
        if (search) {
            query += ` WHERE s.name ILIKE $2 OR s.address ILIKE $2`;
            queryParams.push(`%${search}%`);
        }

        query += ` GROUP BY s.id ORDER BY s.name ASC`;

        const stores = await pool.query(query, queryParams);
        res.json(stores.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};

// Submit or Modify a Rating (UPSERT)
exports.submitRating = async (req, res) => {
    const { store_id, rating } = req.body;
    const user_id = req.user.id;

    try {
        // Validate rating range
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 1 and 5." });
        }

        // Insert new rating OR Update existing one if the user already rated this store
        const newRating = await pool.query(
            `INSERT INTO ratings (user_id, store_id, rating) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (user_id, store_id) 
             DO UPDATE SET rating = EXCLUDED.rating 
             RETURNING *`,
            [user_id, store_id, rating]
        );

        res.json({ message: "Rating submitted successfully", data: newRating.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server Error" });
    }
};