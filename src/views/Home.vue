<template>
  <div class="home-page">
    <!-- Màn hình mở thiệp -->
    <OpenInvitation v-if="!opened" @open="handleOpen" />

    <!-- Nội dung chính -->
    <template v-else>
      <HeroSection />
      <HighlightsSection />
      <GallerySection />
      <EventSection />
      <MapSection />
      <GuestBookSection />
      <GiftSection />
      <FooterSection />
      <ScrollTop />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useWedding } from "./../composables/useWedding";
import OpenInvitation from "./../components/hero/OpenInvitation.vue";
import HeroSection from "./../components/hero/HeroSection.vue";
import HighlightsSection from "./../components/common/HighlightsSection.vue";
import ScrollTop from "./../components/common/ScrollTop.vue";
import GallerySection from "./../components/gallery/GallerySection.vue";
import EventSection from "./../components/event/EventSection.vue";
import MapSection from "./../components/map/MapSection.vue";
import GiftSection from "./../components/gift/GiftSection.vue";
import GuestBookSection from "./../components/guestbook/GuestBookSection.vue";
import FooterSection from "./../components/footer/FooterSection.vue";

const opened = ref(false);
const { loadWedding } = useWedding();

onMounted(async () => {
  await loadWedding();
});

function handleOpen() {
  opened.value = true;
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  overflow-x: hidden;
  background: linear-gradient(180deg, #fff8f6 0%, #fffdfc 100%);
}
</style>
