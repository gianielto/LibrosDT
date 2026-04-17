import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import type { Producto, Categoria, PaginatedResponse } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AxiosError } from "axios";

// ─── Tipos del formulario ─────────────────────────────────────────────────────
interface ProductoForm {
  nombre: string;
  codigo: string;
  descripcion: string;
  costo: string;
  stock: string;
  id_categoria: string;
}

const FORM_VACIO: ProductoForm = {
  nombre: "",
  codigo: "",
  descripcion: "",
  costo: "",
  stock: "",
  id_categoria: "",
};

// ─── Modal de crear/editar ────────────────────────────────────────────────────
interface ModalProps {
  producto: Producto | null;
  categorias: Categoria[];
  onClose: () => void;
  onGuardado: () => void;
}

function ProductoModal({
  producto,
  categorias,
  onClose,
  onGuardado,
}: ModalProps) {
  const [form, setForm] = useState<ProductoForm>(
    producto
      ? {
          nombre: producto.nombre ?? "",
          codigo: producto.codigo ?? "",
          descripcion: producto.descripcion ?? "",
          costo: producto.costo?.toString() ?? "",
          stock: producto.stock?.toString() ?? "",
          id_categoria: producto.id_categoria?.toString() ?? "",
        }
      : FORM_VACIO,
  );
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    producto?.archivo_url ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImagen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Usamos FormData porque el endpoint acepta multipart (imagen + campos)
      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("codigo", form.codigo);
      formData.append("descripcion", form.descripcion);
      formData.append("costo", form.costo);
      formData.append("stock", form.stock);
      if (form.id_categoria) {
        formData.append("id_categoria", form.id_categoria);
      }
      if (imagen) {
        formData.append("imagen", imagen);
      }

      if (producto) {
        await api.put(`/productos/${producto.id}`, formData);
      } else {
        await api.post("/productos", formData);
      }

      onGuardado();
      onClose();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      setError(error.response?.data?.message ?? "Error al guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const set =
    (campo: keyof ProductoForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [campo]: e.target.value }));

  return (
    // Overlay del modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-base font-semibold">
            {producto ? "Editar producto" : "Nuevo producto"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Imagen */}
          <div className="space-y-2">
            <Label>Imagen</Label>
            <div
              className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center cursor-pointer hover:border-slate-400 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="h-32 object-contain mx-auto rounded"
                />
              ) : (
                <p className="text-sm text-slate-400">
                  Clic para seleccionar imagen (JPG, PNG, WebP — máx. 5MB)
                </p>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImagen}
            />
          </div>

          {/* Nombre y código */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={form.nombre}
                onChange={set("nombre")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={form.codigo}
                onChange={set("codigo")}
                required
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <textarea
              id="descripcion"
              value={form.descripcion}
              onChange={set("descripcion")}
              rows={3}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Costo, stock y categoría */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="costo">Precio *</Label>
              <Input
                id="costo"
                type="number"
                min="0"
                step="0.01"
                value={form.costo}
                onChange={set("costo")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={set("stock")}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select
              value={form.id_categoria}
              onValueChange={(v) => setForm((f) => ({ ...f, id_categoria: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sin categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null,
  );

  const cargarProductos = async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: "15",
      };
      if (busqueda) params.busqueda = busqueda;
      // /if (categoriaFiltro) params.id_categoria = categoriaFiltro;
      if (categoriaFiltro && categoriaFiltro !== "all") {
        params.id_categoria = categoriaFiltro;
      }
      const { data } = await api.get<PaginatedResponse<Producto>>(
        "/productos",
        { params },
      );
      setProductos(data.data);
      setMeta({
        total: data.meta.total,
        page: data.meta.page,
        totalPages: data.meta.totalPages,
      });
    } catch {
      // error silencioso — la tabla queda vacía
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías una sola vez
  useEffect(() => {
    api.get<Categoria[]>("/categorias").then((res) => setCategorias(res.data));
  }, []);

  // Recargar productos cuando cambien filtros
  useEffect(() => {
    cargarProductos(1);
  }, [busqueda, categoriaFiltro]);

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.delete(`/productos/${id}`);
      cargarProductos(meta.page);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message ?? "Error al eliminar");
    }
  };

  const abrirEditar = (producto: Producto) => {
    setProductoEditando(producto);
    setModalAbierto(true);
  };

  const abrirNuevo = () => {
    setProductoEditando(null);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEditando(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500 mt-1">
            {meta.total} productos en total
          </p>
        </div>
        <Button onClick={abrirNuevo}>+ Nuevo producto</Button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Buscar por nombre o código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="max-w-xs"
        />
        <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categorias.map((c) => (
              <SelectItem key={c.id} value={c.id.toString()}>
                {c.nombre}
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
              <p className="text-sm text-slate-400">Cargando productos...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm text-slate-400">
                No se encontraron productos
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-left">
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Imagen
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Nombre
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Código
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Categoría
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Precio
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Stock
                    </th>
                    <th className="px-4 py-3 font-medium text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productos.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        {p.archivo_url ? (
                          <img
                            src={p.archivo_url}
                            alt={p.nombre ?? ""}
                            className="w-10 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-300 text-xs">
                            Sin img
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {p.nombre}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{p.codigo}</td>
                      <td className="px-4 py-3">
                        {p.categoria ? (
                          <Badge variant="secondary">
                            {p.categoria.nombre}
                          </Badge>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        ${p.costo?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-medium ${
                            (p.stock ?? 0) === 0
                              ? "text-red-500"
                              : (p.stock ?? 0) <= 5
                                ? "text-yellow-600"
                                : "text-slate-700"
                          }`}
                        >
                          {p.stock ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => abrirEditar(p)}
                          >
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleEliminar(p.id)}
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
              onClick={() => cargarProductos(meta.page - 1)}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={meta.page >= meta.totalPages}
              onClick={() => cargarProductos(meta.page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalAbierto && (
        <ProductoModal
          producto={productoEditando}
          categorias={categorias}
          onClose={cerrarModal}
          onGuardado={() => cargarProductos(meta.page)}
        />
      )}
    </div>
  );
}
