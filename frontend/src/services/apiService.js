import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60 second timeout for image uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Cache utility functions
const getCacheKey = (url, params) => {
  return `${url}?${JSON.stringify(params || {})}`;
};

const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// Optimized GET request with caching
export const cachedGet = async (url, params = {}, useCache = true) => {
  const cacheKey = getCacheKey(url, params);
  
  if (useCache) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }

  try {
    const response = await api.get(url, { params });
    if (useCache) {
      setCache(cacheKey, response.data);
    }
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Retry utility for failed requests
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && error.response?.status >= 500) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};

// Optimized API methods
export const apiService = {
  // GET with caching
  get: (url, params, useCache = true) => 
    retryRequest(() => cachedGet(url, params, useCache)),
  
  // POST with retry
  post: (url, data) => 
    retryRequest(() => api.post(url, data).then(res => res.data)),
  
  // PUT with retry
  put: (url, data) => 
    retryRequest(() => api.put(url, data).then(res => res.data)),
  
  // DELETE with retry
  delete: (url) => 
    retryRequest(() => api.delete(url).then(res => res.data)),
  
  // Upload with progress (POST by default)
  upload: (url, formData, onProgress, method = 'post') => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    };

    if (method.toLowerCase() === 'put') {
      return api.put(url, formData, config).then(res => res.data);
    } else {
      return api.post(url, formData, config).then(res => res.data);
    }
  },
  
  // Clear cache
  clearCache: () => cache.clear(),
  
  // Clear specific cache entry
  clearCacheEntry: (url, params = {}) => {
    const cacheKey = getCacheKey(url, params);
    cache.delete(cacheKey);
  },
};

export default api; 