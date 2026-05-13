// Modal.tsx
import { useState, useRef } from "react";
import api from "@/api/axios";
import type { Producto, Categoria, Editorial, Autor } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EntityAutocomplete } from "@/components/EntityAutocomplete/EntityAutocomplete";
import { AutorModal } from "../autorModal/AutorModal";
import { EditorialModal } from "../editoriales/EditorialModal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AxiosError } from "axios";

interface ProductoForm {
  nombre: string;
  codigo: string;
  descripcion: string;
  costo: string;
  stock: string;
  id_categoria: string;
  id_editorial?: string;
}

const FORM_VACIO: ProductoForm = {
  nombre: "",
  codigo: "",
  descripcion: "",
  costo: "",
  stock: "",
  id_categoria: "",
  id_editorial: "",
};

interface ModalProps {
  producto: Producto | null;
  categorias: Categoria[];
  editoriales: Editorial[];
  autores: Autor[];
  onClose: () => void;
  onGuardado: () => void;
  onEditorialCreada: (editorial: Editorial) => void;
}

export const ProductoModal = ({
  producto,
  categorias,
  editoriales,
  onClose,
  onGuardado,
  onEditorialCreada,
}: ModalProps) => {
  const [form, setForm] = useState<ProductoForm>(
    producto
      ? {
          nombre: producto.nombre ?? "",
          codigo: producto.codigo ?? "",
          descripcion: producto.descripcion ?? "",
          costo: producto.costo?.toString() ?? "",
          stock: producto.stock?.toString() ?? "",
          id_categoria: producto.id_categoria?.toString() ?? "",
          id_editorial: producto.id_editorial?.toString() ?? "",
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
  const [autoresSeleccionados, setAutoresSeleccionados] = useState<number[]>(
    producto?.autores?.map((a) => a.id) || [],
  );

  const [autorModalOpen, setAutorModalOpen] = useState(false);
  const [nuevoAutorNombre, setNuevoAutorNombre] = useState("");

  const [EditorialModalOpen, setEditorialModalOpen] = useState(false);
  const [nuevaEditorialNombre, setNuevaEditorialNombre] = useState("");

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
      if (form.id_editorial) {
        formData.append("id_editorial", form.id_editorial);
      }

      if (autoresSeleccionados.length > 0) {
        //formData.append("autores", JSON.stringify(form.autores));
        formData.append("autores", JSON.stringify(autoresSeleccionados));
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
          <div className="space-y-2">
            <Label>Editorial</Label>
            <Select
              value={form.id_editorial}
              onValueChange={(v) => setForm((f) => ({ ...f, id_editorial: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sin editorial" />
              </SelectTrigger>
              <SelectContent>
                {editoriales.map((e) => (
                  <SelectItem key={e.id} value={e.id.toString()}>
                    {e.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="px-0 text-blue-600"
              onClick={() => setEditorialModalOpen(true)}
            >
              + Nueva editorial
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Autores</Label>

            <EntityAutocomplete
              endpoint="/autores"
              selected={autoresSeleccionados}
              onChange={setAutoresSeleccionados}
              placeholder="Buscar autores..."
              onNotFound={(query) => {
                setNuevoAutorNombre(query);
                setAutorModalOpen(true);
              }}
            />
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
      {autorModalOpen && (
        <AutorModal
          nombreInicial={nuevoAutorNombre}
          onClose={() => setAutorModalOpen(false)}
          onCreated={(autor) => {
            setAutoresSeleccionados((prev) => [...prev, autor.id]);

            setNuevoAutorNombre("");
          }}
        />
      )}

      {EditorialModalOpen && (
        <EditorialModal
          nombreInicial={nuevaEditorialNombre}
          onClose={() => setEditorialModalOpen(false)}
          onCreated={(editorial) => {
            onEditorialCreada(editorial);

            setForm((prev) => ({
              ...prev,
              id_editorial: editorial.id.toString(),
            }));

            setNuevaEditorialNombre("");
            setEditorialModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
