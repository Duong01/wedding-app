<template>
  <div class="wedding-page" :data-theme="theme.name" :style="themeStyle">
    <!-- =====================================================
         MÀN MỞ THIỆP - tối giản kiểu Bắc Âu
    ====================================================== -->

    <div v-if="!opened" class="mw-open">
      <div class="mw-open-inner">
        <p class="mw-open-kicker">You are invited to</p>

        <h1 class="mw-open-names">
          {{ wedding?.GroomName }}

          <span>&</span>

          {{ wedding?.BrideName }}
        </h1>

        <div class="mw-rule"></div>

        <p class="mw-open-date">
          {{ openDateLabel }}
        </p>

        <button
          type="button"
          class="mw-open-button"
          @click="handleOpen"
        >
          Mở thiệp →
        </button>
      </div>
    </div>

    <!-- =====================================================
         NỘI DUNG THIỆP
    ====================================================== -->

    <template v-else>
      <!-- ================= HERO ================= -->
      <!-- Khoảng trắng lớn, chữ xếp tầng, đường kẻ mảnh -->

      <section class="mw-hero">
        <p class="mw-hero-kicker">
          {{ wedding?.hero?.Title || "Save The Date" }}
        </p>

        <h1 class="mw-hero-name">
          {{ wedding?.hero?.GroomName || wedding?.GroomName }}
        </h1>

        <h1 class="mw-hero-name">
          {{ wedding?.hero?.BrideName || wedding?.BrideName }}
        </h1>

        <div class="mw-rule"></div>

        <p class="mw-hero-date">
          {{ heroDateLabel }}
        </p>

        <p class="mw-hero-location">
          {{ wedding?.hero?.location }}
        </p>

        <span class="mw-scroll-hint">↓</span>
      </section>

      <!-- ================= LỜI MỜI ================= -->

      <section class="mw-invite">
        <p class="mw-invite-text">
          Sự hiện diện của bạn là niềm vui lớn nhất của chúng mình.
          Hãy đến chung vui cùng gia đình trong ngày trọng đại này nhé!
        </p>
      </section>

      <!-- ================= CẶP ĐÔI ================= -->
      <!-- Editorial: nhãn trái - nội dung phải, xen kẽ -->

      <section class="mw-couple">
        <header class="mw-section-head">
          <span class="mw-kicker">01 — The Couple</span>

          <h2 class="mw-title">Chúng mình</h2>
        </header>

        <div class="mw-editorial">
          <!-- Cô dâu -->
          <article class="mw-row">
            <div class="mw-row-label">
              Cô dâu
            </div>

            <div class="mw-row-body">
              <h3 class="mw-person-name">
                {{ wedding?.couple?.bride?.name || wedding?.BrideName }}
              </h3>

              <p
                v-if="wedding?.couple?.bride?.description"
                class="mw-person-desc"
              >
                {{ wedding.couple.bride.description }}
              </p>

              <div class="mw-parents">
                <p v-if="wedding?.couple?.bride?.father">
                  Ông <strong>{{ wedding.couple.bride.father }}</strong>
                </p>

                <p v-if="wedding?.couple?.bride?.mother">
                  Bà <strong>{{ wedding.couple.bride.mother }}</strong>
                </p>
              </div>
            </div>
          </article>

          <!-- Chú rể -->
          <article class="mw-row reverse">
            <div class="mw-row-label">
              Chú rể
            </div>

            <div class="mw-row-body">
              <h3 class="mw-person-name">
                {{ wedding?.couple?.groom?.name || wedding?.GroomName }}
              </h3>

              <p
                v-if="wedding?.couple?.groom?.description"
                class="mw-person-desc"
              >
                {{ wedding.couple.groom.description }}
              </p>

              <div class="mw-parents">
                <p v-if="wedding?.couple?.groom?.father">
                  Ông <strong>{{ wedding.couple.groom.father }}</strong>
                </p>

                <p v-if="wedding?.couple?.groom?.mother">
                  Bà <strong>{{ wedding.couple.groom.mother }}</strong>
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- ================= SỰ KIỆN ================= -->
      <!-- Danh sách dòng với chấm dẫn (dotted leaders) -->

      <section
        v-if="events.length"
        class="mw-events"
      >
        <header class="mw-section-head">
          <span class="mw-kicker">02 — When & Where</span>

          <h2 class="mw-title">Thông tin</h2>
        </header>

        <div class="mw-event-list">
          <article
            v-for="event in events"
            :key="event.Id"
            class="mw-event"
          >
            <p class="mw-event-title">
              {{ event.Title || "Lễ Thành Hôn" }}
            </p>

            <div class="mw-event-line">
              <span>Thời gian</span>

              <i></i>

              <strong>{{ event.time }} · {{ event.day }}/{{ event.month }}/{{ event.year }}</strong>
            </div>

            <div class="mw-event-line">
              <span>Địa điểm</span>

              <i></i>

              <strong>{{ event.location }}</strong>
            </div>

            <p
              v-if="event.address"
              class="mw-event-address"
            >
              {{ event.address }}
            </p>

            <a
              v-if="event.map"
              class="mw-event-map"
              :href="event.map"
              target="_blank"
              rel="noopener"
            >
              Xem bản đồ →
            </a>
          </article>
        </div>
      </section>

      <!-- ================= ALBUM ================= -->
      <!-- Lưới sạch, khoảng cách rộng, số thứ tự -->

      <section
        v-if="gallery.length && wedding?.settings?.showGallery"
        class="mw-gallery"
      >
        <header class="mw-section-head">
          <span class="mw-kicker">03 — Moments</span>

          <h2 class="mw-title">Khoảnh khắc</h2>
        </header>

        <div class="mw-photo-grid">
          <button
            v-for="(item, index) in gallery.slice(0, 6)"
            :key="item.Id ?? index"
            type="button"
            class="mw-photo"
            @click="openGallery(index)"
          >
            <img
              :src="item.Image"
              :alt="item.Title || 'Ảnh cưới'"
              loading="lazy"
            />

            <span class="mw-photo-index">
              {{ String(index + 1).padStart(2, "0") }}
            </span>
          </button>
        </div>
      </section>

      <!-- ================= HỘP QUÀ ================= -->

      <section
        v-if="gifts.length && wedding?.settings?.showGift"
        class="mw-gift"
      >
        <header class="mw-section-head">
          <span class="mw-kicker">04 — Wishing Well</span>

          <h2 class="mw-title">Gửi yêu thương</h2>
        </header>

        <div class="mw-gift-list">
          <article
            v-for="gift in gifts"
            :key="gift.Id"
            class="mw-gift-card"
          >
            <div class="mw-gift-qr">
              <img
                v-if="gift.qrCode"
                :src="gift.qrCode"
                alt=""
              />
            </div>

            <div class="mw-gift-info">
              <h3 class="mw-gift-bank">
                {{ gift.bankName }}
              </h3>

              <p class="mw-gift-number">
                {{ gift.accountNumber }}
              </p>

              <p class="mw-gift-name">
                {{ gift.accountName }}
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- ================= LỜI CHÚC ================= -->

      <section
        v-if="wishes.length && wedding?.settings?.showGuestBook"
        class="mw-wishes"
      >
        <header class="mw-section-head">
          <span class="mw-kicker">05 — Guest Book</span>

          <h2 class="mw-title">Lời chúc</h2>
        </header>

        <div class="mw-wish-list">
          <blockquote
            v-for="wish in wishes"
            :key="wish.Id"
            class="mw-wish"
          >
            <p class="mw-wish-message">
              {{ wish.Message }}
            </p>

            <footer class="mw-wish-meta">
              <strong>{{ wish.name }}</strong>

              <small>{{ wish.created_at }}</small>
            </footer>
          </blockquote>
        </div>
      </section>

      <!-- ================= FOOTER ================= -->

      <footer class="mw-footer">
        <p class="mw-footer-message">
          {{ wedding?.footer?.Message }}
        </p>

        <div class="mw-footer-names">
          {{ wedding?.footer?.GroomName || wedding?.GroomName }}

          <em>&</em>

          {{ wedding?.footer?.BrideName || wedding?.BrideName }}
        </div>

        <div class="mw-rule short"></div>

        <p class="mw-footer-copy">
          © {{ currentYear }} {{ wedding?.footer?.Copyright }}
        </p>

        <p class="mw-footer-site">ngaychungdoi.com</p>
      </footer>

      <!-- Nhạc nền nổi -->
      <FloatingMusic
        v-if="wedding?.music?.Enabled && wedding?.settings?.showMusic"
        ref="floatingMusicRef"
        :music="wedding.music"
      />

      <!-- Xem ảnh toàn màn hình -->
      <v-dialog
        v-model="galleryDialog"
        fullscreen
        persistent
        transition="dialog-fade-transition"
        content-class="gallery-dialog"
      >
        <GalleryModal
          :images="gallery"
          :start-index="galleryIndex"
          @close="closeGallery"
        />
      </v-dialog>
    </template>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

