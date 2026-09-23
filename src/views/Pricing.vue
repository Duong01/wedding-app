<template>
  <main class="mk-page">
    <div class="mk-container">
      <PageBreadcrumb :trail="[{ label: 'Bảng giá' }]" />
    </div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="mk-hero">
      <div class="mk-hero__glow" aria-hidden="true"></div>

      <div class="mk-container mk-hero__inner">
        <p class="mk-eyebrow">Bảng giá</p>

        <h1>
          Tạo miễn phí.
          <em>Ưng rồi mới trả tiền.</em>
        </h1>

        <p class="mk-hero__lead">
          Bạn dựng thiệp, chỉnh sửa bao nhiêu lần cũng được mà không mất phí.
          Khi đã hài lòng và xuất bản, bạn có 3 ngày dùng thử đầy đủ tính năng
          trước khi quyết định thanh toán.
        </p>

        <div class="mk-hero__actions">
          <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--solid">
            Bắt đầu tạo thiệp
          </router-link>

          <router-link :to="{ name: 'Guide' }" class="mk-btn mk-btn--ghost">
            Xem hướng dẫn
          </router-link>
        </div>
      </div>
    </section>

    <!-- =====================================================
         BA GÓI
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container">
        <RailHint text="Vuốt ngang để so ba gói" />

        <div class="plans mk-rail">
          <article
            v-for="plan in PRICING_PLANS"
            :key="plan.id"
            class="plan"
            :class="{ 'is-highlight': plan.highlight }"
          >
            <span v-if="plan.highlight" class="plan-badge">
              Nhiều người chọn
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
          <p class="mk-eyebrow">So sánh</p>

          <h2>
            Từng tính năng,
            <em>rõ ràng từng dòng.</em>
          </h2>
        </header>

        <div class="table-wrap">
          <table class="compare">
            <thead>
              <tr>
                <th scope="col">Tính năng</th>

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
                  <span v-if="value === true" class="yes" aria-label="Có">
                    ✓
                  </span>

                  <span v-else-if="value === false" class="no" aria-label="Không">
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
          <p class="mk-eyebrow">Dùng thử</p>

          <h2>
            Ba ngày đầy đủ,
            <em>không cần thẻ.</em>
          </h2>
        </header>

        <RailHint text="Vuốt ngang để xem đủ ba bước" />

        <div class="mk-grid mk-grid--3">
          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">壹</span>

            <h3>Xuất bản thiệp</h3>

            <p>
              Bấm xuất bản là đồng hồ bắt đầu chạy. Không cần nhập thông tin
              thanh toán, không cần xác nhận gì thêm.
            </p>
          </article>

          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">贰</span>

            <h3>Gửi khách mời thật</h3>

            <p>
              Trong 3 ngày đó thiệp hoạt động đầy đủ: khách xem được, gửi lời
              chúc được, quét QR mừng cưới được. Không giới hạn số người xem.
            </p>
          </article>

          <article class="mk-card">
            <span class="mk-orn" aria-hidden="true">叁</span>

            <h3>Quyết định sau</h3>

            <p>
              Hết 3 ngày, nếu bạn chưa thanh toán thì thiệp tạm ẩn — nhưng
              toàn bộ nội dung vẫn còn nguyên. Thanh toán lúc nào cũng được.
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
          <p class="mk-eyebrow">Thanh toán</p>

          <h2>
            Hỏi về
            <em>chi phí.</em>
          </h2>

          <p>
            Những câu hỏi về giá, dùng thử và hoàn tiền. Nếu còn điều gì chưa
            rõ, nhắn tụi mình hỏi trực tiếp.
          </p>

          <router-link
            :to="{ name: 'Contact' }"
            class="mk-btn mk-btn--outline mk-btn--sm"
          >
            Đặt câu hỏi khác
          </router-link>
        </header>

        <FaqAccordion :items="PRICING_FAQS" />
      </div>
    </section>

    <FinalCta
      title="Sẵn sàng chưa?"
      title-accent="Bắt đầu miễn phí."
      text="Không cần thẻ, không cần cam kết. Bạn chỉ trả tiền khi tấm thiệp đã thật sự vừa ý."
      cta="Tạo thiệp ngay"
    />
  </main>
</template>

<script setup>
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
const COMPARE_ROWS = [
  {
    label: "Truy cập toàn bộ mẫu thiệp",
    values: [true, true, true],
  },
  {
    label: "Editor chỉnh sửa không giới hạn",
    values: [true, true, true],
  },
  {
    label: "Lưu nháp không giới hạn",
    values: [true, true, true],
  },
  {
    label: "Xuất bản và chia sẻ khách mời",
    values: [false, true, true],
  },
  {
    label: "Số khách mời",
    values: ["—", "Không giới hạn", "Không giới hạn"],
  },
  {
    label: "Sổ lưu bút số",
    values: [false, true, true],
  },
  {
    label: "QR mừng cưới",
    values: [false, true, true],
  },
  {
    label: "Đồng hồ đếm ngược & bản đồ",
    values: [false, true, true],
  },
  {
    label: "Nhạc nền",
    values: [false, true, true],
  },
  {
    label: "Sửa nội dung sau khi gửi",
    values: [false, true, true],
  },
  {
    label: "Thời gian lưu thiệp",
    values: ["—", "Vĩnh viễn", "Vĩnh viễn"],
  },
  {
    label: "Tên miền riêng",
    values: [false, false, true],
  },
  {
    label: "Thiết kế chỉnh riêng",
    values: [false, false, true],
  },
  {
    label: "Quản lý khách mời & sắp bàn tiệc",
    values: [false, false, true],
  },
  {
    label: "Hỗ trợ",
    values: ["Cộng đồng", "Messenger", "Ưu tiên 24/7"],
  },
];

useSeo({
  title: "Bảng giá",
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

  font-family: var(--font-heading);
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
