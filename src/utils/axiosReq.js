import axios from 'axios';

const baseURL = window.location.hostname === 'localhost'
? 'http://localhost:5000/api'
: 'https://api.poshcoderit.com/api';

export const axiosReq = axios.create({
  baseURL: baseURL,
  withCredentials: true
});


axiosReq.interceptors.request.use((config) => {
  const token = localStorage.getItem("poshcoder_admin");

  if (token) {
    config.headers.authorization = token;
  }

  return config;
});
