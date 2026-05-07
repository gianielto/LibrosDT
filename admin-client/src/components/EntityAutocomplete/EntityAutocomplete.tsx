// import { useEffect, useState } from "react";
// import api from "@/api/axios";

// interface BaseEntity {
//   id: number;
//   nombre: string;
// }

// interface Props<T extends BaseEntity> {
//   endpoint: string;
//   placeholder?: string;

//   selected: number[];
//   onChange: (ids: number[]) => void;

//   multiple?: boolean;
// }

// export function EntityAutocomplete<T extends BaseEntity>({
//   endpoint,
//   placeholder = "Buscar...",
//   selected,
//   onChange,
//   multiple = true,
// }: Props<T>) {
//   const [query, setQuery] = useState("");
//   const [resultados, setResultados] = useState<T[]>([]);
//   const [cache, setCache] = useState<Record<number, T>>({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!query.trim()) {
//       setResultados([]);
//       return;
//     }

//     const delay = setTimeout(async () => {
//       setLoading(true);

//       try {
//         const { data } = await api.get<T[]>(endpoint, {
//           params: { search: query },
//         });

//         setResultados(data);

//         // guardar cache
//         setCache((prev) => {
//           const updated = { ...prev };

//           data.forEach((item) => {
//             updated[item.id] = item;
//           });

//           return updated;
//         });
//       } catch {
//         setResultados([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 300);

//     return () => clearTimeout(delay);
//   }, [query, endpoint]);

//   const toggleItem = (id: number) => {
//     if (multiple) {
//       if (selected.includes(id)) {
//         onChange(selected.filter((x) => x !== id));
//       } else {
//         onChange([...selected, id]);
//       }
//     } else {
//       onChange(selected.includes(id) ? [] : [id]);
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <input
//         className="w-full border rounded px-3 py-2 text-sm"
//         placeholder={placeholder}
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />

//       {query && (
//         <div className="border rounded max-h-40 overflow-y-auto bg-white shadow">
//           {loading ? (
//             <p className="p-2 text-sm text-gray-400">Buscando...</p>
//           ) : resultados.length === 0 ? (
//             <p className="p-2 text-sm text-gray-400">Sin resultados</p>
//           ) : (
//             resultados.map((item) => (
//               <div
//                 key={item.id}
//                 className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
//                   selected.includes(item.id) ? "bg-gray-200" : ""
//                 }`}
//                 onClick={() => toggleItem(item.id)}
//               >
//                 {item.nombre}
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       <div className="flex flex-wrap gap-2">
//         {selected.map((id) => {
//           const item = cache[id];

//           return (
//             <span
//               key={id}
//               className="bg-slate-200 px-2 py-1 rounded text-xs flex items-center gap-1"
//             >
//               {item?.nombre ?? id}

//               <button onClick={() => toggleItem(id)}>×</button>
//             </span>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
// fase dos
// import { useEffect, useState } from "react";
// import api from "@/api/axios";

// interface Entity {
//   id: number;
//   nombre: string;
// }

// interface Props {
//   endpoint: string;
//   placeholder?: string;

//   selected: number[];
//   onChange: (ids: number[]) => void;

//   multiple?: boolean;
// }

