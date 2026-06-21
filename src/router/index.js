import {
    createRouter,
    createWebHistory
} from "vue-router";

import routes from "./routes";

import {
    setupRouterGuards
} from "./guards";

const router = createRouter({

    history: createWebHistory(import.meta.env.BASE_URL),

    routes,

    scrollBehavior() {

        return {

            top: 0,

            behavior: "smooth"

        };

    }

});

setupRouterGuards(router);

export default router;