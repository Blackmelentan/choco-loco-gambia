/**
 * Kaabu Technologies - RBAC and JWT Authentication Configuration
 * Granular permissions across Admin, Shift Manager, POS Cashier, and Floor Staff
 */

const env = require('./env');

const ROLES = {
  ADMIN: 'admin',
  SHIFT_MANAGER: 'shift_manager',
  POS_CASHIER: 'pos_cashier',
  FLOOR_STAFF: 'floor_staff'
};

const PERMISSIONS = {
  [ROLES.ADMIN]: [
    'godseye:view',
    'staff:read', 'staff:write', 'staff:delete',
    'shifts:read', 'shifts:write', 'shifts:approve',
    'timeclock:read', 'timeclock:override',
    'payroll:calculate', 'payroll:disburse',
    'sales:read', 'sales:manage', 'expenses:write',
    'menu:read', 'menu:write'
  ],
  [ROLES.SHIFT_MANAGER]: [
    'godseye:view',
    'staff:read',
    'shifts:read', 'shifts:write', 'shifts:approve',
    'timeclock:read', 'timeclock:override',
    'payroll:calculate',
    'sales:read', 'expenses:write',
    'menu:read'
  ],
  [ROLES.POS_CASHIER]: [
    'sales:read', 'sales:manage',
    'orders:create', 'orders:update',
    'menu:read',
    'timeclock:self'
  ],
  [ROLES.FLOOR_STAFF]: [
    'timeclock:self',
    'shifts:self',
    'orders:view'
  ]
};

module.exports = {
  secret: env.jwt.secret,
  expiresIn: env.jwt.expiresIn,
  refreshExpiresIn: env.jwt.refreshExpiresIn,
  roles: ROLES,
  permissions: PERMISSIONS,
  hasPermission: (userRole, requiredPermission) => {
    const userPermissions = PERMISSIONS[userRole] || [];
    return userPermissions.includes(requiredPermission);
  }
};
