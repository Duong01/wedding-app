<template>
  <div class="intro-page" :style="cardStyle">
    <!-- =========================================================
         LOADING
    ========================================================== -->
    <div v-if="store.loading" class="intro-state">
      <div class="state-heart">♥</div>

      <div class="state-title">Đang tải mẫu thiệp...</div>

      <div class="state-spinner"></div>
    </div>

    <!-- =========================================================
         ERROR
    ========================================================== -->
    <div v-else-if="store.error || !wedding" class="intro-state">
      <div class="state-heart">♥</div>

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
    <div v-else class="detail-panel">
      <!-- =========================================
           QUAY LẠI
      ========================================== -->
      <button
        type="button"
        class="close-btn"
        aria-label="Quay lại danh sách mẫu"
        @click="goTemplates"
      >
        <span></span>
        <span></span>
      </button>

      <!-- =========================================
           LEFT PREVIEW
      ========================================== -->
      <div class="detail-preview">
        <div class="preview-header">
          <span>PREVIEW</span>

          <div class="preview-device">
            <span class="device-dot"></span>
            Mobile
          </div>
        </div>

        <div class="preview-stage">
          <div class="preview-phone">
            <div class="phone-top">
              <span></span>
            </div>

            <div class="phone-screen">
              <img
                :src="wedding.coverImage"
                :alt="getCoupleName(wedding)"
                @error="onImageError"
              />
            </div>

            <div class="phone-bottom">
              <span></span>
            </div>
          </div>

          <!-- decoration -->
          <div class="preview-decoration decoration-1">
            {{ meta.orn }}
          </div>

          <div class="preview-decoration decoration-2">
            {{ meta.orn }}
          </div>
        </div>

        <div class="preview-footer">
          <span>Thiết kế responsive</span>

          <span>•</span>

          <span>Tối ưu điện thoại</span>
        </div>
      </div>

      <!-- =========================================
           RIGHT CONTENT
      ========================================== -->
      <div class="detail-content">
        <div class="detail-scroll">
          <!-- badge -->
          <div class="detail-topline">
            <span class="info-badge">
              {{ getThemeLabel(wedding) }}
            </span>

            <span class="template-code">
              #{{ wedding.id || wedding.Id || "WEDDING" }}
            </span>
          </div>

          <!-- title -->
          <h2>
            {{ getCoupleName(wedding) }}
          </h2>

          <p class="detail-date">
            {{ formatDate(wedding.weddingDate) }}
          </p>

          <!-- dải màu bản sắc của mẫu -->
          <div class="detail-identity">
            <span
              v-for="(swatch, swatchIndex) in meta.palette"
              :key="swatchIndex"
              class="identity-swatch"
              :style="{ background: swatch }"
            ></span>

            <span class="detail-collection">
              {{ getCollectionLabel(wedding) }}
            </span>
          </div>

          <div class="gold-rule">
            <span></span>
            <i>{{ meta.orn }}</i>
            <span></span>
          </div>

          <!-- description -->
          <p class="description">
            {{
              wedding.story?.Description ||
              "Thiệp cưới được thiết kế theo phong cách hiện đại, đầy cảm xúc và dễ tùy chỉnh theo thông tin ngày cưới của bạn."
            }}
          </p>

          <!-- =====================================
               INFORMATION
          ====================================== -->
          <div class="detail-information">
            <div class="information-item">
              <span class="information-icon">♡</span>

              <div>
                <span class="meta-label">Cặp đôi</span>

                <strong>{{ getCoupleName(wedding) }}</strong>
              </div>
            </div>

            <div class="information-item">
              <span class="information-icon">◷</span>

              <div>
                <span class="meta-label">Thời gian</span>

                <strong>
                  {{
                    formatFullDate(wedding.weddingDate) ||
                    wedding.hero?.Title ||
                    "Save the date"
                  }}
                </strong>
              </div>
            </div>

            <div class="information-item">
              <span class="information-icon">♧</span>

              <div>
                <span class="meta-label">Địa điểm</span>

                <strong>
                  {{ wedding.hero?.Location || "Chưa cập nhật" }}
                </strong>
              </div>
            </div>
          </div>

          <!-- =====================================
               FEATURES
          ====================================== -->
          <div class="features-section">
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
          </div>

          <!-- =====================================
               QR — trỏ thẳng vào bước 2 (mở thiệp)
          ====================================== -->
          <div class="demo-section">
            <div class="qr-box">
              <img :src="qrUrl" alt="QR mở thiệp" />
            </div>

            <div class="qr-content">
              <strong>Xem thiệp trên điện thoại</strong>

              <p>
                Quét mã QR để mở thiệp trực tiếp trên điện thoại.
              </p>

              <span>Không cần đăng nhập</span>
            </div>
          </div>

          <!-- =====================================
               ACTIONS
          ====================================== -->
          <div class="detail-actions">
            <button type="button" class="primary-btn" @click="goOpen">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7"
              >
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>

              Xem thiệp
            </button>

            <button type="button" class="secondary-btn" @click="goEditor">
              <span>＋</span>
              Dùng mẫu này
            </button>
          </div>

          <!-- share -->
          <button type="button" class="share-btn" @click="shareTemplate">
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

            Chia sẻ mẫu thiệp
          </button>
        </div>
      </div>
    </div>

    <!-- =====================================================
         TOAST
    ====================================================== -->
    <Transition name="toast">
      <div v-if="toast" class="toast-message">
        <span>✓</span>
        {{ toast }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";

import { useRoute, useRouter } from "vue-router";

import { useWeddingStore } from "@/stores/wedding";

import {
  getCollection,
  getThemeMeta,
} from "@/data/templateCollections";

import { useSeo } from "@/composables/useSeo";

/* =========================================================
   BƯỚC 1 — TRANG GIỚI THIỆU MẪU

   Nội dung lấy từ modal chi tiết trước đây ở Templates.vue,
   chuyển thành trang riêng để có URL chia sẻ được và để
   Google index được từng mẫu.

   Luồng: /wedding/:slug (ở đây) → /open (phong bì) → /view
========================================================= */

const route = useRoute();
const router = useRouter();

const store = useWeddingStore();

const wedding = computed(() => store.wedding);

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
  { icon: "♧", label: "Ghi tên khách mời" },
  { icon: "↗", label: "Chia sẻ qua link" },
  { icon: "♡", label: "Xác nhận tham dự" },
  { icon: "○", label: "Nhận lời chúc" },
];

