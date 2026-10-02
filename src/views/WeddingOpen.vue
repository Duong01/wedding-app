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
import { computed, watch } from "vue";

import { useRoute, useRouter } from "vue-router";

import { useWeddingStore } from "@/stores/wedding";

/* =========================================================
   THEMES
   Dùng map lazy-load từ @/themes — chỉ tải đúng theme
   mà thiệp đang dùng, không tải 26 theme cùng lúc.
========================================================= */

import themes from "@/themes";

/* Font riêng của theme đang mở — nạp đúng lúc cần thay vì
 * chèn sẵn toàn bộ 25 font trong index.html. */
import { ensureFonts } from "@/utils/fontLoader";
import { fontsForTheme } from "@/data/themeFonts";

/* =========================================================
   ROUTER
========================================================= */

const route = useRoute();
const router = useRouter();

/* =========================================================
   STORE

   Dùng useWeddingStore với loadWeddingNoApi: bước 2 của luồng
   XEM MẪU đọc thẳng wedding.json, không gọi API. Thiệp thật
   của khách mời mở qua /:slug/:token (WeddingApi.vue) — việc
   chặn thiệp chưa xuất bản/khóa chỉ diễn ra ở bên đó.
========================================================= */

const store = useWeddingStore();

const wedding = computed(() => {
  return store.wedding;
});

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

/*
 * Thiệp tải xong → nạp đúng font của theme này (2-3 font)
 * thay vì 25 font mọi trang như trước.
 */
watch(
  wedding,
  (value) => {
    if (value) {
      ensureFonts(fontsForTheme(value));
    }
  },
  { immediate: true }
);

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
    /*
     * loadWeddingNoApi: bước 2 của luồng XEM MẪU — đọc thẳng
     * wedding.json, không gọi API. Thiệp thật của khách mời
     * mở qua /:slug/:token (WeddingApi.vue), không qua đây.
     */
    await store.loadWeddingNoApi(slug);
  } catch (error) {
    console.error("[WeddingOpen] load error:", error);
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
