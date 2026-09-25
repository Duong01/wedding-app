<template>
  <main class="intro-page" :style="cardStyle">
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
         BƯỚC 1 — GIỚI THIỆU MẪU
    ========================================================== -->
    <template v-else>
      <section class="intro-hero">
        <div class="hero-inner">
          <!-- =========================================
               LEFT — XEM TRƯỚC THIỆP
          ========================================== -->
          <aside class="preview-col">
            <div class="preview-stage">
              <div class="preview-phone">
                <div class="phone-notch"></div>

                <div class="phone-screen">
                  <img
                    :src="previewFor(wedding)"
                    :alt="getThemeLabel(wedding)"
                    @error="onImageError"
                  />
                </div>

                <div class="phone-home"></div>
              </div>
            </div>

            <div class="preview-caption">
              <span class="caption-dot"></span>

              Thiết kế responsive · Tối ưu cho điện thoại
            </div>
          </aside>

          <!-- =========================================
               RIGHT — THÔNG TIN MẪU
          ========================================== -->
          <div class="info-col">
            <!-- badges -->
            <div class="info-badges">
              <span class="badge badge-theme">
                {{ getThemeLabel(wedding) }}
              </span>

              <span class="badge badge-collection">
                {{ getCollectionLabel(wedding) }}
              </span>
            </div>

            <!-- title -->
            <h1 class="info-title">
              {{ getCoupleName(wedding) }}
            </h1>

            <!-- date + place -->
            <p class="info-date">
              <span>
                {{ formatFullDate(wedding.weddingDate) || "Save the date" }}
              </span>

              <span v-if="wedding.hero?.Location" class="date-sep">·</span>

              <span v-if="wedding.hero?.Location">
                {{ wedding.hero.Location }}
              </span>
            </p>

            <!-- dải màu bản sắc -->
            <div class="identity-row">
              <span
                v-for="(swatch, swatchIndex) in meta.palette"
                :key="swatchIndex"
                class="identity-swatch"
                :style="{ background: swatch }"
              ></span>

              <span class="identity-orn">
                {{ meta.orn }}
              </span>
            </div>

            <!-- description -->
            <p class="info-description">
              {{
                wedding.story?.Description ||
                "Thiệp cưới được thiết kế theo phong cách hiện đại, đầy cảm xúc và dễ tùy chỉnh theo thông tin ngày cưới của bạn."
              }}
            </p>

            <!-- =====================================
                 CẶP ĐÔI — dữ liệu thật của từng thiệp
            ====================================== -->
            <section class="couple-section">
              <div class="section-heading">
                <span>Cặp đôi</span>
                <i></i>
              </div>

              <div class="couple-grid">
                <div class="couple-card">
                  <div class="couple-avatar">
                    <img
                      v-if="wedding.couple?.Bride?.Avatar"
                      :src="wedding.couple.Bride.Avatar"
                      :alt="wedding.couple.Bride.Name"
                      loading="lazy"
                      @error="onAvatarError"
                    />

                    <span v-else class="avatar-fallback">
                      {{ meta.orn }}
                    </span>
                  </div>

                  <div class="couple-body">
                    <strong class="couple-name">
                      {{ wedding.couple?.Bride?.Name || "Cô dâu" }}
                    </strong>

                    <span class="couple-role">
                      {{ wedding.couple?.Bride?.Role || "Cô dâu" }}
                    </span>
                  </div>
                </div>

                <span class="couple-amp">&amp;</span>

                <div class="couple-card">
                  <div class="couple-avatar">
                    <img
                      v-if="wedding.couple?.Groom?.Avatar"
                      :src="wedding.couple.Groom.Avatar"
                      :alt="wedding.couple.Groom.Name"
                      loading="lazy"
                      @error="onAvatarError"
                    />

                    <span v-else class="avatar-fallback">
                      {{ meta.orn }}
                    </span>
                  </div>

                  <div class="couple-body">
                    <strong class="couple-name">
                      {{ wedding.couple?.Groom?.Name || "Chú rể" }}
                    </strong>

                    <span class="couple-role">
                      {{ wedding.couple?.Groom?.Role || "Chú rể" }}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <!-- =====================================
                 LỄ CƯỚI — sự kiện thật của từng thiệp
            ====================================== -->
            <section v-if="events.length" class="events-section">
              <div class="section-heading">
                <span>Lễ cưới</span>
                <i></i>
              </div>

              <div class="events-list">
                <div
                  v-for="event in events"
                  :key="event.Id || event.Title"
                  class="event-card"
                >
                  <div class="event-date">
                    <strong>{{ event.Day || "—" }}</strong>

                    <span>
                      {{ event.Month ? `Tháng ${event.Month}` : "" }}
                    </span>

                    <small>{{ event.Year || "" }}</small>
                  </div>

                  <div class="event-info">
                    <strong class="event-title">
                      {{ event.Title || "Lễ cưới" }}
                    </strong>

                    <span
                      v-if="event.EventTime"
                      class="event-meta"
                    >
                      ◷ {{ event.EventTime }}
                    </span>

                    <span
                      v-if="event.Location"
                      class="event-meta"
                    >
                      ♧ {{ event.Location }}
                    </span>

                    <a
                      v-if="event.Map"
                      :href="event.Map"
                      target="_blank"
                      rel="noopener"
                      class="event-map"
                    >
                      Xem bản đồ
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <!-- =====================================
                 TÍNH NĂNG
            ====================================== -->
            <section class="features-section">
              <div class="section-heading">
                <span>Tính năng</span>
                <i></i>
              </div>

              <div class="features-grid">
                <div
                  v-for="feature in FEATURES"
                  :key="feature.label"
                  class="feature-item"
                >
                  <span>{{ feature.icon }}</span>
                  <p>{{ feature.label }}</p>
                </div>
              </div>
            </section>

            <!-- =====================================
                 HÀNH ĐỘNG
            ====================================== -->
            <div class="cta-actions">
              <button
                type="button"
                class="primary-btn"
                @click="goOpen"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                >
                  <path
                    d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
                  />
                  <circle cx="12" cy="12" r="2.5" />
                </svg>

                Xem thiệp
              </button>

              <button
                type="button"
                class="secondary-btn"
                @click="goEditor"
              >
                <span>＋</span>
                Dùng mẫu này
              </button>
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
          class="secondary-btn"
          @click="goEditor"
        >
          Dùng mẫu này
        </button>

        <button
          type="button"
          class="primary-btn"
          @click="goOpen"
        >
          Xem thiệp
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
   BƯỚC 1 — TRANG GIỚI THIỆU MẪU

   Luồng: /wedding/:slug (ở đây) → /open (phong bì) → /view

   Trang dùng theme studio sáng (giấy dó, mực nho, vàng foil)
   đồng nhất với Templates.vue — mỗi mẫu mang bảng màu bản sắc
   riêng qua --card-accent / --card-seal.
