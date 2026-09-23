<template>
  <section class="hero">
    <div class="hero-wash" aria-hidden="true"></div>

    <div class="mk-container hero-grid">
      <div class="hero-copy">
        <span class="seal-mark" aria-hidden="true">囍</span>

        <p class="hero-eyebrow">{{ BRAND.slogan }}</p>

        <h1>
          Ngày trọng đại
          <em>của hai bạn</em>
          xứng một tấm thiệp đẹp.
        </h1>

        <p class="hero-lead">
          Bộ sưu tập thiệp cưới lấy cảm hứng Á Đông — đỏ son, lụa ngà, vàng
          foil, ấn triện. Chọn mẫu, điền nội dung, gửi khách mời trong vài
          phút.
        </p>

        <div class="hero-actions">
          <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--solid">
            Tạo thiệp ngay
          </router-link>

          <button type="button" class="mk-btn mk-btn--ghost" @click="scrollToGallery">
            Xem bộ sưu tập
          </button>
        </div>

        <ul class="hero-facts">
          <li v-for="stat in stats" :key="stat.label">
            <strong>{{ stat.value }}</strong>
            <span>{{ stat.label }}</span>
          </li>
        </ul>
      </div>

      <div class="hero-deck" aria-hidden="true">
        <article
          v-for="(card, index) in deck"
          :key="`deck-${index}`"
          class="deck-card"
          :class="`is-${index}`"
        >
          <img :src="card.src" :alt="card.label" />

          <span class="deck-label">{{ card.label }}</span>
        </article>

        <span class="deck-seal">囍</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { BRAND, STATS } from "@/data/siteContent";
import { toCardItem } from "@/utils/weddingCard";

const props = defineProps({
  weddings: { type: Array, default: () => [] },
});

const stats = computed(() => {
  const list = [...STATS];

  if (props.weddings.length) {
    list[0] = { value: `${props.weddings.length}+`, label: "Mẫu thiệp" };
  }

  return list;
});

const deck = computed(() =>
  props.weddings.slice(0, 3).map(toCardItem)
);

function scrollToGallery() {
  document
    .getElementById("gallery")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<style scoped>
.hero {
  position: relative;

  padding: 56px 0 40px;

  overflow: hidden;
}

.hero-wash {
  position: absolute;

  top: -160px;
  right: -120px;

  width: 520px;
  height: 520px;

  border-radius: 50%;

  background: radial-gradient(
    circle,
    rgba(185, 151, 91, 0.22),
    transparent 68%
  );

  pointer-events: none;
}

.hero-grid {
  position: relative;
  z-index: 1;

  display: grid;
  grid-template-columns: 1fr;

  gap: 48px;
  align-items: center;
}

.hero-copy {
  position: relative;
}

.seal-mark {
  position: absolute;

  top: -6px;
  right: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 62px;
  height: 62px;

  border: 2px solid rgba(166, 58, 46, 0.18);
  border-radius: 12px;

  color: rgba(166, 58, 46, 0.24);

  font-family: var(--font-symbol);
  font-size: 30px;

  transform: rotate(6deg);

  pointer-events: none;
}

.hero-eyebrow {
  margin: 0 0 16px;

  color: var(--studio-foil, #b9975b);

  font-size: 11.5px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero-copy h1 {
  max-width: 620px;

  margin: 0;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(34px, 5.4vw, 62px);
  font-weight: 600;

  line-height: 1.04;
  letter-spacing: -0.03em;
}

.hero-copy h1 em {
  display: block;

  color: var(--studio-seal, #a63a2e);

  font-style: italic;
}

.hero-lead {
  max-width: 560px;

  margin: 22px 0 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 16.5px;

  line-height: 1.8;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;

  gap: 12px;

  margin-top: 30px;
}

.hero-facts {
  display: flex;
  flex-wrap: wrap;

  gap: 28px;

  margin: 38px 0 0;
  padding: 0;

  list-style: none;
}

.hero-facts li {
  display: flex;
  flex-direction: column;

  gap: 2px;
}

.hero-facts strong {
  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 600;
}

.hero-facts span {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 11.5px;

  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* =====================================================
   BỘ THIỆP XOÈ QUẠT
===================================================== */

.hero-deck {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 380px;
}

.deck-card {
  position: absolute;

  width: 200px;

  aspect-ratio: 9 / 16;

  overflow: hidden;

  border: 1px solid rgba(185, 151, 91, 0.4);
  border-radius: 14px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 26px 60px rgba(43, 33, 24, 0.22);

  transition: transform 0.5s ease;
}

.deck-card img {
  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center top;
}

.deck-label {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;

  padding: 10px 12px;

  background: linear-gradient(to top, rgba(0, 0, 0, 0.78), transparent);

  color: #fff;

  font-size: 12px;
  font-weight: 600;

  text-align: center;
}

.deck-card.is-0 {
  z-index: 1;

  transform: translateX(-72px) rotate(-9deg) scale(0.9);

  opacity: 0.85;
}

.deck-card.is-1 {
  z-index: 3;

  transform: translateY(-14px);
}

.deck-card.is-2 {
  z-index: 2;

  transform: translateX(72px) rotate(9deg) scale(0.9);

  opacity: 0.85;
}

.hero-deck:hover .deck-card.is-0 {
  transform: translateX(-96px) rotate(-12deg) scale(0.92);
}

.hero-deck:hover .deck-card.is-2 {
  transform: translateX(96px) rotate(12deg) scale(0.92);
}

.deck-seal {
  position: absolute;

  bottom: 6px;
  left: 50%;

  z-index: 4;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 52px;
  height: 52px;

  border-radius: 50%;

  background: linear-gradient(135deg, var(--studio-seal, #a63a2e), #7c2a20);
  color: #fdf6ec;

  font-family: var(--font-symbol);
  font-size: 24px;

  box-shadow: 0 14px 30px rgba(166, 58, 46, 0.34);

  transform: translateX(-50%);
}

/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .hero {
    padding: 84px 0 56px;
  }

  .hero-grid {
    grid-template-columns: 1.05fr 0.95fr;

    gap: 56px;
  }

  .hero-deck {
    height: 460px;
  }

  .deck-card {
    width: 240px;
  }

  .deck-card.is-0 {
    transform: translateX(-96px) rotate(-9deg) scale(0.9);
  }

  .deck-card.is-2 {
    transform: translateX(96px) rotate(9deg) scale(0.9);
  }
}

@media (max-width: 420px) {
  .seal-mark {
    display: none;
  }

  .hero-deck {
    height: 320px;
  }

  .deck-card {
    width: 168px;
  }

  .deck-card.is-0 {
    transform: translateX(-58px) rotate(-9deg) scale(0.9);
  }

  .deck-card.is-2 {
    transform: translateX(58px) rotate(9deg) scale(0.9);
  }
}

@media (prefers-reduced-motion: reduce) {
  .deck-card {
    transition: none;
  }
}
</style>
