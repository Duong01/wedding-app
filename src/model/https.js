import { t } from "@/lang";

import axios from "axios";
import router from "@/router";

const api = axios.create({
  baseURL: "/api",

  /*
   * 30 giây — đủ cho mọi API JSON thường. Đặt quá dài
   * (trước đây 5 phút) thì khi server treo (app pool IIS
   * ngủ, mất kết nối...) người dùng đứng trước màn hình
   * loading vô hạn: F5 cũng chỉ treo lại lần nữa.
   * Riêng upload file lớn (PostFile) giữ hạn dài hơn.
   */
  timeout: 60000,

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
     Ngoại lệ: request đánh dấu skipAuthRedirect
     (vd kiểm tra trạng thái thiệp từ trang khách
     mời — khách không đăng nhập, không được
     văng sang trang login) → bỏ qua, để component
     tự xử lý.
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

/*
 * Chống alert 401 dồn dập: khi token chết giữa phiên,
 * nhiều API đang chạy song song cùng fail 401 — chỉ
 * alert + redirect MỘT lần cho đợt đó (reset khi đã
 * sang trang login hoặc có request thành công lại).
 */
let authRedirected = false;

api.interceptors.response.use(
  (response) => {
    /* Request thành công → token còn sống, mở khóa lại */
    authRedirected = false;

    return response;
  },

  (error) => {
    const status = error.response?.status;

    if (status === 401 && !error.config?.skipAuthRedirect) {
      if (!authRedirected) {
        authRedirected = true;

        alert(
          extractApiMessage(
            error.response?.data,
            t("auth.sessionExpired")
          )
        );

        if (router.currentRoute.value.path !== "/login") {
          router.push({
            path: "/login",
            query: {
              redirect: router.currentRoute.value.fullPath,
            },
          });
        }
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

/*
 * GetPublic — GET không bắt buộc đăng nhập.
 * Khi server trả 401 (chưa có token / token hết hạn)
 * KHÔNG redirect về /login — component tự xử lý
 * (vd khách mời mở link thiệp, chưa đăng nhập).
 */
function GetPublic(url, params = {}, success, error) {
  return api
    .get(url, {
      params,
      skipAuthRedirect: true,
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

/*
 * PostFile — upload multipart/form-data, hạn timeout riêng
 * (5 phút) cho ảnh/nhạc lớn qua mạng chậm.
 *
 * onUploadProgress: callback tiến trình (axios) — truyền vào
 * để UI hiện % đã gửi. Lưu ý: % này là phần TRÍNH DUYỆT gửi
 * được, chưa gồm thời gian server xử lý (tối ưu ảnh) — khi
 * progress = 100% thì request vẫn đang chờ server trả về.
 */
function PostFile(url, form, success, error, onUploadProgress) {
  return api
    .post(url, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },

      /* Upload ảnh/nhạc lớn qua mạng chậm — hạn riêng, dài hơn JSON. */
      timeout: 300000,

      onUploadProgress,
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
  GetPublic,
  GetNew,
  Post,
  Put,
  Delete,
  PostFile,
};

export default https;