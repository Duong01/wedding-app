<template>
  <section class="hero">
    <!-- nền hoa văn mờ dần dưới chân -->
    <div class="hero-wash" aria-hidden="true"></div>

    <div class="mk-container hero-grid">
      <!-- =====================================================
           CỘT CHỮ
      ====================================================== -->
      <div class="hero-copy">
        <p class="hero-brand">
          <span class="hero-brand__name">ThiệpDuyên</span><span>.vn</span>
        </p>

        <h1>{{ $t('hero.h1') }}</h1>

        <!-- điện thoại: câu ngắn gọn, đi thẳng vào lợi ích -->
        <p class="hero-lead hero-lead--mobile">
          {{ $t('hero.sub') }}
        </p>

        <!-- máy tính: câu trích + đoạn dẫn đầy đủ -->
        <p class="hero-quote">
          {{ $t('hero.quote') }}
        </p>

        <p class="hero-lead">
          {{ $t('hero.lead') }}
        </p>

        <p class="hero-trust">
          {{ $t('hero.badge') }}
        </p>

        <div class="hero-actions">
          <router-link :to="{ name: 'Editor' }" class="hero-cta">
            {{ $t('hero.cta') }}
          </router-link>
        </div>

        <!-- =====================================================
             ĐÃI NGỘ — 3 cam kết cốt lõi, một hàng gọn
        ====================================================== -->
        <ul class="hero-perks">
          <li>
            <span class="hero-perks__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
              </svg>
            </span>

            <div>
              <strong>{{ $t('hero.stat1v') }}</strong>
              <span>{{ $t('hero.stat1') }}</span>
            </div>
          </li>

          <li>
            <span class="hero-perks__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="m9 12 2 2 4-4" />
              </svg>
            </span>

            <div>
              <strong>{{ $t('stats.trialValue') }}</strong>
              <span>{{ $t('hero.stat2') }}</span>
            </div>
          </li>

          <li>
            <span class="hero-perks__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </span>

            <div>
              <strong>{{ $t('hero.stat3v') }}</strong>
              <span>{{ $t('hero.stat3') }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- =====================================================
           CỘT MOCKUP — hai thiệp trượt ngược chiều khi cuộn
      ====================================================== -->
      <div class="hero-mockup" aria-hidden="true">
        <img
          :src="mockupLeft"
          alt=""
          class="hero-mockup__img hero-mockup__img--left"
          :style="{ transform: `translate3d(0, ${leftOffset}px, 0)` }"
        />

        <img
          :src="mockupRight"
          alt=""
          class="hero-mockup__img hero-mockup__img--right"
          :style="{ transform: `translate3d(0, ${rightOffset}px, 0)` }"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

import { previewByStem } from "@/utils/weddingCard";

/*
 * Hai ảnh mockup — dùng ảnh xem trước của hai mẫu đẹp nhất
 * làm mặt đứng điện thoại. Ảnh nguyên trang (dài) nên cắt
 * phần trên làm bìa.
 */
const mockupLeft = computed(() => previewByStem("song-hy-red"));
const mockupRight = computed(() => previewByStem("royal-red"));

/*
 * Hiệu ứng parallax nhẹ: hai mockup trượt ngược chiều nhau
 * theo độ cuộn trang — như trang Chung Đôi. Tắt với người
 * dùng giảm chuyển động.
 */
const scrollY = ref(0);

let raf = null;

function onScroll() {
  if (raf) return;

  raf = requestAnimationFrame(() => {
    scrollY.value = window.scrollY;
    raf = null;
  });
}

const reduced = ref(false);

onMounted(() => {
  reduced.value = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!reduced.value) {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);

  if (raf) cancelAnimationFrame(raf);
});

const leftOffset = computed(() => scrollY.value * 0.22);
const rightOffset = computed(() => -scrollY.value * 0.22);
</script>

<style scoped>
.hero {
  position: relative;

  padding: 48px 0 40px;

  overflow: hidden;
}

.hero-wash {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(185, 151, 91, 0.16),
      transparent 40%
    ),
    radial-gradient(
      circle at 6% 90%,
      rgba(166, 58, 46, 0.06),
      transparent 36%
    );

  /* mờ dần về chân để hoà vào section kế tiếp */
  mask-image: linear-gradient(black 50%, transparent 96%);

  pointer-events: none;
}

.hero-grid {
  position: relative;
  z-index: 1;

  display: grid;
  grid-template-columns: 1fr;

  gap: 44px;
  align-items: center;
}

/* =====================================================
   CỘT CHỮ
===================================================== */

.hero-copy {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
}

.hero-brand {
  margin: 0 0 10px;

  font-size: clamp(22px, 3vw, 30px);
  font-weight: 700;
}

.hero-brand__name {
  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-script, cursive);
}

