// // Productos.tsx
// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import type {
//   Producto,
//   Categoria,
//   PaginatedResponse,
//   Editorial,
//   Autor,
// } from "../types";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge/badge";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ProductoModal } from "../components/products/Modal";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import type { AxiosError } from "axios";

// // ─── Página principal ─────────────────────────────────────────────────────────
// export default function Productos() {
//   const [productos, setProductos] = useState<Producto[]>([]);
//   const [categorias, setCategorias] = useState<Categoria[]>([]);
//   const [autores, setAutores] = useState<Autor[]>([]);
//   const [editoriales, setEditoriales] = useState<Editorial[]>([]);
//   const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
//   const [busqueda, setBusqueda] = useState("");
//   const [categoriaFiltro, setCategoriaFiltro] = useState("");
//   const [editorialFiltro, setEditorialFiltro] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [modalAbierto, setModalAbierto] = useState(false);
//   const [productoEditando, setProductoEditando] = useState<Producto | null>(
//     null,
//   );

//   const cargarProductos = async (page = 1) => {
//     setLoading(true);
//     try {
//       const params: Record<string, string> = {
//         page: page.toString(),
//         limit: "15",
//       };
//       if (busqueda) params.busqueda = busqueda;
//       // /if (categoriaFiltro) params.id_categoria = categoriaFiltro;
//       if (categoriaFiltro && categoriaFiltro !== "all") {
//         params.id_categoria = categoriaFiltro;
//       }
//       if (editorialFiltro && editorialFiltro !== "all") {
//         params.id_editorial = editorialFiltro;
//       }
//       const { data } = await api.get<PaginatedResponse<Producto>>(
//         "/productos",
//         { params },
//       );
//       setProductos(data.data);
//       setMeta({
//         total: data.meta.total,
//         page: data.meta.page,
//         totalPages: data.meta.totalPages,
//       });
//     } catch {
//       // error silencioso — la tabla queda vacía
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cargar categorías una sola vez
//   useEffect(() => {
//     api.get<Categoria[]>("/categorias").then((res) => setCategorias(res.data));
//     api
//       .get<Editorial[]>("/editoriales")
//       .then((res) => setEditoriales(res.data));

//     api.get<Autor[]>("/autores").then((res) => setAutores(res.data));
//   }, []);

//   // Recargar productos cuando cambien filtros
//   useEffect(() => {
//     cargarProductos(1);
//   }, [busqueda, categoriaFiltro, editorialFiltro]);

//   const handleEliminar = async (id: number) => {
//     if (!confirm("¿Eliminar este producto?")) return;
//     try {
//       await api.delete(`/productos/${id}`);
//       cargarProductos(meta.page);
//     } catch (err) {
//       const error = err as AxiosError<{ message: string }>;
//       alert(error.response?.data?.message ?? "Error al eliminar");
//     }
//   };

//   const abrirEditar = (producto: Producto) => {
//     setProductoEditando(producto);
//     setModalAbierto(true);
//   };

//   const abrirNuevo = () => {
//     setProductoEditando(null);
//     setModalAbierto(true);
//   };

//   const cerrarModal = () => {
//     setModalAbierto(false);
//     setProductoEditando(null);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-slate-900">Productos</h1>
//           <p className="text-sm text-slate-500 mt-1">
//             {meta.total} productos en total
//           </p>
//         </div>
//         <Button onClick={abrirNuevo}>+ Nuevo producto</Button>
//       </div>

