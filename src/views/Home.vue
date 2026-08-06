<template>
  <div class="home-page">
    <!-- Màn hình mở thiệp -->
    <div v-if="!opened" class="open-wrapper">
      <OpenInvitation @open="handleOpen" />
    </div>

    <!-- Nội dung -->
    <template v-else>
      <!-- Hero -->
      <HeroSection />

      <!-- Nội dung -->
      <main class="content-wrapper">
        <HighlightsSection />
        <GallerySection />
        <EventSection />
        <MapSection />
        <GuestBookSection />
        <GiftSection />
        <FooterSection />
      </main>

      <ScrollTop />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useWeddingStore } from "@/stores/wedding";

import OpenInvitation from "@/components/hero/OpenInvitation.vue";
import HeroSection from "@/components/hero/HeroSection.vue";

import HighlightsSection from "@/components/common/HighlightsSection.vue";
import GallerySection from "@/components/gallery/GallerySection.vue";
import EventSection from "@/components/event/EventSection.vue";
import MapSection from "@/components/map/MapSection.vue";
import GuestBookSection from "@/components/guestbook/GuestBookSection.vue";
import GiftSection from "@/components/gift/GiftSection.vue";
import FooterSection from "@/components/footer/FooterSection.vue";
import ScrollTop from "@/components/common/ScrollTop.vue";

const opened = ref(false);
const weddingStore = useWeddingStore();

onMounted(async () => {
  await weddingStore.loadWedding();
});

const handleOpen = () => {
  opened.value = true;
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  overflow-x: hidden;
}

/* Căn giữa OpenInvitation */
.open-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* Khung giấy */
.content-wrapper {
  width: min(95%, 800px);
  margin: -40px auto 0;
  position: relative;
  z-index: 2;

  background: #9c0d20;
  border-radius: 40px 40px 0 0;

  overflow: hidden;
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.18);
}

/* Responsive */
@media (max-width: 768px) {
  .content-wrapper {
    width: min(98%, 100%);
    margin: -30px auto 0;
    border-radius: 30px 30px 0 0;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    width: 100%;
    margin: -20px auto 0;
    border-radius: 25px 25px 0 0;
  }
}

/* Texture giấy */
.content-wrapper::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url("/images/paper-texture.png") center/cover;
  opacity: 0.12;
  pointer-events: none;
}

/* Các section */
.content-wrapper > section {
  position: relative;
  z-index: 2;
}
</style>