/**
 * Kaabu Technologies - Staff Management Routes
 * /api/staff
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../services/database');

// GET /api/staff - List all staff with combined user & profile info
router.get('/', (req, res) => {
  try {
    const staffProfiles = db.findAll('staff_profiles');
    const result = staffProfiles.map(profile => {
      const user = db.findById('users', profile.user_id) || {};
      const activeClock = db.findOne('time_clock_entries', e => 
        e.staff_profile_id === profile.id && e.status === 'active'
      );

      return {
        id: profile.id,
        userId: user.id,
        employeeCode: profile.employee_code,
        fullName: user.full_name || 'Staff Member',
        email: user.email,
        phone: user.phone,
        role: user.role || 'floor_staff',
        positionTitle: profile.position_title,
        hourlyRateGmd: profile.hourly_rate_gmd,
        waveMobileNumber: profile.wave_mobile_number,
        emergencyContact: profile.emergency_contact,
        hiredDate: profile.hired_date,
        isActive: user.is_active !== false,
        onDuty: !!activeClock,
        activeClockIn: activeClock ? activeClock.clock_in_time : null
      };
    });

    res.json(result);
  } catch (err) {
    console.error('[STAFF LIST ERROR]', err);
    res.status(500).json({ error: 'Failed to retrieve staff directory' });
  }
});

// POST /api/staff - Add new staff member
router.post('/', async (req, res) => {
  try {
    const {
      fullName,
      email,
      password = 'ChocoLoco2026!',
      phone,
      role = 'floor_staff',
      positionTitle,
      hourlyRateGmd,
      waveMobileNumber,
      emergencyContact,
      hiredDate = new Date().toISOString().split('T')[0]
    } = req.body;

    if (!fullName || !email || !phone || !hourlyRateGmd || !waveMobileNumber) {
      return res.status(400).json({ error: 'Missing required staff fields' });
    }

    const existingUser = db.findOne('users', u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = db.insert('users', {
      email,
      password_hash: passwordHash,
      full_name: fullName,
      phone,
      role,
      is_active: true
    });

    const employeeCode = `CL-${positionTitle.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const profile = db.insert('staff_profiles', {
      user_id: user.id,
      employee_code: employeeCode,
      position_title: positionTitle,
      hourly_rate_gmd: Number(hourlyRateGmd),
      wave_mobile_number: waveMobileNumber,
      emergency_contact: emergencyContact || '',
      hired_date: hiredDate,
      notes: ''
    });

    res.status(201).json({
      message: 'Staff member created successfully',
      staff: {
        id: profile.id,
        userId: user.id,
        employeeCode,
        fullName,
        email,
        phone,
        role,
        positionTitle,
        hourlyRateGmd,
        waveMobileNumber
      }
    });
  } catch (err) {
    console.error('[CREATE STAFF ERROR]', err);
    res.status(500).json({ error: 'Failed to create staff member' });
  }
});

module.exports = router;