// export function EntityAutocomplete({
//   endpoint,
//   placeholder = "Buscar...",
//   selected,
//   onChange,
//   multiple = true,
// }: Props) {
//   const [query, setQuery] = useState("");
//   const [resultados, setResultados] = useState<Entity[]>([]);
//   const [cache, setCache] = useState<Record<number, Entity>>({});
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!query.trim()) {
//       setResultados([]);
//       return;
//     }

//     const delay = setTimeout(async () => {
//       setLoading(true);

//       try {
//         const { data } = await api.get<Entity[]>(endpoint, {
//           params: { search: query },
//         });

//         setResultados(data);

//         setCache((prev) => {
//           const updated = { ...prev };

//           data.forEach((item) => {
//             updated[item.id] = item;
//           });

//           return updated;
//         });
//       } catch {
//         setResultados([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 300);

//     return () => clearTimeout(delay);
//   }, [query, endpoint]);

//   const toggleItem = (id: number) => {
//     if (multiple) {
//       if (selected.includes(id)) {
//         onChange(selected.filter((x) => x !== id));
//       } else {
//         onChange([...selected, id]);
//       }
//     } else {
//       onChange(selected.includes(id) ? [] : [id]);
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <input
//         className="w-full border rounded px-3 py-2 text-sm"
//         placeholder={placeholder}
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />

//       {query && (
//         <div className="border rounded max-h-40 overflow-y-auto bg-white shadow">
//           {loading ? (
//             <p className="p-2 text-sm text-gray-400">Buscando...</p>
//           ) : resultados.length === 0 ? (
//             <p className="p-2 text-sm text-gray-400">Sin resultados</p>
//           ) : (
//             resultados.map((item) => (
//               <div
//                 key={item.id}
//                 className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
//                   selected.includes(item.id) ? "bg-gray-200" : ""
//                 }`}
//                 onClick={() => toggleItem(item.id)}
//               >
//                 {item.nombre}
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       <div className="flex flex-wrap gap-2">
//         {selected.map((id) => {
//           const item = cache[id];

//           return (
//             <span
//               key={id}
//               className="bg-slate-200 px-2 py-1 rounded text-xs flex items-center gap-1"
//             >
//               {item?.nombre ?? id}

//               <button onClick={() => toggleItem(id)}>×</button>
//             </span>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// EntityMultiSelectPro.tsx
import { useEffect, useRef, useState } from "react";
import api from "@/api/axios";

interface Entity {
  id: number;
  nombre: string;
}

interface Props {
  endpoint: string;
  selected: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
}

export function EntityAutocomplete({
  endpoint,
  selected,
  onChange,
  placeholder = "Buscar...",
}: Props) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Entity[]>([]);
  const [cache, setCache] = useState<Record<number, Entity>>({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // 🔎 búsqueda con debounce
  useEffect(() => {
    if (!query.trim()) {
      setItems([]);
      return;
    }

    const delay = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get<Entity[]>(endpoint, {
          params: { search: query },
        });

        setItems(data);

        setCache((prev) => {
          const updated = { ...prev };
          data.forEach((i) => (updated[i.id] = i));
          return updated;
        });
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [query, endpoint]);

  // 🔥 cargar seleccionados (IMPORTANTE)
  useEffect(() => {
    const fetchSelected = async () => {
      if (!selected.length) return;

      try {
        const { data } = await api.get<Entity[]>(endpoint, {
          params: { ids: selected.join(",") },
        });

        setCache((prev) => {
          const updated = { ...prev };
          data.forEach((i) => (updated[i.id] = i));
          return updated;
        });
      } catch {
        // no pasa nada si falla, se mostrará el ID en su lugar
      }
    };

    fetchSelected();
  }, [selected, endpoint]);

  const toggle = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  // ⌨️ teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % items.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + items.length) % items.length);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const item = items[highlight];
      if (item) {
        toggle(item.id);
        setQuery("");
      }
    }

    if (e.key === "Backspace" && !query) {
      onChange(selected.slice(0, -1));
    }
  };

  return (
    <div className="relative">
      {/* INPUT + TAGS */}
      <div
        className="flex flex-wrap gap-2 border rounded px-2 py-2 focus-within:ring-2"
        onClick={() => inputRef.current?.focus()}
      >
        {selected.map((id) => (
          <span
            key={id}
            className="bg-slate-200 px-2 py-1 rounded text-xs flex items-center gap-1"
          >
            {cache[id]?.nombre ?? id}
            <button onClick={() => toggle(id)}>×</button>
          </span>
        ))}

        <input
          ref={inputRef}
          className="flex-1 outline-none text-sm min-w-[120px]"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>

      {/* DROPDOWN */}
      {open && query && (
        <div className="absolute z-50 mt-1 w-full border rounded bg-white shadow max-h-60 overflow-y-auto">
          {loading ? (
            <p className="p-2 text-sm text-gray-400">Buscando...</p>
          ) : items.length === 0 ? (
            <p className="p-2 text-sm text-gray-400">Sin resultados</p>
          ) : (
            items.map((item, i) => (
              <div
                key={item.id}
                className={`px-3 py-2 text-sm cursor-pointer ${
                  i === highlight ? "bg-slate-100" : ""
                }`}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={() => {
                  toggle(item.id);
                  setQuery("");
                }}
              >
                {item.nombre}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
