import { defineStore } from "pinia";

import {
  Login,
  RegisterAccount,
  CheckSession,
  LogOut,
} from "@/model/api";

/*
 * 3 quyền của hệ thống:
 *  - Admin: toàn quyền (quản lý tài khoản, phân quyền)
 *  - User:  tạo / chỉnh sửa thiệp của mình
 *  - Guest: chỉ xem thiệp
 */
export const ROLES = {
  ADMIN: "Admin",
  USER: "User",
  GUEST: "Guest",
};

export const ROLE_LABELS = {
  Admin: "Quản trị viên",
  User: "Người dùng",
  Guest: "Khách",
};

/*
 * Ma trận phân quyền — điều hướng + trang nào
 * được phép truy cập với quyền nào.
 *
 * Lưu ý: "editor" ai cũng có (kể cả chưa đăng nhập)
 * — vào tạo thiệp tự do, chỉ bắt buộc đăng nhập
 * khi bấm "Lưu thiệp".
 */
export const ROLE_PERMISSIONS = {
  Admin: [
    "home",
    "templates",
    "manage",
    "editor",
    "preview",
    "admin",
    "profile",
  ],

  User: [
    "home",
    "templates",
    "manage",
    "editor",
    "preview",
    "profile",
  ],

  Guest: [
    "home",
    "templates",
    "editor",
    "preview",
    "profile",
  ],
};

function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1];

    if (!base64) {
      return null;
    }

    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");

    const json = decodeURIComponent(
      window
        .atob(normalized)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(json);
  } catch (e) {
    console.warn("[auth] Không giải mã được token:", e);

    return null;
  }
}

function normalizeRole(value) {
  const role = (value || "").toString().trim();

  if (!role) {
    return ROLES.GUEST;
  }

  const match = Object.values(ROLES).find(
    (r) => r.toLowerCase() === role.toLowerCase()
  );

  return match || ROLES.GUEST;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",

    user: (() => {
      try {
        const raw = localStorage.getItem("user");

        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })(),

    role: (() => {
      const stored = localStorage.getItem("role");

      if (stored) {
        return stored;
      }

      /*
       * Fallback: giải mã token đang có để lấy claim Role.
       */
      const token = localStorage.getItem("token");

      if (!token) {
        return "";
      }

      const payload = decodeJwtPayload(token);

      return payload?.Role || "";
    })(),

    checking: false,

    /*
     * Đánh dấu đã xác thực token với server
     * trong phiên này chưa (tránh gọi CheckSession
     * mỗi lần điều hướng).
     */
    sessionVerified: false,
  }),

  getters: {
    isLoggedIn: (state) => {
      return !!state.token;
    },

    currentRole: (state) => {
      return normalizeRole(state.role);
    },

    roleLabel() {
      return ROLE_LABELS[this.currentRole] || this.currentRole;
    },

    isAdmin() {
      return this.currentRole === ROLES.ADMIN;
    },

    isUser() {
      return this.currentRole === ROLES.USER;
    },

    isGuest() {
      return this.currentRole === ROLES.GUEST;
    },

    /*
     * Danh sách "khóa trang" mà quyền hiện tại
     * được phép truy cập.
     */
    permissions() {
      return ROLE_PERMISSIONS[this.currentRole] || ROLE_PERMISSIONS.Guest;
    },

    displayName: (state) => {
      return (
        state.user?.EmpName ||
        state.user?.Email ||
        "Người dùng"
      );
    },

    avatar: (state) => {
      return state.user?.Avartar || state.user?.Avatar || "";
    },
  },

  actions: {
    persist() {
      if (this.token) {
        localStorage.setItem("token", this.token);
      } else {
        localStorage.removeItem("token");
      }

      if (this.user) {
        localStorage.setItem("user", JSON.stringify(this.user));
      } else {
        localStorage.removeItem("user");
      }

      if (this.role) {
        localStorage.setItem("role", this.role);
      } else {
        localStorage.removeItem("role");
      }
    },

    /*
     * Đăng nhập bằng email + password.
     * Backend trả { token, user: {..., Role_User} }.
     */
    async login(email, password) {
      const response = await Login({
        Email: email,
        Password: password,
      });

      const result = response?.data;

      if (!result || result.status !== "success" || !result.data?.token) {
        throw new Error(
          result?.message || "Đăng nhập thất bại. Vui lòng thử lại."
        );
      }

      this.token = result.data.token;
      this.user = result.data.user || null;

      /*
       * Ưu tiên Role_User trong user object,
       * fallback về claim Role trong token.
       */
      const payload = decodeJwtPayload(this.token);

      this.role =
        this.user?.Role_User || payload?.Role || ROLES.GUEST;

      this.sessionVerified = true;

      this.persist();

      return this.user;
    },

    /*
     * Đăng ký tài khoản mới.
     * Backend Register không gán Role_User → tài khoản mới
     * mặc định là Guest cho đến khi Admin phân quyền
     * qua trang /admin (UpdateRole).
     */
    async register(payload) {
      const response = await RegisterAccount(payload);

      const result = response?.data;

      if (!result || result.status !== "success") {
        throw new Error(
          result?.message || "Đăng ký thất bại. Vui lòng thử lại."
        );
      }

      return true;
    },

    /*
     * Khởi động app: nếu có token thì xác thực lại
     * với server (CheckSession) và đồng bộ role.
     */
    async restoreSession() {
      if (!this.token) {
        return false;
      }

      this.checking = true;

      try {
        const response = await CheckSession();

        const result = response?.data;

        if (!result || result.status !== "success" || !result.data) {
          this.forceLogout();

          return false;
        }

        /*
         * Giữ dữ liệu user cũ (có Role_User),
         * chỉ bổ sung thông tin từ server.
         */
        this.user = {
          ...(this.user || {}),
          ...result.data,
        };

        const payload = decodeJwtPayload(this.token);

        this.role =
          this.user?.Role_User || payload?.Role || this.role || ROLES.GUEST;

        this.persist();

        return true;
      } catch (e) {
        /*
         * Token hết hạn / không hợp lệ → đăng xuất.
         */
        this.forceLogout();

        return false;
      } finally {
        this.checking = false;
      }
    },

    async logout() {
      try {
        await LogOut();
      } catch {
        /*
         * Backend logout chỉ trả success —
         * lỗi mạng vẫn cho đăng xuất local.
         */
      }

      this.forceLogout();
    },

    forceLogout() {
      this.token = "";
      this.user = null;
      this.role = "";
      this.sessionVerified = false;

      this.persist();
    },

    /*
     * Dùng bởi trang Admin khi phân quyền.
     */
    setRole(role) {
      this.role = normalizeRole(role);

      if (this.user) {
        this.user = {
          ...this.user,
          Role_User: this.role,
        };
      }

      this.persist();
    },

    /*
     * Quyền hiện tại có được phép truy cập
     * "khóa trang" này không.
     */
    can(permission) {
      return this.permissions.includes(permission);
    },

    /*
     * Editor cho phép khách chưa đăng nhập vào tạo
     * thiệp — chỉ chặn khi bấm "Lưu thiệp".
     */
    canEditDraft() {
      return true;
    },

    /*
     * Được phép lưu thiệp lên server không
     * (phải đăng nhập + có quyền User/Admin).
     */
    canSaveWedding() {
      return (
        this.isLoggedIn &&
        (this.currentRole === ROLES.ADMIN ||
          this.currentRole === ROLES.USER)
      );
    },
  },
});
