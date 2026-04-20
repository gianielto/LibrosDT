import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Pedido, PaginatedResponse } from "../types";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AxiosError } from "axios";

const STATUS_OPTIONS = [
  { value: "1", label: "Pendiente" },
  { value: "2", label: "En proceso" },
  { value: "3", label: "Enviado" },
  { value: "4", label: "Entregado" },
];

const STATUS_STYLES: Record<number, string> = {
  1: "bg-yellow-100 text-yellow-800 border-yellow-200",
  2: "bg-blue-100 text-blue-800 border-blue-200",
  3: "bg-purple-100 text-purple-800 border-purple-200",
  4: "bg-green-100 text-green-800 border-green-200",
};

// ─── Modal de detalle ─────────────────────────────────────────────────────────
interface DetalleModalProps {
  pedido: Pedido;
  onClose: () => void;
  onStatusCambiado: () => void;
}

function DetalleModal({
  pedido,
  onClose,
  onStatusCambiado,
}: DetalleModalProps) {
  const [nuevoStatus, setNuevoStatus] = useState(
    pedido.status?.toString() ?? "1",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCambiarStatus = async () => {
    if (nuevoStatus === pedido.status?.toString()) return;
    setError("");
    setLoading(true);
    try {
      await api.patch(`/pedidos/${pedido.id}/status`, {
        status: parseInt(nuevoStatus),
      });
      onStatusCambiado();
      onClose();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(
        error.response?.data?.message ?? "Error al actualizar el status",
      );
    } finally {
      setLoading(false);
    }
  };

  const totalPedido = pedido.pedidos_productos.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold">Pedido #{pedido.id}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Datos del cliente */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-1">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
              Cliente
            </p>
            {pedido.cliente ? (
              <>
                <p className="text-sm font-medium text-slate-800">
                  {pedido.cliente.nombre} {pedido.cliente.apellidos}
                </p>
                <p className="text-sm text-slate-500">
                  {pedido.cliente.correo}
                </p>
                {pedido.cliente.telefono && (
                  <p className="text-sm text-slate-500">
                    {pedido.cliente.telefono}
                  </p>
                )}
                {pedido.cliente.direccion && (
                  <p className="text-sm text-slate-500">
                    {pedido.cliente.direccion}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400">Sin datos de cliente</p>
            )}
          </div>

          {/* Productos del pedido */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">
              Productos
            </p>
            <div className="space-y-2">
              {pedido.pedidos_productos.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0"
                >
                  {item.productos.archivo_url ? (
                    <img
                      src={item.productos.archivo_url}
                      alt={item.productos.nombre ?? ""}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {item.productos.nombre}
                    </p>
                    <p className="text-xs text-slate-400">
                      {item.cantidad} × ${item.precio.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    ${(item.cantidad * item.precio).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 mt-1">
              <p className="text-sm font-medium text-slate-600">Total</p>
              <p className="text-base font-semibold text-slate-900">
                ${totalPedido.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Cambiar status */}
          <div className="space-y-2">
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">
              Actualizar status
            </p>
            <div className="flex gap-2">
              <Select value={nuevoStatus} onValueChange={setNuevoStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem
                      key={s.value}
                      value={s.value}
                      disabled={parseInt(s.value) < (pedido.status ?? 1)}
                    >
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleCambiarStatus}
                disabled={loading || nuevoStatus === pedido.status?.toString()}
              >
                {loading ? "Guardando..." : "Actualizar"}
              </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [filtroStatus, setFiltroStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [pedidoDetalle, setPedidoDetalle] = useState<Pedido | null>(null);

  const cargarPedidos = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: "15",
      };
      if (filtroStatus) params.status = filtroStatus;

      const { data } = await api.get<PaginatedResponse<Pedido>>("/pedidos", {
        params,
      });
      setPedidos(data.data);
      setMeta({
        total: data.meta.total,
        page: data.meta.page,
        totalPages: data.meta.totalPages,
      });
    } catch {
      // error silencioso
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos(1);
  }, [filtroStatus]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Pedidos</h1>
          <p className="text-sm text-slate-500 mt-1">
            {meta.total} pedidos en total
          </p>
        </div>
      </div>

      {/* Filtro por status */}
      <div className="flex gap-3">
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los estados</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm text-slate-400">Cargando pedidos...</p>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm text-slate-400">No hay pedidos</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-4 py-3 font-medium text-slate-600">#</th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Fecha
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Cliente
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Productos
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Total
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Status
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pedidos.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-slate-500">#{p.id}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {new Date(p.fecha).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {p.cliente ? (
                          <div>
                            <p className="font-medium text-slate-800">
                              {p.cliente.nombre} {p.cliente.apellidos}
                            </p>
                            <p className="text-xs text-slate-400">
                              {p.cliente.correo}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {p.pedidos_productos.length}{" "}
                        {p.pedidos_productos.length === 1
                          ? "producto"
                          : "productos"}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        ${p.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                            STATUS_STYLES[p.status ?? 1] ??
                            "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {p.status_label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setPedidoDetalle(p)}
                        >
                          Ver detalle
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paginación */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Página {meta.page} de {meta.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={meta.page <= 1}
              onClick={() => cargarPedidos(meta.page - 1)}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={meta.page >= meta.totalPages}
              onClick={() => cargarPedidos(meta.page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Modal detalle */}
      {pedidoDetalle && (
        <DetalleModal
          pedido={pedidoDetalle}
          onClose={() => setPedidoDetalle(null)}
          onStatusCambiado={() => cargarPedidos(meta.page)}
        />
      )}
    </div>
  );
}
