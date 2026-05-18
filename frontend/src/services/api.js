import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://greenguide-nj4c.onrender.com/api',
  headers: { "Content-Type": "application/json" },
});
// If the server returns 401, clear local storage and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);
export default api;
