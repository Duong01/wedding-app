<template>
  <main class="mk-page">
    <div class="mk-container">
      <PageBreadcrumb :trail="[{ label: $t('landing.create.crumb') }]" />
    </div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="mk-hero">
      <div class="mk-hero__glow" aria-hidden="true"></div>

      <div class="mk-container mk-hero__inner">
        <p class="mk-eyebrow">{{ $t('landing.create.crumb') }}</p>

        <h1>
          {{ $t('landing.create.h1a') }}
          <em>{{ $t('landing.create.h1b') }}</em>
        </h1>

        <p class="mk-hero__lead">
          {{ $t('landing.create.lead') }}
        </p>

        <div class="mk-hero__actions">
          <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--solid">
            {{ $t('landing.create.openEditor') }}
          </router-link>

          <router-link :to="{ name: 'Templates' }" class="mk-btn mk-btn--ghost">
            {{ $t('landing.create.pickFirst') }}
          </router-link>
        </div>

        <ul class="trust">
          <li v-for="item in TRUST" :key="item">
            <span class="tick" aria-hidden="true">✦</span>
            {{ item }}
          </li>
        </ul>
      </div>
    </section>

    <!-- =====================================================
         EDITOR LÀM ĐƯỢC GÌ
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">Trong editor</p>

          <h2>
            {{ $t('landing.create.editH2a') }}
            <em>{{ $t('landing.create.editH2b') }}</em>
          </h2>
        </header>

        <RailHint :text="$t('rail.swipeMore')" />

        <div class="mk-grid mk-grid--3">
          <article v-for="item in EDITOR_ITEMS" :key="item.title" class="mk-card">
            <span class="mk-orn" aria-hidden="true">{{ item.orn }}</span>

            <h3>{{ item.title }}</h3>

            <p>{{ item.text }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         BA BƯỚC
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">{{ $t('landing.process') }}</p>

          <h2>
            {{ $t('landing.create.stepsH2a') }}
            <em>{{ $t('landing.create.stepsH2b') }}</em>
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
      </div>
    </section>

    <!-- =====================================================
         CHUẨN BỊ
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">{{ $t('guide.prepEyebrow') }}</p>

          <h2>
            {{ $t('landing.create.prepH2a') }}
            <em>{{ $t('landing.create.prepH2b') }}</em>
          </h2>
        </header>

        <RailHint :text="$t('guide.swipeGroups')" />

        <div class="mk-grid mk-grid--3">
          <article
            v-for="group in GUIDE_CHECKLIST.slice(0, 3)"
            :key="group.group"
            class="mk-card"
          >
            <h3>{{ group.group }}</h3>

            <ul class="check-list">
              <li v-for="item in group.items" :key="item">
                <span class="box" aria-hidden="true"></span>
                {{ item }}
              </li>
            </ul>
          </article>
        </div>

        <div class="mk-cta">
          <router-link :to="{ name: 'Guide' }" class="mk-btn mk-btn--outline">
            {{ $t('landing.create.fullChecklist') }}
            <span aria-hidden="true">→</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- =====================================================
         GIÁ
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">{{ $t('landing.cost') }}</p>

          <h2>
            {{ $t('landing.create.costH2a') }}
            <em>{{ $t('landing.create.costH2b') }}</em>
          </h2>

          <p>
            {{ $t('landing.create.costLead') }}
          </p>
        </header>

        <RailHint :text="$t('pricing.swipePlans')" />

        <div class="mk-grid mk-grid--3">
          <article
            v-for="plan in PRICING_PLANS"
            :key="plan.id"
            class="mk-card plan"
            :class="{ 'is-highlight': plan.highlight }"
          >
            <h3>{{ plan.name }}</h3>

            <p class="plan-price">
              <strong :class="{ 'is-text': isTextPrice(plan) }">
                {{ publicPriceLabel(plan) }}
              </strong>
              <span>{{ plan.unit }}</span>
            </p>

            <p>{{ plan.tagline }}</p>
          </article>
        </div>

        <div class="mk-cta">
          <router-link :to="{ name: 'Pricing' }" class="mk-btn mk-btn--outline">
            {{ $t('landing.fullPricing') }}
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
            {{ $t('landing.create.faqH2a') }}
            <em>{{ $t('landing.create.faqH2b') }}</em>
          </h2>

          <p>
            {{ $t('landing.create.faqLead') }}
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
      :title="$t('landing.create.ctaTitle')"
      :title-accent="$t('landing.create.ctaAccent')"
      :text="$t('landing.create.ctaText')"
      :cta="$t('footer.createNow')"
    />
  </main>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import PageBreadcrumb from "@/components/marketing/PageBreadcrumb.vue";
import FaqAccordion from "@/components/marketing/FaqAccordion.vue";
import FinalCta from "@/components/marketing/FinalCta.vue";
import RailHint from "@/components/marketing/RailHint.vue";

import { useSeo, faqJsonLd } from "@/composables/useSeo";

import {
  BRAND,
  FAQS,
  GUIDE_CHECKLIST,
  PRICING_PLANS,
  STEPS,
  publicPriceLabel,
} from "@/data/siteContent";

const { t } = useI18n();

const TRUST = [
  t("landing.create.b1"),
  t("landing.create.b2"),
  t("landing.create.b3"),
  t("landing.create.b4"),
];

/*
 * Gói trả phí không còn hiện con số trên trang công khai —
 * nhãn là chữ nên cần cỡ chữ nhỏ hơn (xem .plan-price strong.is-text).
 */
function isTextPrice(plan) {
  return typeof plan?.price === "number" && plan.price > 0;
}

const EDITOR_ITEMS = [
  {
    orn: "囍",
    get title() { return t("storyPanel.content"); },
    get text() { return t("landing.create.i1"); },
  },
  {
    orn: "✦",
    get title() { return t("landing.create.i2t"); },
    get text() { return t("landing.create.i2"); },
  },
  {
    orn: "❀",
    get title() { return t("landing.create.i3t"); },
    get text() { return t("landing.create.i3"); },
  },
  {
    orn: "❖",
    get title() { return t("landing.create.i4t"); },
    get text() { return t("landing.create.i4"); },
  },
  {
    orn: "◈",
    get title() { return t("editor.menu.gifts"); },
    get text() { return t("landing.create.i5"); },
  },
  {
    orn: "❝",
    get title() { return t("landing.create.i6t"); },
    get text() { return t("landing.create.i6"); },
  },
];

useSeo({
  title: "Tạo thiệp cưới online",
  description:
    `Tạo thiệp cưới online miễn phí cùng ${BRAND.name}: chọn mẫu, điền nội dung, ` +
    "xuất bản và gửi khách mời. Không cần đăng ký, không cần thẻ, dùng thử 3 ngày.",
  path: "/tao-thiep-cuoi",
  jsonLd: faqJsonLd(FAQS),
});
</script>

<style scoped>
.trust {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  gap: 10px 24px;

  margin: 32px 0 0;
  padding: 0;

  list-style: none;
}

.trust li {
  display: flex;

  gap: 8px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13.5px;
}

.tick {
  flex-shrink: 0;

  color: var(--studio-foil, #b9975b);

  font-size: 12px;

  line-height: 1.6;
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
   CHECKLIST
===================================================== */

.check-list {
  margin: 0;
  padding: 0;

  list-style: none;

  display: flex;
  flex-direction: column;

  gap: 11px;
}

.check-list li {
  display: flex;

  gap: 10px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13.5px;

  line-height: 1.6;
}

.box {
  flex-shrink: 0;

  width: 15px;
  height: 15px;

  margin-top: 3px;

  border: 1.5px solid rgba(185, 151, 91, 0.6);
  border-radius: 4px;
}

/* =====================================================
   GÓI GIÁ RÚT GỌN
===================================================== */

.plan.is-highlight {
  border-color: rgba(166, 58, 46, 0.4);

  box-shadow: 0 22px 52px rgba(166, 58, 46, 0.14);
}

.plan-price {
  display: flex;
  flex-direction: column;

  gap: 2px;

  margin: 10px 0 12px;
}

.plan-price strong {
  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-heading);
  font-size: 30px;
  font-weight: 600;

  line-height: 1.1;
}

/*
 * Gói trả phí giờ hiển thị chữ ("Trả khi xuất bản") thay vì
 * con số — cỡ 30px vốn dành cho "50.000đ" sẽ làm câu chữ vỡ
 * dòng và lấn át cả thẻ.
 */
.plan-price strong.is-text {
  font-size: 20px;

  line-height: 1.25;
}

.plan-price span {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;
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