import dayjs from "dayjs";

import FloatingMusic from "@/components/common/FloatingMusic.vue";
import GalleryModal from "@/components/gallery/GalleryModal.vue";

import { useWeddingTheme } from "@/composables/useWeddingTheme";

const props = defineProps({
  wedding: {
    type: Object,
    required: true,
  },
});

const { theme, themeStyle } = useWeddingTheme(props.wedding);

const opened = ref(false);

const floatingMusicRef = ref(null);

const galleryDialog = ref(false);

const galleryIndex = ref(0);

const currentYear = new Date().getFullYear();

/* =========================================================
   DATA
========================================================= */

const events = computed(() => {
  return Array.isArray(props.wedding?.events)
    ? props.wedding.events
    : [];
});

const gallery = computed(() => {
  return Array.isArray(props.wedding?.gallery)
    ? props.wedding.gallery
    : [];
});

const gifts = computed(() => {
  return Array.isArray(props.wedding?.gifts)
    ? props.wedding.gifts
    : [];
});

const wishes = computed(() => {
  return props.wedding?.guestBook?.guest ?? [];
});

/* =========================================================
   DATE LABELS
========================================================= */

function formatFull(date) {
  if (!date) return "";

  const parsed = dayjs(date);

  if (!parsed.isValid()) return "";

  const weekday = parsed
    .locale("vi")
    .format("dddd")
    .replace(/^./, (char) => char.toUpperCase());

  return `${weekday}, ${parsed.format("DD.MM.YYYY")}`;
}

