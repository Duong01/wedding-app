<template>

  <div class="theme theme-traditional-red">

    <div v-if="!opened" class="open-wrapper">
      <OpenInvitation @open="handleOpen" :wedding="wedding"/>
    </div>

    <!-- Nội dung -->
    <template v-else>
      <!-- Hero -->
      <HeroSection :wedding="wedding"/>

      <!-- Nội dung -->
      <main class="content-wrapper">
        <HighlightsSection :couple="wedding.couple"/>
        <GallerySection :couple="wedding.couple"/>
        <EventSection v-if="wedding.events?.length" :events="wedding.events"/>
        <MapSection :couple="wedding.couple"/>
        <GuestBookSection v-if="
        wedding.settings?.showGuestBook &&
        wedding.guestBook?.enabled
      "
      :guest-book="wedding.guestBook"/>
        <GiftSection  v-if="
        wedding.settings?.showGift &&
        wedding.gifts?.length
      "
      :gifts="wedding.gifts"/>
        <FooterSection :footer="wedding.footer"/>
      </main>

      <!-- <ScrollTop /> -->
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

const opened = ref(false);

const handleOpen = () => {
  opened.value = true;
};
const store = useWeddingStore();


const wedding = computed(
  () => store.wedding
);

</script>