<template>
  <div class="wedding-detail">
    <!-- =========================================================
         LOADING
    ========================================================== -->
    <div v-if="store.loading" class="wedding-loading">
      <div class="loading-content">
        <div class="loading-heart">♥</div>

        <div class="loading-title">{{ $t("Đang mở thiệp...") }}</div>

        <div class="loading-text">{{ $t("Vui lòng chờ một chút") }}</div>

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
          {{ $t("Quay lại trang chủ") }}
        </button>
      </div>
    </div>

    <!-- =========================================================
         ERROR
    ========================================================== -->
    <div v-else-if="store.error || !wedding" class="wedding-error">
      <div class="error-content">
        <div class="error-icon">♥</div>

        <h1>{{ $t("Thiệp này chưa được đăng ký") }}</h1>

        <p>{{ $t("Thiệp cưới bạn đang tìm kiếm không tồn tại hoặc đã được thay đổi.") }}</p>

        <button type="button" class="back-button" @click="goHome">
          {{ $t("Quay lại trang chủ") }}
        </button>
      </div>
    </div>

    <!-- =========================================================
         WEDDING
    ========================================================== -->
    <component
      v-else-if="currentTheme"
      :is="currentTheme"
      :wedding="wedding"
      @open="themeOpened = true"
    />

    <!-- =========================================================
         THEME ERROR
    ========================================================== -->
    <div v-else class="theme-error">
      <div class="theme-error-content">
        <div class="theme-error-icon">⚠</div>

        <h1>{{ $t("Không tìm thấy mẫu thiệp") }}</h1>

        <p>
          Theme
          <strong>
            {{ wedding?.theme?.Name || "unknown" }}
          </strong>
          {{ $t("chưa được đăng ký.") }}
        </p>

        <button type="button" class="back-button" @click="goHome">
          {{ $t("Quay lại trang chủ") }}
        </button>
      </div>
    </div>

    <!-- Tự cuộn tới cuối thiệp khi khách không thao tác (sau khi mở phong bì) -->
    <AutoScroll v-if="themeOpened && currentTheme && wedding" :wedding="wedding" />
  </div>
</template>

<script setup>
import { computed, ref, watch, onBeforeUnmount } from "vue";

import AutoScroll from "@/components/common/AutoScroll.vue";

import { useRoute, useRouter } from "vue-router";

import { GetWedding, getWeddingStatus } from "@/model/api";

import { useWeddingDetailStore } from "@/stores/weddingDetail";

import { PUBLISH_STATE } from "@/model/weddingAdmin";

import { GetWeddingForEdit } from "@/model/api";

/* =========================================================
   THEMES
   Dùng map lazy-load từ @/themes — chỉ tải đúng theme
   mà thiệp đang dùng, không tải 17 theme cùng lúc.
========================================================= */

import themes from "@/themes";

/* Font riêng của theme đang mở — nạp đúng lúc cần. */
import { ensureFonts } from "@/utils/fontLoader";
import { fontsForTheme } from "@/data/themeFonts";
import { t, setCardLocale, clearCardLocale } from "@/lang";

import { ensureNewSections } from "@/utils/weddingShape";
/*
 * Thiệp đã qua phong bì chưa — tự cuộn chỉ chạy sau khi mở
 * (theme phát "open" khi khách bấm mở thiệp).
 */
const themeOpened = ref(false);

/* =========================================================
   ROUTER
========================================================= */

const route = useRoute();
const router = useRouter();

/* =========================================================
   STORE
========================================================= */

const store = useWeddingDetailStore();

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
      return t("Thiệp tạm ẩn");
    case "draft":
      return t("Thiệp chưa được xuất bản");
    default:
      return t("Thiệp chưa được kích hoạt");
  }
});

