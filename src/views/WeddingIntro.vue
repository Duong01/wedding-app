<template>
  <main class="intro-page">
    <!-- =========================================================
         TOPBAR — quay lại danh sách + chia sẻ
    ========================================================== -->
    <div class="intro-topbar">
      <div class="topbar-inner">
        <button
          type="button"
          class="back-btn"
          @click="goTemplates"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path d="M19 12H5"></path>
            <path d="m11 18-6-6 6-6"></path>
          </svg>

          Danh sách mẫu thiệp
        </button>

        <button
          type="button"
          class="share-btn"
          @click="shareTemplate"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
          >
            <circle cx="18" cy="5" r="2.5" />
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="19" r="2.5" />
            <path d="m8.3 10.8 7.4-4.4" />
            <path d="m8.3 13.2 7.4 4.4" />
          </svg>

          Chia sẻ
        </button>
      </div>
    </div>

    <!-- =========================================================
         LOADING
    ========================================================== -->
    <div v-if="store.loading" class="intro-state">
      <div class="state-orn">{{ FALLBACK_ORN }}</div>

      <div class="state-title">Đang tải mẫu thiệp...</div>

      <div class="state-spinner"></div>
    </div>

    <!-- =========================================================
         ERROR
    ========================================================== -->
    <div v-else-if="store.error || !wedding" class="intro-state">
      <div class="state-orn">{{ FALLBACK_ORN }}</div>

      <h1>Không tìm thấy mẫu thiệp</h1>

      <p>
        Mẫu thiệp bạn đang tìm không tồn tại hoặc đã được thay đổi.
      </p>

      <button type="button" class="state-btn" @click="goTemplates">
        Xem danh sách mẫu
      </button>
    </div>

    <!-- =========================================================
         GIỚI THIỆU MẪU — một màn: ảnh xem trước + thông tin gọn
    ========================================================== -->
    <template v-else>
      <section class="intro-hero">
        <div class="hero-inner">
          <!-- =========================================
               XEM TRƯỚC — thẻ ảnh 9/16 vừa màn hình
          ========================================== -->
          <aside class="preview-col">
            <div class="preview-card">
              <img
                :src="previewFor(wedding)"
                :alt="getThemeLabel(wedding)"
                @error="onImageError"
              />
            </div>
          </aside>

          <!-- =========================================
               THÔNG TIN MẪU — gọn, đủ, không cuộn
          ========================================== -->
          <div class="info-col">
            <span class="info-eyebrow">
              {{ meta.orn }} {{ getCollectionLabel(wedding) }}
            </span>

            <h1 class="info-title">
              {{ getThemeLabel(wedding) }}
            </h1>

            <p class="info-couple">
              {{ getCoupleName(wedding) }}
            </p>

            <!-- ngày cưới + địa điểm — lấy từ sự kiện đầu tiên -->
            <div v-if="mainEvent" class="info-event">
              <div class="event-date">
                <span class="date-day">{{ mainEvent.Day }}</span>

                <span class="date-rest">
                  tháng {{ mainEvent.Month }} {{ mainEvent.Year }}
                </span>
              </div>

              <p class="event-meta">
                {{ mainEvent.Title }} · {{ mainEvent.EventTime }} ·
                {{ mainEvent.Location }}
              </p>
            </div>

            <p class="info-desc">
              {{ meta.desc }}
            </p>

            <!-- từ khóa phong cách -->
            <div class="info-tags">
              <span
                v-for="tag in meta.tags"
                :key="tag"
                class="info-tag"
              >
                {{ tag }}
              </span>
            </div>

            <!-- =====================================
                 HÀNH ĐỘNG — tin cậy + hai nút
            ====================================== -->
            <div class="cta-block">
              <p class="cta-trust">
                Tạo miễn phí · Thử 3 ngày · Đẹp mới thanh toán
              </p>

              <div class="cta-actions">
                <button
                  type="button"
                  class="primary-btn"
                  @click="goEditor"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>

                  Dùng mẫu này
                </button>

                <button
                  type="button"
                  class="outline-btn"
                  @click="goOpen"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                  >
                    <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
                  </svg>

                  Xem demo
                </button>
              </div>

              <p class="cta-note">
                Bạn có thể đổi mẫu bất cứ lúc nào khi chỉnh sửa
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- =========================================
           THANH HÀNH ĐỘNG CỐ ĐỊNH — chỉ trên điện thoại
      ========================================== -->
      <div class="mobile-cta">
        <button
          type="button"
          class="outline-btn"
          @click="goOpen"
        >
          Xem demo
        </button>

        <button
          type="button"
          class="primary-btn"
          @click="goEditor"
        >
          Dùng mẫu này
        </button>
      </div>
    </template>

    <!-- =====================================================
         TOAST
    ====================================================== -->
    <Transition name="toast">
      <div v-if="toast" class="toast-message">
        <span>✓</span>
        {{ toast }}
      </div>
    </Transition>
  </main>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import { useRoute, useRouter } from "vue-router";

