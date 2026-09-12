export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  USER: 'USER',
  OWNER: 'OWNER',
})

export const HOME_BY_ROLE = {
  ADMIN: '/admin',
  USER: '/stores',
  OWNER: '/owner',
}

export const NAV_LINKS = {
  ADMIN: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ],
  USER: [{ to: '/stores', label: 'Stores' }],
  OWNER: [{ to: '/owner', label: 'Dashboard' }],
}

export const ROLE_LABELS = {
  ADMIN: 'Admin',
  USER: 'Normal user',
  OWNER: 'Store owner',
}

