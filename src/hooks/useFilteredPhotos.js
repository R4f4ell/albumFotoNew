import { useMemo } from "react";

export function useFilteredPhotos({ fotos, categoria, query, interactedPhotos }) {
  return useMemo(() => {
    // Se for pesquisa normal (categoria vazia ou qualquer outra), retorna direto o array da API:
    if (categoria !== "liked" && categoria !== "downloaded") {
      return fotos;
    }

    // Se for liked/downloaded, começa da lista de interactedPhotos
    let lista = interactedPhotos;

    // Só filtra pelo termo caso tenha query (dentro de liked/downloaded)
    if (query) {
      const termo = query.toLowerCase();
      lista = lista.filter((f) => {
        const text = (
          f.title ??
          f.alt_description ??
          f.description ??
          ""
        ).toLowerCase();

        const tags = Array.isArray(f.tags)
          ? f.tags.map((t) =>
              typeof t === "string" ? t : t.title ?? ""
            )
          : [];

        const tagsMatch = tags.some((t) =>
          t.toLowerCase().includes(termo)
        );

        return text.includes(termo) || tagsMatch;
      });
    }

    return lista;
  }, [fotos, categoria, query, interactedPhotos]);
}