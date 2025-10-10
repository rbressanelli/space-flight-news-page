import axios from "axios";

const api = axios.create({
  baseURL: "https://api.spaceflightnewsapi.net/v4",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
