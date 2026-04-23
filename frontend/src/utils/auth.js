const TOKEN_KEY = 'agrilink_token';
const USER_KEY = 'agrilink_user';

export function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch { return null; }
}

// Backend returns response.data.data = raw JWT string
export function saveSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    const payload = decodeToken(token);
    if (payload) {
      const role = (payload.role || '').replace(/^ROLE_/, '').toUpperCase();
      const id = payload.sub;
      const stored = { id, role, fullName: payload.fullName || '' };
      if (role === 'FARMER') stored.farmerId = id;
      if (role === 'AGENT')  stored.agentId  = id;
      if (role === 'BUYER')  stored.buyerId  = id;
      if (role === 'ADMIN')  stored.adminId  = id;
      localStorage.setItem(USER_KEY, JSON.stringify(stored));
    }
  }
}

export const getToken    = () => localStorage.getItem(TOKEN_KEY);
export const getUser     = () => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } };
export const getUserId   = () => { const p = decodeToken(getToken()); return p?.sub || null; };
export const clearSession = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); };

export function getRole() {
  const token = getToken();
  if (!token) return null;
  const payload = decodeToken(token);
  const raw = payload?.role || payload?.roles?.[0] || '';
  return raw.replace(/^ROLE_/, '').toUpperCase();
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  return Date.now() < payload.exp * 1000;
}

export const ROLE_ROUTES = {
  FARMER: '/dashboard/farmer',
  AGENT:  '/dashboard/agent',
  BUYER:  '/dashboard/buyer',
  ADMIN:  '/dashboard/admin',
};
