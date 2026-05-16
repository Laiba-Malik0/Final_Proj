const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware'); // Ye file abhi banani hai

router.post('/add', protect, createTask);
router.get('/all', protect, getTasks);

module.exports = router;