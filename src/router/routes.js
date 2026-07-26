export default [
  {
    path: "/",
    name: "Home",
    component: () => import("./../views/Home.vue"),
    meta: {
      title: "Wedding Invitation"
    }
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