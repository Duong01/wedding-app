export default [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: "Ngày chung ",
    },
  },

  {
    path: "/templates",
    name: "Templates",
    component: () => import("@/views/Templates.vue"),
    meta: {
      title: "Mẫu thiệp cưới",
    },
  },

  {
    path: "/manage",
    name: "Manage",
    component: () => import("@/views/Manage.vue"),
    meta: {
      title: "Quản lý thiệp",
      requiresAuth: true,
      roles: ["Admin", "User"],
    },
  },

  {
    path: "/admin",
    name: "Admin",
    component: () => import("@/views/Admin.vue"),
    meta: {
      title: "Phân quyền tài khoản",
      requiresAuth: true,
      roles: ["Admin"],
    },
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: {
      title: "Đăng nhập",
      guestOnly: true,
    },
  },

  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/Profile.vue"),
    meta: {
      title: "Thông tin cá nhân",
      requiresAuth: true,
      roles: ["Admin", "User", "Guest"],
    },
  },

  {
    path: "/preview",
    name: "EditorPreview",
    component: () => import("@/components/editor/EditorPreview.vue"),
    meta: {
      title: "Mẫu thiệp cưới",
    },
  },

  {
    path: "/preview-bare",
    name: "PreviewBare",
    component: () => import("@/components/editor/PreviewRenderer.vue"),
    meta: {
      title: "Xem trước",
    },
  },

  {
    path: "/editor",
    name: "Editor",
    component: () => import("@/views/Editor.vue"),
    meta: {
      keepAlive: true,
      title: "Editor thiệp cưới",
      /*
       * Cho phép vào tạo thiệp KHÔNG cần đăng nhập.
       * Chỉ bắt buộc đăng nhập khi bấm "Lưu thiệp"
       * (xử lý trong Editor.vue).
       */
      requiresAuth: false,
      roles: ["Admin", "User"],
    },
  },

  {
    path: "/wedding/:slug",
    name: "WeddingBySlug",
    component: () => import("@/views/WeddingDetail.vue"),
    props: true,
  },

  {
    path: "/:slug/:token?",
    name: "WeddingByApi",
    component: () => import("@/views/WeddingApi.vue"),
    props: true,
  },

  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: "Ngày chung đôi",
    },
  },
];