const openDateLabel = computed(() => {
  return formatFull(props.wedding?.weddingDate);
});

const heroDateLabel = computed(() => {
  return formatFull(
    props.wedding?.hero?.weddingDate || props.wedding?.weddingDate
  );
});

/* =========================================================
   OPEN / MUSIC
========================================================= */

const handleOpen = async () => {
  opened.value = true;

  await nextTick();

  floatingMusicRef.value?.play?.();

  requestAnimationFrame(() => {
    initScrollAnimation();
  });
};

/* =========================================================
   GALLERY
========================================================= */

function openGallery(index) {
  galleryIndex.value = index;

  galleryDialog.value = true;

  document.body.style.overflow = "hidden";
}

function closeGallery() {
  galleryDialog.value = false;

  document.body.style.overflow = "";
}

onBeforeUnmount(() => {
  document.body.style.overflow = "";

  observer?.disconnect();
});

/* =========================================================
   REVEAL ON SCROLL
========================================================= */

let observer = null;

const initScrollAnimation = () => {
  const elements = document.querySelectorAll(
    ".wedding-page .mw-invite, .wedding-page .mw-couple, .wedding-page .mw-events, .wedding-page .mw-gallery, .wedding-page .mw-gift, .wedding-page .mw-wishes, .wedding-page .mw-footer"
  );

  if (!elements.length) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          observer?.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
};

onMounted(() => {
  if (opened.value) {
    nextTick(() => {
      initScrollAnimation();
    });
  }
});
</script>

<style scoped>
/* =========================================================
   PALETTE - MODERN WHITE
   Phong cách: Bắc Âu tối giản (ivory & xanh xô thơm)
========================================================= */

