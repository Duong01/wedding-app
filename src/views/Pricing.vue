<template>
  <main class="mk-page">
    <div class="mk-container">
      <PageBreadcrumb :trail="[{ label: $t('nav.pricing') }]" />
    </div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="mk-hero">
      <div class="mk-hero__glow" aria-hidden="true"></div>

      <div class="mk-container mk-hero__inner">
        <p class="mk-eyebrow">{{ $t('nav.pricing') }}</p>

        <h1>
          {{ $t('pricing.h1a') }}
          <em>{{ $t('pricing.h1b') }}</em>
        </h1>

        <p class="mk-hero__lead">
          {{ $t('pricing.lead') }}
        </p>

        <div class="mk-hero__actions">
          <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--solid">
            {{ $t('plan.free.cta') }}
          </router-link>

          <router-link :to="{ name: 'Guide' }" class="mk-btn mk-btn--ghost">
            {{ $t('pricing.viewGuide') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- =====================================================
         BA GÓI
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <RailHint :text="$t('pricing.swipePlans')" />

        <div class="plans mk-rail">
          <article
            v-for="plan in PRICING_PLANS"
            :key="plan.id"
            class="plan"
            :class="{ 'is-highlight': plan.highlight }"
          >
            <span v-if="plan.highlight" class="plan-badge">
              {{ $t('pricing.popular') }}
            </span>

            <h2>{{ plan.name }}</h2>

            <p class="plan-tagline">{{ plan.tagline }}</p>

            <p class="plan-price">
              <strong :class="{ 'is-text': isTextPrice(plan) }">
                {{ publicPriceLabel(plan) }}
              </strong>
              <span>{{ plan.unit }}</span>
            </p>

            <ul class="plan-features">
              <li v-for="feature in plan.features" :key="feature">
                <span class="tick" aria-hidden="true">✦</span>
                {{ feature }}
              </li>
            </ul>

            <ul v-if="plan.missing.length" class="plan-missing">
              <li v-for="item in plan.missing" :key="item">
                <span class="cross" aria-hidden="true">—</span>
                {{ item }}
              </li>
            </ul>

            <a
              v-if="plan.id === 'cao-cap'"
              :href="CONTACT.messenger"
              target="_blank"
              rel="noopener noreferrer"
              class="mk-btn mk-btn--outline"
            >
              {{ plan.cta }}
            </a>

            <router-link
              v-else
              :to="{ name: 'Editor' }"
              class="mk-btn"
              :class="plan.highlight ? 'mk-btn--solid' : 'mk-btn--outline'"
            >
              {{ plan.cta }}
            </router-link>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         SO SÁNH
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">{{ $t('pricing.compareEyebrow') }}</p>

          <h2>
            {{ $t('pricing.compareH2a') }}
            <em>{{ $t('pricing.compareH2b') }}</em>
          </h2>
        </header>

        <div class="table-wrap">
          <table class="compare">
            <thead>
              <tr>
                <th scope="col">{{ $t('pricing.feature') }}</th>

                <th
                  v-for="plan in PRICING_PLANS"
                  :key="plan.id"
                  scope="col"
                  :class="{ 'is-highlight': plan.highlight }"
                >
                  {{ plan.name }}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in COMPARE_ROWS" :key="row.label">
                <th scope="row">{{ row.label }}</th>

                <td
                  v-for="(value, index) in row.values"
                  :key="index"
                  :class="{ 'is-highlight': PRICING_PLANS[index]?.highlight }"
                >
                  <span v-if="value === true" class="yes" :aria-label="$t('pricing.yes')">
                    ✓
                  </span>

                  <span v-else-if="value === false" class="no" :aria-label="$t('pricing.no')">
                    —
                  </span>

                  <span v-else>{{ value }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- =====================================================
         DÙNG THỬ
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <header class="mk-head mk-head--center">
          <p class="mk-eyebrow">{{ $t('stats.trial') }}</p>

          <h2>
            {{ $t('pricing.trialH2a') }}
            <em>{{ $t('pricing.trialH2b') }}</em>
          </h2>
        </header>

        <RailHint :text="$t('about.swipeSteps')" />

        <div class="mk-grid mk-grid--3">
          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">壹</span>

            <h3>{{ $t('pricing.step1.title') }}</h3>

            <p>
              {{ $t('pricing.step1.text') }}
            </p>
          </article>

          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">贰</span>

            <h3>{{ $t('pricing.step2.title') }}</h3>

            <p>
              {{ $t('pricing.step2.text') }}
            </p>
          </article>

          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">叁</span>

            <h3>{{ $t('pricing.step3.title') }}</h3>

            <p>
              {{ $t('pricing.step3.text') }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         FAQ THANH TOÁN
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container faq-grid">
        <header class="faq-head">
          <p class="mk-eyebrow">{{ $t('manage.payment') }}</p>

          <h2>
            {{ $t('pricing.faqH2a') }}
            <em>{{ $t('pricing.faqH2b') }}</em>
          </h2>

          <p>
            {{ $t('pricing.faqLead') }}
          </p>

          <router-link
            :to="{ name: 'Contact' }"
            class="mk-btn mk-btn--outline mk-btn--sm"
          >
            {{ $t('pricing.askOther') }}
          </router-link>
        </header>

        <FaqAccordion :items="PRICING_FAQS" />
      </div>
    </section>

    <FinalCta
      :title="$t('pricing.ctaTitle')"
      :title-accent="$t('pricing.ctaAccent')"
      :text="$t('pricing.ctaText')"
      :cta="$t('footer.createNow')"
    />
  </main>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import PageBreadcrumb from "@/components/marketing/PageBreadcrumb.vue";
import FaqAccordion from "@/components/marketing/FaqAccordion.vue";
import FinalCta from "@/components/marketing/FinalCta.vue";
import RailHint from "@/components/marketing/RailHint.vue";

import { useSeo, faqJsonLd, productJsonLd } from "@/composables/useSeo";

import {
  CONTACT,
  PRICING_FAQS,
  PRICING_PLANS,
  publicPriceLabel,
} from "@/data/siteContent";

const { t } = useI18n();

/*
 * Gói trả phí không còn hiện con số trên trang công khai —
 * nhãn là chữ nên cần cỡ chữ nhỏ hơn (xem .plan-price strong.is-text).
 */
function isTextPrice(plan) {
  return typeof plan?.price === "number" && plan.price > 0;
}

/*
 * Bảng so sánh — thứ tự cột khớp PRICING_PLANS
 * (Miễn phí · Trọn đời · Cao cấp).
 */
/* computed: ô "Không giới hạn", "Vĩnh viễn"... đổi theo ngôn ngữ */
const COMPARE_ROWS = computed(() => [
  {
    get label() { return t("pricing.row.templates"); },
    values: [true, true, true],
  },
  {
    get label() { return t("pricing.row.editor"); },
    values: [true, true, true],
  },
  {
    get label() { return t("pricing.row.drafts"); },
    values: [true, true, true],
  },
  {
    get label() { return t("pricing.row.publish"); },
    values: [false, true, true],
  },
  {
    get label() { return t("pricing.row.guests"); },
    values: ["—", t("pricing.unlimited"), t("pricing.unlimited")],
  },
  {
    get label() { return t("features.guestbook.title"); },
    values: [false, true, true],
  },
  {
    get label() { return t("pricing.row.qr"); },
    values: [false, true, true],
  },
  {
    get label() { return t("pricing.row.countdown"); },
    values: [false, true, true],
  },
  {
    get label() { return t("pricing.row.music"); },
    values: [false, true, true],
  },
  {
    get label() { return t("pricing.row.editAfter"); },
    values: [false, true, true],
  },
  {
    get label() { return t("pricing.row.storage"); },
    values: ["—", t("pricing.forever"), t("pricing.forever")],
  },
  {
    get label() { return t("features.domain.title"); },
    values: [false, false, true],
  },
  {
    get label() { return t("pricing.row.customDesign"); },
    values: [false, false, true],
  },
  {
    get label() { return t("pricing.row.seating"); },
    values: [false, false, true],
  },
  {
    get label() { return t("footer.support"); },
    values: [t("pricing.community"), "Messenger", t("pricing.priority")],
  },
]);

useSeo({
  get title() { return t("nav.pricing"); },
  description:
    "Bảng giá tạo thiệp cưới online: tạo và chỉnh sửa miễn phí, " +
    "dùng thử 3 ngày đầy đủ tính năng, chỉ trả một lần khi xuất bản thiệp.",
  path: "/bang-gia",
  jsonLd: {
    "@context": "https://schema.org",
    "@graph": [productJsonLd(PRICING_PLANS), faqJsonLd(PRICING_FAQS)],
  },
});
</script>

<style scoped>
/* =====================================================
   BA GÓI
===================================================== */

.plans {
  display: grid;
  grid-template-columns: 1fr;

  gap: 16px;

  align-items: start;
}

.plan {
  position: relative;

  display: flex;
  flex-direction: column;

  padding: 30px 24px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 24px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 16px 40px rgba(43, 33, 24, 0.05);
}

.plan.is-highlight {
  border-color: rgba(166, 58, 46, 0.4);

  box-shadow: 0 26px 60px rgba(166, 58, 46, 0.16);
}

.plan-badge {
  position: absolute;

  top: -12px;
  left: 24px;

  padding: 5px 14px;

  border-radius: 999px;

  background: linear-gradient(135deg, var(--studio-seal, #a63a2e), #7c2a20);
  color: #fdf6ec;

  font-size: 10.5px;
  font-weight: 700;

  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.plan h2 {
  margin: 0 0 6px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 23px;
  font-weight: 600;
}

.plan-tagline {
  margin: 0 0 18px;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 13px;

  line-height: 1.6;
}

.plan-price {
  display: flex;
  flex-direction: column;

  gap: 2px;

  margin: 0 0 22px;
  padding-bottom: 20px;

  border-bottom: 1px solid var(--studio-line, rgba(43, 33, 24, 0.1));
}

.plan-price strong {
  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-num), var(--font-heading);
  font-size: 36px;
  font-weight: 600;

  line-height: 1.1;
}

/*
 * Gói trả phí giờ hiển thị chữ ("Trả khi xuất bản") thay vì
 * con số — cỡ 36px vốn dành cho "50.000đ" sẽ làm câu chữ vỡ
 * dòng và lấn át cả thẻ.
 */
.plan-price strong.is-text {
  font-size: 22px;

  line-height: 1.25;
}

.plan-price span {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;
}

.plan-features,
.plan-missing {
  margin: 0 0 20px;
  padding: 0;

  list-style: none;

  display: flex;
  flex-direction: column;

  gap: 10px;
}

.plan-features {
  flex: 1;
}

.plan-features li,
.plan-missing li {
  display: flex;

  gap: 10px;

  font-size: 13.5px;

  line-height: 1.6;
}

.plan-features li {
  color: var(--studio-ink-soft, #5c4f43);
}

.plan-missing li {
  color: var(--studio-ink-faint, #8a7a68);
}

.tick {
  flex-shrink: 0;

  color: var(--studio-foil, #b9975b);

  font-size: 11px;

  line-height: 1.7;
}

.cross {
  flex-shrink: 0;

  color: rgba(43, 33, 24, 0.3);

  font-size: 11px;

  line-height: 1.7;
}

/* =====================================================
   BẢNG SO SÁNH
===================================================== */

.table-wrap {
  overflow-x: auto;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 20px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 16px 40px rgba(43, 33, 24, 0.05);
}

.compare {
  width: 100%;

  min-width: 620px;

  border-collapse: collapse;

  font-size: 13.5px;
}

.compare th,
.compare td {
  padding: 14px 16px;

  text-align: left;

  border-bottom: 1px solid var(--studio-line, rgba(43, 33, 24, 0.08));
}

.compare thead th {
  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 15px;
  font-weight: 600;

  background: rgba(185, 151, 91, 0.08);
}

.compare thead th.is-highlight {
  color: var(--studio-seal, #a63a2e);

  background: rgba(166, 58, 46, 0.08);
}

.compare tbody th {
  color: var(--studio-ink-soft, #5c4f43);

  font-weight: 550;
}

.compare tbody td {
  color: var(--studio-ink-soft, #5c4f43);
}

.compare tbody td.is-highlight {
  background: rgba(166, 58, 46, 0.04);
}

.compare tbody tr:last-child th,
.compare tbody tr:last-child td {
  border-bottom: 0;
}

.yes {
  color: #2e6b3f;

  font-weight: 700;
}

.no {
  color: rgba(43, 33, 24, 0.28);
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
  .plans {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 20px;
  }

  .plan.is-highlight {
    transform: translateY(-10px);
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
