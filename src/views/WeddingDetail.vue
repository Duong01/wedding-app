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

        <h1>Không tìm thấy thiệp</h1>

        <p>Thiệp cưới bạn đang tìm kiếm không tồn tại hoặc đã được thay đổi.</p>

        <button type="button" class="back-button" @click="goHome">
          Quay lại trang chủ
        </button>
      </div>
    </div>

    <!-- =========================================================
         WEDDING THEME
    ========================================================== -->
    <component v-else-if="currentTheme" :is="currentTheme" :wedding="wedding" />

    <!-- =========================================================
         KHÔNG TÌM THẤY THEME
    ========================================================== -->
    <div v-else class="theme-error">
      <div class="theme-error-content">
        <div class="theme-error-icon">⚠</div>

        <h1>Không tìm thấy mẫu thiệp</h1>

        <p>
          Theme
          <strong>
            {{ wedding?.theme || "unknown" }}
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
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useWeddingStore } from "@/stores/wedding";

import TraditionalRed from "@/themes/TraditionalRed.vue";
import RomanticPink from "@/themes/RomanticPink.vue";
import ElegantGold from "@/themes/ElegantGold.vue";
import ModernWhite from "@/themes/ModernWhite.vue";

const route = useRoute();
const router = useRouter();

const store = useWeddingStore();

const wedding = computed(() => store.wedding);

const themes = {
  "traditional-red": TraditionalRed,
  "romantic-pink": RomanticPink,
  "elegant-gold": ElegantGold,
  "modern-white": ModernWhite,
};

const currentTheme = computed(() => {
  const themeName = wedding.value?.theme;
  return themeName
    ? themes[themeName.name] || null
    : null;
});

async function loadWedding(slug) {

  if (!slug) {
    store.wedding = null;
    store.error = "Không có slug";
    return;
  }

  try {
    await store.loadWedding(slug);
  } catch (error) {
    console.error(
      "WeddingDetail load error:",
      error
    );
  }
}

watch(
  () => route.params.slug,
  (slug, oldSlug) => {
    console.log(
      "Slug changed:",
      oldSlug,
      "=>",
      slug
    );

    loadWedding(slug);
  },
  {
    immediate: true,
  }
);

function goHome() {
  router.push({
    name: "Home",
  });
}
</script>

<style scoped>
.wedding-detail {
  width: 100%;
  min-height: 100vh;
}

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

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 28px;

  font-weight: 600;

  margin-bottom: 6px;
}

.loading-text {
  color: #95777c;

  font-size: 14px;

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

/* ============================================================
   ERROR
============================================================ */

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

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 32px;
}

.error-content p,
.theme-error-content p {
  margin: 0 auto 28px;

  color: #806d71;

  line-height: 1.8;
}

.back-button {
  border: 0;

  padding: 13px 24px;

  border-radius: 999px;

  background: #c76b7c;

  color: white;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.back-button:hover {
  transform: translateY(-2px);

  box-shadow: 0 10px 25px rgba(199, 107, 124, 0.25);
}

/* ============================================================
   ANIMATION
============================================================ */

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

/* ============================================================
   MOBILE
============================================================ */

@media (max-width: 600px) {
  .loading-heart {
    width: 62px;
    height: 62px;

    font-size: 28px;
  }

  .loading-title {
    font-size: 24px;
  }

  .error-content,
  .theme-error-content {
    padding: 36px 22px;

    border-radius: 22px;
  }

  .error-content h1,
  .theme-error-content h1 {
    font-size: 28px;
  }
}
</style>