-- ==============================================================================
-- KAABU TECHNOLOGIES ENTERPRISE DATABASE ARCHITECTURE
-- CLIENT TARGET: CHOCO LOCO PATISSERIE & LOUNGE (PIPELINE, THE GAMBIA)
-- MIGRATION: 002_payroll_and_timeclock.sql
-- DESCRIPTION: Time Tracking, GPS Audit, Shift Swap, & Wave API Payroll Disbursement
-- ==============================================================================

-- 1. STORE SHIFTS & SCHEDULES
CREATE TABLE IF NOT EXISTS store_shifts (
    id VARCHAR(64) PRIMARY KEY,
    staff_profile_id VARCHAR(64) NOT NULL,
    shift_title VARCHAR(100) NOT NULL, -- e.g. 'Morning Patisserie Rush', 'Evening Lounge & Barista'
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    scheduled_hours DECIMAL(5, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'swapped', 'missed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_profile_id) REFERENCES staff_profiles(id) ON DELETE CASCADE
);

-- 2. SHIFT SWAP PROTOCOLS
CREATE TABLE IF NOT EXISTS shift_swap_requests (
    id VARCHAR(64) PRIMARY KEY,
    shift_id VARCHAR(64) NOT NULL,
    requesting_staff_id VARCHAR(64) NOT NULL,
    target_staff_id VARCHAR(64) NOT NULL,
    reason TEXT NOT NULL,
    manager_approval_status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    reviewed_by_user_id VARCHAR(64),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES store_shifts(id) ON DELETE CASCADE,
    FOREIGN KEY (requesting_staff_id) REFERENCES staff_profiles(id),
    FOREIGN KEY (target_staff_id) REFERENCES staff_profiles(id),
    FOREIGN KEY (reviewed_by_user_id) REFERENCES users(id)
);

-- 3. AUDITED TIME CLOCK (CLOCK-IN / CLOCK-OUT WITH GPS & IP)
CREATE TABLE IF NOT EXISTS time_clock_entries (
    id VARCHAR(64) PRIMARY KEY,
    staff_profile_id VARCHAR(64) NOT NULL,
    shift_id VARCHAR(64),
    clock_in_time TIMESTAMP NOT NULL,
    clock_out_time TIMESTAMP,
    clock_in_latitude DECIMAL(10, 8) NOT NULL,
    clock_in_longitude DECIMAL(11, 8) NOT NULL,
    clock_in_ip VARCHAR(45) NOT NULL,
    clock_in_within_geofence BOOLEAN NOT NULL DEFAULT TRUE,
    clock_out_latitude DECIMAL(10, 8),
    clock_out_longitude DECIMAL(11, 8),
    clock_out_ip VARCHAR(45),
    clock_out_within_geofence BOOLEAN,
    total_hours DECIMAL(6, 2) DEFAULT 0.00,
    regular_hours DECIMAL(6, 2) DEFAULT 0.00,
    overtime_hours DECIMAL(6, 2) DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- 'active', 'completed', 'disputed'
    manager_override_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_profile_id) REFERENCES staff_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (shift_id) REFERENCES store_shifts(id)
);

-- 4. PAYROLL CALCULATION RUNS
CREATE TABLE IF NOT EXISTS payroll_runs (
    id VARCHAR(64) PRIMARY KEY,
    run_reference VARCHAR(64) UNIQUE NOT NULL, -- e.g. 'PR-2026-WK41'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_gross_gmd DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_overtime_gmd DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    total_net_gmd DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    disbursement_status VARCHAR(32) NOT NULL DEFAULT 'draft', -- 'draft', 'approved', 'disbursed', 'partially_disbursed'
    approved_by_user_id VARCHAR(64),
    disbursed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (approved_by_user_id) REFERENCES users(id)
);

-- 5. PAYROLL ITEMS PER STAFF MEMBER
CREATE TABLE IF NOT EXISTS payroll_items (
    id VARCHAR(64) PRIMARY KEY,
    payroll_run_id VARCHAR(64) NOT NULL,
    staff_profile_id VARCHAR(64) NOT NULL,
    regular_hours DECIMAL(6, 2) NOT NULL,
    overtime_hours DECIMAL(6, 2) NOT NULL DEFAULT 0.00,
    hourly_rate_gmd DECIMAL(10, 2) NOT NULL,
    overtime_rate_multiplier DECIMAL(3, 2) NOT NULL DEFAULT 1.50,
    gross_pay_gmd DECIMAL(10, 2) NOT NULL,
    deductions_gmd DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    net_pay_gmd DECIMAL(10, 2) NOT NULL,
    wave_payout_status VARCHAR(32) NOT NULL DEFAULT 'pending', -- 'pending', 'queued', 'success', 'failed'
    wave_transaction_id VARCHAR(100),
    disbursed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payroll_run_id) REFERENCES payroll_runs(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_profile_id) REFERENCES staff_profiles(id)
);

-- 6. WAVE API TRANSACTION AUDIT LOG
CREATE TABLE IF NOT EXISTS wave_payout_transactions (
    id VARCHAR(64) PRIMARY KEY,
    payroll_item_id VARCHAR(64),
    staff_profile_id VARCHAR(64) NOT NULL,
    recipient_mobile VARCHAR(32) NOT NULL,
    amount_gmd DECIMAL(10, 2) NOT NULL,
    wave_external_id VARCHAR(100) UNIQUE,
    wave_status VARCHAR(32) NOT NULL, -- 'success', 'processing', 'failed'
    wave_fee_gmd DECIMAL(8, 2) DEFAULT 0.00,
    idempotency_key VARCHAR(100) UNIQUE NOT NULL,
    api_response_payload TEXT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payroll_item_id) REFERENCES payroll_items(id),
    FOREIGN KEY (staff_profile_id) REFERENCES staff_profiles(id)
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_timeclock_staff ON time_clock_entries(staff_profile_id);
CREATE INDEX IF NOT EXISTS idx_timeclock_status ON time_clock_entries(status);
CREATE INDEX IF NOT EXISTS idx_shifts_staff ON store_shifts(staff_profile_id);
CREATE INDEX IF NOT EXISTS idx_payroll_runs_ref ON payroll_runs(run_reference);
