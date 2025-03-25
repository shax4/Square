import axios from "axios"

// Base axios instance with common configuration
const axiosInstance = axios.create({
  baseURL: "https://api.example.com", // Replace with your actual API base URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

// Request interceptor for adding auth token, etc.
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add authorization token here if needed
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling common responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error:", error.response.status, error.response.data)

      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized - maybe redirect to login
        console.log("Unauthorized access")
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network Error:", error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Request Error:", error.message)
    }

    return Promise.reject(error)
  },
)

export default axiosInstance