/* =========================================================
   HELPERS — chép từ Templates.vue để trang này đứng độc lập
========================================================= */

function themeNameOf(item) {
  return item?.theme?.Name || item?.theme || "";
}

/*
 * Bản sắc màu của mẫu. Ở Templates.vue đây là hàm cục bộ;
 * templateCollections.js không export nó nên phải định nghĩa
 * lại ở đây — thiếu hàm này là ReferenceError lúc render.
 */
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

function formatDate(date) {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
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
  event.target.src =
    "https://images.unsplash.com/" +
    "photo-1520854221256-17451cc331bf" +
    "?auto=format&fit=crop&w=900&q=80";
}

/* =========================================================
   LINK BƯỚC 2 — QR và nút chia sẻ đều phải mở đúng phong bì,
   không phải trang giới thiệu này.
========================================================= */

const openUrl = computed(() => {
  const slug = wedding.value?.slug || route.params.slug || "";

  return slug ? `${window.location.origin}/wedding/${slug}/open` : "";
});

const qrUrl = computed(() => {
  if (!openUrl.value) {
    return "";
  }

  return (
    "https://api.qrserver.com/v1/create-qr-code/" +
    `?size=180x180&margin=8&data=${encodeURIComponent(openUrl.value)}`
  );
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
    image: item.coverImage,
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
   TRANG — nền tối toàn màn hình như modal cũ, nhưng là
   một trang thật (có URL riêng), không phải lớp phủ.
========================================================= */

.intro-page {
  position: relative;

  min-height: 100vh;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 30px;

  background: rgba(18, 11, 13, 0.78);
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

  padding: 48px 30px;

  border-radius: 25px;

  background: linear-gradient(135deg, #3a2c28 0%, #241a18 100%);

  color: #fff;

  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
}

.state-heart {
  width: 70px;
  height: 70px;

  display: flex;

  align-items: center;
  justify-content: center;

  margin-bottom: 20px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.06);

  color: var(--card-accent, #b9975b);

  font-size: 30px;

  animation: heartPulse 1.5s ease-in-out infinite;
}

.state-title {
  color: rgba(255, 255, 255, 0.8);

  font-size: var(--text-md);
}

.intro-state h1 {
  margin: 0 0 12px;

  font-family: var(--font-heading);

  font-size: var(--text-2xl);

  font-weight: 500;
}

.intro-state p {
  margin: 0 0 26px;

  color: rgba(255, 255, 255, 0.55);

  font-size: var(--text-md);

  line-height: 1.8;
}

.state-spinner {
  width: 30px;
  height: 30px;

  margin-top: 22px;

  border-radius: 50%;

  border: 3px solid rgba(185, 151, 91, 0.25);

  border-top-color: var(--card-accent, #b9975b);

  animation: spinner 0.8s linear infinite;
}

.state-btn {
  border: 0;

  padding: 13px 24px;

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
   PANEL — hai cột, chuyển nguyên từ modal chi tiết
========================================================= */

.detail-panel {
  position: relative;

  width: min(1100px, 100%);

  max-height: min(850px, calc(100vh - 60px));

  display: grid;

  grid-template-columns: minmax(0, 1.02fr) minmax(390px, 0.98fr);

  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 0.12);

  border-radius: 25px;

  background: linear-gradient(135deg, #3a2c28 0%, #241a18 100%);

  color: #fff;

  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
}

/* =========================================================
   CLOSE
========================================================= */

.close-btn {
  position: absolute;

  top: 15px;
  right: 15px;

  z-index: 20;

  width: 40px;
  height: 40px;

  display: grid;
  place-items: center;

  padding: 0;

  border: 1px solid rgba(255, 255, 255, 0.25);

  border-radius: 50%;

  background: rgba(43, 33, 24, 0.6);

  backdrop-filter: blur(12px);

  cursor: pointer;

  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

.close-btn:hover {
  transform: rotate(90deg);

  background: rgba(255, 255, 255, 0.15);
}

.close-btn span {
  position: absolute;

  width: 16px;
  height: 1.5px;

  background: #fff;

  border-radius: 999px;
}

.close-btn span:first-child {
  transform: rotate(45deg);
}

.close-btn span:last-child {
  transform: rotate(-45deg);
}

/* =========================================================
   PREVIEW
========================================================= */

.detail-preview {
  position: relative;

  min-height: 680px;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 50% 40%,
      color-mix(in srgb, var(--card-accent, #b9975b) 16%, transparent),
      transparent 38%
    ),
    linear-gradient(
      145deg,
      color-mix(in srgb, var(--card-seal, #3a2c28) 78%, #1a1210),
      #1a1210
    );
}

.preview-header {
  position: absolute;

  top: 22px;
  left: 25px;
  right: 25px;

  display: flex;

  justify-content: space-between;

  z-index: 5;

  color: rgba(255, 255, 255, 0.52);

  font-size: var(--text-xs);

  font-weight: 700;

  letter-spacing: 0.18em;
}

.preview-device {
  display: flex;

  align-items: center;
  gap: 7px;

  letter-spacing: 0.05em;
}

.device-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: var(--card-accent, #b9975b);

  box-shadow: 0 0 10px
    color-mix(in srgb, var(--card-accent, #b9975b) 80%, transparent);
}

.preview-stage {
  position: absolute;

  inset: 55px 30px 45px;

  display: flex;

  align-items: center;
  justify-content: center;
}

.preview-phone {
  position: relative;

  width: min(330px, 75%);

  height: min(620px, 82%);

  overflow: hidden;

  border: 7px solid #1a1210;

  border-radius: 34px;

  background: #eee;

  box-shadow:
    0 30px 70px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.1);

  transform: rotate(-1deg);

  transition: transform 0.5s ease;
}

.detail-panel:hover .preview-phone {
  transform: rotate(0deg) translateY(-4px);
}

.phone-top {
  position: absolute;

  top: 0;
  left: 50%;

  transform: translateX(-50%);

  width: 90px;
  height: 19px;

  z-index: 5;

  border-radius: 0 0 14px 14px;

  background: #1a1210;
}

.phone-top span {
  position: absolute;

  left: 50%;
  top: 6px;

  width: 28px;
  height: 4px;

  transform: translateX(-50%);

  border-radius: 999px;

  background: #2c211e;
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

.phone-bottom {
  position: absolute;

  bottom: 5px;
  left: 50%;

  transform: translateX(-50%);

  width: 80px;
  height: 4px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.75);

  z-index: 5;
}

.preview-decoration {
  position: absolute;

  color: color-mix(in srgb, var(--card-accent, #b9975b) 65%, transparent);

  font-family: var(--font-heading);

  font-size: clamp(17px, 2vw, 24px);

  animation: floating 4s ease-in-out infinite;
}

.decoration-1 {
  top: 23%;
  left: 13%;
}

.decoration-2 {
  bottom: 20%;
  right: 12%;

  animation-delay: -1.5s;
}

.preview-footer {
  position: absolute;

  bottom: 17px;
  left: 0;
  right: 0;

  display: flex;

  justify-content: center;

  gap: 8px;

  color: rgba(255, 255, 255, 0.4);

  font-size: var(--text-xs);

  letter-spacing: 0.04em;
}

/* =========================================================
   DETAIL CONTENT
========================================================= */

.detail-content {
  min-width: 0;

  /* Container cho đơn vị cqw của h2 — cỡ chữ tên cặp đôi
     scale theo chiều rộng cột này thay vì theo viewport */
  container-type: inline-size;

  overflow: hidden;

  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.045),
    rgba(255, 255, 255, 0.018)
  );
}

.detail-scroll {
  height: 100%;

  overflow-y: auto;

  padding: 46px 36px 30px;

  scrollbar-width: thin;

  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}

.detail-topline {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 15px;
}

.info-badge {
  display: inline-flex;

  align-items: center;

  min-height: 25px;

  padding: 0 10px;

  border: 1px solid
    color-mix(in srgb, var(--card-accent, #b9975b) 35%, transparent);

  border-radius: 999px;

  color: var(--card-accent, #b9975b);

  background: color-mix(
    in srgb,
    var(--card-accent, #b9975b) 8%,
    transparent
  );

  font-size: var(--text-xs);

  font-weight: 700;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}

.template-code {
  color: rgba(255, 255, 255, 0.25);

  font-size: var(--text-xs);

  letter-spacing: 0.08em;
}

.detail-content h2 {
  margin: 17px 0 6px;

  font-family: var(--font-heading), "Cormorant Garamond", Georgia, serif;

  /* Fallback cho trình duyệt không hỗ trợ container query */
  font-size: 36px;

  /* Co giãn theo chiều rộng CỘT NỘI DUNG (cqw — container đặt ở
     .detail-content), không theo viewport: cột hẹp trên tablet
     dọc thì chữ nhỏ lại theo, không tràn hay vỡ dòng xấu */
  font-size: clamp(30px, 9.5cqw, 52px);

  line-height: 0.98;

  font-weight: 500;

  letter-spacing: -0.025em;

  color: #fff;
}

.detail-date {
  margin: 0;

  color: rgba(255, 255, 255, 0.5);

  font-size: var(--text-sm);
}

/* =========================================================
   DETAIL IDENTITY (dải màu + bộ sưu tập)
========================================================= */

.detail-identity {
  display: flex;

  align-items: center;

  gap: 6px;

  margin-top: 14px;
}

.detail-identity .identity-swatch {
  width: 22px;
  height: 6px;

  border-radius: 999px;

  opacity: 0.9;
}

.detail-identity .identity-swatch:first-child {
  width: 34px;
}

.detail-collection {
  margin-left: auto;

  color: color-mix(in srgb, var(--card-accent, #b9975b) 75%, #ffffff);

  font-size: var(--text-xs);

  font-weight: 700;

  letter-spacing: 0.14em;

  text-transform: uppercase;
}

.gold-rule {
  display: flex;

  align-items: center;

  gap: 10px;

  margin: 20px 0;
}

.gold-rule span {
  width: 38px;
  height: 1px;

  background: color-mix(
    in srgb,
    var(--card-accent, #b9975b) 45%,
    transparent
  );
}

.gold-rule i {
  color: var(--card-accent, #b9975b);

  font-family: var(--font-symbol, var(--font-heading));

  font-size: var(--text-sm);

  font-style: normal;

  line-height: 1;
}

.description {
  margin: 0;

  color: rgba(255, 255, 255, 0.58);

  font-size: var(--text-md);

  line-height: 1.8;
}

/* =========================================================
   INFORMATION
========================================================= */

.detail-information {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 8px;

  margin-top: 24px;
}

.information-item {
  min-width: 0;

  display: flex;

  gap: 9px;

  padding: 11px;

  border: 1px solid rgba(255, 255, 255, 0.06);

  border-radius: 10px;

  background: rgba(255, 255, 255, 0.025);
}

.information-icon {
  flex: 0 0 auto;

  color: var(--card-accent, #b9975b);

  font-size: var(--text-md);
}

.information-item > div {
  min-width: 0;
}

.meta-label {
  display: block;

  margin-bottom: 4px;

  color: rgba(255, 255, 255, 0.3);

  font-size: var(--text-xs);

  text-transform: uppercase;

  letter-spacing: 0.09em;
}

.information-item strong {
  display: block;

  overflow: hidden;

  color: rgba(255, 255, 255, 0.8);

  font-size: var(--text-xs);

  font-weight: 500;

  line-height: 1.4;

  text-overflow: ellipsis;

  white-space: nowrap;
}

/* =========================================================
   FEATURES
========================================================= */

.features-section {
  margin-top: 27px;
}

.section-heading {
  display: flex;

  align-items: center;

  gap: 12px;

  margin-bottom: 12px;

  color: rgba(255, 255, 255, 0.78);

  font-size: var(--text-xs);

  font-weight: 700;

  letter-spacing: 0.09em;

  text-transform: uppercase;
}

.section-heading i {
  flex: 1;

  height: 1px;

  background: rgba(255, 255, 255, 0.07);
}

.features-grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 9px 20px;
}

.feature-item {
  display: flex;

  align-items: center;

  gap: 8px;
}

.feature-item > span {
  width: 15px;

  color: var(--card-accent, #b9975b);

  font-size: var(--text-xs);

  text-align: center;
}

.feature-item p {
  margin: 0;

  color: rgba(255, 255, 255, 0.53);

  font-size: var(--text-xs);
}

/* =========================================================
   QR
========================================================= */

.demo-section {
  display: flex;

  align-items: center;

  gap: 15px;

  margin-top: 27px;

  padding-top: 21px;

  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.qr-box {
  width: 86px;
  height: 86px;

  flex: 0 0 auto;

  display: grid;
  place-items: center;

  padding: 6px;

  border-radius: 9px;

  background: #fff;

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.18);
}

.qr-box img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.qr-content strong {
  display: block;

  margin-bottom: 4px;

  color: rgba(255, 255, 255, 0.82);

  font-size: var(--text-sm);
}

.qr-content p {
  max-width: 230px;

  margin: 0;

  color: rgba(255, 255, 255, 0.4);

  font-size: var(--text-sm);

  line-height: 1.55;
}

.qr-content span {
  display: block;

  margin-top: 5px;

  color: rgba(255, 255, 255, 0.25);

  font-size: var(--text-xs);
}

/* =========================================================
   ACTIONS
========================================================= */

.detail-actions {
  display: grid;

  grid-template-columns: 1.2fr 1fr;

  gap: 9px;

  margin-top: 20px;
}

.detail-actions button {
  min-height: 44px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  border-radius: 10px;

  font-size: var(--text-sm);

  font-weight: 700;

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.detail-actions button:hover {
  transform: translateY(-2px);
}

.primary-btn {
  border: none;

  background: linear-gradient(
    135deg,
    var(--card-seal, #a63a2e),
    color-mix(in srgb, var(--card-seal, #7c2a20) 70%, #1a1210)
  );

  color: #fff;

  box-shadow: 0 8px 25px
    color-mix(in srgb, var(--card-seal, #7c2a20) 30%, transparent);
}

.primary-btn svg {
  width: 15px;
  height: 15px;
}

.secondary-btn {
  border: 1px solid rgba(255, 255, 255, 0.35);

  background: transparent;

  color: rgba(255, 255, 255, 0.78);
}

.secondary-btn span {
  font-size: 18px;

  font-weight: 400;
}

.share-btn {
  width: 100%;

  min-height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 7px;

  margin-top: 9px;

  border: none;

  border-radius: 9px;

  background: rgba(255, 255, 255, 0.035);

  color: rgba(255, 255, 255, 0.4);

  font-size: var(--text-xs);

  cursor: pointer;

  transition:
    background 0.25s ease,
    color 0.25s ease;
}

.share-btn:hover {
  background: rgba(255, 255, 255, 0.07);

  color: rgba(255, 255, 255, 0.75);
}

.share-btn svg {
  width: 14px;
  height: 14px;
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

@keyframes floating {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

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
   TABLET
========================================================= */

@media (max-width: 1180px) {
  .detail-panel {
    grid-template-columns: 1fr 1fr;
  }

  .detail-information {
    grid-template-columns: 1fr;
  }
}

/* =========================================================
   TABLET SMALL
========================================================= */

@media (max-width: 900px) {
  .intro-page {
    padding: 18px;
  }

  .detail-panel {
    max-height: calc(100vh - 36px);

    grid-template-columns: 1fr;
  }

  .detail-preview {
    min-height: 370px;

    height: 43vh;
  }

  .detail-scroll {
    padding: 28px 28px 26px;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 640px) {
  .intro-page {
    padding: 0;

    align-items: flex-end;
  }

  .detail-panel {
    width: 100%;

    max-height: 100dvh;

    height: 100dvh;

    border-radius: 22px 22px 0 0;

    grid-template-rows: 43dvh 57dvh;

    grid-template-columns: 1fr;
  }

  .detail-preview {
    min-height: 0;

    height: auto;
  }

  .preview-header {
    top: 13px;
    left: 16px;
    right: 62px;
  }

  .preview-stage {
    inset: 35px 15px 30px;
  }

  .preview-phone {
    width: min(220px, 56vw);

    height: 88%;

    border-width: 5px;

    border-radius: 24px;
  }

  .phone-top {
    width: 62px;
    height: 13px;
  }

  .phone-top span {
    top: 4px;

    width: 20px;
    height: 3px;
  }

  .phone-bottom {
    bottom: 3px;

    width: 55px;
    height: 3px;
  }

  .preview-footer {
    bottom: 10px;
  }

  .detail-scroll {
    padding: 25px 18px 28px;
  }

  .detail-identity {
    margin-top: 10px;
  }

  .detail-identity .identity-swatch {
    width: 16px;
    height: 5px;
  }

  .detail-identity .identity-swatch:first-child {
    width: 26px;
  }

  .description {
    line-height: 1.7;
  }

  .detail-information {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 6px;

    margin-top: 17px;
  }

  .information-item {
    padding: 8px;

    display: block;
  }

  .information-icon {
    display: none;
  }

  .features-section {
    margin-top: 19px;
  }

  .features-grid {
    gap: 7px 10px;
  }

  .feature-item {
    gap: 5px;
  }

  .feature-item > span {
    width: 11px;
  }

  .demo-section {
    margin-top: 18px;

    padding-top: 15px;
  }

  .qr-box {
    width: 65px;
    height: 65px;
  }

  .detail-actions {
    margin-top: 15px;
  }

  .detail-actions button {
    min-height: 42px;
  }

  .share-btn {
    min-height: 34px;
  }

  .close-btn {
    top: 10px;
    right: 10px;

    width: 34px;
    height: 34px;
  }
}

/* =========================================================
   VERY SMALL PHONE
========================================================= */

@media (max-width: 380px) {
  .detail-panel {
    grid-template-rows: 39dvh 61dvh;
  }

  .preview-phone {
    width: 190px;
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
