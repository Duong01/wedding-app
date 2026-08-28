<template>
  <div class="wedding-page" :data-theme="theme.Name" :style="themeStyle">
    <!-- =====================================================
         OPEN INVITATION
    ====================================================== -->

    <div v-if="!opened" class="open-wrapper">
      <OpenInvitation :wedding="wedding" @open="handleOpen" />
    </div>

    <!-- =====================================================
         WEDDING
    ====================================================== -->

    <template v-else>
      <!--
        KHUNG THIỆP
        Desktop: giống màn hình điện thoại
        Mobile: full width
      -->
      <div class="invitation-device">
        <!-- ================= HERO ================= -->

        <HeroSection
          v-if="wedding?.hero"
          :hero="wedding.hero"
          :recipientName="wedding.recipientName"
          class="section-reveal hero-reveal"
        />

        <!-- ================= CONTENT ================= -->

        <main class="invitation-content">
          <div class="bg-content">
            <section class="section-reveal">
              <HighlightsSection
                v-if="wedding?.couple"
                :couple="wedding.couple"
                :events="wedding.events"
                
              />
            </section>

            <section
              v-if="wedding?.gallery?.length && wedding?.settings?.ShowGallery"
              class="section-reveal"
            >
              <GallerySection :gallery="wedding.gallery" />
            </section>

            <section v-if="wedding?.settings?.ShowEvents" class="section-reveal">
              <EventSection :events="wedding.events" />
            </section>
          </div>
          <section
            v-if="wedding?.settings?.ShowMap"
            class="section-reveal"
          >
            <MapSection :events="wedding.events" />
          </section>  

          <section
          v-if="wedding?.settings?.ShowTimeline && wedding?.events.length"
          class="section-reveal"
          >

            <Timeline
              :timeline="wedding.timeline"
              :events="wedding.events"
              :countdown="wedding.countdown"
              :settings="wedding.settings"
            />

          </section>

          <section
            v-if="
              wedding?.settings?.ShowGuestBook && wedding?.guestBook?.Enabled
            "
            class="section-reveal"
          >
            <GuestBookSection :guest-book="wedding.guestBook" />
          </section>

          <section
            v-if="wedding?.settings?.ShowGift && wedding?.gifts?.length"
            class="section-reveal"
          >
            <GiftSection :gifts="wedding.gifts" />
          </section>

          <section v-if="wedding?.footer" class="section-reveal">
            <FooterSection :footer="wedding.footer" />
          </section>
        </main>
      </div>

      <!-- Floating music nằm ngoài thiệp -->
      <FloatingMusic
        v-if="wedding?.music?.Enabled && wedding?.settings?.ShowMusic"
        ref="floatingMusicRef"
        :music="wedding.music"
      />
    </template>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onBeforeUnmount, ref } from "vue";

import OpenInvitation from "@/components/hero/OpenInvitation.vue";
import HeroSection from "@/components/hero/HeroSection.vue";
import HighlightsSection from "@/components/common/HighlightsSection.vue";
import GallerySection from "@/components/gallery/GallerySection.vue";
import EventSection from "@/components/event/EventSection.vue";
import MapSection from "@/components/map/MapSection.vue";
import Timeline from "@/components/timeline/TimelineSection.vue";
import GuestBookSection from "@/components/guestbook/GuestBookSection.vue";
import GiftSection from "@/components/gift/GiftSection.vue";
import FooterSection from "@/components/footer/FooterSection.vue";
import FloatingMusic from "@/components/common/FloatingMusic.vue";

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

let observer = null;

