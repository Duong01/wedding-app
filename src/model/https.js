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
   RESPONSE – XỬ LÝ LỖI TẬP TRUNG

   Backend trả lỗi theo envelope CusResponse:
   { status: "success" | "error", message, data }

   - 401: chưa đăng nhập / token hết hạn hoặc sai
     → thông báo + xóa token + về /login.
   - 403: đã đăng nhập nhưng không đủ quyền
     (vd API Admin) → KHÔNG logout, để component
     tự hiển thị message từ response.
====================== */

function extractApiMessage(data, fallback) {
  if (!data) {
    return fallback;
  }

  if (typeof data === "object" && typeof data.message === "string" && data.message) {
    return data.message;
  }

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  return fallback;
}

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      alert(
        extractApiMessage(
          error.response?.data,
          "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại."
        )
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("favoriteMovies");
      localStorage.removeItem("name");
      localStorage.removeItem("nameShow");

      if (router.currentRoute.value.path !== "/login") {
        router.push({
          path: "/login",
          query: {
            redirect: router.currentRoute.value.fullPath,
          },
        });
      }
    }

    return Promise.reject(error);
  }
);

/* ======================
   GET
====================== */

function Get(url, params = {}, success, error) {
  return api
    .get(url, {
      params,
    })
    .then((response) => {
      if (success) {
        success(response.data);
      }

      return response;
    })
    .catch((err) => {
      if (error) {
        error(err);
      }

      throw err;
    });
}

/* ======================
   POST
====================== */

function Post(url, params = {}, success, error) {
  return api
    .post(url, params)
    .then((response) => {
      if (success) {
        success(response.data);
      }

      return response;
    })
    .catch((err) => {
      if (error) {
        error(err);
      }

      throw err;
    });
}

/* ======================
   PUT
====================== */

function Put(url, params = {}, success, error) {
  return api
    .put(url, params)
    .then((response) => {
      if (success) {
        success(response.data);
      }

      return response;
    })
    .catch((err) => {
      if (error) {
        error(err);
      }

      throw err;
    });
}

/* ======================
   DELETE
====================== */

function Delete(url, params = {}, success, error) {
  return api
    .delete(url, {
      params,
    })
    .then((response) => {
      if (success) {
        success(response.data);
      }

      return response;
    })
    .catch((err) => {
      if (error) {
        error(err);
      }

      throw err;
    });
}

/* ======================
   GET NEW
====================== */

function GetNew(url, params = {}, success, error) {
  return api
    .get(url, {
      params,
    })
    .then((response) => {
      if (success) {
        success(response.data);
      }

      return response;
    })
    .catch((err) => {
      if (error) {
        error(err);
      }

      throw err;
    });
}

/* ======================
   POST FILE
====================== */

function PostFile(url, form, success, error) {
  return api
    .post(url, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      if (success) {
        success(response.data);
      }

      return response;
    })
    .catch((err) => {
      if (error) {
        error(err);
      }

      throw err;
    });
}

/* ======================
   EXPORT
====================== */

const https = {
  Get,
  GetNew,
  Post,
  Put,
  Delete,
  PostFile,
};

export default https;