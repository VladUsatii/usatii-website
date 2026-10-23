export function applicationAdminPath(id) {
  if (!/^\d{1,18}$/.test(String(id))) throw new Error('Invalid application ID.');
  return `/dashboard?tab=applications&application=${id}`;
}

export function safeAdminReturnTo(value) {
  return typeof value === 'string' && /^\/(?:dashboard|admin)(?:\?|$)/.test(value) && !/[\r\n\\]/.test(value) ? value : '/dashboard';
}
