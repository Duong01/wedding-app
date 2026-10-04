<template>
  <main class="mk-page">
    <div class="mk-container">
      <PageBreadcrumb :trail="[{ label: $t('footer.online') }]" />
    </div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="mk-hero">
      <div class="mk-hero__glow" aria-hidden="true"></div>

      <div class="mk-container mk-hero__inner">
        <p class="mk-eyebrow">{{ $t('footer.online') }}</p>

        <h1>
          {{ $t('landing.online.h1a') }}
          <em>{{ $t('landing.online.h1b') }}</em>
        </h1>

        <p class="mk-hero__lead">
          {{ $t('landing.online.lead') }}
        </p>

        <div class="mk-hero__actions">
          <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--solid">
            {{ $t('footer.createNow') }}
          </router-link>

          <router-link :to="{ name: 'Templates' }" class="mk-btn mk-btn--ghost">
            {{ $t('about.viewTemplates') }}
          </router-link>
        </div>

        <ul class="mk-hero__stats">
          <li v-for="stat in STATS" :key="stat.label">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- =====================================================
         THIỆP GIẤY VS THIỆP ONLINE
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">{{ $t('landing.online.diffEyebrow') }}</p>

          <h2>
            {{ $t('landing.online.diffH2a') }}
            <em>{{ $t('landing.online.diffH2b') }}</em>
          </h2>
        </header>

        <div class="mk-grid mk-grid--2">
          <article class="mk-card compare-card is-muted">
            <h3>{{ $t('landing.online.paper') }}</h3>

            <ul class="compare-list">
              <li v-for="item in PAPER_CONS" :key="item">
                <span class="cross" aria-hidden="true">—</span>
                {{ item }}
              </li>
            </ul>
          </article>

          <article class="mk-card compare-card is-strong">
            <h3>{{ $t('footer.online') }}</h3>

            <ul class="compare-list">
              <li v-for="item in ONLINE_PROS" :key="item">
                <span class="tick" aria-hidden="true">✦</span>
                {{ item }}
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CÓ GÌ TRONG THIỆP
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">{{ $t('storyPanel.content') }}</p>

          <h2>
            {{ $t('landing.online.insideH2a') }}
            <em>{{ $t('landing.online.insideH2b') }}</em>
          </h2>
        </header>

        <RailHint :text="$t('landing.online.swipeTen')" />

        <div class="mk-grid mk-grid--4">
          <article v-for="item in CONTENTS" :key="item.title" class="mk-card">
            <span class="mk-orn" aria-hidden="true">{{ item.orn }}</span>

            <h3>{{ item.title }}</h3>

            <p>{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         BỘ SƯU TẬP
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">{{ $t('footer.styles') }}</p>

          <h2>
            {{ $t('landing.online.styleH2a') }}
            <em>{{ $t('landing.online.styleH2b') }}</em>
          </h2>
        </header>

        <RailHint :text="$t('landing.online.swipeCollections')" />

        <div class="mk-grid mk-grid--3">
          <router-link
            v-for="col in collectionCards"
            :key="col.id"
            :to="{ name: col.routeName }"
            class="mk-card link-card"
          >
            <span class="swatches" aria-hidden="true">
              <span
                v-for="(swatch, index) in col.swatches"
                :key="index"
                class="swatch"
                :style="{ background: swatch }"
              ></span>
            </span>

            <h3>{{ col.title }}</h3>

            <p>{{ col.text }}</p>

            <span class="link-more">
              {{ $t('intro.viewTemplate') }} <span aria-hidden="true">→</span>
            </span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- =====================================================
         QUY TRÌNH
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">{{ $t('landing.online.howEyebrow') }}</p>

          <h2>
            {{ $t('landing.online.howH2a') }}
            <em>{{ $t('landing.online.howH2b') }}</em>
          </h2>
        </header>

        <ol class="flow">
          <li v-for="(step, index) in STEPS" :key="step.title" class="flow-step">
            <span class="flow-seal" aria-hidden="true">{{ step.seal }}</span>

            <div>
              <p class="flow-kicker">{{ $t('guide.step') }} {{ index + 1 }}</p>

              <h3>{{ step.title }}</h3>

              <p>{{ step.text }}</p>
            </div>
          </li>
        </ol>

        <div class="mk-cta">
          <router-link :to="{ name: 'Guide' }" class="mk-btn mk-btn--outline">
            {{ $t('faqSection.more') }}
            <span aria-hidden="true">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- =====================================================
         FAQ
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container faq-grid">
        <header class="faq-head">
          <p class="mk-eyebrow">{{ $t('guide.faqEyebrow') }}</p>

          <h2>
            {{ $t('landing.online.faqH2a') }}
            <em>{{ $t('landing.online.faqH2b') }}</em>
          </h2>

          <p>
            {{ $t('landing.online.faqLead') }}
          </p>

          <router-link
            :to="{ name: 'Contact' }"
            class="mk-btn mk-btn--outline mk-btn--sm"
          >
            {{ $t('landing.askDirect') }}
          </router-link>
        </header>

        <FaqAccordion :items="FAQS" />
      </div>
    </section>

    <FinalCta
      :title="$t('landing.online.ctaTitle')"
      :title-accent="$t('landing.online.ctaAccent')"
      :text="$t('finalCta.text')"
    />
  </main>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";

import PageBreadcrumb from "@/components/marketing/PageBreadcrumb.vue";
import FaqAccordion from "@/components/marketing/FaqAccordion.vue";
import FinalCta from "@/components/marketing/FinalCta.vue";
import RailHint from "@/components/marketing/RailHint.vue";

import { useSeo, faqJsonLd } from "@/composables/useSeo";

import { COLLECTIONS } from "@/data/templateCollections";
import {
  BRAND,
  COLLECTION_LANDING,
  FAQS,
  STATS,
  STEPS,
} from "@/data/siteContent";

const { t } = useI18n();

const PAPER_CONS = [
  t("landing.online.c1"),
  t("landing.online.c2"),
  t("landing.online.c3"),
  t("landing.online.c4"),
  t("landing.online.c5"),
];

const ONLINE_PROS = [
  t("landing.online.p1"),
  t("landing.online.p2"),
  t("landing.online.p3"),
  t("landing.online.p4"),
  t("landing.online.p5"),
];

const CONTENTS = [
  {
    orn: "囍",
    get title() { return t("landing.online.i1t"); },
    get text() { return t("landing.online.i1"); },
  },
  {
    orn: "✦",
    get title() { return t("landing.online.i2t"); },
    get text() { return t("landing.online.i2"); },
  },
  {
    orn: "❀",
    get title() { return t("landing.online.i3t"); },
    get text() { return t("landing.online.i3"); },
  },
  {
    orn: "❖",
    get title() { return t("editor.menu.story"); },
    get text() { return t("landing.online.i4"); },
  },
  {
    orn: "◈",
    get title() { return t("landing.online.i5t"); },
    get text() { return t("landing.online.i5"); },
  },
  {
    orn: "✽",
    get title() { return t("landing.online.i6t"); },
    get text() { return t("landing.online.i6"); },
  },
  {
    orn: "❝",
    get title() { return t("editor.menu.guestbook"); },
    get text() { return t("landing.online.i7"); },
  },
  {
    orn: "❦",
    get title() { return t("pricing.row.qr"); },
    get text() { return t("landing.online.i8"); },
  },
];

const collectionCards = computed(() =>
  COLLECTIONS.map((col) => {
    const landing = COLLECTION_LANDING[col.id] || {};

    return {
      id: col.id,
      swatches: col.swatches,
      title: landing.title || col.name,
      text: landing.text || col.sub,
      routeName: landing.routeName || "Templates",
    };
  })
);

useSeo({
  get title() { return t("footer.online"); },
  description:
    "Thiệp cưới online là gì, có gì bên trong và khác gì thiệp giấy? " +
    `${BRAND.name} — tạo thiệp cưới điện tử miễn phí, gửi khách mời trong vài phút.`,
  path: "/thiep-cuoi-online",
  jsonLd: faqJsonLd(FAQS),
});
</script>

<style scoped>
.compare-card h3 {
  margin-bottom: 16px;
}

.compare-card.is-muted {
  background: var(--studio-glass, rgba(255, 253, 248, 0.6));
}

.compare-card.is-strong {
  border-color: rgba(166, 58, 46, 0.34);

  box-shadow: 0 22px 52px rgba(166, 58, 46, 0.12);
}

.compare-list {
  margin: 0;
  padding: 0;

  list-style: none;

  display: flex;
  flex-direction: column;

  gap: 12px;
}

.compare-list li {
  display: flex;

  gap: 10px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14px;

  line-height: 1.65;
}

.tick {
  flex-shrink: 0;

  color: var(--studio-foil, #b9975b);

  font-size: 12px;

  line-height: 1.65;
}

.cross {
  flex-shrink: 0;

  color: rgba(43, 33, 24, 0.3);

  font-size: 12px;

  line-height: 1.65;
}

/* =====================================================
   BỘ SƯU TẬP
===================================================== */

.link-card {
  display: flex;
  flex-direction: column;

  text-decoration: none;
}

.swatches {
  display: flex;

  gap: 6px;

  margin-bottom: 16px;
}

.swatch {
  width: 24px;
  height: 24px;

  border: 1px solid rgba(43, 33, 24, 0.1);
  border-radius: 50%;
}

.link-more {
  display: inline-flex;
  align-items: center;

  gap: 6px;

  margin-top: 16px;

  color: var(--studio-seal, #a63a2e);

  font-size: 13px;
  font-weight: 650;
}

/* =====================================================
   QUY TRÌNH
===================================================== */

.flow {
  display: grid;
  grid-template-columns: 1fr;

  gap: 16px;

  margin: 0;
  padding: 0;

  list-style: none;
}

.flow-step {
  display: flex;

  gap: 16px;

  padding: 22px 20px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 22px;

  background: var(--studio-glass, rgba(255, 253, 248, 0.75));
}

.flow-seal {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 46px;
  height: 46px;

  border: 1px solid rgba(185, 151, 91, 0.4);
  border-radius: 50%;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-symbol);
  font-size: 19px;
}

.flow-kicker {
  margin: 0 0 4px;

  color: var(--studio-foil, #b9975b);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.flow-step h3 {
  margin: 0 0 6px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 600;
}

.flow-step p {
  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14px;

  line-height: 1.7;
}

/* =====================================================
   FAQ
===================================================== */

.faq-grid {
  display: grid;
  grid-template-columns: 1fr;

  gap: 28px;
}

.faq-head h2 {
  margin: 0 0 12px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: 600;

  line-height: 1.15;
}

.faq-head h2 em {
  color: var(--studio-seal, #a63a2e);

  font-style: italic;
}

.faq-head p {
  max-width: 420px;

  margin: 0 0 20px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 15px;

  line-height: 1.75;
}

@media (min-width: 768px) {
  .flow {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 20px;
  }

  .flow-step {
    flex-direction: column;

    gap: 14px;

    padding: 28px 24px;
  }

  .faq-grid {
    grid-template-columns: 0.8fr 1.2fr;

    gap: 48px;
  }

  .faq-head {
    position: sticky;
    top: 96px;

    align-self: start;
  }
}
</style>
