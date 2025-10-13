import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_BASE_API

const axiosInstance = axios.create({
	baseURL: baseURL,
	headers: {
		'Content-Type': 'application/json',
	}
})

// Request interceptor
axiosInstance.interceptors.request.use(
	function (config) {
		const accessToken = localStorage.getItem('accessToken')

		if (accessToken) {
			config.headers['Authorization'] = `Bearer ${accessToken}`
		}
		console.log(config)

		return config;
	}, function (error) {
		return Promise.reject(error);
	}
);

export default axiosInstance