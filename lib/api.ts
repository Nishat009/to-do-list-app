import axios, { AxiosInstance } from "axios";

const DEFAULT_API_BASE_URL = "https://todo-app.pioneeralpha.com";

const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  return DEFAULT_API_BASE_URL;
};

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
      "Content-Type": "application/json",
    },
  });

  client.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // If FormData is being sent, remove Content-Type header so axios can set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (typeof window !== "undefined") {
        if (error.response?.status === 401) {
          window.localStorage.removeItem("token");
          window.location.href = "/login";
        }
        
        // Log 400 errors with details for debugging
        if (error.response?.status === 400) {
          console.error("400 Bad Request Error:", {
            url: error.config?.url,
            method: error.config?.method,
            data: error.config?.data,
            response: error.response?.data,
          });
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createApiClient();

class ApiService {
  private api: AxiosInstance;

  constructor(apiInstance: AxiosInstance = apiClient) {
    this.api = apiInstance;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post("/api/auth/login/", {
      email,
      password,
    });
    return response.data;
  }

  async signup(data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) {
    const response = await this.api.post("/api/users/signup/", data);
    return response.data;
  }

  async changePassword(oldPassword: string, newPassword: string) {
    const response = await this.api.post("/api/users/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  }

  // User endpoints
  async getUserDetails() {
    const response = await this.api.get("/api/users/me/");
    return response.data;
  }

  async updateUser(formData: FormData) {
    // Don't set Content-Type header - axios will set it automatically with boundary for FormData
    const response = await this.api.patch("/api/users/me/", formData);
    return response.data;
  }

  // Todo endpoints
  async getTodos(search?: string) {
    const params = search ? { search } : {};
    const response = await this.api.get("/api/todos/", { params });
    return response.data;
  }

  async createTodo(data: {
    title: string;
    description?: string;
    completed?: boolean;
  }) {
    const response = await this.api.post("/api/todos/", data);
    return response.data;
  }

  async updateTodo(
    id: number,
    data: Partial<{
      title: string;
      description: string;
      completed: boolean;
      order?: number;
    }>
  ) {
    const response = await this.api.patch(`/api/todos/${id}/`, data);
    return response.data;
  }

  async deleteTodo(id: number) {
    const response = await this.api.delete(`/api/todos/${id}/`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiClient;
