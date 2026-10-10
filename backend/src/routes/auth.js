/**
 * Kaabu Technologies - Authentication & RBAC Routes
 * /api/auth
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../services/database');
const jwtConfig = require('../../../config/jwt.config');

// Helper: generate tokens
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name
    },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn }
  );
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or credentials' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    const staffProfile = db.findOne('staff_profiles', s => s.user_id === user.id);
    const token = generateToken(user);

    db.logAudit(user.id, 'auth:login', 'users', user.id, req.ip, { email });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        phone: user.phone,
        staffProfile: staffProfile || null
      }
    });
  } catch (err) {
    console.error('[AUTH LOGIN ERROR]', err);
    res.status(500).json({ error: 'Internal authentication server error' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = db.findById('users', decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const staffProfile = db.findOne('staff_profiles', s => s.user_id === user.id);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        phone: user.phone,
        staffProfile
      }
    });
  } catch (err) {
    res.status(401).json({ error: 'Token is invalid or expired' });
  }
});

module.exports = router;
