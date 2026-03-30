import api from "./axios";

export const fetchBlasts = (params = {}) =>
  api.get("/api/blasts", { params }).then((r) => r.data);

export const fetchBlastById = (id) =>
  api.get(`/api/blasts/${id}`).then((r) => r.data);

export const createBlast = (data) =>
  api.post("/api/blasts", data).then((r) => r.data);
