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
// import { useWedding } from "@/composables/useWedding";
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
// const { loadWedding } = useWedding();
const weddingStore = useWeddingStore();

onMounted(async () => {
  await weddingStore.loadWedding();
});

const handleOpen = () => {
  opened.value = true;
};
</script>

<style scoped>
.home-page{
    min-height:100vh;
    overflow-x:hidden;
    background:#7b0d0d;
}

/* Khung giấy */
.content-wrapper{
    width:min(92%,760px);
    margin:-40px auto 0;
    position:relative;
    z-index:2;

    background:#f8f3ea;
    border-radius:40px 40px 0 0;

    /* padding:70px 55px 100px; */

    overflow:hidden;
    box-shadow:0 -8px 30px rgba(0,0,0,.18);
}

/* Texture giấy */
.content-wrapper::before{
    content:"";
    position:absolute;
    inset:0;
    background:url("/images/paper-texture.png") center/cover;
    opacity:.12;
    pointer-events:none;
}

/* tất cả section */
.content-wrapper > section{
    position:relative;
    z-index:2;
}
</style>