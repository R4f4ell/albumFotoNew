import axios from "axios";

const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_API_KEY;

export const unsplash = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${ACCESS_KEY}`,
    "Accept-Version": "v1",
  },
});

export const listPhotos   = (params) => unsplash.get("/photos", { params });
export const searchPhotos = (params) => unsplash.get("/search/photos", { params });
export const getPhotoById = (id)     => unsplash.get(`/photos/${id}`);