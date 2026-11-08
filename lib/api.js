export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export function getToken() {
  return typeof window === 'undefined' ? null : localStorage.getItem('token');
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const text = localStorage.getItem('user');
  return text ? JSON.parse(text) : null;
}

export function saveLogin(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearLogin() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export async function api(path, method = 'GET', body = null) {
  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = 'Bearer ' + token;

  const options = { method, headers };
  if (body instanceof FormData) {
    options.body = body;
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(API_URL + path, options);
  } catch (e) {
    throw new Error('Cannot reach the server. Is the Laravel API running?');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const firstError = data.errors ? Object.values(data.errors)[0][0] : null;
    throw new Error(firstError || data.message || 'Something went wrong.');
  }
  return data;
}

export function toFormData(values, isUpdate = false) {
  const form = new FormData();
  Object.keys(values).forEach((key) => {
    const value = values[key];
    if (value !== null && value !== undefined && value !== '') form.append(key, value);
  });
  if (isUpdate) form.append('_method', 'PUT');
  return form;
}

export function money(value, currency = '৳') {
  return currency + Number(value).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

export function updateStoredUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
  window.dispatchEvent(new Event('user-updated'));
}

export function flash(type, message) {
  sessionStorage.setItem('flash', JSON.stringify({ type, message }));
  window.dispatchEvent(new Event('flash'));
}
