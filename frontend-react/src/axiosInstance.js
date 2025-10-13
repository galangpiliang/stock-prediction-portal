import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API;

const axiosInstance = axios.create({
	baseURL,
	headers: { "Content-Type": "application/json" },
});

// Separate instance for refresh
const refreshAxios = axios.create({
	baseURL,
	headers: { "Content-Type": "application/json" },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    // Skip attaching Authorization header for public endpoints
    const isAuthEndpoint =
      config.url.includes("/login") ||
      config.url.includes("/token/refresh");

    if (accessToken && !isAuthEndpoint) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    } else if (!accessToken && !isAuthEndpoint) {
      console.warn("[Axios Request] No access token found, skipping protected request.");
    }

    return config;
  },
  (error) => {
    console.error("[Axios Request Interceptor] Error configuring request:", error);
    return Promise.reject(error);
  }
);

function handleAuthFailure(error) {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
	window.location.href = "/login";
	return Promise.reject(error);
}

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const refreshToken = localStorage.getItem("refreshToken");

		if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
			originalRequest._retry = true;

			try {
				const res = await refreshAxios.post("/token/refresh/", {
					refresh: refreshToken,
				});

				const newAccessToken = res.data.access;
				localStorage.setItem("accessToken", newAccessToken);
				originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

				console.log("Token refreshed");
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				console.error('[Axios Interceptor] Token refresh failed:', refreshError?.response?.data || refreshError.message);
				console.warn('[Axios Interceptor] Clearing tokens and redirecting to login.');
				return handleAuthFailure(refreshError);
			}
		} else if (error.response?.status === 401) {
			console.warn('[Axios Interceptor] 401 detected (no valid refresh token). Redirecting to login.');
			console.log('Error details:', error.response?.data || error.message);
			return handleAuthFailure(error);
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
