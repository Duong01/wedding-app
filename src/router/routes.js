export default [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: "Thiệp cưới online - Lưu giữ ngày mình thuộc về nhau",
    },
  },

  /* =====================================================
     THƯ VIỆN MẪU THIẾP + CÁC TRANG ĐÍCH SEO
     Cùng một component, khác bộ lọc mặc định truyền qua
     query để Google index được từng nhóm phong cách.
  ====================================================== */

  {
    path: "/mau-thiep-cuoi",
    name: "Templates",
    component: () => import("@/views/Templates.vue"),
    meta: {
      title: "Mẫu thiệp cưới đẹp",
    },
  },

  {
    path: "/mau-thiep-cuoi-dep",
    name: "TemplatesFeatured",
    component: () => import("@/views/Templates.vue"),
    meta: {
      title: "Mẫu thiệp cưới đẹp nhất",
    },
  },

  {
    path: "/thiep-cuoi-hien-dai",
    name: "TemplatesModern",
    component: () => import("@/views/Templates.vue"),
    meta: {
      title: "Thiệp cưới hiện đại",
    },
  },

  {
    path: "/thiep-cuoi-truyen-thong",
    name: "TemplatesTraditional",
    component: () => import("@/views/Templates.vue"),
    meta: {
      title: "Thiệp cưới truyền thống",
    },
  },

  /* =====================================================
     TRANG ĐÍCH SEO
  ====================================================== */

  {
    path: "/thiep-cuoi-online",
    name: "WeddingOnline",
    component: () => import("@/views/landing/WeddingOnline.vue"),
    meta: {
      title: "Thiệp cưới online",
    },
  },

  {
    path: "/tao-thiep-cuoi",
    name: "CreateInvitation",
    component: () => import("@/views/landing/CreateInvitation.vue"),
    meta: {
      title: "Tạo thiệp cưới online",
    },
  },

  /* =====================================================
     TRANG HỖ TRỢ
  ====================================================== */

  {
    path: "/gioi-thieu",
    name: "About",
    component: () => import("@/views/About.vue"),
    meta: {
      title: "Giới thiệu",
    },
  },

  {
    path: "/bang-gia",
    name: "Pricing",
    component: () => import("@/views/Pricing.vue"),
    meta: {
      title: "Bảng giá",
    },
  },

  {
    path: "/huong-dan",
    name: "Guide",
    component: () => import("@/views/Guide.vue"),
    meta: {
      title: "Hướng dẫn tạo thiệp cưới",
    },
  },

  {
    path: "/lien-he",
    name: "Contact",
    component: () => import("@/views/Contact.vue"),
    meta: {
      title: "Liên hệ",
    },
  },

  /* =====================================================
     ĐƯỜNG DẪN CŨ — giữ để link đã chia sẻ không gãy
  ====================================================== */

  {
    path: "/templates",
    redirect: { name: "Templates" },
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
    path: "/admin/weddings",
    name: "AdminWeddings",
    component: () => import("@/views/AdminWeddings.vue"),
    meta: {
      title: "Quản lý thiệp",
      requiresAuth: true,
      roles: ["Admin"],
    },
  },

  {
    path: "/manage/:slug/payment",
    name: "WeddingPayment",
    component: () => import("@/views/WeddingPayment.vue"),
    meta: {
      title: "Kích hoạt thiệp",
      requiresAuth: true,
      roles: ["Admin", "User"],
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
      title: "Thiệp cưới online – Lưu giữ ngày mình thuộc về nhau",
    },
  },
];
