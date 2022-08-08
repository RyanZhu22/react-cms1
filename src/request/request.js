import axios from 'axios'

// Configuration items
const axiosOption = {
    baseURL: '/api',
    timeout: 5000
}

// Create a single instance
const instance = axios.create(axiosOption);

// Adding a request interceptor
instance.interceptors.request.use(function (config) {
  let token = localStorage.getItem('cms-token')
  if(token){
    config.headers = {
      'cms-token': token
    }
  }
  return config;
}, function (error) {
  // what happen when request error
  return Promise.reject(error);
});

// Adding a response interceptor
instance.interceptors.response.use(function (response) {
  // what happen when response to requests
  return response.data;
}, function (error) {
  // what happen when response errors
  return Promise.reject(error);
});

export default instance;
