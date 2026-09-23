import { useAuthStore } from "@/stores/auth";

/*
 * Các route công khai — ai cũng xem được
 * (khách chưa đăng nhập, Guest...).
 */
const PUBLIC_ROUTE_NAMES = [
  "Home",
  "Templates",
  "TemplatesFeatured",
  "TemplatesModern",
  "TemplatesTraditional",
  "WeddingOnline",
  "CreateInvitation",
  "About",
  "Pricing",
  "Guide",
  "Contact",
  "EditorPreview",
  "PreviewBare",
  "WeddingBySlug",
  "WeddingByApi",
  "Login",
];

export function setupRouterGuards(router) {

    /*
     * Guard trả thẳng giá trị điều hướng thay vì gọi next():
     * vue-router 4 đã bỏ dần kiểu callback (cảnh báo
     * VUE_ROUTER_R0025). `undefined` = cho đi tiếp.
     */
    router.beforeEach(async (to) => {

        document.title = to.meta.title || "Thiệp Duyên — Thiệp cưới online";

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
                return { name: "Manage" };
            }

            return true;
        }

        /*
         * Route cho phép truy cập khi chưa đăng nhập
         * (meta.requiresAuth === false) — ví dụ Editor:
         * vào tạo thiệp tự do, chỉ bắt buộc đăng nhập
         * khi bấm "Lưu thiệp".
         */
        if (to.meta.requiresAuth === false) {
            return true;
        }

        /*
         * Route bảo vệ: chưa đăng nhập
         * → đá về /login kèm redirect.
         */
        if (!auth.isLoggedIn) {
            return {
                name: "Login",
                query: {
                    redirect: to.fullPath,
                },
            };
        }

        /*
         * Có token nhưng chưa xác thực lại với server
         * (F5 / mở tab mới) → kiểm tra session một lần.
         */
        if (!auth.checking && !auth.sessionVerified) {
            const valid = await auth.restoreSession();

            auth.sessionVerified = true;

            if (!valid) {
                return {
                    name: "Login",
                    query: {
                        redirect: to.fullPath,
                    },
                };
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
                return { name: "Home" };
            }
        }

        return true;

    });
    router.afterEach(() => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    });

}