const blockMessage = computed(() => {
  switch (blockReason.value) {
    case "expired":
      return t("Thời gian dùng thử của thiệp đã kết thúc và thiệp chưa được thanh toán. Toàn bộ nội dung vẫn được giữ nguyên — vui lòng liên hệ cô dâu chú rể.");
    case "draft":
      return t("Cô dâu chú rể chưa xuất bản thiệp này cho khách mời. Vui lòng quay lại sau.");
    default:
      return t("Thiệp cưới này đang chờ xác nhận thanh toán. Vui lòng liên hệ với cô dâu chú rể hoặc quay lại sau.");
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
    console.warn("[WeddingApi] getWeddingStatus error:", error);
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

/* Thiệp tải xong → nạp đúng font của theme (2-3 font). */
watch(
  wedding,
  (value) => {
    if (value) {
      ensureFonts(fontsForTheme(value));

      /* Ngôn ngữ thiệp — chủ thiệp chọn trong editor */
      setCardLocale(value.language);
    } else {
      clearCardLocale();
    }
  },
  { immediate: true }
);

/* =========================================================
   LOAD WEDDING
========================================================= */

async function loadWedding() {
  const slug = route.params.slug;
  const token = route.params.token;

  // Kiểm tra slug
  if (typeof slug !== "string" || !slug.trim()) {
    store.wedding = null;
    store.error = t("Đường dẫn thiệp không hợp lệ.");
    return;
  }

  // Reset dữ liệu cũ
  store.wedding = null;
  store.error = null;
  store.loading = true;

  try {
    let response;

    if (typeof token === "string" && token.trim()) {
      // Có token
      response = await GetWedding(slug, token);
    } else {
      // Không có token
      response = await GetWedding(slug);
    }

    const result = response?.data;

    if (!result || result.status !== "success" || !result.data) {
      /*
       * CHỦ THIỆP XEM BẢN NHÁP CỦA MÌNH.
       *
       * Thiệp mới lưu có IsActive = 0 + Status = 'Pending'
       * (chờ xuất bản / thanh toán) nên endpoint công khai
       * không trả về. Nếu đang đăng nhập và là chủ sở hữu,
       * thử endpoint getWeddingForEdit để xem trước thiệp
       * thay vì báo "chưa xuất bản".
       */
      if (localStorage.getItem("token")) {
        try {
          const editResponse = await GetWeddingForEdit(slug);

          const editResult = editResponse?.data;

          if (editResult?.status === "success" && editResult.data) {
            store.wedding = ensureNewSections(editResult.data);

            return;
          }
        } catch (editError) {
          console.warn(
            "[WeddingApi] getWeddingForEdit fallback lỗi:",
            editError?.response?.status || editError?.message
          );
        }
      }

      /*
       * Server trả "không tìm thấy" — có thể thiệp chưa
       * kích hoạt (Pending/Locked, IsActive = 0). Hỏi trạng
       * thái để hiển thị đúng màn hình khóa thay vì lỗi.
       */
      await checkWeddingStatus(slug);

      if (blockReason.value) {
        store.wedding = null;

        store.error = null;

        return;
      }

      store.wedding = null;
      store.error = result?.message || t("Thiệp này chưa được đăng ký");
      return;
    }

    store.wedding = ensureNewSections(result.data);
  } catch (error) {
    console.error("WeddingDetail API error:", error);

    store.wedding = null;

    if (error?.response?.status === 404) {
      /*
       * Có thể thiệp chưa kích hoạt — hỏi trạng thái
       * để phân biệt "không tồn tại" với "đang khóa".
       */
      await checkWeddingStatus(slug);

      if (blockReason.value) {
        store.error = null;

        return;
      }

      store.error = t("Thiệp này chưa được đăng ký");
      return;
    }

    if (error?.response?.status === 400) {
      store.error = t("Đường dẫn thiệp không hợp lệ.");
      return;
    }

    if (error?.response?.status >= 500) {
      store.error = t("Máy chủ đang gặp sự cố. Vui lòng thử lại sau.");
      return;
    }

    store.error = t("Không thể tải dữ liệu thiệp.");
  } finally {
    store.loading = false;
  }
}

/* =========================================================
   WATCH URL
========================================================= */

watch(
  () => [route.params.slug, route.params.token],

  (newValue, oldValue) => {
    /*
     * Không gọi lại nếu URL thực sự không thay đổi
     */

    if (newValue[0] === oldValue?.[0] && newValue[1] === oldValue?.[1]) {
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

/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(() => {
  /*
   * Xóa dữ liệu wedding khi rời trang.
   *
   * Tránh trường hợp quay lại trang khác
   * vẫn còn dữ liệu thiệp cũ trong store.
   */

  store.wedding = null;

  store.error = null;

  /* Trả ngôn ngữ về giao diện web */
  clearCardLocale();
});
</script>

<style scoped>
.wedding-detail {
  width: 100%;

  min-height: 100vh;
  min-height: 100dvh;
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
  min-height: 100dvh;

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
