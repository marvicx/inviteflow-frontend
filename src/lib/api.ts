import axios from "axios";

const API_ORIGIN = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");
const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage as fallback
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(err);
  },
);

// Auth
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

// Templates
export const templatesApi = {
  list: (params?: { category?: string; premium?: boolean }) =>
    api.get("/templates", { params }),
  get: (id: string) => api.get(`/templates/${id}`),
};

// Invitations
export const invitationsApi = {
  list: () => api.get("/invitations"),
  get: (id: string) => api.get(`/invitations/${id}`),
  getPublic: (slug: string) => api.get(`/invitations/public/${slug}`),
  create: (data: Record<string, unknown>) => api.post("/invitations", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.patch(`/invitations/${id}`, data),
  updateStatus: (id: string, status: string) =>
    api.patch(`/invitations/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/invitations/${id}`),
  addQuestion: (id: string, data: Record<string, unknown>) =>
    api.post(`/invitations/${id}/questions`, data),
  deleteQuestion: (id: string, questionId: string) =>
    api.delete(`/invitations/${id}/questions/${questionId}`),
  analytics: (id: string) => api.get(`/invitations/${id}/analytics`),
  addFaq: (
    id: string,
    data: { question: string; answer: string; sortOrder?: number },
  ) => api.post(`/invitations/${id}/faqs`, data),
  updateFaq: (
    id: string,
    faqId: string,
    data: { question?: string; answer?: string },
  ) => api.patch(`/invitations/${id}/faqs/${faqId}`, data),
  deleteFaq: (id: string, faqId: string) =>
    api.delete(`/invitations/${id}/faqs/${faqId}`),
};

// Guests
export const guestsApi = {
  rsvp: (data: Record<string, unknown>) => api.post("/guests/rsvp", data),
  list: (invitationId: string) => api.get(`/guests/${invitationId}`),
  checkin: (guestId: string) => api.patch(`/guests/${guestId}/checkin`),
  exportCsv: (invitationId: string) =>
    api.get(`/guests/${invitationId}/export`, { responseType: "blob" }),
  bulkInvite: (invitationId: string, emails: string[]) =>
    api.post(`/guests/${invitationId}/bulk-invite`, { emails }),
};

// Upload
export const uploadApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post("/upload/image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Users
export const usersApi = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: Record<string, unknown>) =>
    api.patch("/users/profile", data),
};
