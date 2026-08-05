export function setupRouterGuards(router) {

    router.beforeEach((to, from, next) => {

        document.title = to.meta.title || "Ngày chung đôi";

        next();

    });

    router.afterEach(() => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}