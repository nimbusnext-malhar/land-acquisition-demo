const KEY = "mmrda_user";

export function login(user) {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function getUser() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthed() {
  return !!getUser();
}
