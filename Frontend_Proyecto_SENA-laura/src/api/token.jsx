import axios from 'axios';
import { URL_api } from './variables';

const getToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : ''; 
}

const api = axios.create({
    baseURL: URL_api
});

api.interceptors.request.use((request) => {
  const token = getToken();
  request.headers.Authorization = token;
  return request;  
});

export { getToken, api };
