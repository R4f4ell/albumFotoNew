import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getLikedImageIds, getDownloadedImageIds } from "../utils/interactions";

export function useInteractedPhotos(categoria, apiKey, onReady) {
  const [photos, setPhotos] = useState([]);
  const cache = useRef({ liked: null, downloaded: null });

  useEffect(() => {
    if (categoria !== "liked" && categoria !== "downloaded") return;

    (async () => {
      let list = cache.current[categoria];

      if (!list) {
        const ids =
          categoria === "liked"
            ? await getLikedImageIds()
            : await getDownloadedImageIds();

        const results = await Promise.all(
          ids.map((id) =>
            axios
              .get(`https://api.unsplash.com/photos/${id}`, {
                params: { client_id: apiKey },
              })
              .then((r) => r.data)
              .catch(() => null)
          )
        );

        // Filtra os nulls em caso de erro
        list = results.filter(Boolean);
        cache.current[categoria] = list;
      }

      setPhotos(list);
      if (onReady) onReady();
    })();
  }, [categoria, apiKey, onReady]);

  return photos;
}