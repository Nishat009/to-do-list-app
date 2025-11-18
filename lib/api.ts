import axios, { AxiosInstance } from "axios";

const API_BASE_URL = "https://todo-app.pioneeralpha.com";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
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

  async updateUser(
    data: Partial<{ first_name: string; last_name: string; email: string }>
  ) {
    const response = await this.api.patch("/api/users/me/", data);
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
