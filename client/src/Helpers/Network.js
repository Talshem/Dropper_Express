import axios from 'axios';

const network = axios.create({});

const getToken = () => {
  return localStorage.getItem('token');
}

const getType = () => {
  return localStorage.getItem('type');
}



network.interceptors.request.use(
  config => {
    config.headers["Authorization"] = "bearer " + getToken();
    config.headers["Type"] = getType();
    return config;
  }
);

network.interceptors.response.use(
  config => {
    return config;
  },
  (error) => {
    return error;
  }
);

export default network;