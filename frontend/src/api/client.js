import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const uploadsBase =
  import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000";
