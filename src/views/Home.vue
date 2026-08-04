<template>
  <div class="home-page">
    <!-- Màn hình mở thiệp -->
    <OpenInvitation
      v-if="!opened"
      @open="handleOpen"
    />

    <!-- Nội dung -->
    <template v-else>
      <!-- Hero -->
      <HeroSection />

      <!-- Nội dung trên nền giấy -->
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
import { useWedding } from "@/composables/useWedding";

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
const { loadWedding } = useWedding();

onMounted(async () => {
  await loadWedding();
});

const handleOpen = () => {
  opened.value = true;
};
</script>

<style scoped>
.home-page{
    background:#7b0d0d;
    min-height:100vh;
    overflow-x:hidden;
}

/* phần nền giấy bên dưới */
.content-wrapper{
    width:min(100%,780px);
    margin:auto;
    margin-top:-40px;
    background:#faf3ea;
    border-radius:36px 36px 0 0;
    overflow:hidden;
    position:relative;
    z-index:2;
    box-shadow:0 -8px 30px rgba(0,0,0,.15);
}
</style>