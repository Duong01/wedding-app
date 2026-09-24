<template>
  <div class="wedding-detail">
    <!-- =========================================================
         LOADING
    ========================================================== -->
    <div v-if="store.loading" class="wedding-loading">
      <div class="loading-content">
        <div class="loading-heart">♥</div>

        <div class="loading-title">Đang mở thiệp...</div>

        <div class="loading-text">Vui lòng chờ một chút</div>

        <div class="loading-spinner"></div>
      </div>
    </div>

    <!-- =========================================================
         THIỆP CHƯA MỞ CHO KHÁCH — ba lý do khác nhau, ba màn hình
         (đặt trước nhánh error để thông báo cụ thể ưu tiên hơn)
    ========================================================== -->
    <div v-else-if="blockReason" class="wedding-error">
      <div class="error-content">
        <div class="error-icon">{{ blockIcon }}</div>

        <h1>{{ blockTitle }}</h1>

        <p>{{ blockMessage }}</p>

        <button type="button" class="back-button" @click="goHome">
          Quay lại trang chủ
        </button>
      </div>
    </div>

    <!-- =========================================================
         ERROR
    ========================================================== -->
    <div v-else-if="store.error || !wedding" class="wedding-error">
      <div class="error-content">
        <div class="error-icon">♥</div>

        <h1>Thiệp này chưa được đăng ký</h1>

        <p>Thiệp cưới bạn đang tìm kiếm không tồn tại hoặc đã được thay đổi.</p>

        <button type="button" class="back-button" @click="goHome">
          Quay lại trang chủ
        </button>
      </div>
    </div>

    <!-- =========================================================
         MÀN HÌNH MỞ THIỆP + NỘI DUNG THIỆP — CÙNG MỘT URL

         KHÔNG truyền startOpened: theme bắt đầu ở màn hình bìa
         (OpeningScreen với nút "Mở thiệp"). Bấm nút → theme tự
         đặt opened = true và chuyển sang nội dung ngay trong
         chính instance này.

         KHÔNG điều hướng sang /view khi theme phát emit "open":
         đổi route là theme bị unmount rồi mount lại từ đầu, nội
         dung render lần thứ hai (nháy 2 lần). Giữ nguyên URL
         /open cũng là điều kiện để F5 bắt đầu lại từ phong bì.
    ========================================================== -->
    <component
      v-else-if="currentTheme"
      :is="currentTheme"
      :wedding="wedding"
    />

    <!-- =========================================================
         THEME ERROR
    ========================================================== -->
    <div v-else class="theme-error">
      <div class="theme-error-content">
        <div class="theme-error-icon">⚠</div>

        <h1>Không tìm thấy mẫu thiệp</h1>

        <p>
          Theme
          <strong>
            {{ wedding?.theme?.Name || "unknown" }}
          </strong>
          chưa được đăng ký.
        </p>

        <button type="button" class="back-button" @click="goHome">
          Quay lại trang chủ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import { useRoute, useRouter } from "vue-router";

import { getWeddingStatus } from "@/model/api";

import { useWeddingStore } from "@/stores/wedding";

import { PUBLISH_STATE } from "@/model/weddingAdmin";

/* =========================================================
   THEMES
   Dùng map lazy-load từ @/themes — chỉ tải đúng theme
   mà thiệp đang dùng, không tải 19 theme cùng lúc.
========================================================= */

import themes from "@/themes";

/* =========================================================
   ROUTER
========================================================= */

const route = useRoute();
const router = useRouter();

/* =========================================================
   STORE

   Dùng useWeddingStore (KHÔNG phải useWeddingDetailStore):
   store này thử API thật trước rồi fallback về 19 mẫu mock,
   nên bước 2 chạy được cho cả thiệp thật lẫn mẫu demo trong
   /mau-thiep-cuoi. Bản API-only sẽ chặn đứng mọi mẫu demo.
========================================================= */

const store = useWeddingStore();

const wedding = computed(() => {
  return store.wedding;
});

