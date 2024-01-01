import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('ssoAccessTokenHash');
    // eslint-disable-next-line no-param-reassign
    if (token) config.headers['X-token'] = token;

    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
