import { useAuthStore } from "@/stores/auth";

/*
 * Các route công khai — ai cũng xem được
 * (khách chưa đăng nhập, Guest...).
 */
const PUBLIC_ROUTE_NAMES = [
  "Home",
  "Templates",
  "EditorPreview",
  "PreviewBare",
  "WeddingBySlug",
  "WeddingByApi",
  "Login",
];

export function setupRouterGuards(router) {

    router.beforeEach(async (to, from, next) => {

        document.title = to.meta.title || "Ngày chung đôi";

        const auth = useAuthStore();

        /*
         * Route công khai → đi tiếp luôn.
         */
        if (PUBLIC_ROUTE_NAMES.includes(to.name)) {

            /*
             * Đã đăng nhập mà vào /login
             * → chuyển về trang quản lý.
             */
            if (to.name === "Login" && auth.isLoggedIn) {
                next({ name: "Manage" });

                return;
            }

            next();

            return;
        }

        /*
         * Route cho phép truy cập khi chưa đăng nhập
         * (meta.requiresAuth === false) — ví dụ Editor:
         * vào tạo thiệp tự do, chỉ bắt buộc đăng nhập
         * khi bấm "Lưu thiệp".
         */
        if (to.meta.requiresAuth === false) {
            next();

            return;
        }

        /*
         * Route bảo vệ: chưa đăng nhập
         * → đá về /login kèm redirect.
         */
        if (!auth.isLoggedIn) {
            next({
                name: "Login",
                query: {
                    redirect: to.fullPath,
                },
            });

            return;
        }

        /*
         * Có token nhưng chưa xác thực lại với server
         * (F5 / mở tab mới) → kiểm tra session một lần.
         */
        if (!auth.checking && !auth.sessionVerified) {
            const valid = await auth.restoreSession();

            auth.sessionVerified = true;

            if (!valid) {
                next({
                    name: "Login",
                    query: {
                        redirect: to.fullPath,
                    },
                });

                return;
            }
        }

        /*
         * Phân quyền theo meta.roles
         * (Admin / User / Guest).
         */
        const allowedRoles = to.meta.roles;

        if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
            if (!allowedRoles.includes(auth.currentRole)) {
                /*
                 * Không đủ quyền → về trang chủ.
                 */
                next({ name: "Home" });

                return;
            }
        }

        next();

    });
    router.afterEach(() => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}
