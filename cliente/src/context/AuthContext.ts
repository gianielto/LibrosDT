import { createContext } from "react";

export interface User {
  id: number;
  correo: string;
  nombre: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
