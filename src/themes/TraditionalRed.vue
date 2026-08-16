<template>
  <div class="wedding-page" :data-theme="theme.name" :style="themeStyle">
    <!-- OPEN -->

    <div v-if="!opened" class="open-wrapper">
      <OpenInvitation :wedding="wedding" @open="handleOpen" />
    </div>

    <!-- WEDDING -->

    <template v-else>
      <FloatingMusic
        v-if="wedding?.music?.enabled && wedding?.settings?.showMusic"
        ref="floatingMusicRef"
        :music="wedding.music"
      />

      <HeroSection v-if="wedding?.hero" :hero="wedding.hero" />

      <main class="content-wrapper">
        <HighlightsSection
          v-if="wedding?.couple"
          :couple="wedding.couple"
          :events="wedding.events"
        />

        <GallerySection
          v-if="wedding?.gallery?.length && wedding?.settings?.showGallery"
          :gallery="wedding.gallery"
        />

        <EventSection v-if="wedding?.events?.length" :events="wedding.events" />

        <MapSection
          v-if="wedding?.events?.length && wedding?.settings?.showMap"
          :events="wedding.events"
        />

        <GuestBookSection
          v-if="wedding?.settings?.showGuestBook && wedding?.guestBook?.enabled"
          :guest-book="wedding.guestBook"
        />

        <GiftSection
          v-if="wedding?.settings?.showGift && wedding?.gifts?.length"
          :gifts="wedding.gifts"
        />

        <FooterSection v-if="wedding?.footer" :footer="wedding.footer" />
      </main>
    </template>
  </div>
</template>
<script setup>
import { nextTick, ref } from "vue";

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

const handleOpen = async () => {
  opened.value = true;

  await nextTick();

  if (
    floatingMusicRef.value &&
    typeof floatingMusicRef.value.play === "function"
  ) {
    await floatingMusicRef.value.play();
  }
};
</script>
<style scoped>
.wedding-page {
  width: 100%;

  min-height: 100vh;

  background: var(--background);

  color: var(--text);

  font-family: var(--font-main);

  font-size: 16px;

  line-height: 1.6;

  overflow-x: hidden;

  -webkit-font-smoothing: antialiased;
}

/* =========================================================
   GLOBAL
========================================================= */

.wedding-page *,
.wedding-page *::before,
.wedding-page *::after {
  box-sizing: border-box;
}

.wedding-page h1,
.wedding-page h2,
.wedding-page h3,
.wedding-page h4,
.wedding-page h5,
.wedding-page h6 {
  font-family: var(--font-heading);
}

.wedding-page button,
.wedding-page input,
.wedding-page textarea {
  font-family: var(--font-main);
}

/* =========================================================
   CONTENT
========================================================= */

.content-wrapper {
  position: relative;

  width: 100%;
  max-width: 900px;

  margin: 0 auto;

  padding: 70px 30px 80px;

  color: var(--text);

  text-align: center;

  overflow: hidden;

  background:
    linear-gradient(
      180deg,
      rgba(255, 253, 249, 0.96),
      rgba(255, 248, 244, 0.96)
    );
}

/* Chữ 囍 trang trí phía sau */
.content-wrapper::before {
  content: "";

  position: absolute;

  inset: 0;

  background-image: url("@/assets/chu-hy.webp");

  background-repeat: no-repeat;

  background-position: center;

  background-size: 260px auto;

  opacity: 0.08;

  pointer-events: none;

  z-index: 0;
}

/* Nội dung nằm trên hình */
.content-wrapper > * {
  position: relative;

  z-index: 1;
}

/* =========================================================
   SECTION
========================================================= */

.content-wrapper > :deep(section) {
  width: 100%;

  max-width: var(--content-width);

  margin-left: auto;

  margin-right: auto;
}

/* =========================================================
   OPEN
========================================================= */

.open-wrapper {
  width: 100%;

  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  background: var(--background);

  color: var(--text);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .wedding-page {
    font-size: 15px;
  }
}
</style>