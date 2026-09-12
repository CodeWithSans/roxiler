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
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ],
  USER: [{ to: '/stores', label: 'Stores' }],
  OWNER: [{ to: '/owner', label: 'Dashboard' }],
}
