import React, { useState, useEffect, useMemo, useCallback } from "react";
import SearchBar from "../searchBar/SearchBar";
import FotoList from "../foto-fotoList/FotoList";
import FotoAmpliada from "../fotoAmpliada/FotoAmpliada";

import { useDebounce } from "../../hooks/useDebounce";
import { useInteractedPhotos } from "../../hooks/useInteractedPhotos";
import { useFilteredPhotos } from "../../hooks/useFilteredPhotos";

import { listPhotos, searchPhotos } from "../../lib/unsplash";
import "./photoGallery.scss";

const IMAGES_PER_PAGE = 6;

const PhotoGallery = () => {
  const [fotos, setFotos] = useState([]);
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("");
  const [activateSearch, setActivateSearch] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [interactedReady, setInteractedReady] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  const isInteractedCategory = useMemo(
    () => categoria === "liked" || categoria === "downloaded",
    [categoria]
  );

  const handleInteractedReady = useCallback(() => {
    setInteractedReady(true);
  }, []);

  const interactedPhotos = useInteractedPhotos(categoria, handleInteractedReady);

  const fotosExibidas = useFilteredPhotos({
    fotos,
    categoria,
    query: debouncedQuery,
    interactedPhotos,
  });

  const fetchImages = async (reset = false) => {
    if (isInteractedCategory) return;

    const searchQuery = [debouncedQuery, categoria].filter(Boolean).join(" ");
    const params = {
      page,
      per_page: IMAGES_PER_PAGE,
      ...(searchQuery ? { query: searchQuery } : {}),
    };

    setIsLoading(true);
    try {
      const res = searchQuery ? await searchPhotos(params) : await listPhotos(params);

      if (res.status >= 400) {
        console.error("Erro ao buscar imagens:", res.status, res.data);
        return;
      }

      const results = searchQuery ? res.data.results : res.data;

      setFotos((prev) => {
        if (reset) return results;
        const prevIds = new Set(prev.map((f) => f.id));
        const unique = results.filter((f) => !prevIds.has(f.id));
        return [...prev, ...unique];
      });

      setHasMore(
        searchQuery ? page < res.data.total_pages : results.length === IMAGES_PER_PAGE
      );
    } catch (err) {
      console.error("Erro ao buscar imagens:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activateSearch) return;

    if (!isInteractedCategory) {
      setPage(1);
      fetchImages(true);
    }
    setActivateSearch(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activateSearch, isInteractedCategory]);

  useEffect(() => {
    if (page > 1) fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // reset ao trocar de categoria (evita race com onReady do hook)
  useEffect(() => {
    setFotos([]);

    if (categoria === "liked" || categoria === "downloaded") {
      setInteractedReady(false);   // só reseta quando precisa mostrar "Carregando..."
    } else {
      setInteractedReady(true);    // nas abas normais esse flag não é usado
    }
  }, [categoria]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.pageYOffset >=
        document.documentElement.offsetHeight - 10;

      if (nearBottom && hasMore && !isLoading) {
        setPage((p) => p + 1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  const hasInteracted = interactedPhotos.length > 0;

  return (
    <section className="photo-gallery" aria-label="Galeria de fotos">
      <SearchBar
        setQuery={setQuery}
        setCategoria={setCategoria}
        setActivateSearch={setActivateSearch}
      />

      {isInteractedCategory ? (
        !interactedReady ? (
          <p className="loading-message" aria-live="polite">
            Carregando...
          </p>
        ) : hasInteracted ? (
          <FotoList fotos={fotosExibidas} setFotoAmpliada={setFotoAmpliada} />
        ) : (
          <p className="empty-message" aria-live="polite">
            Nada por aqui. Curta ou baixe algumas imagens primeiro!
          </p>
        )
      ) : (
        <FotoList fotos={fotosExibidas} setFotoAmpliada={setFotoAmpliada} />
      )}

      {fotoAmpliada && (
        <FotoAmpliada foto={fotoAmpliada} setFotoAmpliada={setFotoAmpliada} />
      )}
    </section>
  );
};

export default PhotoGallery;