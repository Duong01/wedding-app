<template>
  <main class="mk-page">
    <div class="mk-container">
      <PageBreadcrumb :trail="[{ label: 'Tạo thiệp cưới' }]" />
    </div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="mk-hero">
      <div class="mk-hero__glow" aria-hidden="true"></div>

      <div class="mk-container mk-hero__inner">
        <p class="mk-eyebrow">Tạo thiệp cưới</p>

        <h1>
          Bắt đầu tạo thiệp cưới
          <em>ngay bây giờ.</em>
        </h1>

        <p class="mk-hero__lead">
          Không cần đăng ký, không cần thẻ, không mất phí. Mở editor, chọn một
          mẫu và điền thử vài dòng — bạn sẽ thấy tấm thiệp của mình hiện ra
          ngay bên cạnh.
        </p>

        <div class="mk-hero__actions">
          <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--solid">
            Mở editor tạo thiệp
          </router-link>

          <router-link :to="{ name: 'Templates' }" class="mk-btn mk-btn--ghost">
            Chọn mẫu trước
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
            Mọi thứ bạn cần sửa,
            <em>đều sửa được.</em>
          </h2>
        </header>

        <RailHint text="Vuốt ngang để xem thêm" />

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
          <p class="mk-eyebrow">Quy trình</p>

          <h2>
            Từ mẫu trống tới thiệp gửi được
            <em>trong ba bước.</em>
          </h2>
        </header>

        <ol class="flow">
          <li v-for="(step, index) in STEPS" :key="step.title" class="flow-step">
            <span class="flow-seal" aria-hidden="true">{{ step.seal }}</span>

            <div>
              <p class="flow-kicker">Bước {{ index + 1 }}</p>

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
          <p class="mk-eyebrow">Chuẩn bị</p>

          <h2>
            Có sẵn những thứ này thì
            <em>điền một mạch.</em>
          </h2>
        </header>

        <RailHint text="Vuốt ngang để xem đủ ba nhóm" />

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
            Xem checklist đầy đủ
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
          <p class="mk-eyebrow">Chi phí</p>

          <h2>
            Tạo miễn phí,
            <em>trả tiền sau.</em>
          </h2>

          <p>
            Bạn dựng thiệp và chỉnh sửa bao nhiêu lần cũng được mà không mất
            phí. Chỉ khi xuất bản và thật sự ưng ý mới cần thanh toán.
          </p>
        </header>

        <RailHint text="Vuốt ngang để so ba gói" />

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
            Xem bảng giá đầy đủ
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
          <p class="mk-eyebrow">Giải đáp</p>

          <h2>
            Trước khi
            <em>bắt đầu.</em>
          </h2>

          <p>
            Vài điều các cặp đôi thường hỏi ngay trước khi mở editor lần đầu.
          </p>

          <router-link
            :to="{ name: 'Contact' }"
            class="mk-btn mk-btn--outline mk-btn--sm"
          >
            Hỏi trực tiếp
          </router-link>
        </header>

        <FaqAccordion :items="FAQS" />
      </div>
    </section>

    <FinalCta
      title="Mở editor"
      title-accent="và thử một mẫu."
      text="Không cần đăng nhập, không mất phí. Bạn có thể bỏ dở và quay lại bất cứ lúc nào."
      cta="Tạo thiệp ngay"
    />
  </main>
</template>

<script setup>
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

const TRUST = [
  "Không cần đăng ký để bắt đầu",
  "Không cần thẻ thanh toán",
  "Dùng thử 3 ngày đầy đủ tính năng",
  "Sửa không giới hạn, kể cả sau khi gửi",
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
    title: "Nội dung",
    text: "Tên cô dâu chú rể, cha mẹ hai bên, địa chỉ, giờ lễ và tiệc — nhập một lần, hiển thị đồng bộ khắp thiệp.",
  },
  {
    orn: "✦",
    title: "Hình ảnh",
    text: "Ảnh bìa, ảnh chân dung, album cưới. Tải lên không giới hạn, tự sắp thành album.",
  },
  {
    orn: "❀",
    title: "Bố cục & thứ tự",
    text: "Bật tắt từng mục, đổi thứ tự hiển thị — thiệp chạy theo đúng mạch bạn muốn kể.",
  },
  {
    orn: "❖",
    title: "Tên các mục",
    text: "Đổi tiêu đề hiển thị của từng phần. Bỏ trống thì mẫu dùng tiêu đề mặc định của nó.",
  },
  {
    orn: "◈",
    title: "Mừng cưới",
    text: "Nhập số tài khoản hai bên, hệ thống tự dựng mã QR cho khách quét chuyển khoản.",
  },
  {
    orn: "❝",
    title: "Xem trước tức thì",
    text: "Mọi thay đổi hiện ngay ở khung xem trước — đúng như khách mời sẽ thấy trên điện thoại.",
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
