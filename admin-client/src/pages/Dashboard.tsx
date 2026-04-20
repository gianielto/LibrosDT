import { useEffect, useState } from "react";
import api from "../api/axios";
import type { DashboardData } from "../types/index";
// import { DashboardData } from "../types/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge/badge";

const STATUS_COLORS: Record<number, string> = {
  1: "bg-yellow-100 text-yellow-800",
  2: "bg-blue-100 text-blue-800",
  3: "bg-purple-100 text-purple-800",
  4: "bg-green-100 text-green-800",
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setData(res.data))
      .catch(() => setError("No se pudo cargar el dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400 text-sm">Cargando...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Resumen del mes actual</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Ventas del mes</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">
              $
              {data.ventasMes.toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Pedidos este mes</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">
              {data.pedidosMes}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500">Clientes activos</p>
            <p className="text-3xl font-semibold text-slate-900 mt-1">
              {data.totalClientes}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pedidos por status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Pedidos por status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.pedidosPorStatus.length === 0 ? (
              <p className="text-sm text-slate-400">Sin pedidos registrados</p>
            ) : (
              <div className="space-y-3">
                {data.pedidosPorStatus.map((s) => (
                  <div
                    key={s.status}
                    className="flex items-center justify-between"
                  >
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        STATUS_COLORS[s.status ?? 1] ??
                        "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {s.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {s.cantidad}{" "}
                      <span className="font-normal text-slate-400">
                        {s.cantidad === 1 ? "pedido" : "pedidos"}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Productos con stock bajo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Stock bajo{" "}
              <span className="text-slate-400 font-normal text-sm">
                (menos de 5 unidades)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.productosBajoStock.length === 0 ? (
              <p className="text-sm text-slate-400">
                Todos los productos tienen stock suficiente
              </p>
            ) : (
              <div className="space-y-2">
                {data.productosBajoStock.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {p.nombre}
                      </p>
                      <p className="text-xs text-slate-400">{p.codigo}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        (p.stock ?? 0) === 0
                          ? "border-red-300 text-red-600"
                          : "border-yellow-300 text-yellow-700"
                      }
                    >
                      {p.stock === 0 ? "Sin stock" : `${p.stock} uds.`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
