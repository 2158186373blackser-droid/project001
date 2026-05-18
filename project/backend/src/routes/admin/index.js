const express = require('express');
const router = express.Router();

const dashboardRoutes = require('./dashboard');
const reportRoutes = require('./report');
const userRoutes = require('./user');
const libraryRoutes = require('./library');
const logRoutes = require('./log');   // 新增

router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);
router.use('/library', libraryRoutes);
router.use('/logs', logRoutes);       // 新增

module.exports = router;