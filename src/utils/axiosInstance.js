import router from "@/router";
import axios from "axios";
import { useToast } from "vue-toastification";

const toast = useToast();

// Determine the base URL based on the environmen
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://workoutscannerapi-5cfa4a00a153.herokuapp.com/"
    : "http://localhost:8000/";

const axiosInstance = axios.create({
  // baseURL: `https://workoutscannerapi-5cfa4a00a153.herokuapp.com/`, // Replace this with your API base URL
  // baseURL: `https://workoutscannerapi-5cfa4a00a153.herokuapp.com/`, // Replace this with your API base URL
  baseURL: `https://workoutscannerapi-5cfa4a00a153.herokuapp.com/`, // Replace this with your API base URL
  // baseURL,
});

// Request interceptor to set credentials and bearer token for all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the bearer token from local storage
    const token = localStorage.getItem("gymkey");

    if (token) {
      // Set the bearer token in the request headers
      config.headers.Authorization = `Bearer ${token}`;
    }

    // You can also set other headers, etc. if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and show toasts
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // Show toast with error details
    if (response) {
      const { data, status } = response;
      // toast.error(`Status Code: ${status}`);
      // Check if the current route is the login route
      const isLoginRoute = router.currentRoute.value.name === "login";
      //console.log(isLoginRoute);
      if (status == 401) {
        // toast.error(`Session expired ${router.currentRoute.value}`);
        // router.push({ name: "login" });
        return Promise.reject(error);
      }
      if (data && data.error) {
        toast.error(data.error);
      } else if (data && data.detail) {
        toast.error(data.detail);
      } else if (data && data.old_password) {
        toast.error(data.old_password[0]);
      } else if (data && data.email) {
        toast.error(data.email[0]);
      }
    } else {
      // For network errors or other errors without a response
      toast.error("Network Error");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
