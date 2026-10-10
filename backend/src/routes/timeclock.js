/**
 * Kaabu Technologies - Audited Time Clock Routes
 * /api/timeclock
 * Logs GPS coordinates, IP address, and verifies store geofence proximity (Pipeline, The Gambia)
 */

const express = require('express');
const router = express.Router();
const db = require('../services/database');
const env = require('../../../config/env');

// Haversine formula for geofence verification
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// GET /api/timeclock/status/:staffProfileId - Get current clock-in state
router.get('/status/:staffProfileId', (req, res) => {
  const { staffProfileId } = req.params;
  const activeEntry = db.findOne('time_clock_entries', e => 
    e.staff_profile_id === staffProfileId && e.status === 'active'
  );

  res.json({
    isClockedIn: !!activeEntry,
    activeEntry
  });
});

// POST /api/timeclock/clock-in - Clock in with GPS and IP
router.post('/clock-in', (req, res) => {
  try {
    const { staffProfileId, latitude, longitude, shiftId } = req.body;
    if (!staffProfileId) {
      return res.status(400).json({ error: 'staffProfileId is required' });
    }

    // Check if already clocked in
    const activeEntry = db.findOne('time_clock_entries', e => 
      e.staff_profile_id === staffProfileId && e.status === 'active'
    );
    if (activeEntry) {
      return res.status(409).json({ error: 'Staff member is already clocked in', activeEntry });
    }

    const lat = Number(latitude) || env.geofence.storeLatitude;
    const lon = Number(longitude) || env.geofence.storeLongitude;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    const distance = calculateDistanceMeters(
      lat, lon,
      env.geofence.storeLatitude, env.geofence.storeLongitude
    );
    const withinGeofence = distance <= env.geofence.allowedRadiusMeters;

    const entry = db.insert('time_clock_entries', {
      staff_profile_id: staffProfileId,
      shift_id: shiftId || null,
      clock_in_time: new Date().toISOString(),
      clock_out_time: null,
      clock_in_latitude: lat,
      clock_in_longitude: lon,
      clock_in_ip: clientIp,
      clock_in_within_geofence: withinGeofence,
      total_hours: 0,
      regular_hours: 0,
      overtime_hours: 0,
      status: 'active'
    });

    db.logAudit(staffProfileId, 'timeclock:clock_in', 'time_clock_entries', entry.id, clientIp, {
      lat, lon, distanceMeters: Math.round(distance), withinGeofence
    });

    res.status(201).json({
      message: 'Clock-in recorded successfully',
      entry,
      geofence: {
        distanceMeters: Math.round(distance),
        withinGeofence,
        storeLocation: env.brand.location
      }
    });
  } catch (err) {
    console.error('[CLOCK-IN ERROR]', err);
    res.status(500).json({ error: 'Failed to record clock-in' });
  }
});

// POST /api/timeclock/clock-out - Clock out with GPS and compute overtime
router.post('/clock-out', (req, res) => {
  try {
    const { staffProfileId, latitude, longitude } = req.body;
    const activeEntry = db.findOne('time_clock_entries', e => 
      e.staff_profile_id === staffProfileId && e.status === 'active'
    );

    if (!activeEntry) {
      return res.status(404).json({ error: 'No active clock-in found for this staff member' });
    }

    const lat = Number(latitude) || env.geofence.storeLatitude;
    const lon = Number(longitude) || env.geofence.storeLongitude;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    const distance = calculateDistanceMeters(
      lat, lon,
      env.geofence.storeLatitude, env.geofence.storeLongitude
    );
    const withinGeofence = distance <= env.geofence.allowedRadiusMeters;

    const clockOutTime = new Date();
    const clockInTime = new Date(activeEntry.clock_in_time);
    const diffHours = Math.max(0.1, (clockOutTime - clockInTime) / (1000 * 60 * 60));

    // Overtime calculation
    const regularHours = Math.min(8.0, diffHours);
    const overtimeHours = Math.max(0.0, diffHours - 8.0);

    const updated = db.update('time_clock_entries', activeEntry.id, {
      clock_out_time: clockOutTime.toISOString(),
      clock_out_latitude: lat,
      clock_out_longitude: lon,
      clock_out_ip: clientIp,
      clock_out_within_geofence: withinGeofence,
      total_hours: Number(diffHours.toFixed(2)),
      regular_hours: Number(regularHours.toFixed(2)),
      overtime_hours: Number(overtimeHours.toFixed(2)),
      status: 'completed'
    });

    db.logAudit(staffProfileId, 'timeclock:clock_out', 'time_clock_entries', activeEntry.id, clientIp, {
      lat, lon, totalHours: diffHours, overtimeHours
    });

    res.json({
      message: 'Clock-out recorded successfully',
      entry: updated,
      summary: {
        totalHours: Number(diffHours.toFixed(2)),
        regularHours: Number(regularHours.toFixed(2)),
        overtimeHours: Number(overtimeHours.toFixed(2))
      }
    });
  } catch (err) {
    console.error('[CLOCK-OUT ERROR]', err);
    res.status(500).json({ error: 'Failed to record clock-out' });
  }
});

// GET /api/timeclock/entries - List recent time entries
router.get('/entries', (req, res) => {
  const entries = db.findAll('time_clock_entries');
  const enriched = entries.map(e => {
    const staff = db.findById('staff_profiles', e.staff_profile_id);
    const user = staff ? db.findById('users', staff.user_id) : null;
    return {
      ...e,
      staffName: user ? user.full_name : 'Staff Member',
      employeeCode: staff ? staff.employee_code : 'N/A'
    };
  });
  res.json(enriched);
});

module.exports = router;
