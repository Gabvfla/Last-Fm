import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_LASTFM_API_URL, 
  params: {
    api_key: import.meta.env.VITE_LASTFM_API_KEY,
    format: "json",
  },
});

export default api;
