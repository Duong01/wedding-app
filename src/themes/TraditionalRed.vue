<template>
  <div class="wedding-page" :data-theme="theme.name" :style="themeStyle">
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
              v-if="wedding?.gallery?.length && wedding?.settings?.showGallery"
              class="section-reveal"
            >
              <GallerySection :gallery="wedding.gallery" />
            </section>

            <section v-if="wedding?.events?.length" class="section-reveal">
              <EventSection :events="wedding.events" />
            </section>
          </div>
          <section
            v-if="wedding?.events?.length && wedding?.settings?.showMap"
            class="section-reveal"
          >
            <MapSection :events="wedding.events" />
          </section>

          <section
            v-if="
              wedding?.settings?.showGuestBook && wedding?.guestBook?.enabled
            "
            class="section-reveal"
          >
            <GuestBookSection :guest-book="wedding.guestBook" />
          </section>

          <section
            v-if="wedding?.settings?.showGift && wedding?.gifts?.length"
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
        v-if="wedding?.music?.enabled && wedding?.settings?.showMusic"
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
  background: url("@/assets/bg-frame.jpg") center / cover;
}
.wedding-page {
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

  opacity: 0.085;

  mix-blend-mode: screen;

  filter: brightness(0.75) contrast(0.9);
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
   * QUAN TRỌNG:
   * Không dùng background trắng.
   * Toàn bộ thiệp dùng nền đỏ.
   */
  background: linear-gradient(
    180deg,
    rgba(125, 13, 16, 0.98),
    rgba(105, 8, 11, 0.98)
  );

  box-shadow: 0 0 0 1px rgba(100, 45, 20, 0.15),
    0 12px 35px rgba(50, 20, 10, 0.18), 0 35px 100px rgba(50, 20, 10, 0.22);

  overflow: hidden;

  isolation: isolate;
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

  background-size: 430px auto;

  opacity: 0.075;

  mix-blend-mode: screen;
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

  opacity: 0.07;

  mix-blend-mode: screen;
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

  transform: translateY(35px);

  filter: blur(5px);

  transition: opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    transform 1s cubic-bezier(0.22, 1, 0.36, 1), filter 0.9s ease;
}

.section-reveal.is-visible {
  opacity: 1;

  transform: translateY(0);

  filter: blur(0);
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
  .wedding-page {
    padding-bottom: 70px;
  }

  .invitation-device {
    width: 900px;
    padding-inline: 20px;
    margin: 0 auto;

    border-radius: 0;
  }

  .invitation-content {
    padding: 35px 12px 90px;
  }

  .invitation-content > section {
    padding-left: 10px;
    padding-right: 10px;

    margin-bottom: 30px;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 767px) {
  .wedding-page {
    background: linear-gradient(180deg, #7d0d10 0%, #720a0d 50%, #69080b 100%);
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

  .invitation-content {
    padding: 20px 8px 70px;
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

    filter: none;

    transition: none;
  }
}
</style>
