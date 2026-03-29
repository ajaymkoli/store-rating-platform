const express = require('express');
const router = express.Router();
const { getDashboardStats, addUser, addStore, getUsers, getStores } = require('../controllers/adminController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// Apply middleware to ALL routes in this file
router.use(verifyToken);
router.use(authorizeRole('SYSTEM_ADMIN')); // Only Admins can pass beyond this point [cite: 16]

router.get('/dashboard', getDashboardStats); // 
router.post('/users', addUser); // 
router.post('/stores', addStore); // 
router.get('/users', getUsers);
router.get('/stores', getStores);

module.exports = router;