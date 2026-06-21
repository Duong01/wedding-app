export function setupRouterGuards(router) {

    router.beforeEach((to, from, next) => {

        document.title = to.meta.title || "Wedding Invitation";

        next();

    });

    router.afterEach(() => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}