.hero-brand span:last-child {
  color: var(--studio-ink, #2b2118);
}

.hero-copy h1 {
  max-width: 620px;

  margin: 0 0 16px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(30px, 5vw, 52px);
  font-weight: 700;

  line-height: 1.08;
  letter-spacing: -0.02em;
}

.hero-quote {
  margin: 0 0 14px;

  color: var(--studio-ink-soft, #5c4f43);

  font-family: var(--font-heading);
  font-size: 15.5px;
  font-style: italic;

  line-height: 1.7;
}

/*
 * Hai câu dẫn: bản ngắn cho điện thoại, bản dài cho máy
 * tính — mặc định hiện bản ngắn, từ 768px trở lên đảo lại.
 */
.hero-lead--mobile {
  display: block;
}

.hero-quote,
.hero-lead:not(.hero-lead--mobile) {
  display: none;
}

.hero-lead {
  max-width: 520px;

  margin: 0 0 14px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 15px;

  line-height: 1.75;
}

.hero-trust {
  margin: 0 0 26px;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 13px;
}

.hero-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: 15px 40px;

  border-radius: 999px;

  background: linear-gradient(135deg, var(--studio-seal, #a63a2e), #7c2a20);
  color: #fdf6ec;

  font-size: 16px;
  font-weight: 600;

  letter-spacing: 0.01em;
  white-space: nowrap;
  text-decoration: none;

  box-shadow: 0 16px 36px rgba(166, 58, 46, 0.32);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
}

.hero-cta:hover {
  transform: scale(1.05);

  filter: brightness(1.06);

  box-shadow: 0 22px 46px rgba(166, 58, 46, 0.4);
}

/* =====================================================
   ĐÃI NGỘ — 3 cam kết, một hàng gọn dưới nút CTA
===================================================== */

.hero-perks {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 8px;

  width: 100%;
  max-width: 420px;

  margin: 22px 0 0;
  padding: 0;

  list-style: none;
}

.hero-perks li {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 6px;

  padding: 12px 6px 10px;

  border: 1px solid rgba(185, 151, 91, 0.28);
  border-radius: 14px;

  background: var(--studio-glass, rgba(255, 253, 248, 0.7));

  text-align: center;
}

.hero-perks__icon {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  border-radius: 50%;

  background: rgba(166, 58, 46, 0.1);
  color: var(--studio-seal, #a63a2e);
}

.hero-perks__icon svg {
  width: 15px;
  height: 15px;
}

.hero-perks strong {
  display: block;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 15px;
  font-weight: 700;

  line-height: 1.1;
}

.hero-perks span:not(.hero-perks__icon) {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 10.5px;

  line-height: 1.3;
}

/* =====================================================
   CỘT MOCKUP — hai thiệp chồng lệch, parallax ngược chiều
===================================================== */

.hero-mockup {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 400px;
}

.hero-mockup__img {
  position: absolute;

  width: 200px;

  border: 1px solid rgba(185, 151, 91, 0.45);
  border-radius: 18px;

  box-shadow: 0 25px 25px rgba(0, 0, 0, 0.15);

  object-fit: cover;
  object-position: center top;

  will-change: transform;
}

.hero-mockup__img--left {
  left: 4%;
  top: 6%;

  z-index: 10;

  aspect-ratio: 2 / 3;
}

.hero-mockup__img--right {
  right: 4%;
  top: 0;

  z-index: 20;

  aspect-ratio: 9 / 16;

  box-shadow: 0 30px 30px rgba(0, 0, 0, 0.2);
}

/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .hero {
    padding: 80px 0 64px;
  }

  .hero-grid {
    grid-template-columns: 1fr 1fr;

    gap: 48px;
  }

  /* máy tính: hiện câu trích + đoạn dẫn đầy đủ, ẩn bản ngắn */
  .hero-quote,
  .hero-lead:not(.hero-lead--mobile) {
    display: block;
  }

  .hero-lead--mobile {
    display: none;
  }

  .hero-mockup {
    height: 500px;

    /* dịch cả khối sang trái một chút như bản gốc */
    transform: translateX(-22px);
  }

  .hero-mockup__img--left {
    width: 300px;
  }

  .hero-mockup__img--right {
    width: 252px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-cta {
    transition: none;
  }
}

/* =====================================================
   ĐIỆN THOẠI
===================================================== */

@media (max-width: 640px) {
  .hero {
    padding: 36px 0 28px;
  }

  .hero-grid {
    gap: 32px;
  }

  .hero-copy h1 {
    font-size: clamp(28px, 8.6vw, 38px);
  }

  .hero-quote {
    font-size: 14.5px;
  }

  .hero-lead {
    font-size: 14.5px;

    line-height: 1.7;
  }

  .hero-trust {
    margin-bottom: 22px;

    font-size: 12.5px;
  }

  .hero-cta {
    width: 100%;
    max-width: 320px;

    padding: 15px 28px;
  }

  /*
   * Hai mockup 200px cộng lại vượt bề rộng máy 360px nên
   * chúng chồng lên nhau gần hết. Thu nhỏ và hạ chiều cao
   * khung để phần ảnh không chiếm gần trọn màn hình đầu.
   */
  .hero-mockup {
    height: 300px;
  }

  .hero-mockup__img {
    width: 150px;

    border-radius: 14px;
  }

  .hero-mockup__img--left {
    left: 2%;
  }

  .hero-mockup__img--right {
    right: 2%;
  }
}

@media (max-width: 380px) {
  .hero-mockup {
    height: 260px;
  }

  .hero-mockup__img {
    width: 128px;
  }
}
</style>