import { useWeddingStore } from "@/stores/wedding";

import {
  getCollection,
  getThemeMeta,
} from "@/data/templateCollections";

import {
  handleImageError,
  previewFor,
} from "@/utils/weddingCard";

import { useSeo } from "@/composables/useSeo";

/* =========================================================
   TRANG GIỚI THIỆU MẪU — gọn theo cấu trúc thẻ mẫu:

   ảnh xem trước 9/16 · tên thiết kế · mô tả · từ khóa
   phong cách · dòng tin cậy · hai nút hành động.

   Luồng: /wedding/:slug (ở đây) → /open (phong bì) → /view

   Toàn trang dùng hệ màu studio chung (giấy dó, mực nho,
   vàng foil) — bản sắc từng mẫu nằm ở ảnh, tên, mô tả
   và từ khóa.
========================================================= */

const route = useRoute();
const router = useRouter();

const store = useWeddingStore();

const wedding = computed(() => store.wedding);

const FALLBACK_ORN = "囍";

const meta = computed(() => getWeddingMeta(themeNameOf(wedding.value)));

/* =========================================================
   HELPERS — đọc dữ liệu hiển thị của mẫu
========================================================= */

function themeNameOf(item) {
  return item?.theme?.Name || item?.theme || "";
}

function getWeddingMeta(item) {
  return getThemeMeta(themeNameOf(item));
}

function getCoupleName(item) {
  const bride = item?.couple?.Bride?.Name || "";
  const groom = item?.couple?.Groom?.Name || "";

  if (!bride && !groom) {
    return "Cô dâu & Chú rể";
  }

  return `${bride} & ${groom}`;
}

function getThemeLabel(item) {
  const themeName = themeNameOf(item);

  return getThemeMeta(themeName).name || themeName || "Classic";
}

function getCollectionLabel(item) {
  return getCollection(getWeddingMeta(themeNameOf(item)).collection).name;
}

/*
 * Sự kiện chính — Lễ Thành Hôn nếu có, không thì sự kiện
 * đầu tiên. Hiển thị ngày giờ địa điểm gọn trên trang.
 */
const mainEvent = computed(() => {
  const events = wedding.value?.events || [];

  return (
    events.find((event) => event.EventType === "tanthanh") || events[0] || null
  );
});

function onImageError(event) {
  handleImageError(event);
}

/* =========================================================
   LINK BƯỚC 2 — chia sẻ phải mở đúng phong bì,
   không phải trang giới thiệu này.
========================================================= */

const openUrl = computed(() => {
  const slug = wedding.value?.slug || route.params.slug || "";

  return slug ? `${window.location.origin}/wedding/${slug}/open` : "";
});

