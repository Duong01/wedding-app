<template>
  <section class="mk-section">
    <div class="mk-container">
      <header class="mk-head mk-head--center">
        <p class="mk-eyebrow">Bảng giá</p>

        <h2>
          Trả một lần,
          <em>giữ thiệp mãi mãi.</em>
        </h2>

        <p>
          Tạo và chỉnh sửa miễn phí. Chỉ thanh toán khi bạn đã xuất bản và
          thật sự ưng ý.
        </p>
      </header>

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

          <h3>{{ plan.name }}</h3>

          <p class="plan-tagline">{{ plan.tagline }}</p>

          <p class="plan-price">
            <strong :class="{ 'is-text': isTextPrice(plan) }">
              {{ publicPriceLabel(plan) }}
            </strong>
            <span>{{ plan.unit }}</span>
          </p>

          <ul class="plan-features">
            <li v-for="feature in plan.features.slice(0, 5)" :key="feature">
              <span class="tick" aria-hidden="true">✦</span>
              {{ feature }}
            </li>
          </ul>

          <router-link
            :to="{ name: 'Pricing' }"
            class="mk-btn"
            :class="plan.highlight ? 'mk-btn--solid' : 'mk-btn--outline'"
          >
            Xem chi tiết
          </router-link>
        </article>
      </div>

      <div class="mk-cta">
        <router-link :to="{ name: 'Pricing' }" class="mk-btn mk-btn--outline">
          So sánh đầy đủ ba gói
          <span aria-hidden="true">→</span>
        </router-link>

        <p class="mk-note">
          Dùng thử 3 ngày đầy đủ tính năng · Không phí gia hạn hằng năm
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import RailHint from "@/components/marketing/RailHint.vue";

import { PRICING_PLANS, publicPriceLabel } from "@/data/siteContent";

/*
 * Gói trả phí không còn hiện con số trên trang công khai —
 * nhãn là chữ nên cần cỡ chữ nhỏ hơn (xem .plan-price strong.is-text).
 */
function isTextPrice(plan) {
  return typeof plan?.price === "number" && plan.price > 0;
}
</script>

<style scoped>
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

  padding: 28px 24px;

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

.plan h3 {
  margin: 0 0 6px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 22px;
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
  font-size: 34px;
  font-weight: 600;

  line-height: 1.1;
}

/*
 * Gói trả phí giờ hiển thị chữ ("Trả khi xuất bản") thay vì
 * con số — cỡ 34px vốn dành cho "50.000đ" sẽ làm câu chữ vỡ
 * dòng và lấn át cả thẻ.
 */
.plan-price strong.is-text {
  font-size: 21px;

  line-height: 1.25;
}

.plan-price span {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;
}

.plan-features {
  flex: 1;

  margin: 0 0 24px;
  padding: 0;

  list-style: none;

  display: flex;
  flex-direction: column;

  gap: 10px;
}

.plan-features li {
  display: flex;

  gap: 10px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13.5px;

  line-height: 1.6;
}

.tick {
  flex-shrink: 0;

  color: var(--studio-foil, #b9975b);

  font-size: 11px;

  line-height: 1.7;
}

@media (min-width: 768px) {
  .plans {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 20px;
  }

  .plan.is-highlight {
    transform: translateY(-10px);
  }
}
</style>
