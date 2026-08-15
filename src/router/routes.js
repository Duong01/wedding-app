export default [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: () => import("./../views/Home.vue"),

  // },
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: "Ngày chung đôi",
    },
  },

  // {
  //   path: "/wedding/:id",
  //   name: "WeddingDetail",
  //   component: () => import("@/views/WeddingDetail.vue"),
  //   props: true,
  // },

  {
    path: "/wedding/:slug",
    name: "WeddingBySlug",
    component: () => import("@/views/WeddingDetail.vue"),
    props: true,
  },

  // {
  //   path: "/loading",
  //   name: "Loading",
  //   component: () => import("@/views/Loading.vue"),
  //   meta: {
  //     title: "Loading..."
  //   }
  // },

  // {
  //   path: "/:pathMatch(.*)*",
  //   name: "NotFound",
  //   component: () => import("@/views/NotFound.vue"),
  //   meta: {
  //     title: "404"
  //   }
  // }
];
