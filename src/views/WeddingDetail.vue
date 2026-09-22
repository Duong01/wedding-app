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

import themes from "@/themes";

const route = useRoute();
const router = useRouter();

const store = useWeddingStore();

const wedding = computed(() => store.wedding);

const currentTheme = computed(() => {
  const themeName = wedding.value?.theme;
  return themeName
    ? themes[themeName.Name] || null
    : null;
});

async function loadWedding(slug) {

  if (!slug) {
    store.wedding = null;
    store.error = "Không có slug";
    return;
  }

  try {
    await store.loadWeddingNoApi(slug);
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

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.back-button:hover {
  transform: translateY(-2px);

  box-shadow: 0 10px 25px rgba(43, 33, 24, 0.25);
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

  .error-content,
  .theme-error-content {
    padding: 36px 22px;

    border-radius: 22px;
  }
}
</style>