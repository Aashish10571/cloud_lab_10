import type { Note, NoteInput } from "./types";

const BASE = "/api/v1";

export const session = {
  get token() {
    return localStorage.getItem("token");
  },
  get name() {
    return localStorage.getItem("name") ?? "";
  },
  save(token: string, name: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("name", name);
  },
  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
  },
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(BASE + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401 && session.token) {
    session.clear(); // token expired or invalid -> back to login
    window.location.reload();
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.message || body.error || `Request failed (${res.status})`,
    );
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

// Backend returns { token, username } (a bare { token } also works).
interface AuthResponse {
  token: string;
  username?: string;
}

export async function login(email: string, password: string) {
  const d = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  session.save(d.token, d.username ?? email.split("@")[0]);
}

export async function register(name: string, email: string, password: string) {
  await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username: name, email, password }),
  });
  await login(email, password);
}

export async function getNotes(): Promise<Note[]> {
  const d = await request<Note[] | { notes: Note[] }>("/note");
  return Array.isArray(d) ? d : d.notes;
}

export const createNote = (n: NoteInput) =>
  request<Note>("/note", { method: "POST", body: JSON.stringify(n) });

export const updateNote = (id: string, n: NoteInput) =>
  request<Note>(`/note/${id}`, { method: "PATCH", body: JSON.stringify(n) });

export const deleteNote = (id: string) =>
  request<void>(`/note/${id}`, { method: "DELETE" });
