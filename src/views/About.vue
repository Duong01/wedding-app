<template>
  <main class="mk-page">
    <div class="mk-container">
      <PageBreadcrumb :trail="[{ label: $t('nav.about') }]" />
    </div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="mk-hero">
      <div class="mk-hero__glow" aria-hidden="true"></div>

      <div class="mk-container mk-hero__inner">
        <p class="mk-eyebrow">{{ $t("about.eyebrow") }}</p>

        <h1>
          {{ $t("about.h1a") }}
          <em>{{ $t("about.h1b") }}</em>
        </h1>

        <p class="mk-hero__lead">
          {{ $t("about.lead", { brand: BRAND.name }) }}
        </p>
        <ul class="mk-hero__stats">
          <li v-for="stat in ABOUT_STATS" :key="stat.label">
            <strong>{{ stat.value }}</strong> <span>{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </section>
    <!-- ===================================================== CÂU CHUYỆN ====================================================== -->
    <section class="mk-section">
      <div class="mk-narrow story">
        <p class="mk-eyebrow">{{ $t("about.storyEyebrow") }}</p>
        <h2 class="story-title">
          {{ $t("about.storyH2a") }} <em>{{ $t("about.storyH2b") }}</em>
        </h2>
        <div class="story-body">
          <p>{{ $t("about.story1") }}</p>
          <p>{{ $t("about.story2") }}</p>
          <p>{{ $t("about.story3", { brand: BRAND.name }) }}</p>
        </div>
      </div>
    </section>
    <!-- ===================================================== GIÁ TRỊ ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">{{ $t("about.valuesEyebrow") }}</p>
          <h2>
            {{ $t("about.valuesH2a") }} <em>{{ $t("about.valuesH2b") }}</em>
          </h2>
        </header>
        <RailHint :text="$t('about.swipeValues')" />
        <div class="mk-grid mk-grid--4">
          <article v-for="value in VALUES" :key="value.title" class="mk-card">
            <span class="mk-orn" aria-hidden="true">{{ value.orn }}</span>
            <h3>{{ value.title }}</h3>
            <p>{{ value.text }}</p>
          </article>
        </div>
      </div>
    </section>
    <!-- ===================================================== CÁCH LÀM VIỆC ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">{{ $t("about.howEyebrow") }}</p>
          <h2>
            {{ $t("about.howH2a") }} <em>{{ $t("about.howH2b") }}</em>
          </h2>
        </header>
        <RailHint :text="$t('about.swipeSteps')" />
        <div class="mk-grid mk-grid--3">
          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">壹</span>
            <h3>{{ $t("about.how1.title") }}</h3>
            <p>{{ $t("about.how1.text") }}</p>
          </article>
          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">贰</span>
            <h3>{{ $t("about.how2.title") }}</h3>
            <p>{{ $t("about.how2.text") }}</p>
          </article>
          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">叁</span>
            <h3>{{ $t("about.how3.title") }}</h3>
            <p>{{ $t("about.how3.text") }}</p>
          </article>
        </div>
      </div>
    </section>
    <!-- ===================================================== CTA ====================================================== -->
    <section class="mk-section mk-section--tight">
      <div class="mk-container">
        <div class="mk-grid mk-grid--2">
          <router-link :to="{ name: 'Templates' }" class="mk-card link-card">
            <span class="mk-orn" aria-hidden="true">囍</span>
            <h3>{{ $t("about.collectionsTitle") }}</h3>
            <p>{{ $t("about.collectionsText") }}</p>
            <span class="link-more">
              {{ $t("about.viewTemplates") }} <span aria-hidden="true">→</span>
            </span>
          </router-link>
          <router-link :to="{ name: 'Contact' }" class="mk-card link-card">
            <span class="mk-orn" aria-hidden="true">❝</span>
            <h3>{{ $t("about.talkTitle") }}</h3>
            <p>{{ $t("about.talkText") }}</p>
            <span class="link-more">
              {{ $t("nav.contact") }} <span aria-hidden="true">→</span>
            </span>
          </router-link>
        </div>
      </div>
    </section>
    <FinalCta
      :title="$t('about.ctaTitle')"
      :title-accent="$t('about.ctaAccent')"
      :text="$t('about.ctaText')"
    />
  </main>
</template> <script setup>
import { useI18n } from "vue-i18n";
import PageBreadcrumb from "@/components/marketing/PageBreadcrumb.vue";
import FinalCta from "@/components/marketing/FinalCta.vue";
import RailHint from "@/components/marketing/RailHint.vue";
import { useSeo, organizationJsonLd } from "@/composables/useSeo";
import { ABOUT_STATS, BRAND, VALUES } from "@/data/siteContent";
const { t } = useI18n();
useSeo({
  get title() {
    return t("nav.about");
  },
  description:
    `${BRAND.name} — nền tảng tạo thiệp cưới online cho người Việt. ` +
    "Hơn 12.000 cặp đôi đã gửi thiệp qua đây. Tạo miễn phí, dùng thử 3 ngày.",
  path: "/gioi-thieu",
  jsonLd: organizationJsonLd(),
});
</script>

<style scoped>
.story-title {
  margin: 0 0 24px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: 600;

  line-height: 1.15;
}

.story-title em {
  color: var(--studio-seal, #a63a2e);

  font-style: italic;
}

.story-body {
  display: flex;
  flex-direction: column;

  gap: 18px;
}

.story-body p {
  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 16px;

  line-height: 1.9;
}

.link-card {
  display: flex;
  flex-direction: column;

  text-decoration: none;
}

.link-more {
  display: inline-flex;
  align-items: center;

  gap: 6px;

  margin-top: 18px;

  color: var(--studio-seal, #a63a2e);

  font-size: 13px;
  font-weight: 650;
}
</style>
