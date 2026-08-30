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

