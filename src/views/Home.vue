<template>
  <div class="home-page">
    <!-- Màn hình mở thiệp -->
    <OpenInvitation v-if="!opened" @open="handleOpen" />

    <!-- Nội dung chính -->
    <template v-else>
      <HeroSection />
      <HighlightsSection />
      <CoupleSection />
      <LoveStorySection />
      <GallerySection />
      <TimelineSection />
      <EventSection />
      <MapSection />
      <GiftSection />
      <RsvpSection />
      <GuestBookSection />
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
import CoupleSection from "./../components/couple/CoupleSection.vue";
import LoveStorySection from "./../components/story/LoveStorySection.vue";
import ScrollTop from "./../components/common/ScrollTop.vue";
import GallerySection from "./../components/gallery/GallerySection.vue";
import TimelineSection from "./../components/timeline/TimelineSection.vue";
import EventSection from "./../components/event/EventSection.vue";
import MapSection from "./../components/map/MapSection.vue";
import GiftSection from "./../components/gift/GiftSection.vue";
import RsvpSection from "./../components/rsvp/RsvpSection.vue";
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
  overflow: hidden;
  background: #fff8f6;
}
</style>
