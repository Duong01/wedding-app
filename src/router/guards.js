export function setupRouterGuards(router) {

    router.beforeEach((to, from, next) => {

        document.Title = to.meta.Title || "Ngày chung đôi";

        next();

    });

    router.afterEach(() => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}