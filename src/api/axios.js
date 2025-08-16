import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // ajuste conforme sua API
  withCredentials: true,
});

export default api;
