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

        /*
         * SANG TRANG MỚI → luôn bắt đầu từ đầu trang.
         * Chỉ QUAY LẠI trang đã xem (bấm nút back của trình
         * duyệt, hoặc vào lại đường dẫn cũ trong phiên này)
         * mới khôi phục đúng chỗ đang xem dở.
         *
         * savedPosition: có khi bấm back/forward — trình duyệt
         * nhớ sẵn. recallPosition: vị trí App đã ghi khi rời
         * trang đó trước đó (điều hướng trong app).
         */
        const isBack =
            Boolean(savedPosition) ||
            (from.name && positions.has(to.path));

        if (!isBack) {
            return { top: 0 };
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
 * =========================================================
 * TỰ HỒI PHỤC KHI LAZY-CHUNK TẢI HỎNG
 * =========================================================
 * Mọi view/theme đều import() lazy. Hai tình huống làm
 * import đó fail:
 *
 *  - Dev: Vite phát hiện dependency mới giữa phiên (theme,
 *    panel editor tải muộn) → tối ưu lại → đổi hash →
 *    trình duyệt còn giữ URL ?v=<hash cũ> → 504 Outdated
 *    Optimize Dep / "Failed to fetch dynamically imported
 *    module".
 *  - Production: deploy mới xóa file assets hash cũ, tab
 *    còn mở (hoặc index.html nằm trong cache) vẫn trỏ tới
 *    file đã bị xóa → 404.
 *
 * vue-router KHÔNG tự thử lại — navigation fail âm thầm,
 * RouterView trắng ngòm. Ở đây bắt lỗi đó rồi tải lại toàn
 * bộ trang đúng URL đích: lần tải mới nhận hash mới từ
 * server là hết.
 *
 * Cờ sessionStorage chặn reload lặp: chunk thật sự không
 * tồn tại (deploy lỗi) thì chỉ reload 1 lần trong 10 giây,
 * không xoay vòng vô hạn.
 */
const CHUNK_FAIL_PATTERNS = [
    "Failed to fetch dynamically imported module",
    "Importing a module script failed",
    "error loading dynamically imported module",
    "Outdated Optimize Dep",
    "Unable to preload CSS",
];

const CHUNK_RELOAD_FLAG = "wedding:chunk-reloaded";

router.onError((error, to) => {
    const message = String(error?.message || "");

    const isChunkFail = CHUNK_FAIL_PATTERNS.some((pattern) =>
        message.includes(pattern)
    );

    if (!isChunkFail || !to?.fullPath) {
        return;
    }

    try {
        const last = Number(sessionStorage.getItem(CHUNK_RELOAD_FLAG) || 0);

        if (Date.now() - last < 10000) {
            return;
        }

        sessionStorage.setItem(CHUNK_RELOAD_FLAG, String(Date.now()));
    } catch {
        /* sessionStorage bị chặn — vẫn reload, chấp nhận rủi ro lặp */
    }

    window.location.assign(to.fullPath);
});

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
