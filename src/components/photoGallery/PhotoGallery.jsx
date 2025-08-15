import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../searchBar/SearchBar";
import FotoList from "../foto-fotoList/FotoList";
import FotoAmpliada from "../fotoAmpliada/FotoAmpliada";

import { useDebounce } from "../../hooks/useDebounce";
import { useInteractedPhotos } from "../../hooks/useInteractedPhotos";
import { useFilteredPhotos } from "../../hooks/useFilteredPhotos";

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

  const apiKey = import.meta.env.VITE_UNSPLASH_API_KEY;
  const debouncedQuery = useDebounce(query, 400);
  const interactedPhotos = useInteractedPhotos(categoria, apiKey, () => {
    setInteractedReady(true);
  });

  const fotosExibidas = useFilteredPhotos({
    fotos,
    categoria,
    query: debouncedQuery,
    interactedPhotos,
  });

  const fetchImages = async (reset = false) => {
    const isFilter = categoria === "liked" || categoria === "downloaded";
    const searchQuery = isFilter
      ? ""
      : [debouncedQuery, categoria].filter(Boolean).join(" ");
    const endpoint = searchQuery
      ? "https://api.unsplash.com/search/photos"
      : "https://api.unsplash.com/photos";
    const params = {
      client_id: apiKey,
      page,
      per_page: IMAGES_PER_PAGE,
      query: searchQuery || undefined,
    };

    setIsLoading(true);
    try {
      const res = await axios.get(endpoint, { params });
      const results = searchQuery ? res.data.results : res.data;
      setFotos((prev) => {
        if (reset) return results;
        const prevIds = new Set(prev.map((f) => f.id));
        const unique = results.filter((f) => !prevIds.has(f.id));
        return [...prev, ...unique];
      });
      if (!isFilter) {
        setHasMore(
          searchQuery
            ? page < res.data.total_pages
            : results.length === IMAGES_PER_PAGE
        );
      }
    } catch (err) {
      console.error("Erro ao buscar imagens:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activateSearch) {
      if (!["liked", "downloaded"].includes(categoria)) {
        setPage(1);
        fetchImages(true);
      }
      setActivateSearch(false);
    }
  }, [activateSearch]);

  useEffect(() => {
    if (page > 1) fetchImages();
  }, [page]);

  useEffect(() => {
    fetchImages(true);
  }, []);

  useEffect(() => {
    setFotos([]);
    setInteractedReady(false);
  }, [categoria]);

  // infinite scroll automático
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.pageYOffset >=
          document.documentElement.offsetHeight - 10 &&
        hasMore &&
        !isLoading
      ) {
        setPage((p) => p + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading]);

  const isInteractedCategory = ["liked", "downloaded"].includes(categoria);
  const hasInteracted = interactedPhotos.length > 0;

  return (
    <section className="photo-gallery">
      <SearchBar
        setQuery={setQuery}
        setCategoria={setCategoria}
        setActivateSearch={setActivateSearch}
      />

      {isInteractedCategory ? (
        !interactedReady ? (
          <p className="loading-message">Carregando...</p>
        ) : hasInteracted ? (
          <FotoList
            fotos={fotosExibidas}
            setFotoAmpliada={setFotoAmpliada}
          />
        ) : (
          <p className="empty-message">
            Nada por aqui. Curta ou baixe algumas imagens primeiro!
          </p>
        )
      ) : (
        <>
          <FotoList fotos={fotosExibidas} setFotoAmpliada={setFotoAmpliada} />
        </>
      )}

      {fotoAmpliada && (
        <FotoAmpliada
          foto={fotoAmpliada}
          setFotoAmpliada={setFotoAmpliada}
        />
      )}
    </section>
  );
};

export default PhotoGallery;