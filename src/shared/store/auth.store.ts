import { create } from 'zustand';

type AuthRole = 'patient' | 'doctor' | 'donor';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: AuthRole | null;
  pendingEmail: string | null;
  pendingResetContact: string | null;
  setAuth: (userId: string, role: AuthRole) => void;
  setPendingEmail: (email: string) => void;
  setPendingResetContact: (contact: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  role: null,
  pendingEmail: null,
  pendingResetContact: null,
  setAuth: (userId, role) => set({ isAuthenticated: true, userId, role }),
  setPendingEmail: (email) => set({ pendingEmail: email }),
  setPendingResetContact: (contact) => set({ pendingResetContact: contact }),
  clearAuth: () => set({ isAuthenticated: false, userId: null, role: null, pendingEmail: null, pendingResetContact: null }),
}));
