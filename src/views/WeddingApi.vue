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
         WEDDING
    ========================================================== -->
    <component v-else-if="currentTheme" :is="currentTheme" :wedding="wedding" />

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
import { computed, watch, onBeforeUnmount } from "vue";

import { useRoute, useRouter } from "vue-router";

import { GetWedding } from "@/model/api";

import { useWeddingDetailStore } from "@/stores/weddingDetail";

/* =========================================================
   THEMES
========================================================= */

import TraditionalRed from "@/themes/TraditionalRed.vue";
import RomanticPink from "@/themes/RomanticPink.vue";
import ElegantGold from "@/themes/ElegantGold.vue";
import ModernWhite from "@/themes/ModernWhite.vue";
import NhatBinhDo from "@/themes/NhatBinhDo.vue";
import IvoryGold from "@/themes/IvoryGold.vue";
import RoyalRed from "@/themes/RoyalRed.vue";
import DongSon from "@/themes/DongSon.vue";

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
   DANH SÁCH THEME
========================================================= */

const themes = {
  "traditional-red": TraditionalRed,
  "romantic-pink": RomanticPink,
  "elegant-gold": ElegantGold,
  "modern-white": ModernWhite,
  "nhat-binh-do": NhatBinhDo,
  "ivory-gold": IvoryGold,
  "royal-red": RoyalRed,
  "dong-son": DongSon,
};

/* =========================================================
   THEME HIỆN TẠI
========================================================= */
console.log("aaaa:" +wedding)
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
  const token = route.params.token;

  // Kiểm tra slug
  if (typeof slug !== "string" || !slug.trim()) {
    store.wedding = null;
    store.error = "Đường dẫn thiệp không hợp lệ.";
    return;
  }

  // Reset dữ liệu cũ
  store.wedding = null;
  store.error = null;
  store.loading = true;

  try {
    console.log("Loading wedding:", {
      slug,
      token,
    });

    let response;

    if (typeof token === "string" && token.trim()) {
      // Có token
      response = await GetWedding(slug, token);
    } else {
      // Không có token
      response = await GetWedding(slug);
    }

    console.log("Wedding API response:", response);

    const result = response?.data;

    if (!result || result.status !== "success" || !result.data) {
      store.wedding = null;
      store.error = result?.message || "Thiệp này chưa được đăng ký.";
      return;
    }

    store.wedding = result.data;
  } catch (error) {
    console.error("WeddingDetail API error:", error);

    store.wedding = null;

    if (error?.response?.status === 404) {
      store.error = "Thiệp này chưa được đăng ký.";
      return;
    }

    if (error?.response?.status === 400) {
      store.error = "Đường dẫn thiệp không hợp lệ.";
      return;
    }

    if (error?.response?.status >= 500) {
      store.error = "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.";
      return;
    }

    store.error = "Không thể tải dữ liệu thiệp.";
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
});
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
    #fff8f8 0%,
    #fff1f3 45%,
    #f9e7ea 100%
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

  background: rgba(255, 255, 255, 0.8);

  color: #c76b7c;

  font-size: 32px;

  box-shadow: 0 15px 40px rgba(130, 70, 80, 0.12);

  animation: heartPulse 1.5s ease-in-out infinite;
}

.loading-title {
  color: #54363b;

  font-family: var(--font-heading);

  font-size: var(--text-2xl);

  font-weight: 600;

  margin-bottom: 6px;
}

.loading-text {
  color: #95777c;

  font-family: var(--font-main);

  font-size: var(--text-sm);

  margin-bottom: 24px;
}

.loading-spinner {
  width: 30px;

  height: 30px;

  border-radius: 50%;

  border: 3px solid rgba(199, 107, 124, 0.18);

  border-top-color: #c76b7c;

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

  background: linear-gradient(135deg, #fff8f8, #fff1f3);
}

.error-content,
.theme-error-content {
  width: min(100%, 500px);

  text-align: center;

  padding: 48px 30px;

  border-radius: 28px;

  background: rgba(255, 255, 255, 0.8);

  box-shadow: 0 25px 70px rgba(100, 60, 70, 0.1);
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

  background: #fbe7ea;

  color: #c76b7c;

  font-size: 30px;
}

.error-content h1,
.theme-error-content h1 {
  margin: 0 0 12px;

  color: #54363b;

  font-family: var(--font-heading);

  font-size: var(--text-2xl);
}

.error-content p,
.theme-error-content p {
  margin: 0 auto 28px;

  color: #806d71;

  font-family: var(--font-main);

  font-size: var(--text-md);

  line-height: 1.8;
}

.back-button {
  border: 0;

  padding: 13px 24px;

  border-radius: 999px;

  background: #c76b7c;

  color: white;

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

  box-shadow: 0 10px 25px rgba(199, 107, 124, 0.25);
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
