import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/productos", label: "Productos" },
  { to: "/pedidos", label: "Pedidos" },
  { to: "/clientes", label: "Clientes" },
];

export default function Sidebar() {
  const { empleado, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-56 min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="px-6 py-5 border-b border-slate-700">
        <p className="font-semibold text-sm">LibrosDT</p>
        <p className="text-xs text-slate-400 mt-0.5">Panel administrativo</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-slate-700 text-white font-medium"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-400 truncate mb-2">
          {empleado?.nombre ?? empleado?.correo}
        </p>
        <button
          onClick={handleLogout}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
