<template>
  <main class="mk-page">
    <HomeHero :weddings="weddings" />

    <TemplateGallery :weddings="weddings" :loading="store.loading" />

    <FeatureBento />

    <HowItWorks />

    <FeatureTabs />

    <CollectionShowcase />

    <Testimonials />

    <PricingTeaser />

    <SupportBlock />

    <FaqSection />

    <FinalCta />
  </main>
</template>

<script setup>
import { computed, onMounted } from "vue";

import HomeHero from "@/components/home/HomeHero.vue";
import TemplateGallery from "@/components/home/TemplateGallery.vue";
import FeatureBento from "@/components/home/FeatureBento.vue";
import HowItWorks from "@/components/home/HowItWorks.vue";
import FeatureTabs from "@/components/home/FeatureTabs.vue";
import CollectionShowcase from "@/components/home/CollectionShowcase.vue";
import Testimonials from "@/components/home/Testimonials.vue";
import PricingTeaser from "@/components/home/PricingTeaser.vue";
import SupportBlock from "@/components/home/SupportBlock.vue";
import FaqSection from "@/components/home/FaqSection.vue";
import FinalCta from "@/components/marketing/FinalCta.vue";

import { useSeo, faqJsonLd } from "@/composables/useSeo";
import { useWeddingStore } from "@/stores/wedding";

import { BRAND, FAQS } from "@/data/siteContent";

const store = useWeddingStore();

const weddings = computed(() => store.weddings || []);

/*
 * Không truyền title riêng: useSeo sẽ dùng thẳng
 * BRAND.title làm tiêu đề trang chủ, tránh lặp thành
 * "… | Thiệp Duyên" trong khi tiêu đề đã có tên thương hiệu.
 */
useSeo({
  description: BRAND.description,
  path: "/",
  jsonLd: faqJsonLd(FAQS),
});

onMounted(() => {
  store.loadWeddings();
});
</script>
