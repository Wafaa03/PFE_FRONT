const API_BASE = "http://127.0.0.1:5000";
const TOKEN_KEY = "legalAI_access_token";
const USER_KEY = "legalAI_user";

export interface User {
  id: number;
  username: string;
  role: string;
  fullName?: string;
  department?: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function getUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers as Record<string, string>),
    },
  });

  if (response.status === 401) {
    clearAuth();
    window.location.href = "/login";
  }

  return response;
}

export async function login(
  username: string,
  password: string
): Promise<{ access_token: string; user: User }> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Échec de la connexion");
  }

  return {
    access_token: data.access_token,
    user: data.user,
  };
}

export async function register(
  username: string,
  password: string
): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role: "employee" }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Échec de l'inscription");
  }
}
