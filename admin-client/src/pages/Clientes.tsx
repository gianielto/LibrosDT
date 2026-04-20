import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Cliente, Pedido, PaginatedResponse } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { AxiosError } from "axios";

// ─── Modal de detalle de cliente ──────────────────────────────────────────────
interface DetalleClienteProps {
  clienteId: number;
  onClose: () => void;
}

function DetalleCliente({ clienteId, onClose }: DetalleClienteProps) {
  // const [data, setData] = useState
  //   (Cliente & { pedidos: Pedido[]; eliminado: number }) | null>(null);
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<
    (Cliente & { pedidos: Pedido[]; eliminado: number }) | null
  >(null);

  useEffect(() => {
    api
      .get(`/clientes/${clienteId}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [clienteId]);

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
          <h2 className="text-base font-semibold">Detalle del cliente</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <p className="text-sm text-slate-400 text-center py-8">
              Cargando...
            </p>
          ) : !data ? (
            <p className="text-sm text-red-500 text-center py-8">
              No se pudo cargar el cliente
            </p>
          ) : (
            <div className="space-y-5">
              {/* Info del cliente */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-1.5">
                <p className="text-sm font-medium text-slate-800">
                  {data.nombre} {data.apellidos}
                </p>
                <p className="text-sm text-slate-500">{data.correo}</p>
                {data.telefono && (
                  <p className="text-sm text-slate-500">{data.telefono}</p>
                )}
                {data.direccion && (
                  <p className="text-sm text-slate-500">{data.direccion}</p>
                )}
              </div>

              {/* Historial de pedidos */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-3">
                  Historial de pedidos ({data.pedidos.length})
                </p>
                {data.pedidos.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    Sin pedidos registrados
                  </p>
                ) : (
                  <div className="space-y-2">
                    {data.pedidos.map((pedido) => (
                      <div
                        key={pedido.id}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-700">
                            Pedido #{pedido.id}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(pedido.fecha).toLocaleDateString(
                              "es-MX",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-800">
                            ${pedido.total?.toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {pedido.status_label}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [clienteDetalle, setClienteDetalle] = useState<number | null>(null);

  const cargarClientes = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: "15",
      };
      if (busqueda) params.busqueda = busqueda;

      const { data } = await api.get<PaginatedResponse<Cliente>>("/clientes", {
        params,
      });
      setClientes(data.data);
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
    cargarClientes(1);
  }, [busqueda]);

  const handleEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar a ${nombre}? Esta acción se puede revertir.`))
      return;
    try {
      await api.delete(`/clientes/${id}`);
      cargarClientes(meta.page);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message ?? "Error al eliminar el cliente");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-500 mt-1">
            {meta.total} clientes registrados
          </p>
        </div>
      </div>

      {/* Búsqueda */}
      <Input
        placeholder="Buscar por nombre, apellido o correo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="max-w-sm"
      />

      {/* Tabla */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm text-slate-400">Cargando clientes...</p>
            </div>
          ) : clientes.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm text-slate-400">
                No se encontraron clientes
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Nombre
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Correo
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Teléfono
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Dirección
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientes.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {c.nombre} {c.apellidos}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{c.correo}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {c.telefono ?? (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                        {c.direccion ?? (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setClienteDetalle(c.id)}
                          >
                            Ver detalle
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleEliminar(c.id, `${c.nombre} ${c.apellidos}`)
                            }
                          >
                            Eliminar
                          </Button>
                        </div>
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
              onClick={() => cargarClientes(meta.page - 1)}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={meta.page >= meta.totalPages}
              onClick={() => cargarClientes(meta.page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Modal detalle */}
      {clienteDetalle !== null && (
        <DetalleCliente
          clienteId={clienteDetalle}
          onClose={() => setClienteDetalle(null)}
        />
      )}
    </div>
  );
}