const initScrollAnimation = () => {
  const elements = document.querySelectorAll(".wedding-page .section-reveal");

  if (!elements.length) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          // Chỉ chạy một lần
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

const handleOpen = async () => {
  opened.value = true;

  await nextTick();

  if (
    floatingMusicRef.value &&
    typeof floatingMusicRef.value.play === "function"
  ) {
    await floatingMusicRef.value.play();
  }

  requestAnimationFrame(() => {
    initScrollAnimation();
  });
};

onMounted(() => {
  if (opened.value) {
    nextTick(() => {
      initScrollAnimation();
    });
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<style scoped>
/* =========================================================
   PAGE - NỀN TOÀN BỘ THIỆP
========================================================= */
.bg-content {
  position: relative;

  background: url("@/assets/bg-frame.jpg") center / cover;

  border: 1px solid rgba(231, 193, 119, .55);

  border-radius: 16px;

  /*
   * Viền ngoài + viền trong rất nhẹ
   */
  box-shadow:
    0 0 0 1px rgba(123, 13, 13, .65),
    0 0 0 4px rgba(231, 193, 119, .07),
    0 10px 35px rgba(35, 5, 5, .18),
    inset 0 0 0 1px rgba(255, 227, 177, .10);

  overflow: hidden;

}

.wedding-page {
  /* =====================================================
     PALETTE - Á ĐÔNG (đỏ son & vàng kim)
     ===================================================== */
  --p-primary: #7b0d0d;
  --p-primary-light: #861313;
  --p-primary-dark: #65090c;
  --p-gold: #c79d5c;
  --p-gold-light: #ffe3b1;
  --p-paper: #f8f5ed;
  --p-ink: #4f4039;
  --p-muted: #80665b;
  --p-deep: #7b0d0d;
  --p-line: rgba(123, 13, 13, 0.18);
  --p-accent-soft: linear-gradient(135deg, #fff0e8, #fbe4d6);
  --p-on-bg: #fff0f3;
  --p-on-bg-muted: rgba(255, 240, 243, 0.85);
  --p-hero-1: #8d1115;
  --p-hero-2: #7b0d0d;
  --p-hero-3: #69090c;
  --p-hero-glow: rgba(174, 43, 43, 0.35);
  --p-hero-text: #f7d8a3;

  position: relative;

  width: 100%;
  min-height: 100dvh;

  overflow-x: hidden;

  color: var(--text);
  
}

/* =========================================================
   HOA VĂN TOÀN BỘ THIỆP
========================================================= */

/*
 * Đây là lớp hoa văn chính.
 *
 * Nếu rong-phuong.webp chứa cả rồng + phượng:
 * dùng trực tiếp file này.
 */

.wedding-page::before {
  content: "";

  position: fixed;

  inset: 0;

  z-index: -1;

  pointer-events: none;

  background-image: url("@/assets/rong-phuong.webp");

  background-repeat: repeat-y;

  background-position: center top;

  background-size: 430px auto;

  opacity: 0.1;

  /* Bỏ mix-blend-mode + filter để tránh repaint nặng khi lăn */
}

/*
 * Lớp ánh sáng nhẹ ở giữa.
 */
.wedding-page::after {
  content: "";

  position: fixed;

  inset: 0;

  z-index: -1;

  pointer-events: none;

  background: radial-gradient(
      ellipse at center 25%,
      rgba(190, 60, 55, 0.16),
      transparent 58%
    ),
    linear-gradient(
      90deg,
      rgba(45, 0, 0, 0.14),
      transparent 20%,
      transparent 80%,
      rgba(45, 0, 0, 0.14)
    );

  opacity: 0.9;
}

/* =========================================================
   OPEN INVITATION
========================================================= */

.open-wrapper {
  position: relative;

  width: 100%;
  min-height: 100dvh;

  display: flex;

  align-items: center;
  justify-content: center;
}

/* =========================================================
   KHUNG THIỆP
========================================================= */

.invitation-device {
  position: relative;

  width: 900px;
  max-width: 100%;

  min-height: 100vh;

  margin: 0 auto;

  /*
   * KHÔNG padding ở đây
   *
   * Padding phải nằm ở invitation-content
   */
  padding: 0;

  background:
    linear-gradient(
      180deg,
      var(--p-primary) 0%,
      var(--p-primary-dark) 100%
    );

  color: var(--text);

  overflow: hidden;

  isolation: isolate;

  box-shadow:
    0 0 0 1px rgba(100, 45, 20, 0.15),
    0 12px 35px rgba(50, 20, 10, 0.18),
    0 35px 100px rgba(50, 20, 10, 0.22);
}

/* =========================================================
   HOA VĂN TRONG THIỆP
========================================================= */

.invitation-device::before {
  content: "";

  position: absolute;

  inset: 0;

  z-index: 0;

  pointer-events: none;

  background-image: url("@/assets/rong-phuong.webp");

  background-repeat: repeat-y;

  background-position: center top;

  background-size: 100% auto;

  opacity: 0.10;
}
/* =========================================================
   HERO
   FULL MÀN HÌNH
========================================================= */

.invitation-device > .hero-section {
  position: relative;

  z-index: 1;

  width: 100%;

  min-height: 100dvh;

  height: 100dvh;
}

/* =========================================================
   CONTENT
========================================================= */

.invitation-content {
  position: relative;

  z-index: 1;

  width: 100%;

  min-height: 100vh;

  background: transparent;

  color: var(--text);

  overflow: visible;
}

/* =========================================================
   HOA VĂN CONTENT
========================================================= */

.invitation-content::before {
  content: "";

  position: absolute;

  inset: 0;

  z-index: -1;

  pointer-events: none;

  background-image: url("@/assets/rong-phuong.webp");

  background-repeat: repeat-y;

  background-position: center top;

  background-size: 430px auto;

  opacity: 0.085;
}

/* =========================================================
   LỚP TỐI NHẸ
========================================================= */

.invitation-content::after {
  content: "";

  position: absolute;

  inset: 0;

  z-index: -1;

  pointer-events: none;

  background: linear-gradient(
    180deg,
    rgba(120, 10, 14, 0.15),
    rgba(80, 4, 7, 0.18)
  );
}

/* =========================================================
   CÁC SECTION
========================================================= */

.invitation-content > section {
  position: relative;

  z-index: 2;

  width: 100%;

  margin: 0 auto 24px;

  /*
   * Có khoảng trống để nhìn thấy nền phía sau.
   */
  padding: 0;

  background: transparent;
}

/* =========================================================
   KHỐI NỘI DUNG BÊN TRONG
========================================================= */

/*
 * Không ép tất cả component thành background đỏ riêng.
 *
 * Đây là điểm rất quan trọng.
 */

.invitation-content > section :deep(.section),
.invitation-content > section :deep(.wedding-info),
.invitation-content > section :deep(.invitation-section),
.invitation-content > section :deep(.gallery-section) {
  position: relative;

  background: transparent;

  box-shadow: none;

  border-radius: 0;
}

/* =========================================================
   XÓA NỀN CÁC COMPONENT PHỔ BIẾN
========================================================= */

.invitation-content > section :deep(.gallery-section),
.invitation-content > section :deep(.invitation-section),
.invitation-content > section :deep(.event-section),
.invitation-content > section :deep(.map-section),
.invitation-content > section :deep(.guestbook-section),
.invitation-content > section :deep(.gift-section),
.invitation-content > section :deep(.footer-section) {
  background: transparent !important;
}

/* =========================================================
   TẠO CHIỀU SÂU
========================================================= */

/*
 * Mỗi section được "co" vào giữa.
 *
 * Phần nền đỏ xung quanh vẫn nhìn thấy.
 */

.invitation-content > section {
  padding-left: 12px;
  padding-right: 12px;
}

/* =========================================================
   REVEAL
========================================================= */

.section-reveal {
  opacity: 0;

  transform: translateY(24px);

  /* Chỉ opacity + transform -> chạy GPU, không giật lag */
  transition: opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
}

.section-reveal.is-visible {
  opacity: 1;

  transform: translateY(0);
}

/* =========================================================
   HERO REVEAL
========================================================= */

.hero-reveal {
  opacity: 1;

  transform: none;

  filter: none;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 768px) {

  .invitation-device {
    width: 900px;
    padding-inline: 20px;
    margin: 0 auto;

    border-radius: 0;
  }

  .invitation-content > section {
    padding-left: 10px;
    padding-right: 10px;

  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 767px) {
  .wedding-page {
    background: linear-gradient(
      180deg,
      var(--p-primary) 0%,
      var(--p-primary-dark) 50%,
      var(--p-primary-dark) 100%
    );
  }
  .invitation-device {
    width: 100%;

    max-width: none;
    padding-inline: 20px;
    min-height: 100dvh;

    margin: 0;

    box-shadow: none;

    border-radius: 0;
  }

  .invitation-device > .hero-section {
    min-height: 100dvh;

    height: 100dvh;
  }

  .invitation-content > section {
    padding-left: 8px;

    padding-right: 8px;

    margin-bottom: 22px;
  }

  .invitation-device::before,
  .invitation-content::before {
    background-size: 420px auto;

    opacity: 0.065;
  }
}

/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 380px) {
  .invitation-content {
    padding-left: 6px;

    padding-right: 6px;
  }

  .invitation-content > section {
    padding-left: 6px;

    padding-right: 6px;
  }

  .invitation-device::before,
  .invitation-content::before {
    background-size: 360px auto;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .section-reveal {
    opacity: 1;

    transform: none;

    transition: none;
  }
}
</style>
