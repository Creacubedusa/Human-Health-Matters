import { create } from 'zustand';

type AuthRole = 'patient' | 'doctor' | 'donor';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  accessToken: string | null;
  role: AuthRole | null;
  pendingEmail: string | null;
  pendingResetContact: string | null;
  pendingResetCode: string | null;
  setAuth: (userId: string, role: AuthRole) => void;
  setAccessToken: (token: string | null) => void;
  setPendingEmail: (email: string) => void;
  setPendingResetContact: (contact: string) => void;
  setPendingResetCode: (code: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  accessToken: null,
  role: null,
  pendingEmail: null,
  pendingResetContact: null,
  pendingResetCode: null,
  setAuth: (userId, role) => set({ isAuthenticated: true, userId, role }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setPendingEmail: (email) => set({ pendingEmail: email }),
  setPendingResetContact: (contact) => set({ pendingResetContact: contact }),
  setPendingResetCode: (pendingResetCode) => set({ pendingResetCode }),
  clearAuth: () =>
    set({
      isAuthenticated: false,
      userId: null,
      accessToken: null,
      role: null,
      pendingEmail: null,
      pendingResetContact: null,
      pendingResetCode: null,
    }),
}));
