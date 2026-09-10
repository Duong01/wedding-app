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
    path: "/preview",
    name: "EditorPreview",
    component: () => import("@/components/editor/EditorPreview.vue"),
    meta: {
      title: "Mẫu thiệp cưới",
    },
  },

  {
    path: "/editor",
    name: "Editor",
    component: () => import("@/views/Editor.vue"),
    meta: {
      keepAlive: true,
    },
    meta: {
      title: "Editor thiệp cưới",
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
];

