import axios from "axios";

const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json"
    }
});

service.interceptors.request.use(
    config => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;

    },
    error => Promise.reject(error)
);

service.interceptors.response.use(

    response => response.data,

    error => {

        console.error(error);

        return Promise.reject(error);

    }

);

export default {

    install(app) {

        app.config.globalProperties.$axios = service;

    }

};

export { service };