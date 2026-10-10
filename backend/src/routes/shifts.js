/**
 * Kaabu Technologies - Shift Scheduling & Shift Swap Protocols
 * /api/shifts
 */

const express = require('express');
const router = express.Router();
const db = require('../services/database');
const smsService = require('../services/smsService');

// GET /api/shifts - List upcoming and current shifts
router.get('/', (req, res) => {
  try {
    const shifts = db.findAll('store_shifts');
    const enriched = shifts.map(s => {
      const staff = db.findById('staff_profiles', s.staff_profile_id);
      const user = staff ? db.findById('users', staff.user_id) : null;
      return {
        ...s,
        staffName: user ? user.full_name : 'Staff Member',
        employeeCode: staff ? staff.employee_code : 'N/A',
        positionTitle: staff ? staff.position_title : 'N/A'
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error('[SHIFTS LIST ERROR]', err);
    res.status(500).json({ error: 'Failed to retrieve shifts' });
  }
});

// POST /api/shifts - Schedule a new shift
router.post('/', (req, res) => {
  try {
    const { staffProfileId, shiftTitle, startTime, endTime, notes } = req.body;
    if (!staffProfileId || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required shift parameters' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const scheduledHours = Math.max(0, (end - start) / (1000 * 60 * 60));

    const newShift = db.insert('store_shifts', {
      staff_profile_id: staffProfileId,
      shift_title: shiftTitle || 'Regular Store Shift',
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      scheduled_hours: Number(scheduledHours.toFixed(2)),
      status: 'scheduled',
      notes: notes || ''
    });

    res.status(201).json(newShift);
  } catch (err) {
    console.error('[CREATE SHIFT ERROR]', err);
    res.status(500).json({ error: 'Failed to schedule shift' });
  }
});

// GET /api/shifts/swaps - List pending shift swap requests
router.get('/swaps', (req, res) => {
  try {
    const swaps = db.findAll('shift_swap_requests');
    const enriched = swaps.map(swap => {
      const shift = db.findById('store_shifts', swap.shift_id) || {};
      const reqStaff = db.findById('staff_profiles', swap.requesting_staff_id);
      const reqUser = reqStaff ? db.findById('users', reqStaff.user_id) : null;
      const targetStaff = db.findById('staff_profiles', swap.target_staff_id);
      const targetUser = targetStaff ? db.findById('users', targetStaff.user_id) : null;

      return {
        ...swap,
        shiftTitle: shift.shift_title,
        shiftTime: shift.start_time,
        requestingStaffName: reqUser ? reqUser.full_name : 'Staff',
        targetStaffName: targetUser ? targetUser.full_name : 'Staff'
      };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve swap requests' });
  }
});

// POST /api/shifts/swaps - Request a shift swap
router.post('/swaps', (req, res) => {
  try {
    const { shiftId, requestingStaffId, targetStaffId, reason } = req.body;
    if (!shiftId || !requestingStaffId || !targetStaffId || !reason) {
      return res.status(400).json({ error: 'All swap fields are required' });
    }

    const swapRecord = db.insert('shift_swap_requests', {
      shift_id: shiftId,
      requesting_staff_id: requestingStaffId,
      target_staff_id: targetStaffId,
      reason,
      manager_approval_status: 'pending'
    });

    // Automated SMS Alert to Target Staff Member
    const reqStaff = db.findById('staff_profiles', requestingStaffId);
    const reqUser = reqStaff ? db.findById('users', reqStaff.user_id) : null;
    const targetStaff = db.findById('staff_profiles', targetStaffId);
    const shift = db.findById('store_shifts', shiftId);

    if (targetStaff && targetStaff.wave_mobile_number) {
      smsService.notifyShiftSwapRequested({
        requestingStaffName: reqUser ? reqUser.full_name : 'Team Member',
        targetPhone: targetStaff.wave_mobile_number,
        targetStaffName: targetStaff.position_title,
        shiftTitle: shift ? shift.shift_title : 'Store Shift',
        reason
      }).catch(err => console.error('[SMS SWAP REQUEST ERROR]', err));
    }

    res.status(201).json(swapRecord);
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit shift swap request' });
  }
});

// PATCH /api/shifts/swaps/:id/decision - Manager approve or reject swap
router.patch('/swaps/:id/decision', (req, res) => {
  try {
    const { id } = req.params;
    const { decision, reviewedByUserId } = req.body; // 'approved' or 'rejected'

    const swap = db.findById('shift_swap_requests', id);
    if (!swap) return res.status(404).json({ error: 'Swap request not found' });

    const updatedSwap = db.update('shift_swap_requests', id, {
      manager_approval_status: decision,
      reviewed_by_user_id: reviewedByUserId || 'system-admin',
      reviewed_at: new Date().toISOString()
    });

    const shift = db.findById('store_shifts', swap.shift_id);

    if (decision === 'approved') {
      // Transfer shift to the new target staff member
      db.update('store_shifts', swap.shift_id, {
        staff_profile_id: swap.target_staff_id,
        status: 'swapped'
      });
    }

    // Automated SMS Notifications to both staff members
    const reqStaff = db.findById('staff_profiles', swap.requesting_staff_id);
    const targetStaff = db.findById('staff_profiles', swap.target_staff_id);

    if (reqStaff && reqStaff.wave_mobile_number) {
      smsService.notifyShiftSwapDecision({
        requestingPhone: reqStaff.wave_mobile_number,
        targetPhone: targetStaff ? targetStaff.wave_mobile_number : null,
        decision,
        shiftTitle: shift ? shift.shift_title : 'Store Shift'
      }).catch(err => console.error('[SMS SWAP DECISION ERROR]', err));
    }

    res.json(updatedSwap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to process swap decision' });
  }
});

module.exports = router;
