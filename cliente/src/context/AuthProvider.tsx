import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("No autenticado");

      const data = await response.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    await checkSession();
  };

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
// import { useEffect, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import type { User } from "./AuthContext";
// import usePushNotifications from "../hooks/usePushNotifications";

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const { subscribe } = usePushNotifications();

//   useEffect(() => {
//     checkSession();
//   }, []);

//   const checkSession = async () => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
//         credentials: "include",
//       });

//       if (!response.ok) throw new Error("No autenticado");

//       const data = await response.json();
//       setUser(data);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const autoSubscribe = async () => {
//       if (!user) return;

//       const already = localStorage.getItem("push_subscribed");
//       if (already) return;

//       try {
//         await subscribe(user.id);

//         localStorage.setItem("push_subscribed", "true");
//         console.log("🔔 Auto-suscripción exitosa");
//       } catch (err) {
//         console.error("❌ Error auto-suscripción:", err);
//       }
//     };

//     autoSubscribe();
//   }, [user]);

//   const login = async () => {
//     await checkSession();
//   };

//   const logout = async () => {
//     try {
//       await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
//         method: "POST",
//         credentials: "include",
//       });
//     } finally {
//       setUser(null);
//       localStorage.removeItem("push_subscribed");
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
