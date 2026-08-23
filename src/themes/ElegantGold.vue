<template>
  <div class="wedding-page" :data-theme="theme.name" :style="themeStyle">
    <!-- =====================================================
         MÀN MỞ THIỆP - Art Deco: monogram kim cương
    ====================================================== -->

    <div v-if="!opened" class="eg-open">
      <div class="eg-open-frame">
        <div class="eg-monogram">
          <span>{{ monogram }}</span>
        </div>

        <p class="eg-open-kicker">The Wedding Of</p>

        <h1 class="eg-open-names">
          {{ wedding?.groomName }}

          <span class="eg-open-amp">&</span>

          {{ wedding?.brideName }}
        </h1>

        <div class="eg-rule">
          <i>◆</i>
        </div>

        <p class="eg-open-date">
          {{ openDateLabel }}
        </p>

        <button
          type="button"
          class="eg-open-button"
          @click="handleOpen"
        >
          Mở thiệp
        </button>
      </div>
    </div>

    <!-- =====================================================
         NỘI DUNG THIỆP
    ====================================================== -->

    <template v-else>
      <!-- ================= HERO ================= -->
      <!-- Đêm đen, tia Art Deco, monogram giữa -->

      <section class="eg-hero">
        <div class="eg-hero-rays"></div>

        <div class="eg-hero-body">
          <div class="eg-hero-mono">
            <span>{{ monogram }}</span>
          </div>

          <p class="eg-hero-kicker">
            {{ wedding?.hero?.title || "Save The Date" }}
          </p>

          <h1 class="eg-hero-name">
            {{ wedding?.hero?.groomName || wedding?.groomName }}
          </h1>

          <div class="eg-hero-sep">
            <span></span>

            <i>◆</i>

            <span></span>
          </div>

          <h1 class="eg-hero-name">
            {{ wedding?.hero?.brideName || wedding?.brideName }}
          </h1>

          <div class="eg-hero-datebox">
            {{ heroDateLabel }}
          </div>

          <HeroCountdown
            v-if="wedding?.weddingDate"
            class="eg-hero-countdown"
            :time-wedding="wedding.weddingDate"
          />
        </div>

        <div class="eg-hero-corner tl"></div>
        <div class="eg-hero-corner tr"></div>
        <div class="eg-hero-corner bl"></div>
        <div class="eg-hero-corner br"></div>
      </section>

      <!-- ================= LỜI MỜI ================= -->

      <section class="eg-invite">
        <p class="eg-invite-text">
          Trân trọng kính mời quý khách đến dự buổi tiệc
          sang trọng chào mừng hôn lễ của chúng tôi.
        </p>
      </section>

      <!-- ================= CẶP ĐÔI ================= -->
      <!-- Hai cột chia bằng đường dọc vàng -->

      <section class="eg-couple">
        <header class="eg-section-head">
          <span class="eg-kicker">The Couple</span>

          <h2 class="eg-title">Đôi Uyên Ương</h2>
        </header>

        <div class="eg-couple-grid">
          <!-- Cô dâu -->
          <article class="eg-person">
            <h3 class="eg-person-name">
              {{ wedding?.couple?.bride?.name || wedding?.brideName }}
            </h3>

            <p class="eg-person-role">Cô Dâu</p>

            <div class="eg-parents">
              <p v-if="wedding?.couple?.bride?.father">
                Ông <strong>{{ wedding.couple.bride.father }}</strong>
              </p>

              <p v-if="wedding?.couple?.bride?.mother">
                Bà <strong>{{ wedding.couple.bride.mother }}</strong>
              </p>
            </div>
          </article>

          <div class="eg-couple-divider">
            <i>◆</i>
          </div>

          <!-- Chú rể -->
          <article class="eg-person">
            <h3 class="eg-person-name">
              {{ wedding?.couple?.groom?.name || wedding?.groomName }}
            </h3>

            <p class="eg-person-role">Chú Rể</p>

            <div class="eg-parents">
              <p v-if="wedding?.couple?.groom?.father">
                Ông <strong>{{ wedding.couple.groom.father }}</strong>
              </p>

              <p v-if="wedding?.couple?.groom?.mother">
                Bà <strong>{{ wedding.couple.groom.mother }}</strong>
              </p>
            </div>
          </article>
        </div>
      </section>

      <!-- ================= SỰ KIỆN ================= -->
      <!-- Thẻ deco: viền kép, góc ◆, giờ nổi bật -->

      <section
        v-if="events.length"
        class="eg-events"
      >
        <header class="eg-section-head">
          <span class="eg-kicker">Ceremony</span>

          <h2 class="eg-title">Thông Tin Tiệc</h2>
        </header>

        <div class="eg-event-list">
          <article
            v-for="event in events"
            :key="event.id"
            class="eg-event-card"
          >
            <span class="eg-corner tl">◆</span>
            <span class="eg-corner tr">◆</span>
            <span class="eg-corner bl">◆</span>
            <span class="eg-corner br">◆</span>

            <p class="eg-event-title">
              {{ event.title || "Lễ Thành Hôn" }}
            </p>

            <div class="eg-event-row">
              <div class="eg-event-cell">
                <span class="eg-cell-label">Ngày</span>

                <strong class="eg-cell-value">
                  {{ event.day }}.{{ event.month }}.{{ event.year }}
                </strong>
              </div>

              <div class="eg-event-cell-divider"></div>

              <div class="eg-event-cell">
                <span class="eg-cell-label">Giờ</span>

                <strong class="eg-cell-value">
                  {{ event.time }}
                </strong>
              </div>
            </div>

            <div class="eg-event-place">
              <strong>{{ event.location }}</strong>

              <p>{{ event.address }}</p>
            </div>

            <a
              v-if="event.map"
              class="eg-event-map"
              :href="event.map"
              target="_blank"
              rel="noopener"
            >
              Chỉ Đường
            </a>
          </article>
        </div>
      </section>

      <!-- ================= ALBUM ================= -->
      <!-- Lưới ảnh viền vàng kép -->

      <section
        v-if="gallery.length && wedding?.settings?.showGallery"
        class="eg-gallery"
      >
        <header class="eg-section-head">
          <span class="eg-kicker">GALLERY</span>

          <h2 class="eg-title">Khoảnh Khắc Vàng</h2>
        </header>

        <div class="eg-photo-grid">
          <button
            v-for="(item, index) in gallery.slice(0, 6)"
            :key="item.id ?? index"
            type="button"
            class="eg-photo"
            @click="openGallery(index)"
          >
            <img
              :src="item.image"
              :alt="item.title || 'Ảnh cưới'"
              loading="lazy"
            />
          </button>
        </div>
      </section>

      <!-- ================= HỘP QUÀ ================= -->
      <!-- Nền tối, chữ vàng -->

      <section
        v-if="gifts.length && wedding?.settings?.showGift"
        class="eg-gift"
      >
        <header class="eg-section-head light">
          <span class="eg-kicker">Wishing Well</span>

          <h2 class="eg-title">Hộp Quà Mừng</h2>
        </header>

        <div class="eg-gift-grid">
          <article
            v-for="gift in gifts"
            :key="gift.id"
            class="eg-gift-card"
          >
            <div class="eg-gift-qr">
              <img
                v-if="gift.qrCode"
                :src="gift.qrCode"
                alt=""
              />
            </div>

            <h3 class="eg-gift-bank">
              {{ gift.bankName }}
            </h3>

            <p class="eg-gift-number">
              {{ gift.accountNumber }}
            </p>

            <p class="eg-gift-name">
              {{ gift.accountName }}
            </p>
          </article>
        </div>
      </section>

      <!-- ================= LỜI CHÚC ================= -->

      <section
        v-if="wishes.length && wedding?.settings?.showGuestBook"
        class="eg-wishes"
      >
        <header class="eg-section-head">
          <span class="eg-kicker">Guest Book</span>

          <h2 class="eg-title">Lời Chúc</h2>
        </header>

        <div class="eg-wish-list">
          <blockquote
            v-for="wish in wishes"
            :key="wish.id"
            class="eg-wish"
          >
            <p class="eg-wish-message">
              “{{ wish.message }}”
            </p>

            <footer class="eg-wish-meta">
              — <strong>{{ wish.name }}</strong>

              <small>{{ wish.created_at }}</small>
            </footer>
          </blockquote>
        </div>
      </section>

      <!-- ================= FOOTER ================= -->

      <footer class="eg-footer">
        <div class="eg-footer-mono">
          <span>{{ monogram }}</span>
        </div>

        <p class="pk-footer-message eg-footer-message">
          {{ wedding?.footer?.message }}
        </p>

        <div class="eg-footer-names">
          {{ wedding?.footer?.groomName || wedding?.groomName }}

          <em>&</em>

          {{ wedding?.footer?.brideName || wedding?.brideName }}
        </div>

        <div class="eg-rule">
          <i>◆</i>
        </div>

        <p class="eg-footer-copy">
          © {{ currentYear }} {{ wedding?.footer?.copyright }}
        </p>

        <p class="eg-footer-site">ngaychungdoi.com</p>
      </footer>

      <!-- Nhạc nền nổi -->
      <FloatingMusic
        v-if="wedding?.music?.enabled && wedding?.settings?.showMusic"
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
import HeroCountdown from "@/components/hero/HeroCountdown.vue";

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

