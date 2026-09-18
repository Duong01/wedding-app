import { createRouter, createWebHistory } from "vue-router";

import routes from "./routes";

import { setupRouterGuards } from "./guards";

const router = createRouter({

    history: createWebHistory(import.meta.env.BASE_URL),

    routes,

    scrollBehavior(to, from, savedPosition) {

        // Quay lại trang trước (back/forward): giữ nguyên vị trí cuộn

        if (savedPosition) {

            return savedPosition;

        }

        return {

            top: 0

        };

    }

});

setupRouterGuards(router);

export default router;