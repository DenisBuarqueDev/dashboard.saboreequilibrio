import axios from "axios";

const api = axios.create({
  //baseURL: "https://backend-saboreequilibrio.onrender.com",
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default api;