========================================================= */

const route = useRoute();
const router = useRouter();

const store = useWeddingStore();

const wedding = computed(() => store.wedding);

const FALLBACK_ORN = "囍";

const meta = computed(() => getWeddingMeta(themeNameOf(wedding.value)));

const cardStyle = computed(() => {
  const p = meta.value.palette;

  return {
    "--card-ink": p.ink,
    "--card-accent": p.accent,
    "--card-seal": p.seal,
    "--card-bg": p.bg,
  };
});

const FEATURES = [
  { icon: "✦", label: "Tùy chỉnh nội dung" },
  { icon: "◉", label: "Ảnh không giới hạn" },
  { icon: "⌖", label: "Google Maps" },
  { icon: "♪", label: "Nhạc nền" },
  { icon: "♡", label: "Xác nhận tham dự" },
  { icon: "↗", label: "Chia sẻ qua link" },
];

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

function formatFullDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const day = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);

  const time = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);

  return `${day} · ${time}`;
}

function onImageError(event) {
  handleImageError(event);
}

/*
 * Ảnh đại diện lỗi (link ngoài hỏng) → ẩn img, fallback
 * chữ ký họa tiết hiện lên nhờ v-else.
 */
function onAvatarError(event) {
  event.target.style.display = "none";
}

/* =========================================================
   SỰ KIỆN LỄ CƯỚI — dữ liệu thật của từng thiệp
========================================================= */

