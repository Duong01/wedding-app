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
  "WeddingIntro",
  "WeddingOpen",
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
    router.beforeEach((to) => {

        /*
         * Title tạm ngay khi điều hướng — trang có useSeo
         * (src/composables/useSeo.js) sẽ ghi đè bằng thẻ đầy
         * đủ hơn sau khi component mount. Trang không có
         * useSeo (Login, Manage, Admin...) vẫn giữ lại tên
         * thương hiệu ở cuối tiêu đề.
         */
        document.title = to.meta.title
            ? `${to.meta.title} | Thiệp Nhà Mình`
            : "Thiệp Nhà Mình — Thiệp cưới online";

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
         * KHÔNG xác thực session (CheckSession) ở đây.
         *
         * Phiên bản trước `await auth.restoreSession()` xong mới
         * cho điều hướng: lần đầu bấm vào trang bảo vệ (Profile,
         * Admin, Thanh toán...) sau khi F5 / mở tab mới, người
         * dùng đứng im chờ API trả về — server free tier đang
         * ngủ đông thì là cả chục giây, cảm giác nút bấm bị treo.
         *
         * Giữ cảm giác tức thì: điều hướng NGAY bằng role đã lưu
         * trong localStorage (đọc đồng bộ, không đi mạng). Session
         * được xác thực ở NỀN lúc app mở (App.vue onMounted) và
         * khi quay lại tab (useTabResume). Token chết thì
         * restoreSession tự forceLogout, API của trang vừa mở
         * sẽ 401 và interceptor https.js đá về /login.
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

}