/* Monogram: chữ cái đầu tên cô dâu + chú rể */
const monogram = computed(() => {
  const groom = (props.wedding?.groomName || "G").trim().charAt(0);

  const bride = (props.wedding?.brideName || "B").trim().charAt(0);

  return `${groom}&${bride}`.toUpperCase();
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

  return `${weekday} · ${parsed.format("DD.MM.YYYY")}`;
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
    ".wedding-page .eg-invite, .wedding-page .eg-couple, .wedding-page .eg-events, .wedding-page .eg-gallery, .wedding-page .eg-gift, .wedding-page .eg-wishes, .wedding-page .eg-footer"
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
   PALETTE - ELEGANT GOLD
   Phong cách: Art Deco thập niên 1920 (đêm đen & vàng champagne)
========================================================= */

.wedding-page {
  --p-primary: #23201a;
  --p-primary-light: #35301f;
  --p-primary-dark: #15120d;
  --p-gold: #d4af37;
  --p-gold-light: #f3e5c0;
  --p-paper: #f6f1e6;
  --p-ink: #3a332a;
  --p-muted: #8a7d6a;
  --p-deep: #23201a;
  --p-hero-text: #f3e5c0;

  position: relative;

  width: 100%;
  min-height: 100dvh;

  overflow-x: hidden;

  color: var(--p-ink);

  background: linear-gradient(180deg, #26221a 0%, #1c1812 50%, #14110c 100%);
}

/* Họa tiết hình học chìm toàn trang */
.wedding-page::before {
  content: "";

  position: fixed;

  inset: 0;

  z-index: -1;

  pointer-events: none;

  opacity: 0.5;

  background-image: repeating-linear-gradient(
      45deg,
      rgba(212, 175, 55, 0.035) 0px,
      rgba(212, 175, 55, 0.035) 1px,
      transparent 1px,
      transparent 16px
    ),
    repeating-linear-gradient(
      -45deg,
      rgba(212, 175, 55, 0.035) 0px,
      rgba(212, 175, 55, 0.035) 1px,
      transparent 1px,
      transparent 16px
    );
}

/* =========================================================
   MÀN MỞ THIỆP
========================================================= */

.eg-open {
  position: fixed;

  inset: 0;

  z-index: 50;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 24px;

  background: radial-gradient(
      ellipse at 50% 25%,
      rgba(212, 175, 55, 0.14),
      transparent 55%
    ),
    linear-gradient(170deg, #26221a 0%, #17130e 60%, #100d09 100%);
}

.eg-open-frame {
  width: min(100%, 440px);

  padding: 52px 36px;

  text-align: center;

  border: 2px solid rgba(212, 175, 55, 0.65);

  outline: 1px solid rgba(212, 175, 55, 0.3);

  outline-offset: 5px;

  background: rgba(20, 16, 11, 0.88);
}

.eg-monogram {
  width: 84px;
  height: 84px;

  margin: 0 auto 22px;

  display: flex;

  align-items: center;
  justify-content: center;

  transform: rotate(45deg);

  border: 1px solid var(--p-gold);

  background: rgba(212, 175, 55, 0.08);
}

.eg-monogram {
  color: var(--p-gold-light);
}

.eg-monogram {
  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;

  letter-spacing: 0.08em;
}

/* Chữ bên trong xoay ngược lại để đứng thẳng */
.eg-monogram span,
.eg-hero-mono span,
.eg-footer-mono span {
  display: block;

  transform: rotate(-45deg);
}

.eg-open-kicker {
  margin: 0 0 10px;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.42em;
  text-transform: uppercase;

  color: var(--p-gold);
}

.eg-open-names {
  margin: 0 0 18px;

  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 500;

  line-height: 1.3;

  letter-spacing: 0.04em;

  text-transform: uppercase;

  color: var(--p-gold-light);
}

.eg-open-amp {
  display: block;

  font-family: var(--font-script);
  font-size: var(--text-xl);
  font-weight: 400;

  text-transform: none;

  color: var(--p-gold);
}

.eg-rule {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  margin: 0 auto 18px;
}

.eg-rule i {
  font-size: var(--text-xs);

  font-style: normal;

  color: var(--p-gold);
}

.eg-open-date {
  margin: 0 0 28px;

  font-family: var(--font-main);
  font-size: var(--text-sm);

  letter-spacing: 0.14em;

  color: rgba(243, 229, 192, 0.75);
}

.eg-open-button {
  min-height: 46px;

  padding: 0 38px;

  border: 1px solid var(--p-gold);

  background: transparent;

  cursor: pointer;

  color: var(--p-gold-light);

  font-family: var(--font-main);
  font-size: var(--text-sm);
  font-weight: 600;

  letter-spacing: 0.24em;
  text-transform: uppercase;

  transition: background 0.25s ease, color 0.25s ease;
}

.eg-open-button:hover {
  background: var(--p-gold);

  color: #1c1812;
}

/* =========================================================
   HERO ART DECO
========================================================= */

.eg-hero {
  position: relative;

  width: 100%;

  min-height: 100dvh;

  display: flex;

  align-items: center;
  justify-content: center;

  overflow: hidden;

  isolation: isolate;

  background: radial-gradient(
      ellipse at 50% 30%,
      rgba(212, 175, 55, 0.1),
      transparent 55%
    ),
    linear-gradient(180deg, #26221a 0%, #191510 100%);
}

/* Tia nắng Art Deco phía trên - quay chậm bằng transform (GPU) */
.eg-hero-rays {
  position: absolute;

  top: -40%;

  left: 50%;

  width: 140vw;

  height: 140vw;

  margin-left: -70vw;

  z-index: -1;

  border-radius: 50%;

  background-image: repeating-conic-gradient(
    from 250deg at 50% 50%,
    rgba(212, 175, 55, 0.05) 0deg 4deg,
    transparent 4deg 12deg
  );

  opacity: 0.9;

  animation: egRaysSpin 160s linear infinite;

  will-change: transform;
}

@keyframes egRaysSpin {

  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }

}

@media (prefers-reduced-motion: reduce) {
  .eg-hero-rays {
    animation: none;
  }
}

.eg-hero-body {
  width: min(100%, 520px);

  padding: 110px 24px 90px;

  text-align: center;

  color: var(--p-hero-text);

  animation: egFadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes egFadeUp {

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
  .eg-hero-body {
    animation: none;
  }
}

.eg-hero-mono {
  width: 74px;
  height: 74px;

  margin: 0 auto 26px;

  display: flex;

  align-items: center;
  justify-content: center;

  transform: rotate(45deg);

  border: 1px solid var(--p-gold);

  background: rgba(212, 175, 55, 0.07);

  font-family: var(--font-heading);
  font-size: var(--text-md);
  font-weight: 600;

  letter-spacing: 0.06em;

  color: var(--p-gold-light);
}

.eg-hero-kicker {
  display: block;

  margin-bottom: 22px;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.44em;
  text-transform: uppercase;

  color: var(--p-gold);
}

.eg-hero-name {
  margin: 0;

  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 500;

  line-height: 1.15;

  letter-spacing: 0.1em;

  text-transform: uppercase;
}

.eg-hero-sep {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 14px;

  margin: 18px auto;
}

.eg-hero-sep span {
  width: 70px;

  height: 1px;

  background: linear-gradient(
    90deg,
    transparent,
    var(--p-gold),
    transparent
  );
}

.eg-hero-sep i {
  font-size: var(--text-xs);

  font-style: normal;

  color: var(--p-gold);
}

.eg-hero-datebox {
  display: inline-block;

  margin-top: 24px;

  padding: 12px 28px;

  border-top: 1px solid var(--p-gold);

  border-bottom: 1px solid var(--p-gold);

  font-family: var(--font-main);
  font-size: var(--text-sm);

  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.eg-hero-countdown {
  margin-top: 34px;
}

/* Góc quạt Art Deco */
.eg-hero-corner {
  position: absolute;

  width: 64px;
  height: 64px;

  z-index: 0;

  pointer-events: none;

  opacity: 0.7;
}

.eg-hero-corner.tl {
  top: 18px;
  left: 18px;

  border-top: 2px solid var(--p-gold);
  border-left: 2px solid var(--p-gold);
}

.eg-hero-corner.tr {
  top: 18px;
  right: 18px;

  border-top: 2px solid var(--p-gold);
  border-right: 2px solid var(--p-gold);
}

.eg-hero-corner.bl {
  bottom: 18px;
  left: 18px;

  border-bottom: 2px solid var(--p-gold);
  border-left: 2px solid var(--p-gold);
}

.eg-hero-corner.br {
  bottom: 18px;
  right: 18px;

  border-bottom: 2px solid var(--p-gold);
  border-right: 2px solid var(--p-gold);
}

/* =========================================================
   SECTION HEAD CHUNG
========================================================= */

.eg-section-head {
  margin-bottom: 36px;

  text-align: center;
}

.eg-section-head.light .eg-title {
  color: var(--p-gold-light);
}

.eg-kicker {
  display: block;

  margin-bottom: 10px;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.42em;
  text-transform: uppercase;

  color: var(--p-gold);
}

.eg-title {
  margin: 0;

  font-family: var(--font-heading);
  font-size: var(--text-3xl);
  font-weight: 500;

  line-height: 1.15;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  color: var(--p-primary-dark);
}

/* =========================================================
   LỜI MỜI
========================================================= */

.eg-invite {
  max-width: 560px;

  margin: 0 auto;

  padding: 70px 24px 40px;

  text-align: center;
}

.eg-invite-text {
  margin: 0;

  padding: 26px 30px;

  border-top: 1px solid rgba(212, 175, 55, 0.45);

  border-bottom: 1px solid rgba(212, 175, 55, 0.45);

  font-family: var(--font-main);
  font-size: var(--text-lg);

  line-height: 1.9;

  color: var(--p-muted);
}

/* =========================================================
   CẶP ĐÔI - HAI CỘT
========================================================= */

.eg-couple {
  max-width: 760px;

  margin: 0 auto;

  padding: 40px 24px 60px;
}

.eg-couple-grid {
  display: grid;

  grid-template-columns: 1fr auto 1fr;

  align-items: stretch;

  gap: 20px;
}

.eg-person {
  padding: 10px 6px;

  text-align: center;
}

.eg-person-name {
  margin: 0 0 8px;

  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 600;

  letter-spacing: 0.05em;

  text-transform: uppercase;

  color: var(--p-primary-dark);
}

.eg-person-role {
  margin: 0 0 16px;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.32em;
  text-transform: uppercase;

  color: var(--p-gold);
}

.eg-parents p {
  margin: 4px 0;

  font-family: var(--font-main);
  font-size: var(--text-sm);

  color: var(--p-muted);
}

.eg-parents strong {
  color: var(--p-ink);

  font-weight: 600;
}

.eg-couple-divider {
  display: flex;

  align-items: center;

  justify-content: center;
}

.eg-couple-divider i {
  font-size: var(--text-xs);

  font-style: normal;

  color: var(--p-gold);
}

@media (max-width: 600px) {
  .eg-couple-grid {
    grid-template-columns: 1fr;
  }

  .eg-couple-divider {
    padding: 6px 0;
  }
}

/* =========================================================
   SỰ KIỆN - THẺ DECO
========================================================= */

.eg-events {
  max-width: 720px;

  margin: 0 auto;

  padding: 30px 24px 60px;
}

.eg-event-list {
  display: flex;

  flex-direction: column;

  gap: 26px;
}

.eg-event-card {
  position: relative;

  padding: 34px 28px 30px;

  text-align: center;

  background: var(--p-paper);

  border: 1px solid rgba(212, 175, 55, 0.5);

  outline: 1px solid rgba(212, 175, 55, 0.25);

  outline-offset: 4px;

  box-shadow: 0 16px 44px rgba(15, 12, 8, 0.35);
}

.eg-corner {
  position: absolute;

  font-size: var(--text-xs);

  font-style: normal;

  color: var(--p-gold);
}

.eg-corner.tl {
  top: 8px;
  left: 10px;
}

.eg-corner.tr {
  top: 8px;
  right: 10px;
}

.eg-corner.bl {
  bottom: 8px;
  left: 10px;
}

.eg-corner.br {
  bottom: 8px;
  right: 10px;
}

.eg-event-title {
  margin: 0 0 20px;

  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;

  letter-spacing: 0.14em;
  text-transform: uppercase;

  color: var(--p-primary-dark);
}

.eg-event-row {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 22px;

  margin-bottom: 20px;
}

.eg-event-cell {
  display: flex;

  flex-direction: column;

  gap: 4px;
}

.eg-cell-label {
  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.28em;
  text-transform: uppercase;

  color: var(--p-gold);
}

.eg-cell-value {
  font-family: var(--font-heading);
  font-size: var(--text-xl);
  font-weight: 600;

  color: var(--p-ink);
}

.eg-event-cell-divider {
  width: 1px;

  height: 44px;

  background: linear-gradient(
    180deg,
    transparent,
    rgba(212, 175, 55, 0.6),
    transparent
  );
}

.eg-event-place strong {
  display: block;

  margin-bottom: 4px;

  font-family: var(--font-heading);
  font-size: var(--text-md);
  font-weight: 600;

  color: var(--p-ink);
}

.eg-event-place p {
  margin: 0 0 16px;

  font-family: var(--font-main);
  font-size: var(--text-sm);

  line-height: 1.6;

  color: var(--p-muted);
}

.eg-event-map {
  display: inline-block;

  padding: 10px 26px;

  border: 1px solid var(--p-primary-dark);

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.22em;
  text-transform: uppercase;

  color: var(--p-primary-dark);

  text-decoration: none;

  transition: background 0.25s ease, color 0.25s ease;
}

.eg-event-map:hover {
  background: var(--p-primary-dark);

  color: var(--p-gold-light);
}

/* =========================================================
   ALBUM - VIỀN KÉP
========================================================= */

.eg-gallery {
  max-width: 780px;

  margin: 0 auto;

  padding: 30px 24px 60px;
}

.eg-photo-grid {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 16px;
}

.eg-photo {
  padding: 6px;

  border: 0;

  cursor: pointer;

  background: transparent;

  border: 1px solid rgba(212, 175, 55, 0.55);

  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.eg-photo img {
  display: block;

  width: 100%;

  aspect-ratio: 1 / 1;

  object-fit: cover;

  filter: sepia(0.12) saturate(0.92);

  transition: filter 0.3s ease;
}

.eg-photo:hover {
  transform: translateY(-4px);

  box-shadow: 0 16px 40px rgba(15, 12, 8, 0.4);
}

.eg-photo:hover img {
  filter: none;
}

@media (min-width: 700px) {
  .eg-photo-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* =========================================================
   HỘP QUÀ - NỀN TỐI
========================================================= */

.eg-gift {
  padding: 56px 24px;

  background: linear-gradient(180deg, #201c15 0%, #17130e 100%);
}

.eg-gift-grid {
  display: flex;

  flex-wrap: wrap;

  justify-content: center;

  gap: 24px;
}

.eg-gift-card {
  width: min(100%, 260px);

  padding: 28px 24px;

  text-align: center;

  border: 1px solid rgba(212, 175, 55, 0.45);

  background: rgba(212, 175, 55, 0.04);
}

.eg-gift-qr {
  width: 150px;
  height: 150px;

  margin: 0 auto 16px;

  padding: 8px;

  background: var(--p-paper);
}

.eg-gift-qr img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.eg-gift-bank {
  margin: 0 0 6px;

  font-family: var(--font-heading);
  font-size: var(--text-lg);
  font-weight: 600;

  letter-spacing: 0.06em;

  color: var(--p-gold-light);
}

.eg-gift-number {
  margin: 0 0 4px;

  font-family: var(--font-heading);
  font-size: var(--text-md);
  font-weight: 700;

  letter-spacing: 0.1em;

  color: var(--p-gold);
}

.eg-gift-name {
  margin: 0;

  font-family: var(--font-main);
  font-size: var(--text-xs);

  letter-spacing: 0.14em;
  text-transform: uppercase;

  color: rgba(243, 229, 192, 0.65);
}

/* =========================================================
   LỜI CHÚC
========================================================= */

.eg-wishes {
  max-width: 680px;

  margin: 0 auto;

  padding: 50px 24px 70px;
}

.eg-wish-list {
  display: flex;

  flex-direction: column;

  gap: 16px;
}

.eg-wish {
  margin: 0;

  padding: 22px 26px;

  background: rgba(246, 241, 230, 0.05);

  border: 1px solid rgba(212, 175, 55, 0.25);
}

.eg-wish-message {
  margin: 0 0 10px;

  font-family: var(--font-main);
  font-size: var(--text-md);
  font-style: italic;

  line-height: 1.75;

  color: var(--p-gold-light);
}

.eg-wish-meta {
  font-family: var(--font-main);
  font-size: var(--text-xs);

  color: rgba(243, 229, 192, 0.6);
}

.eg-wish-meta strong {
  font-family: var(--font-heading);
  font-size: var(--text-sm);

  color: var(--p-gold);
}

/* =========================================================
   FOOTER
========================================================= */

.eg-footer {
  padding: 70px 24px 60px;

  text-align: center;

  background: linear-gradient(180deg, #17130e 0%, #100d09 100%);

  color: var(--p-gold-light);
}

.eg-footer-mono {
  width: 62px;
  height: 62px;

  margin: 0 auto 22px;

  display: flex;

  align-items: center;
  justify-content: center;

  transform: rotate(45deg);

  border: 1px solid var(--p-gold);

  font-family: var(--font-heading);
  font-size: var(--text-sm);
  font-weight: 600;

  color: var(--p-gold-light);
}

.eg-footer-message {
  max-width: 520px;

  margin: 0 auto 30px;

  font-family: var(--font-main);
  font-size: var(--text-md);
  font-style: italic;

  line-height: 1.9;

  opacity: 0.85;
}

.eg-footer-names {
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  font-weight: 500;

  letter-spacing: 0.08em;

  text-transform: uppercase;
}

.eg-footer-names em {
  font-family: var(--font-script);
  font-size: var(--text-xl);
  font-weight: 400;

  text-transform: none;

  color: var(--p-gold);
}

.eg-footer-copy {
  margin: 18px 0 6px;

  font-family: var(--font-main);
  font-size: var(--text-xs);

  letter-spacing: 0.1em;

  opacity: 0.7;
}

.eg-footer-site {
  margin: 0;

  font-family: var(--font-main);
  font-size: var(--text-xs);
  font-weight: 600;

  letter-spacing: 0.34em;
  text-transform: uppercase;

  color: var(--p-gold);

  opacity: 0.7;
}

/* =========================================================
   REVEAL ON SCROLL
========================================================= */

.eg-invite,
.eg-couple,
.eg-events,
.eg-gallery,
.eg-gift,
.eg-wishes,
.eg-footer {
  opacity: 0;

  transform: translateY(24px);

  /* Chỉ opacity + transform -> GPU mượt */
  transition: opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}

.eg-invite.is-visible,
.eg-couple.is-visible,
.eg-events.is-visible,
.eg-gallery.is-visible,
.eg-gift.is-visible,
.eg-wishes.is-visible,
.eg-footer.is-visible {
  opacity: 1;

  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .eg-invite,
  .eg-couple,
  .eg-events,
  .eg-gallery,
  .eg-gift,
  .eg-wishes,
  .eg-footer {
    opacity: 1;

    transform: none;

    transition: none;
  }
}
</style>