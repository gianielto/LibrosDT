import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { Empleado } from "../types/index";
import type { Empleado } from "../types/index";

interface AuthState {
  token: string | null;
  empleado: Empleado | null;
  setAuth: (token: string, empleado: Empleado) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      empleado: null,

      setAuth: (token, empleado) => set({ token, empleado }),

      logout: () => {
        set({ token: null, empleado: null });
        window.location.href = "/login";
      },

      isAuthenticated: () => {
        const { token } = get();
        if (!token) return false;
        try {
          // Verificar si el token está expirado sin librería externa
          const payload = JSON.parse(atob(token.split(".")[1]));
          return payload.exp * 1000 > Date.now();
        } catch {
          return false;
        }
      },
    }),
    {
      name: "admin-auth",
      // Solo persistimos token y empleado, no las funciones
      partialize: (state) => ({
        token: state.token,
        empleado: state.empleado,
      }),
    },
  ),
);
