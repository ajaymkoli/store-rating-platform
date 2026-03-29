const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

router.use(verifyToken);
router.use(authorizeRole('STORE_OWNER')); // Only Store Owners allowed

router.get('/dashboard', getOwnerDashboard);

module.exports = router;