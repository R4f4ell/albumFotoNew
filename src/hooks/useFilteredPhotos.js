import { useMemo } from "react";

export function useFilteredPhotos({ fotos, categoria, query, interactedPhotos }) {
  return useMemo(() => {
    if (categoria !== "liked" && categoria !== "downloaded") {
      return fotos;
    }

    let lista = interactedPhotos;

    if (query) {
      const termo = String(query).toLowerCase();
      lista = lista.filter((f) => {
        const text = (f.title ?? f.alt_description ?? f.description ?? "").toLowerCase();

        const tags = Array.isArray(f.tags)
          ? f.tags.map((t) => (typeof t === "string" ? t : t.title ?? ""))
          : [];

        const tagsMatch = tags.some((t) => String(t).toLowerCase().includes(termo));
        return text.includes(termo) || tagsMatch;
      });
    }

    return lista;
  }, [fotos, categoria, query, interactedPhotos]);
}