/* =========================================================
   SEO — mỗi mẫu một thẻ riêng để chia sẻ lên Facebook/Zalo
   hiện đúng tên thiết kế và ảnh xem trước.
========================================================= */

useSeo(() => {
  const item = wedding.value;

  if (!item) {
    return {
      title: "Mẫu thiệp cưới",
      description: "Xem trước mẫu thiệp cưới online.",
      path: route.path,
    };
  }

  const label = getThemeLabel(item);

  return {
    title: `${label} — Mẫu thiệp cưới`,
    description:
      meta.value.desc ||
      item.story?.Description ||
      `Mẫu thiệp cưới ${label}. Xem trước và tùy chỉnh theo ngày cưới của bạn.`,
    path: route.path,
    image: previewFor(item),
  };
});

/* =========================================================
   LOAD

   loadWedding (KHÔNG phải loadWeddingNoApi): thử API thật
   trước, không có thì fallback về 19 mẫu mock. Nhờ vậy trang
   này chạy được cho cả thiệp thật lẫn mẫu demo.
========================================================= */

async function loadWedding(slug) {
  if (typeof slug !== "string" || !slug.trim()) {
    store.wedding = null;
    store.error = "Đường dẫn thiệp không hợp lệ.";

    return;
  }

  try {
    await store.loadWedding(slug);
  } catch (error) {
    console.error("[WeddingIntro] load error:", error);
  }
}

watch(
  () => route.params.slug,
  (slug, oldSlug) => {
    if (slug === oldSlug) {
      return;
    }

    loadWedding(slug);
  },
  { immediate: true },
);

/* =========================================================
   ĐIỀU HƯỚNG
========================================================= */

function goTemplates() {
  router.push({ name: "Templates" });
}

/* Bước 2 — phong bì */
function goOpen() {
  const slug = wedding.value?.slug || route.params.slug;

  if (!slug) {
    return;
  }

  router.push({ name: "WeddingOpen", params: { slug } });
}

function goEditor() {
  const themeName = themeNameOf(wedding.value);

  router.push({
    name: "Editor",
    query: themeName ? { theme: themeName } : {},
  });
}

/* =========================================================
   SHARE
========================================================= */

const toast = ref("");

let toastTimer = null;

function showToast(message) {
  toast.value = message;

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.value = "";
  }, 2500);
}

async function shareTemplate() {
  if (!openUrl.value) {
    return;
  }

  try {
    if (navigator.share) {
      await navigator.share({
        title: getThemeLabel(wedding.value),
        text: "Xem mẫu thiệp cưới này",
        url: openUrl.value,
      });

      return;
    }

    await navigator.clipboard.writeText(openUrl.value);

    showToast("Đã sao chép link mẫu thiệp");
  } catch (error) {
    // Người dùng đóng hộp thoại share
  }
}
</script>

<style scoped>
/* =========================================================
   TRANG — khung sáng "giấy dó", đồng nhất với Templates.vue:
   nền kem sáng, chữ mực nho, vàng foil, đỏ ấn son. Thẻ ảnh
   thiệp nổi bật trên nền sáng; bản sắc từng mẫu nằm ở nội
   dung (ảnh, tên, mô tả, từ khóa).
========================================================= */

