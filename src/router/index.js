import { createRouter, createWebHistory } from "vue-router";

import routes from "./routes";

import { setupRouterGuards } from "./guards";

/*
 * =========================================================
 * GHI NHỚ VỊ TRÍ CUỘN THEO TỪNG TRANG
 * =========================================================
 * Mặc định mọi điều hướng đều đưa về đầu trang, nên đang xem
 * dở một danh sách dài mà bấm sang trang khác thì quay lại
 * phải vuốt từ đầu. Ở đây mỗi đường dẫn tự nhớ lấy chỗ đang
 * xem và lần sau quay lại sẽ được trả về đúng chỗ đó.
 *
 * Vị trí được chốt ngay lúc bắt đầu rời trang (beforeEach) —
 * lúc đó DOM còn nguyên nên số đo là thật. Nếu đọc lúc đã
 * chuyển trang thì trang cũ đã bị tháo, tài liệu ngắn lại và
 * trình duyệt kẹp scrollY về 0.
 *
 * Lưu kèm vào sessionStorage để sống qua cả lần tải lại trang;
 * đóng tab là quên, không để rác vĩnh viễn trong máy.
 * =========================================================
 */

const STORAGE_KEY = "wedding:scroll-positions";

/* Giữ tối đa ngần này đường dẫn — vượt thì bỏ cái cũ nhất. */
const MAX_ENTRIES = 60;

const positions = new Map();

function loadPositions() {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return;
        }

        Object.entries(JSON.parse(raw)).forEach(([path, top]) => {
            if (typeof top === "number" && top > 0) {
                positions.set(path, top);
            }
        });
    } catch {
        /*
         * sessionStorage bị chặn (chế độ riêng tư) hoặc dữ liệu
         * hỏng → chạy tạm bằng bản trong bộ nhớ.
         */
    }
}

let persistTimer = null;

function persistPositions() {
    clearTimeout(persistTimer);

    persistTimer = setTimeout(() => {
        try {
            const entries = [...positions.entries()].slice(-MAX_ENTRIES);

            sessionStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(Object.fromEntries(entries))
            );
        } catch {
            /* Không ghi được thì thôi — bản trong bộ nhớ vẫn dùng được. */
        }
    }, 250);
}

function rememberPosition(path, top) {
    if (!path) {
        return;
    }

    if (top > 0) {
        positions.set(path, top);
    } else {
        positions.delete(path);
    }

    persistPositions();
}

function recallPosition(path) {
    return positions.get(path) || 0;
}

/*
 * Chờ trang mới cao đủ để cuộn tới vị trí cũ.
 *
 * Transition "out-in" ở App.vue tháo trang cũ trước rồi mới gắn
 * trang mới; trong khoảng giữa đó tài liệu ngắn lại và trình
 * duyệt kẹp scrollY về 0 — cuộn ngay lúc này là cuộn hụt. Lần
 * theo chiều cao cho tới khi đủ.
 *
 * Ảnh trong danh sách tải dần nên trang còn cao thêm; nhưng
 * cũng không thể chờ mãi. Nếu chiều cao đứng yên vài khung
 * hình liên tiếp thì coi như đã dựng xong — cuộn tới, trình
 * duyệt tự kẹp nếu vị trí cũ vượt quá trang mới.
 */
function waitForHeight(top, timeout = 1200) {
    return new Promise((resolve) => {
        const started = performance.now();

        let lastHeight = -1;
        let stableFrames = 0;

        function check() {
            const height = document.documentElement.scrollHeight;

            const max = height - window.innerHeight;

            if (max >= top - 2) {
                resolve();

                return;
            }

            stableFrames = height === lastHeight ? stableFrames + 1 : 0;

            lastHeight = height;

            const settled = stableFrames >= 4 && performance.now() - started > 120;

            if (settled || performance.now() - started > timeout) {
                resolve();

                return;
            }

            requestAnimationFrame(check);
        }

        requestAnimationFrame(check);
    });
}

loadPositions();

/*
 * Trình duyệt cũng có cơ chế tự khôi phục vị trí cuộn khi tải
 * lại trang. Tắt đi để chỉ còn một nguồn duy nhất quyết định
 * chỗ dừng — hai bên cùng kéo thì trang giật.
 */
if (typeof history !== "undefined" && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

const router = createRouter({

    history: createWebHistory(import.meta.env.BASE_URL),

    routes,

    scrollBehavior(to, from, savedPosition) {

        /*
         * Cùng một trang, chỉ đổi query (bộ lọc, từ khoá, sắp
         * xếp) → giữ nguyên chỗ đang xem. Thiếu nhánh này thì
         * mỗi lần gõ vào ô tìm kiếm là trang nhảy về đầu.
         *
         * `from.name` rỗng nghĩa là lần vào đầu tiên — lúc đó
         * đường dẫn trùng nhau vẫn phải khôi phục bình thường.
         *
         * Đổi hash (bấm vào liên kết neo trong trang) thì trả về
         * undefined để vue-router tự cuộn tới đúng phần tử.
         */
        if (from.name && to.path === from.path) {
            return to.hash !== from.hash ? undefined : false;
        }

        const target = savedPosition?.top ?? recallPosition(to.path);

        if (!target) {
            return { top: 0 };
        }

        return waitForHeight(target).then(() => ({
            top: target,

            /* Nhảy thẳng tới chỗ cũ, không cuộn mượt qua cả trang. */
            behavior: "auto",
        }));

    }

});

setupRouterGuards(router);

/*
 * Chốt vị trí cuộn của trang đang rời đi, trước khi DOM đổi.
 */
router.beforeEach((to, from) => {
    if (from.name) {
        rememberPosition(from.path, window.scrollY || 0);
    }
});

/*
 * Tải lại trang hoặc đóng tab thì `beforeEach` không chạy —
 * ghi nốt vị trí hiện tại ở hai sự kiện cuối này.
 */
function rememberCurrent() {
    rememberPosition(router.currentRoute.value.path, window.scrollY || 0);
}

if (typeof window !== "undefined") {
    window.addEventListener("pagehide", rememberCurrent);
    window.addEventListener("beforeunload", rememberCurrent);
}

export default router;
