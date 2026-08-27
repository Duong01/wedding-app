import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: "/api",
  timeout: 300000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

/* ======================
   REQUEST – GẮN JWT
====================== */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ======================
   RESPONSE – 401 LOGOUT
====================== */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
        alert(error.response.data || "Unauthorized. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("favoriteMovies");
        localStorage.removeItem("user");
        localStorage.removeItem("name");
        localStorage.removeItem("nameShow");
        router.push({
          path: "/login",
          query: { redirect: router.currentRoute.value.fullPath }
        });
    }
    return Promise.reject(error);
  }
);

/* ======================
   COMMON METHODS
====================== */

function Get(url, params = {}) {
  return api.get(url, {
    params,
  });
}
function Post(url, params = {}) {
  return api.post(url, params);
}

function GetNew(url, params = {}) {
  return api.get(url, {
    params,
  });
}

function PostFile(url, form) {
  return api.post(url, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

const https = {
  Post,
  Get,
  GetNew,
  PostFile,
};

export default https;