.intro-page {
  --text: var(--studio-ink, #2b2118);
  --muted: var(--studio-ink-faint, #8a7a68);

  min-height: 100vh;

  background:
    radial-gradient(
      circle at 8% 4%,
      rgba(185, 151, 91, 0.1),
      transparent 30%
    ),
    linear-gradient(
      180deg,
      #fdfbf5 0%,
      #faf7ef 50%,
      #f6f1e4 100%
    );

  color: var(--text);

  padding-bottom: 80px;
}

/* =========================================================
   TOPBAR
========================================================= */

.intro-topbar {
  position: sticky;
  top: 0;
  z-index: 50;

  padding: 14px 0;

  background: var(--studio-glass-strong, rgba(250, 246, 238, 0.85));

  backdrop-filter: blur(14px);

  border-bottom: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
}

.topbar-inner {
  width: min(1200px, calc(100% - 32px));

  display: flex;
  align-items: center;
  justify-content: space-between;

  margin: 0 auto;
}

.back-btn,
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  min-height: 40px;
  padding: 0 16px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 999px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.back-btn svg {
  width: 15px;
  height: 15px;
}

.share-btn svg {
  width: 14px;
  height: 14px;
}

.back-btn:hover,
.share-btn:hover {
  transform: translateY(-1px);

  border-color: rgba(185, 151, 91, 0.5);

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  color: var(--studio-seal, #a63a2e);
}

/* =========================================================
   LOADING / ERROR
========================================================= */

.intro-state {
  width: min(100%, 460px);

  display: flex;
  flex-direction: column;

  align-items: center;

  text-align: center;

  margin: 90px auto 0;
  padding: 48px 30px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 22px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 20px 50px rgba(43, 33, 24, 0.12);
}

.state-orn {
  width: 64px;
  height: 64px;

  display: grid;
  place-items: center;

  margin-bottom: 18px;

  border-radius: 50%;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-symbol, serif);

  font-size: 26px;
}

.intro-state h1 {
  margin: 0 0 10px;

  font-family: var(--font-heading), Georgia, serif;

  font-size: var(--text-2xl);

  font-weight: 500;
}

.intro-state p {
  margin: 0 0 24px;

  color: var(--muted);

  font-size: var(--text-md);

  line-height: 1.8;
}

.state-title {
  color: var(--studio-ink-soft, #5c4f43);

  font-size: var(--text-md);
}

.state-spinner {
  width: 28px;
  height: 28px;

  margin-top: 20px;

  border-radius: 50%;

  border: 3px solid rgba(185, 151, 91, 0.25);
  border-top-color: var(--studio-foil, #b9975b);

  animation: spinner 0.8s linear infinite;
}

.state-btn {
  border: 0;
  padding: 12px 24px;

  border-radius: 999px;

  background: var(--studio-seal, #a63a2e);

  color: #fff;

  font-size: var(--text-sm);

  font-weight: 600;

  cursor: pointer;

  transition: transform 0.25s ease;
}

.state-btn:hover {
  transform: translateY(-2px);
}

/* =========================================================
   HERO — một màn: ảnh xem trước + thông tin gọn, không cuộn
========================================================= */

.intro-hero {
  /* trừ chiều cao topbar — hero chiếm đúng phần còn lại của màn */
  height: calc(100vh - 68px);

  display: flex;
  align-items: center;

  padding: 20px 0;
}

.hero-inner {
  width: min(1200px, calc(100% - 32px));

  display: grid;

  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);

  gap: 56px;

  margin: 0 auto;

  align-items: center;
}

/* =========================================================
   PREVIEW — thẻ ảnh 9/16 vừa chiều cao màn hình

   Ảnh xem trước là ảnh chụp toàn trang thiệp (rất dài) nên
   khung 9/16 + object-top hiển thị phần đầu thiệp — đúng
   cách các trang mẫu hiển thị.
========================================================= */

.preview-col {
  display: flex;
  justify-content: center;
}

.preview-card {
  /*
   * Vừa bề ngang cột, vừa chiều cao màn hình: 9/16 của
   * 400px là ~711px — trên màn thấp sẽ vượt viewport nên
   * chặn bằng max-height theo viewport (trừ topbar + đệm).
   * Khi bị chặn, khung thấp hơn tỉ lệ 9/16 nhưng ảnh vẫn
   * cover từ đầu trang thiệp.
   */
  width: min(400px, 100%);
  max-height: calc(100vh - 150px);

  aspect-ratio: 9 / 16;

  overflow: hidden;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 24px;

  background: #fff;

  box-shadow:
    0 30px 70px rgba(43, 33, 24, 0.18),
    0 0 0 4px rgba(185, 151, 91, 0.16);
}

.preview-card img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
  object-position: top;
}

/* =========================================================
   INFO — tên thiết kế, mô tả, từ khóa, hành động
========================================================= */

.info-col {
  min-width: 0;
}

.info-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  color: var(--studio-seal, #a63a2e);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.info-title {
  margin: 14px 0 0;

  font-family: var(--font-heading), "Cormorant Garamond", Georgia, serif;

  font-size: clamp(32px, 4.2vw, 52px);

  line-height: 1.05;

  font-weight: 500;

  letter-spacing: -0.02em;

  color: var(--text);
}

.info-couple {
  margin: 10px 0 0;

  color: var(--muted);

  font-size: clamp(13px, 1.4vw, 15px);
}

/* =========================================================
   NGÀY CƯỚI — khối ngày + giờ + địa điểm gọn
========================================================= */

.info-event {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: 14px;

  margin-top: 18px;
  padding: 12px 18px;

  border: 1px solid rgba(185, 151, 91, 0.35);
  border-radius: 16px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 8px 24px rgba(43, 33, 24, 0.06);
}

.event-date {
  display: flex;
  align-items: baseline;

  gap: 6px;
}

.date-day {
  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-heading), Georgia, serif;

  font-size: 34px;
  font-weight: 600;

  line-height: 1;
}

.date-rest {
  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13px;
  font-weight: 600;
}

.event-meta {
  flex: 1;

  min-width: 200px;

  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13px;

  line-height: 1.6;
}

.info-desc {
  max-width: 520px;

  margin: 16px 0 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: clamp(14px, 1.5vw, 15.5px);

  line-height: 1.75;
}

/* từ khóa phong cách — cùng dạng pill với thẻ ở gallery */

.info-tags {
  display: flex;
  flex-wrap: wrap;

  gap: 6px;

  margin-top: 18px;
}

.info-tag {
  display: inline-flex;
  align-items: center;

  padding: 5px 12px;

  border: 1px solid var(--studio-line-strong, rgba(43, 33, 24, 0.24));

  border-radius: 999px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 11.5px;
  font-weight: 600;

  letter-spacing: 0.02em;
}

/* =========================================================
   CTA — dòng tin cậy + hai nút hành động
========================================================= */

.cta-block {
  margin-top: 22px;
  padding-top: 20px;

  border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  text-align: left;
}

.cta-trust {
  margin: 0;

  color: var(--muted);

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.06em;
}

.cta-note {
  margin: 10px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  opacity: 0.75;

  font-size: 12px;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;

  gap: 10px;

  margin-top: 14px;
}

.cta-actions button {
  min-height: 50px;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  padding: 0 26px;

  border-radius: 999px;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease;
}

.cta-actions button:hover {
  transform: translateY(-2px);
}

.cta-actions svg {
  width: 17px;
  height: 17px;
}

.primary-btn {
  border: 1px solid var(--studio-contrast-bg, #2b2118);

  background: var(--studio-contrast-bg, #2b2118);

  color: var(--studio-contrast-ink, #f7f1e6);

  box-shadow: 0 14px 32px rgba(43, 33, 24, 0.22);
}

.primary-btn:hover {
  box-shadow: 0 20px 42px rgba(43, 33, 24, 0.3);
}

.outline-btn {
  border: 1px solid var(--studio-line-strong, rgba(43, 33, 24, 0.28));

  background: var(--studio-glass, rgba(255, 255, 255, 0.7));

  color: var(--text);
}

.outline-btn:hover {
  border-color: var(--studio-ink, #2b2118);

  background: var(--studio-glass-strong, #fff);
}

/* =========================================================
   THANH HÀNH ĐỘNG CỐ ĐỊNH — chỉ hiện trên điện thoại
========================================================= */

.mobile-cta {
  display: none;
}

/* =========================================================
   TOAST
========================================================= */

.toast-message {
  position: fixed;

  left: 50%;
  bottom: 28px;

  z-index: 10001;

  display: flex;
  align-items: center;

  gap: 8px;

  padding: 12px 17px;

  transform: translateX(-50%);

  border: 1px solid rgba(43, 33, 24, 0.1);

  border-radius: 999px;

  background: rgba(43, 33, 24, 0.92);

  backdrop-filter: blur(15px);

  color: #fff;

  box-shadow: 0 15px 35px rgba(43, 33, 24, 0.25);

  font-size: var(--text-sm);
}

.toast-message span {
  color: var(--studio-foil, #b9975b);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;

  transform: translate(-50%, 12px);
}

/* =========================================================
   ANIMATIONS
========================================================= */

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   TABLET — xếp chồng, ảnh trên info dưới, vẫn gọn một màn
========================================================= */

@media (max-width: 1024px) {
  .intro-hero {
    height: auto;
    min-height: calc(100vh - 68px);

    align-items: stretch;
  }

  .hero-inner {
    grid-template-columns: 1fr;

    gap: 24px;
  }

  .preview-col {
    justify-content: stretch;
  }

  .preview-card {
    width: min(340px, 100%);

    margin: 0 auto;

    max-height: 52vh;
  }
}

/* =========================================================
   MOBILE — ảnh to gần toàn màn, nội dung gọn
========================================================= */

@media (max-width: 640px) {
  .intro-page {
    padding-bottom: 96px; /* chừa chỗ cho thanh CTA cố định */
  }

  .intro-topbar {
    padding: 10px 0;
  }

  .back-btn,
  .share-btn {
    min-height: 36px;

    padding: 0 13px;

    font-size: 12px;
  }

  .intro-hero {
    height: auto;

    padding: 16px 0 0;
  }

  .hero-inner {
    width: calc(100% - 24px);

    gap: 18px;
  }

  /* thẻ ảnh chiếm trọn bề rộng, cao tối đa nửa màn */
  .preview-card {
    width: 100%;

    max-height: 46vh;

    border-radius: 18px;

    box-shadow: 0 18px 44px rgba(43, 33, 24, 0.16);
  }

  .info-title {
    margin-top: 8px;

    font-size: clamp(26px, 8vw, 34px);
  }

  .info-event {
    margin-top: 14px;

    padding: 10px 14px;

    gap: 10px;
  }

  .date-day {
    font-size: 28px;
  }

  .event-meta {
    min-width: 100%;

    font-size: 12.5px;
  }

  .info-desc {
    margin-top: 12px;

    font-size: 14px;
  }

  .info-tags {
    margin-top: 12px;
  }

  .cta-block {
    margin-top: 18px;
    padding-top: 16px;
  }

  /* ẩn hàng nút cuối trang — đã có thanh cố định */
  .cta-actions {
    display: none;
  }

  .cta-note {
    display: none;
  }

  /* thanh hành động cố định dưới màn hình */
  .mobile-cta {
    position: fixed;

    left: 0;
    right: 0;
    bottom: 0;

    z-index: 60;

    display: flex;

    gap: 10px;

    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));

    background: var(--studio-glass-strong, rgba(250, 246, 238, 0.92));

    backdrop-filter: blur(14px);

    border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  }

  .mobile-cta button {
    flex: 1;

    min-height: 48px;

    display: inline-flex;

    align-items: center;
    justify-content: center;

    border-radius: 999px;

    font-size: var(--text-sm);

    font-weight: 700;

    cursor: pointer;
  }
}

/* =========================================================
   VERY SMALL PHONE
========================================================= */

@media (max-width: 380px) {
  .hero-inner {
    width: calc(100% - 20px);
  }

  .info-title {
    font-size: 26px;
  }

  .info-tag {
    padding: 4px 10px;

    font-size: 10.5px;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: 0.01ms !important;
  }
}
</style>