/* =========================================================
   CHẶN THIỆP — trạng thái lấy từ API getWeddingStatus
   (server là nguồn duy nhất; khách mời không cần đăng nhập)

   Ba lý do khác nhau, ba thông báo khác nhau:
     locked  — Admin khóa thiệp
     expired — hết hạn dùng thử mà chưa thanh toán
     draft   — chủ thiệp chưa bấm "Xuất bản"
========================================================= */

const blockReason = ref(null);

const blockIcon = computed(() => {
  switch (blockReason.value) {
    case "expired":
      return "⏳";
    case "draft":
      return "✎";
    default:
      return "🔒";
  }
});

const blockTitle = computed(() => {
  switch (blockReason.value) {
    case "expired":
      return "Thiệp tạm ẩn";
    case "draft":
      return "Thiệp chưa được xuất bản";
    default:
      return "Thiệp chưa được kích hoạt";
  }
});

const blockMessage = computed(() => {
  switch (blockReason.value) {
    case "expired":
      return (
        "Thời gian dùng thử của thiệp đã kết thúc và thiệp chưa được " +
        "thanh toán. Toàn bộ nội dung vẫn được giữ nguyên — vui lòng " +
        "liên hệ cô dâu chú rể."
      );
    case "draft":
      return (
        "Cô dâu chú rể chưa xuất bản thiệp này cho khách mời. " +
        "Vui lòng quay lại sau."
      );
    default:
      return (
        "Thiệp cưới này đang chờ xác nhận thanh toán. Vui lòng liên hệ " +
        "với cô dâu chú rể hoặc quay lại sau."
      );
  }
});

async function checkWeddingStatus(slug) {
  blockReason.value = null;

  if (typeof slug !== "string" || !slug.trim()) {
    return;
  }

  try {
    const response = await getWeddingStatus({ slug });

    const result = response?.data;

    if (result && result.status === "success" && result.data) {
      const state = result.data.PublishState || result.data.publishState;

      if (state === PUBLISH_STATE.LOCKED) {
        blockReason.value = "locked";
      } else if (state === PUBLISH_STATE.EXPIRED) {
        blockReason.value = "expired";
      } else if (state === PUBLISH_STATE.DRAFT) {
        blockReason.value = "draft";
      } else {
        blockReason.value = null;
      }
    }
  } catch (error) {
    /*
     * Không lấy được trạng thái (mạng lỗi, API chưa có...)
     * → mặc định cho xem thiệp, không chặn khách.
     */
    console.warn("[WeddingOpen] getWeddingStatus error:", error);
  }
}

/* =========================================================
   THEME HIỆN TẠI
========================================================= */
const currentTheme = computed(() => {
  const themeName = wedding.value?.theme?.Name;

  if (!themeName) {
    return null;
  }

  return themes[themeName] || null;
});

/* =========================================================
   LOAD WEDDING
========================================================= */

async function loadWedding() {
  const slug = route.params.slug;

  /*
   * Xem trước bản nháp từ editor: /wedding/<slug>/open?draft=1
   * đọc bản nháp trong sessionStorage thay vì gọi API.
   */
  if (route.query && route.query.draft === "1") {
    try {
      const draft = sessionStorage.getItem("wedding-draft");

      if (draft) {
        store.wedding = JSON.parse(draft);
        store.loading = false;
        store.error = null;

        return;
      }
    } catch (e) {
      console.warn("Could not read wedding draft from sessionStorage", e);
    }
  }

  if (typeof slug !== "string" || !slug.trim()) {
    store.wedding = null;
    store.error = "Đường dẫn thiệp không hợp lệ.";
    return;
  }

  try {
    await store.loadWedding(slug);
  } catch (error) {
    console.error("[WeddingOpen] load error:", error);

    /*
     * Không tìm thấy thiệp — có thể thiệp chưa kích hoạt
     * (Pending/Locked, IsActive = 0). Hỏi trạng thái để hiển
     * thị đúng màn hình khóa thay vì báo lỗi chung chung.
     *
     * CHỈ gọi khi tải lỗi (giống WeddingApi.vue): 19 mẫu demo
     * trong /mau-thiep-cuoi không có trên server, gọi trạng
     * thái cho chúng là vô nghĩa và có thể chặn nhầm.
     */
    await checkWeddingStatus(slug);
  }
}

