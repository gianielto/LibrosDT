// import { createContext, useContext, useEffect, useState } from "react";

// interface User {
//   id: number;
//   correo: string;
//   nombre: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: () => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     checkSession();
//   }, []);

//   const checkSession = async () => {
//     try {
//       const response = await fetch("http://localhost:4001/api/me", {
//         credentials: "include",
//       });
//       console.log("status:", response.status);
//       if (!response.ok) throw new Error("No autenticado");

//       const data = await response.json();
//       console.log("usuario:", data);
//       setUser(data);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async () => {
//     await checkSession();
//   };

//   const logout = async () => {
//     await fetch("http://localhost:4001/api/logout", {
//       method: "POST",
//       credentials: "include",
//     });

//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth debe usarse dentro de AuthProvider");
//   }

//   return context;
// };
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