//       {/* Filtros */}
//       <div className="flex gap-3 flex-wrap">
//         <Input
//           placeholder="Buscar por nombre o código..."
//           value={busqueda}
//           onChange={(e) => setBusqueda(e.target.value)}
//           className="max-w-xs"
//         />
//         <Select value={categoriaFiltro} onValueChange={setCategoriaFiltro}>
//           <SelectTrigger className="w-48">
//             <SelectValue placeholder="Todas las categorías" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">Todas las categorías</SelectItem>
//             {categorias.map((c) => (
//               <SelectItem key={c.id} value={c.id.toString()}>
//                 {c.nombre}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Select value={editorialFiltro} onValueChange={setEditorialFiltro}>
//           <SelectTrigger className="w-48">
//             <SelectValue placeholder="Todas las editoriales" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">Todas las editoriales</SelectItem>
//             {editoriales.map((e) => (
//               <SelectItem key={e.id} value={e.id.toString()}>
//                 {e.nombre}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Tabla */}
//       <Card>
//         <CardContent className="p-0">
//           {loading ? (
//             <div className="flex items-center justify-center h-48">
//               <p className="text-sm text-slate-400">Cargando productos...</p>
//             </div>
//           ) : productos.length === 0 ? (
//             <div className="flex items-center justify-center h-48">
//               <p className="text-sm text-slate-400">
//                 No se encontraron productos
//               </p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b bg-slate-50 text-left">
//                     <th className="px-4 py-3 font-medium text-slate-600">
//                       Imagen
//                     </th>
//                     <th className="px-4 py-3 font-medium text-slate-600">
//                       Nombre
//                     </th>
//                     <th className="px-4 py-3 font-medium text-slate-600">
//                       Código
//                     </th>
//                     <th className="px-4 py-3 font-medium text-slate-600">
//                       Categoría
//                     </th>
//                     <th className="px-4 py-3 font-medium text-slate-600">
//                       Precio
//                     </th>
//                     <th className="px-4 py-3 font-medium text-slate-600">
//                       Stock
//                     </th>
//                     <th className="px-4 py-3 font-medium text-slate-600">
//                       Acciones
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {productos.map((p) => (
//                     <tr
//                       key={p.id}
//                       className="hover:bg-slate-50 transition-colors"
//                     >
//                       <td className="px-4 py-3">
//                         {p.archivo_url ? (
//                           <img
//                             src={p.archivo_url}
//                             alt={p.nombre ?? ""}
//                             className="w-10 h-10 object-cover rounded"
//                           />
//                         ) : (
//                           <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-slate-300 text-xs">
//                             Sin img
//                           </div>
//                         )}
//                       </td>
//                       <td className="px-4 py-3 font-medium text-slate-800">
//                         {p.nombre}
//                       </td>
//                       <td className="px-4 py-3 text-slate-500">{p.codigo}</td>
//                       <td className="px-4 py-3">
//                         {p.categoria ? (
//                           <Badge variant="secondary">
//                             {p.categoria.nombre}
//                           </Badge>
//                         ) : (
//                           <span className="text-slate-300 text-xs">—</span>
//                         )}
//                       </td>
//                       <td className="px-4 py-3 text-slate-700">
//                         ${p.costo?.toFixed(2)}
//                       </td>
//                       <td className="px-4 py-3">
//                         <span
//                           className={`font-medium ${
//                             (p.stock ?? 0) === 0
//                               ? "text-red-500"
//                               : (p.stock ?? 0) <= 5
//                                 ? "text-yellow-600"
//                                 : "text-slate-700"
//                           }`}
//                         >
//                           {p.stock ?? 0}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex gap-2">
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             onClick={() => abrirEditar(p)}
//                           >
//                             Editar
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="destructive"
//                             onClick={() => handleEliminar(p.id)}
//                           >
//                             Eliminar
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Paginación */}
//       {meta.totalPages > 1 && (
//         <div className="flex items-center justify-between text-sm text-slate-500">
//           <span>
//             Página {meta.page} de {meta.totalPages}
//           </span>
//           <div className="flex gap-2">
//             <Button
//               size="sm"
//               variant="outline"
//               disabled={meta.page <= 1}
//               onClick={() => cargarProductos(meta.page - 1)}
//             >
//               Anterior
//             </Button>
//             <Button
//               size="sm"
//               variant="outline"
//               disabled={meta.page >= meta.totalPages}
//               onClick={() => cargarProductos(meta.page + 1)}
//             >
//               Siguiente
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Modal */}
//       {modalAbierto && (
//         <ProductoModal
//           producto={productoEditando}
//           categorias={categorias}
//           editoriales={editoriales}
//           autores={autores}
//           onClose={cerrarModal}
//           onGuardado={() => cargarProductos(meta.page)}
//         />
//       )}
//     </div>
//   );
// }
// Productos.tsx
// import { useEffect, useState } from "react";
import api from "../api/axios";
import type {
  Producto,
  Categoria,
  PaginatedResponse,
  Editorial,
  Autor,
} from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge/badge";
import { useCallback, useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductoModal } from "../components/products/Modal";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AxiosError } from "axios";

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [autores, setAutores] = useState<Autor[]>([]);
  const [editoriales, setEditoriales] = useState<Editorial[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [editorialFiltro, setEditorialFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditando, setProductoEditando] = useState<Producto | null>(
    null,
  );

  // const cargarProductos = async (page = 1) => {
  const cargarProductos = useCallback(
    async (page = 1) => {
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
        if (editorialFiltro && editorialFiltro !== "all") {
          params.id_editorial = editorialFiltro;
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
      // };
    },
    [busqueda, categoriaFiltro, editorialFiltro],
  );
  // Cargar categorías una sola vez
  useEffect(() => {
    api.get<Categoria[]>("/categorias").then((res) => setCategorias(res.data));
    api
      .get<Editorial[]>("/editoriales")
      .then((res) => setEditoriales(res.data));

    api.get<Autor[]>("/autores").then((res) => setAutores(res.data));
  }, []);

  // Recargar productos cuando cambien filtros
  // useEffect(() => {
  //   cargarProductos(1);
  // }, [busqueda, categoriaFiltro, editorialFiltro]);
  useEffect(() => {
    cargarProductos(1);
  }, [cargarProductos]);

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
        <Select value={editorialFiltro} onValueChange={setEditorialFiltro}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Todas las editoriales" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las editoriales</SelectItem>
            {editoriales.map((e) => (
              <SelectItem key={e.id} value={e.id.toString()}>
                {e.nombre}
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
          editoriales={editoriales}
          autores={autores}
          onClose={cerrarModal}
          onGuardado={() => cargarProductos(meta.page)}
        />
      )}
    </div>
  );
}