/* =========================================================
   WATCH URL
========================================================= */

watch(
  () => route.params.slug,

  (newSlug, oldSlug) => {
    /*
     * Không gọi lại nếu URL thực sự không thay đổi
     */
    if (newSlug === oldSlug) {
      return;
    }

    loadWedding();
  },

  {
    immediate: true,
  },
);

/* =========================================================
   HOME
========================================================= */

function goHome() {
  router.push({
    name: "Home",
  });
}

/*
 * KHÔNG xoá store.wedding khi rời trang (khác WeddingApi.vue):
 * /view dùng lại đúng store này, xoá đi thì phải gọi lại API
 * ngay sau đó — chậm và thừa.
 */
</script>

<style scoped>
.wedding-detail {
  width: 100%;

  min-height: 100vh;
}

/* =========================================================
   LOADING
========================================================= */

.wedding-loading {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;

  align-items: center;

  justify-content: center;

  background: radial-gradient(
    circle at center,
    #fdfaf4 0%,
    #f7f1e6 45%,
    #efe6d4 100%
  );
}

.loading-content {
  width: min(90%, 420px);

  display: flex;

  flex-direction: column;

  align-items: center;

  text-align: center;
}

.loading-heart {
  width: 72px;

  height: 72px;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 24px;

  border-radius: 50%;

  background: rgba(255, 253, 248, 0.85);

  color: var(--studio-seal, #a63a2e);

  font-size: 32px;

  box-shadow: 0 15px 40px rgba(43, 33, 24, 0.12);

  animation: heartPulse 1.5s ease-in-out infinite;
}

.loading-title {
  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);

  font-size: var(--text-2xl);

  font-weight: 600;

  margin-bottom: 6px;
}

.loading-text {
  color: var(--studio-ink-faint, #8a7a68);

  font-family: var(--font-main);

  font-size: var(--text-sm);

  margin-bottom: 24px;
}

.loading-spinner {
  width: 30px;

  height: 30px;

  border-radius: 50%;

  border: 3px solid rgba(185, 151, 91, 0.25);

  border-top-color: var(--studio-foil, #b9975b);

  animation: spinner 0.8s linear infinite;
}

/* =========================================================
   ERROR
========================================================= */

.wedding-error,
.theme-error {
  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 30px;

  background: linear-gradient(135deg, #fdfaf4, #f7f1e6);
}

.error-content,
.theme-error-content {
  width: min(100%, 500px);

  text-align: center;

  padding: 48px 30px;

  border-radius: 28px;

  background: rgba(255, 253, 248, 0.85);

  box-shadow: 0 25px 70px rgba(43, 33, 24, 0.1);
}

.error-icon,
.theme-error-icon {
  width: 70px;

  height: 70px;

  margin: 0 auto 22px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  color: var(--studio-seal, #a63a2e);

  font-size: 30px;
}

.error-content h1,
.theme-error-content h1 {
  margin: 0 0 12px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);

  font-size: var(--text-2xl);
}

.error-content p,
.theme-error-content p {
  margin: 0 auto 28px;

  color: var(--studio-ink-soft, #5c4f43);

  font-family: var(--font-main);

  font-size: var(--text-md);

  line-height: 1.8;
}

.back-button {
  border: 0;

  padding: 13px 24px;

  border-radius: 999px;

  background: var(--studio-ink, #2b2118);

  color: var(--studio-paper, #f7f1e6);

  font-family: var(--font-main);

  font-size: var(--text-sm);

  font-weight: 600;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.back-button:hover {
  transform: translateY(-2px);

  box-shadow: 0 10px 25px rgba(43, 33, 24, 0.25);
}

/* =========================================================
   ANIMATION
========================================================= */

@keyframes heartPulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
  }
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .loading-heart {
    width: 62px;

    height: 62px;

    font-size: 28px;
  }

  .error-content,
  .theme-error-content {
    padding: 36px 22px;

    border-radius: 22px;
  }
}
</style>
