// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const apiGet = async (url) => {
//   const response = await api.get(url);
//   return response;
// };

// export const apiPost = async (url, data) => {
//   const response = await api.post(url, data);
//   return response;
// };



import axios from 'axios';

const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const apiGet = (url) => api.get(url);
// In api.js
export const apiPost = (url, data) => {
  console.log('Sending to:', url, 'Data:', data);
  return api.post(url, data); // use api, not axios

};
export const apiPut = (url, data) => api.put(url, data);
export const apiDelete = (url) => api.delete(url);
// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export const apiGet = async (url) => {
//   const response = await api.get(url);
//   return response;
// };

// export const apiPost = async (url, data) => {
//   const response = await api.post(url, data);
//   return response;
// };