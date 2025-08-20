import { supabase } from "../lib/supabase";
import { getSessionId } from "./sessionId";

export const getInteraction = async (imageId) => {
  const sessionId = getSessionId();
  const { data, error } = await supabase
    .from("interactions")
    .select("likes, downloads")
    .eq("image_id", imageId)
    .eq("session_id", sessionId)
    .maybeSingle(); 

  if (error) {
    console.error("Erro ao buscar interações:", error);
  }

  return data ?? null;
};

export const incrementLike = async (imageId) => {
  const sessionId = getSessionId();
  const existing = await getInteraction(imageId);

  if (!existing) {
    await supabase.from("interactions").insert({
      image_id: imageId,
      likes: 1,
      downloads: 0,
      session_id: sessionId,
    });
  } else {
    await supabase
      .from("interactions")
      .update({ likes: existing.likes + 1 })
      .eq("image_id", imageId)
      .eq("session_id", sessionId);
  }
};

export const incrementDownload = async (imageId) => {
  const sessionId = getSessionId();
  const existing = await getInteraction(imageId);

  if (!existing) {
    await supabase.from("interactions").insert({
      image_id: imageId,
      downloads: 1,
      likes: 0,
      session_id: sessionId,
    });
  } else {
    await supabase
      .from("interactions")
      .update({ downloads: existing.downloads + 1 })
      .eq("image_id", imageId)
      .eq("session_id", sessionId);
  }
};

export const getLikedImageIds = async () => {
  const sessionId = getSessionId();
  const { data, error } = await supabase
    .from("interactions")
    .select("image_id")
    .eq("session_id", sessionId)
    .gt("likes", 0);

  if (error) {
    console.error("Erro ao buscar imagens curtidas:", error);
    return [];
  }
  return data.map((row) => row.image_id);
};

export const getDownloadedImageIds = async () => {
  const sessionId = getSessionId();
  const { data, error } = await supabase
    .from("interactions")
    .select("image_id")
    .eq("session_id", sessionId)
    .gt("downloads", 0);

  if (error) {
    console.error("Erro ao buscar imagens baixadas:", error);
    return [];
  }
  return data.map((row) => row.image_id);
};