const events = computed(() => {
  const list = wedding.value?.events;

  return Array.isArray(list) ? list : [];
});

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
   hiện đúng tên cặp đôi và ảnh bìa.
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

  const couple = getCoupleName(item);

  return {
    title: `Thiệp cưới ${couple} — ${getThemeLabel(item)}`,
    description:
      item.story?.Description ||
      `Mẫu thiệp cưới ${getThemeLabel(item)} cho ${couple}. ` +
        "Xem trước và tùy chỉnh theo ngày cưới của bạn.",
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
        title: getCoupleName(wedding.value),
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
   TRANG — theme studio sáng, đồng nhất với Templates.vue:
   giấy dó ấm, mực nho, vàng foil; mỗi mẫu tô điểm bằng bảng
   màu bản sắc riêng (--card-accent / --card-seal).
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
      #faf6ee 0%,
      #f7f1e6 50%,
      #f4ecdd 100%
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

  background: rgba(250, 246, 238, 0.85);

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

  color: var(--card-seal, #a63a2e);
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

  box-shadow: 0 20px 50px rgba(43, 33, 24, 0.07);
}

.state-orn {
  width: 64px;
  height: 64px;

  display: grid;
  place-items: center;

  margin-bottom: 18px;

  border-radius: 50%;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  color: var(--card-seal, #a63a2e);

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
  border-top-color: var(--card-accent, #b9975b);

  animation: spinner 0.8s linear infinite;
}

.state-btn {
  border: 0;
  padding: 12px 24px;

  border-radius: 999px;

  background: var(--card-seal, #a63a2e);

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
   HERO — hai cột: xem trước + thông tin
========================================================= */

.intro-hero {
  padding: 44px 0 0;
}

.hero-inner {
  width: min(1200px, calc(100% - 32px));

  display: grid;

  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);

  gap: 56px;

  margin: 0 auto;

  align-items: start;
}

/* =========================================================
   PREVIEW — điện thoại mockup, dính khi cuộn
========================================================= */

.preview-col {
  position: sticky;
  top: 96px;
}

.preview-stage {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 34px 20px 26px;

  border: 1px solid
    color-mix(in srgb, var(--card-accent, #b9975b) 22%, transparent);

  border-radius: 26px;

  background:
    radial-gradient(
      circle at 50% 30%,
      color-mix(in srgb, var(--card-accent, #b9975b) 10%, transparent),
      transparent 65%
    ),
    var(--studio-card, #fffdf8);

  box-shadow: 0 24px 60px rgba(43, 33, 24, 0.08);
}

.preview-phone {
  position: relative;

  width: min(300px, 100%);

  aspect-ratio: 9 / 19;

  overflow: hidden;

  border: 6px solid var(--studio-ink, #2b2118);

  border-radius: 32px;

  background: #eee;

  box-shadow:
    0 24px 55px rgba(43, 33, 24, 0.22),
    0 0 0 1px rgba(255, 255, 255, 0.35);
}

.phone-notch {
  position: absolute;
  top: 0;
  left: 50%;

  width: 86px;
  height: 18px;

  transform: translateX(-50%);

  z-index: 5;

  border-radius: 0 0 13px 13px;

  background: var(--studio-ink, #2b2118);
}

.phone-screen {
  width: 100%;
  height: 100%;

  overflow: hidden;
}

.phone-screen img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.phone-home {
  position: absolute;
  bottom: 5px;
  left: 50%;

  width: 76px;
  height: 4px;

  transform: translateX(-50%);

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.75);

  z-index: 5;
}

.preview-caption {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 16px;

  color: var(--muted);

  font-size: var(--text-xs);

  letter-spacing: 0.04em;
}

.caption-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: var(--card-accent, #b9975b);
}

/* =========================================================
   INFO — cột nội dung
========================================================= */

.info-col {
  min-width: 0;
}

.info-badges {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: 8px;
}

.badge {
  display: inline-flex;
  align-items: center;

  min-height: 26px;
  padding: 0 12px;

  border-radius: 999px;

  font-size: var(--text-xs);

  font-weight: 700;

  letter-spacing: 0.1em;

  text-transform: uppercase;
}

.badge-theme {
  border: 1px solid
    color-mix(in srgb, var(--card-accent, #b9975b) 40%, transparent);

  background: color-mix(
    in srgb,
    var(--card-accent, #b9975b) 10%,
    transparent
  );

  color: var(--card-seal, #a63a2e);
}

.badge-collection {
  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink-soft, #5c4f43);
}

.info-title {
  margin: 18px 0 8px;

  font-family: var(--font-heading), "Cormorant Garamond", Georgia, serif;

  font-size: clamp(32px, 4.6vw, 54px);

  line-height: 1.04;

  font-weight: 500;

  letter-spacing: -0.02em;

  color: var(--card-ink, var(--text));
}

.info-date {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: 8px;

  margin: 0;

  color: var(--muted);

  font-size: var(--text-md);
}

.date-sep {
  color: var(--card-accent, #b9975b);
}

/* dải màu bản sắc */

.identity-row {
  display: flex;
  align-items: center;

  gap: 6px;

  margin-top: 16px;
}

.identity-swatch {
  width: 22px;
  height: 6px;

  border-radius: 999px;

  box-shadow: inset 0 0 0 1px rgba(43, 33, 24, 0.08);

  opacity: 0.9;
}

.identity-swatch:first-child {
  width: 34px;
}

.identity-orn {
  margin-left: auto;

  color: var(--card-accent, #b9975b);

  font-family: var(--font-symbol, var(--font-heading));

  font-size: 16px;

  line-height: 1;
}

.info-description {
  margin: 18px 0 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: var(--text-md);

  line-height: 1.85;
}

/* =========================================================
   SECTION HEADING — dùng chung cho các khối
========================================================= */

.section-heading {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 14px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: var(--text-xs);

  font-weight: 700;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}

.section-heading i {
  flex: 1;
  height: 1px;

  background: var(--studio-line, rgba(43, 33, 24, 0.14));
}

/* =========================================================
   CẶP ĐÔI
========================================================= */

.couple-section {
  margin-top: 30px;
}

.couple-grid {
  display: grid;

  grid-template-columns: 1fr auto 1fr;

  gap: 14px;

  align-items: stretch;
}

.couple-card {
  display: flex;
  flex-direction: column;

  align-items: center;

  text-align: center;

  padding: 22px 16px 18px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 18px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 10px 28px rgba(43, 33, 24, 0.05);
}

.couple-avatar {
  width: 72px;
  height: 72px;

  overflow: hidden;

  margin-bottom: 12px;

  border-radius: 50%;

  border: 2px solid
    color-mix(in srgb, var(--card-accent, #b9975b) 45%, transparent);

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  display: grid;
  place-items: center;
}

.couple-avatar img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;
}

.avatar-fallback {
  color: var(--card-seal, #a63a2e);

  font-family: var(--font-symbol, serif);

  font-size: 24px;
}

.couple-body {
  min-width: 0;

  display: flex;
  flex-direction: column;

  align-items: center;
}

.couple-name {
  font-family: var(--font-heading), Georgia, serif;

  font-size: var(--text-lg);

  font-weight: 600;

  color: var(--card-ink, var(--text));
}

.couple-role {
  margin-top: 3px;

  color: var(--card-accent, #b9975b);

  font-size: var(--text-xs);

  font-weight: 700;

  letter-spacing: 0.1em;

  text-transform: uppercase;
}

.couple-amp {
  align-self: center;

  font-family: var(--font-heading), Georgia, serif;

  font-size: 30px;

  font-style: italic;

  color: var(--card-accent, #b9975b);
}

/* =========================================================
   LỄ CƯỚI
========================================================= */

.events-section {
  margin-top: 30px;
}

.events-list {
  display: flex;
  flex-direction: column;

  gap: 12px;
}

.event-card {
  display: flex;

  gap: 18px;

  padding: 16px 18px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 16px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 10px 28px rgba(43, 33, 24, 0.05);
}

.event-date {
  flex: 0 0 auto;

  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  min-width: 74px;

  padding: 10px 14px;

  border-radius: 12px;

  background:
    color-mix(
      in srgb,
      var(--card-seal, #a63a2e) 7%,
      transparent
    );

  border: 1px solid
    color-mix(in srgb, var(--card-seal, #a63a2e) 18%, transparent);
}

.event-date strong {
  font-family: var(--font-heading), Georgia, serif;

  font-size: 26px;

  font-weight: 600;

  line-height: 1;

  color: var(--card-seal, #a63a2e);
}

.event-date span {
  margin-top: 4px;

  color: var(--card-seal, #a63a2e);

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 0.06em;

  text-transform: uppercase;
}

.event-date small {
  color: var(--muted);

  font-size: 10px;
}

.event-info {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 4px;
}

.event-title {
  font-family: var(--font-heading), Georgia, serif;

  font-size: var(--text-lg);

  font-weight: 600;

  color: var(--card-ink, var(--text));
}

.event-meta {
  color: var(--studio-ink-soft, #5c4f43);

  font-size: var(--text-sm);
}

.event-map {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  margin-top: 4px;

  color: var(--card-seal, #a63a2e);

  font-size: var(--text-xs);

  font-weight: 700;

  text-decoration: none;
}

.event-map span {
  transition: transform 0.2s ease;
}

.event-map:hover span {
  display: inline-block;

  transform: translateX(3px);
}

/* =========================================================
   TÍNH NĂNG
========================================================= */

.features-section {
  margin-top: 30px;
}

.features-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 10px 22px;
}

.feature-item {
  display: flex;
  align-items: center;

  gap: 9px;

  padding: 10px 14px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 12px;

  background: rgba(255, 253, 248, 0.7);
}

.feature-item > span {
  flex: 0 0 auto;

  width: 16px;

  color: var(--card-accent, #b9975b);

  font-size: var(--text-sm);

  text-align: center;
}

.feature-item p {
  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: var(--text-xs);
}

/* =========================================================
   HÀNH ĐỘNG
========================================================= */

.cta-actions {
  display: flex;
  flex-wrap: wrap;

  gap: 10px;

  margin-top: 32px;
}

.cta-actions button {
  min-height: 46px;

  display: inline-flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  padding: 0 22px;

  border-radius: 999px;

  font-size: var(--text-sm);

  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.cta-actions button:hover {
  transform: translateY(-2px);
}

.primary-btn {
  border: none;

  background: var(--card-seal, #a63a2e);

  color: #fff;

  box-shadow: 0 10px 26px
    color-mix(in srgb, var(--card-seal, #a63a2e) 32%, transparent);
}

.primary-btn svg {
  width: 15px;
  height: 15px;
}

.secondary-btn {
  border: 1px solid var(--studio-line-strong, rgba(43, 33, 24, 0.28));

  background: transparent;

  color: var(--text);
}

.secondary-btn span {
  font-size: 17px;

  font-weight: 400;
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

  border: 1px solid rgba(255, 255, 255, 0.1);

  border-radius: 999px;

  background: rgba(43, 33, 24, 0.92);

  backdrop-filter: blur(15px);

  color: #fff;

  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);

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
   TABLET — xếp chồng, ảnh to giữa màn
========================================================= */

@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr;

    gap: 30px;
  }

  .preview-col {
    position: static;
  }

  .preview-stage {
    max-width: 480px;

    margin: 0 auto;

    padding: 26px 18px 20px;
  }

  .preview-phone {
    width: min(250px, 100%);
  }

  .preview-caption {
    margin-top: 12px;
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
    padding-top: 20px;
  }

  .hero-inner {
    width: calc(100% - 24px);

    gap: 20px;
  }

  /* bỏ khung điện thoại — ảnh to trực tiếp, bắt mắt hơn */
  .preview-stage {
    padding: 0;

    border: 0;

    border-radius: 18px;

    background: transparent;

    box-shadow: none;
  }

  .preview-phone {
    width: 100%;

    aspect-ratio: 3 / 4;

    border: 0;

    border-radius: 18px;

    box-shadow: 0 18px 44px rgba(43, 33, 24, 0.16);
  }

  .phone-notch,
  .phone-home {
    display: none;
  }

  .preview-caption {
    margin-top: 10px;
  }

  .info-title {
    margin-top: 14px;

    font-size: clamp(28px, 8.5vw, 38px);
  }

  .couple-grid {
    grid-template-columns: 1fr;

    gap: 10px;
  }

  .couple-amp {
    padding: 2px 0;
  }

  .couple-card {
    flex-direction: row;

    align-items: center;
    text-align: left;

    gap: 14px;

    padding: 14px 16px;
  }

  .couple-avatar {
    width: 56px;
    height: 56px;

    flex: 0 0 auto;

    margin-bottom: 0;
  }

  .couple-body {
    align-items: flex-start;
  }

  .event-card {
    flex-direction: column;

    gap: 12px;

    padding: 14px;
  }

  .event-date {
    flex-direction: row;

    gap: 8px;

    min-width: 0;

    justify-content: flex-start;
  }

  .event-date strong {
    font-size: 22px;
  }

  .event-date span {
    margin-top: 0;
  }

  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 8px;
  }

  /* ẩn nút cuối trang — đã có thanh cố định */
  .cta-actions {
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

    background: rgba(250, 246, 238, 0.92);

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
