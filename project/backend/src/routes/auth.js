const express = require('express');
const router = express.Router();
const {
  register, login, getUserInfo, refreshToken, logout, changePassword
} = require('../controllers/authController');
const {
  generateCaptcha, verifyCaptcha
} = require('../controllers/captchaController');
const {
  registerLimiter, loginLimiter, dailyRegisterLimiter
} = require('../middleware/rateLimiter');

// 【关键修改】：不需要花括号，直接引入函数
const authMiddleware = require('../middleware/auth');

router.get('/captcha', generateCaptcha);
router.post('/captcha/verify', verifyCaptcha);
router.post('/register', registerLimiter, dailyRegisterLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/refresh-token', refreshToken);

// 使用 authMiddleware
router.get('/user/info', authMiddleware, getUserInfo);
router.post('/logout', authMiddleware, logout);
router.post('/change-password', authMiddleware, changePassword);

router.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = router;