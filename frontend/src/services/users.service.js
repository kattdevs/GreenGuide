import api from "./api.js";
export const usersService = {
  getAll: () => api.get("/users"),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
};
