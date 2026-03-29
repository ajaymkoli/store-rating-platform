const express = require('express');
const router = express.Router();
const { getStores, submitRating } = require('../controllers/userController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// Apply middleware
router.use(verifyToken);
router.use(authorizeRole('NORMAL_USER')); // Only Normal Users can access these

router.get('/stores', getStores);
router.post('/ratings', submitRating);

module.exports = router;