import api from "./axios";

export const fetchExplorations = (params = {}) =>
  api.get("/api/explorations", { params }).then((r) => r.data);

export const fetchExplorationById = (id) =>
  api.get(`/api/explorations/${id}`).then((r) => r.data);

export const createExploration = (data) =>
  api.post("/api/explorations", data).then((r) => r.data);
