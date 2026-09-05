import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://leadcrmintern-ss-v1.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post<RefreshResponse>(
      `${api.defaults.baseURL}/auth/refresh-token`,
      {
        refreshToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const newAccessToken = response.data.accessToken;

    if (!newAccessToken) {
      throw new Error("Refresh response did not contain an access token.");
    }

    const currentUser = useAuthStore.getState().user;

    if (currentUser) {
      useAuthStore.getState().login(
        newAccessToken,
        response.data.refreshToken || refreshToken,
        currentUser
      );
    }

    return newAccessToken;
  } catch (error) {
    console.error(
      "REFRESH TOKEN ERROR:",
      axios.isAxiosError(error)
        ? error.response?.data || error.message
        : error
    );

    useAuthStore.getState().logout();

    return null;
  }
};

// Attach the current access token to every API request.
api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically refresh an expired access token and retry the request.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    const isRefreshRequest =
      originalRequest.url?.includes("/auth/refresh-token");

    if (
      status !== 401 ||
      originalRequest._retry ||
      isRefreshRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      if (!newAccessToken) {
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch {
      return Promise.reject(error);
    }
  }
);

export default api;