.wedding-page {
  --p-primary: #6b7f6a;
  --p-primary-light: #8ba089;
  --p-primary-dark: #556854;
  --p-gold: #93a58c;
  --p-gold-light: #eef2ea;
  --p-paper: #fbfaf7;
  --p-ink: #3f4a3e;
  --p-muted: #8b948a;
  --p-deep: #556854;
  /* Hero sáng: chữ đậm */
  --p-hero-text: #4a5747;

  position: relative;

  width: 100%;
  min-height: 100dvh;

  overflow-x: hidden;

  color: var(--p-ink);

  background: linear-gradient(180deg, #fbfaf7 0%, #f4f5ef 55%, #eef0e8 100%);
}

.wedding-page::before {
  content: "";

  position: fixed;

  inset: 0;

  z-index: -1;

  pointer-events: none;

  background-image: radial-gradient(
    rgba(107, 127, 106, 0.06) 1px,
    transparent 1px
  );

  background-size: 24px 24px;
}

/* =========================================================
   MÀN MỞ THIỆP
========================================================= */

.mw-open {
  position: fixed;

  inset: 0;

  z-index: 50;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 24px;

  background: linear-gradient(165deg, #f4f6ef 0%, #e9ede2 55%, #dde4d4 100%);
}

.mw-open-inner {
  width: min(100%, 420px);

  padding: 56px 36px;

  text-align: center;

  background: rgba(255, 255, 255, 0.92);

  border: 1px solid rgba(107, 127, 106, 0.2);
}

.mw-open-kicker {
  margin: 0 0 18px;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.34em;
  text-transform: uppercase;

  color: var(--p-muted);
}

.mw-open-names {
  margin: 0 0 22px;

  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 500;

  line-height: 1.35;

  color: var(--p-ink);
}

.mw-open-names span {
  display: block;

  font-family: var(--font-script);
  font-weight: 400;

  color: var(--p-primary);
}

.mw-rule {
  width: 56px;

  height: 1px;

  margin: 0 auto 20px;

  background: var(--p-primary);
}

.mw-rule.short {
  margin-bottom: 0;
}

.mw-open-date {
  margin: 0 0 30px;

  font-family: var(--font-main);
  font-size: var(--text-sm);

  letter-spacing: 0.1em;

  color: var(--p-muted);
}

.mw-open-button {
  min-height: 46px;

  padding: 0 34px;

  border: 1px solid var(--p-primary-dark);

  background: transparent;

  cursor: pointer;

  color: var(--p-primary-dark);

  font-family: var(--font-main);
  font-size: var(--text-sm);
  font-weight: 600;

  letter-spacing: 0.1em;

  transition: background 0.25s ease, color 0.25s ease;
}

.mw-open-button:hover {
  background: var(--p-primary-dark);

  color: #fff;
}

/* =========================================================
   HERO - TỐI GIẢN
========================================================= */

.mw-hero {
  width: 100%;

  min-height: 100dvh;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: 90px 24px 70px;

  text-align: center;

  color: var(--p-hero-text);

  animation: mwFadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes mwFadeUp {

  from {
    opacity: 0;

    transform: translateY(26px);
  }

  to {
    opacity: 1;

    transform: translateY(0);
  }

}

@media (prefers-reduced-motion: reduce) {
  .mw-hero {
    animation: none;
  }
}

.mw-hero-kicker {
  margin: 0 0 26px;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.4em;
  text-transform: uppercase;

  color: var(--p-primary);
}

.mw-hero-name {
  margin: 0;

  font-family: var(--font-heading);
  font-size: var(--text-display);
  font-weight: 500;

  line-height: 1.08;
}

.mw-hero .mw-rule {
  margin: 28px auto 22px;

  width: 72px;
}

.mw-hero-date {
  margin: 0 0 8px;

  font-family: var(--font-main);
  font-size: var(--text-sm);
  font-weight: 600;

  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.mw-hero-location {
  margin: 0;

  max-width: 420px;

  font-family: var(--font-main);
  font-size: var(--text-sm);

  line-height: 1.7;

  color: var(--p-muted);
}

.mw-scroll-hint {
  margin-top: 44px;

  font-size: var(--text-lg);

  color: var(--p-primary);

  animation: mwBounce 2.2s ease-in-out infinite;
}

@keyframes mwBounce {

  0%,
  100% {
    transform: translateY(0);

    opacity: 0.6;
  }

  50% {
    transform: translateY(8px);

    opacity: 1;
  }

}

/* =========================================================
   SECTION HEAD CHUNG
========================================================= */

.mw-section-head {
  margin-bottom: 40px;

  text-align: center;
}

.mw-kicker {
  display: block;

  margin-bottom: 12px;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.32em;
  text-transform: uppercase;

  color: var(--p-primary);
}

.mw-title {
  margin: 0;

  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 500;

  line-height: 1.15;

  color: var(--p-ink);
}

/* =========================================================
   LỜI MỜI
========================================================= */

.mw-invite {
  max-width: 540px;

  margin: 0 auto;

  padding: 80px 24px 50px;

  text-align: center;
}

.mw-invite-text {
  margin: 0;

  font-family: var(--font-main);
  font-size: var(--text-lg);

  line-height: 2;

  color: var(--p-muted);
}

/* =========================================================
   CẶP ĐÔI - EDITORIAL ROWS
========================================================= */

.mw-couple {
  max-width: 720px;

  margin: 0 auto;

  padding: 40px 24px 60px;
}

.mw-editorial {
  display: flex;

  flex-direction: column;

  gap: 44px;
}

.mw-row {
  display: grid;

  grid-template-columns: 110px 1fr;

  gap: 22px;

  align-items: start;

  padding-top: 26px;

  border-top: 1px solid rgba(107, 127, 106, 0.25);
}

.mw-row.reverse {
  direction: rtl;
}

.mw-row.reverse > * {
  direction: ltr;
}

.mw-row-label {
  padding-top: 5px;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 700;

  letter-spacing: 0.26em;
  text-transform: uppercase;

  color: var(--p-primary);
}

.mw-person-name {
  margin: 0 0 10px;

  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 500;

  color: var(--p-ink);
}

.mw-person-desc {
  margin: 0 0 14px;

  font-family: var(--font-main);
  font-size: var(--text-sm);

  line-height: 1.8;

  color: var(--p-muted);
}

.mw-parents p {
  margin: 3px 0;

  font-family: var(--font-main);
  font-size: var(--text-xs);

  letter-spacing: 0.04em;

  color: var(--p-muted);
}

.mw-parents strong {
  color: var(--p-ink);

  font-weight: 600;
}

@media (max-width: 560px) {
  .mw-row {
    grid-template-columns: 1fr;

    gap: 10px;
  }
}

/* =========================================================
   SỰ KIỆN - DOTTED LEADERS
========================================================= */

.mw-events {
  max-width: 640px;

  margin: 0 auto;

  padding: 30px 24px 60px;
}

.mw-event-list {
  display: flex;

  flex-direction: column;

  gap: 36px;
}

.mw-event {
  text-align: left;
}

.mw-event-title {
  margin: 0 0 16px;

  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;

  color: var(--p-ink);
}

.mw-event-line {
  display: flex;

  align-items: baseline;

  gap: 12px;

  margin-bottom: 10px;
}

.mw-event-line span {
  flex-shrink: 0;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.16em;
  text-transform: uppercase;

  color: var(--p-muted);
}

.mw-event-line i {
  flex: 1;

  height: 1px;

  background-image: radial-gradient(
    circle,
    rgba(107, 127, 106, 0.45) 1px,
    transparent 1px
  );

  background-size: 8px 2px;

  background-repeat: repeat-x;

  background-position: bottom;
}

.mw-event-line strong {
  flex-shrink: 0;

  font-family: var(--font-heading);
  font-size: var(--text-md);
  font-weight: 600;

  color: var(--p-ink);
}

.mw-event-address {
  margin: 0 0 14px;

  font-family: var(--font-main);
  font-size: var(--text-sm);

  line-height: 1.7;

  color: var(--p-muted);
}

.mw-event-map {
  display: inline-block;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 700;

  letter-spacing: 0.14em;
  text-transform: uppercase;

  color: var(--p-primary-dark);

  text-decoration: none;

  border-bottom: 1px solid var(--p-primary-dark);

  padding-bottom: 2px;

  transition: opacity 0.25s ease;
}

.mw-event-map:hover {
  opacity: 0.65;
}

/* =========================================================
   ALBUM - LƯỚI SẠCH
========================================================= */

.mw-gallery {
  max-width: 760px;

  margin: 0 auto;

  padding: 30px 24px 60px;
}

.mw-photo-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 26px 18px;
}

.mw-photo {
  position: relative;

  padding: 0;

  border: 0;

  cursor: pointer;

  background: transparent;
}

.mw-photo img {
  display: block;

  width: 100%;

  aspect-ratio: 4 / 5;

  object-fit: cover;

  filter: saturate(0.9);

  transition: filter 0.35s ease, transform 0.35s ease;
}

.mw-photo:hover img {
  filter: none;

  transform: scale(1.015);
}

.mw-photo-index {
  position: absolute;

  top: 10px;
  left: 12px;

  font-family: var(--font-heading);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.14em;

  color: #fff;

  text-shadow: 0 1px 6px rgba(40, 50, 38, 0.5);
}

@media (min-width: 700px) {
  .mw-photo-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* =========================================================
   HỘP QUÀ - CARD NGANG
========================================================= */

.mw-gift {
  max-width: 640px;

  margin: 0 auto;

  padding: 30px 24px 60px;
}

.mw-gift-list {
  display: flex;

  flex-direction: column;

  gap: 18px;
}

.mw-gift-card {
  display: flex;

  align-items: center;

  gap: 22px;

  padding: 20px;

  background: #fff;

  border: 1px solid rgba(107, 127, 106, 0.18);
}

.mw-gift-qr {
  flex-shrink: 0;

  width: 118px;
  height: 118px;

  padding: 6px;

  background: #fff;

  border: 1px solid rgba(107, 127, 106, 0.25);
}

.mw-gift-qr img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.mw-gift-info {
  min-width: 0;

  text-align: left;
}

.mw-gift-bank {
  margin: 0 0 6px;

  font-family: var(--font-heading);
  font-size: var(--text-md);
  font-weight: 600;

  color: var(--p-ink);
}

.mw-gift-number {
  margin: 0 0 4px;

  font-family: var(--font-heading);
  font-size: var(--text-md);
  font-weight: 700;

  letter-spacing: 0.06em;

  color: var(--p-primary-dark);
}

.mw-gift-name {
  margin: 0;

  font-family: var(--font-main);
  font-size: var(--text-xs);

  letter-spacing: 0.1em;
  text-transform: uppercase;

  color: var(--p-muted);
}

@media (max-width: 480px) {
  .mw-gift-card {
    flex-direction: column;

    text-align: center;
  }

  .mw-gift-info {
    text-align: center;
  }
}

/* =========================================================
   LỜI CHÚC
========================================================= */

.mw-wishes {
  max-width: 620px;

  margin: 0 auto;

  padding: 30px 24px 70px;
}

.mw-wish-list {
  display: flex;

  flex-direction: column;

  gap: 22px;
}

.mw-wish {
  margin: 0;

  padding-left: 18px;

  border-left: 2px solid var(--p-primary-light);
}

.mw-wish-message {
  margin: 0 0 8px;

  font-family: var(--font-main);
  font-size: var(--text-md);

  line-height: 1.8;

  color: var(--p-ink);
}

.mw-wish-meta {
  display: flex;

  align-items: baseline;

  gap: 10px;
}

.mw-wish-meta strong {
  font-family: var(--font-heading);
  font-size: var(--text-sm);

  color: var(--p-primary-dark);
}

.mw-wish-meta small {
  font-family: var(--font-main);
  font-size: var(--text-xs);

  color: var(--p-muted);
}

/* =========================================================
   FOOTER
========================================================= */

.mw-footer {
  padding: 80px 24px 60px;

  text-align: center;

  background: var(--p-deep);

  color: var(--p-gold-light);
}

.mw-footer-message {
  max-width: 480px;

  margin: 0 auto 34px;

  font-family: var(--font-main);
  font-size: var(--text-md);

  line-height: 1.9;

  opacity: 0.85;
}

.mw-footer-names {
  font-family: var(--font-script);
  font-size: var(--text-4xl);

  line-height: 1.2;
}

.mw-footer-names em {
  font-family: var(--font-heading);
  font-style: italic;

  font-size: var(--text-xl);

  opacity: 0.8;
}

.mw-footer .mw-rule {
  background: rgba(238, 242, 234, 0.5);

  margin: 26px auto 20px;
}

.mw-footer-copy {
  margin: 0 0 6px;

  font-family: var(--font-main);
  font-size: var(--text-xs);

  letter-spacing: 0.08em;

  opacity: 0.7;
}

.mw-footer-site {
  margin: 0;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.3em;
  text-transform: uppercase;

  opacity: 0.55;
}

/* =========================================================
   REVEAL ON SCROLL
========================================================= */

.mw-invite,
.mw-couple,
.mw-events,
.mw-gallery,
.mw-gift,
.mw-wishes,
.mw-footer {
  opacity: 0;

  transform: translateY(24px);

  /* Chỉ opacity + transform -> GPU mượt */
  transition: opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}

.mw-invite.is-visible,
.mw-couple.is-visible,
.mw-events.is-visible,
.mw-gallery.is-visible,
.mw-gift.is-visible,
.mw-wishes.is-visible,
.mw-footer.is-visible {
  opacity: 1;

  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .mw-invite,
  .mw-couple,
  .mw-events,
  .mw-gallery,
  .mw-gift,
  .mw-wishes,
  .mw-footer {
    opacity: 1;

    transform: none;

    transition: none;
  }
}
</style>