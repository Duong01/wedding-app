<template>
  <section class="hero">
    <!-- =====================================================
         BẢNG ĐỎ SON — nền hero, tròn hai góc dưới, nổi trên trang
    ====================================================== -->
    <div class="hero-board" aria-hidden="true">
      <div class="hero-board__glow hero-board__glow--gold"></div>
      <div class="hero-board__glow hero-board__glow--seal"></div>
      <div class="hero-board__grain"></div>
    </div>

    <div class="mk-container hero-grid">
      <!-- =====================================================
           CỘT CHỮ — ngà + foil trên nền đêm
      ====================================================== -->
      <div class="hero-copy">
        <p class="hero-brand">
          <span class="hero-brand__name">ThiệpNhàMình</span><span>.com</span>
        </p>

        <h1>
          {{ $t('hero.h1a') }}
          <em class="hero-h1__accent">{{ $t('hero.h1b') }}</em>
        </h1>

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

        <div class="hero-actions">
          <router-link :to="{ name: 'Templates' }" class="hero-cta">
            <span class="hero-cta__label">{{ $t('hero.cta') }}</span>
            <span class="hero-cta__arrow" aria-hidden="true">→</span>
          </router-link>

          <!-- <router-link :to="{ name: 'Templates' }" class="hero-cta hero-cta--ghost">
            {{ $t('hero.viewTemplates') }}
          </router-link> -->
        </div>

        <p class="hero-trust">
          <span class="hero-trust__shield" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 12 2 2 4-4" />
            </svg>
          </span>

          {{ $t('hero.badge') }}
        </p>
      </div>

      <!-- =====================================================
           CỘT MOCKUP — bộ ba thiệp xoè vòng cung trên nền đêm
      ====================================================== -->
      <div class="hero-mockup" aria-hidden="true">
        <div class="hero-mockup__ring"></div>

        <div
          v-for="(card, index) in deck"
          :key="card.src"
          class="hero-mockup__slot"
          :class="`is-${index}`"
          :style="{ '--drift': drift(index) + 'px' }"
        >
          <img :src="card.src" alt="" class="hero-mockup__img" />
        </div>

        <!-- huy hiệu nổi lơ lửng quanh mockup -->
        <span class="hero-chip hero-chip--trial">
          <span class="hero-chip__dot" aria-hidden="true"></span>
          {{ $t('stats.trialValue') }}
        </span>

        <span class="hero-chip hero-chip--forever">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          {{ $t('hero.stat3v') }}
        </span>
      </div>
    </div>

    <!-- =====================================================
         SỐ LIỆU LỚN — dải đáy bảng tối, tách bạch bằng kẻ foil
    ====================================================== -->
    <div class="mk-container">
      <dl class="hero-stats">
        <div class="hero-stats__item">
          <dt>{{ $t('hero.statTemplates') }}</dt>
          <dd>{{ templateCount }}</dd>
        </div>

        <div class="hero-stats__item">
          <dt>{{ $t('stats.trial') }}</dt>
          <dd>{{ $t('stats.trialValue') }}</dd>
        </div>

        <div class="hero-stats__item">
          <dt>{{ $t('hero.statCreated') }}</dt>
          <dd>{{ $t('hero.big3v') }}</dd>
        </div>

        <div class="hero-stats__item">
          <dt>{{ $t('hero.statRating') }}</dt>
          <dd>{{ $t('hero.big4v') }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, onMounted, onUnmounted, ref } from "vue";

import { previewByStem } from "@/utils/weddingCard";

const { t } = useI18n();

const props = defineProps({
  /*
   * Danh sách mẫu thiệp từ store — dùng đếm số mẫu thật cho
   * dải số liệu (nào có dữ liệu thì hiện số thật + dấu +).
   */
  weddings: { type: Array, default: () => [] },
});

/*
 * Số mẫu thiệp — lấy số thật từ store, kèm dấu + để gợi
 * cảm giác còn nhiều mẫu đang chờ khám phá. Chưa tải được
 * dữ liệu thì về con số tối thiểu 26+.
 */
const templateCount = computed(() => {
  const n = props.weddings.length;

  return n > 0 ? `${n}+` : t("hero.big1v");
});

/*
 * Bộ ba thiệp xoè vòng cung — lấy ba mẫu đẹp nhất làm mặt
 * đứng. Ảnh nguyên trang (dài) nên cắt phần trên làm bìa.
 * Vị trí vòng cung định vị bằng CSS (.hero-mockup__slot),
 * JS chỉ cộng thêm độ trôi parallax theo cuộn.
 */
const DECK_STEMS = ["song-hy-red", "royal-red", "elegant-gold"];

const deck = computed(() =>
  DECK_STEMS.map((stem) => ({
    src: previewByStem(stem),
  }))
);

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

/* hệ số parallax từng vị trí: giữa chậm, hai bên nhanh */
const PARALLAX = [0.3, 0.16, -0.3];

function drift(index) {
  if (reduced.value) return 0;

  return scrollY.value * (PARALLAX[index] ?? 0.16);
}
</script>

<style scoped>
.hero {
  position: relative;

  padding: 0 0 48px;
}

/* =====================================================
   BẢNG ĐỎ SON — tròn hai góc dưới, phủ trọn phần đầu trang
   Nền đỏ đậm của thương hiệu: nổi trên cả nền kem (light)
   lẫn nền nâu tối (dark mode) — không bị "chìm" như bảng
   nâu đêm cũ. Bảng phủ trọn section (kể cả dải số liệu
   ở đáy) để chữ ngà/foil luôn nằm trên nền đỏ.
===================================================== */

.hero-board {
  position: absolute;
  inset: 0;

  overflow: hidden;

  border-radius: 0 0 min(14vw, 180px) min(14vw, 180px);

  background:
    radial-gradient(
      ellipse 120% 90% at 50% -20%,
      rgba(233, 189, 118, 0.22),
      transparent 55%
    ),
    linear-gradient(165deg, #a63a2e 0%, #8a2c22 45%, #6e2018 100%);

  box-shadow: 0 30px 80px rgba(110, 32, 24, 0.4);
}

/* hai vệt sáng lớn — vàng foil trên, đỏ nhạt dưới */
.hero-board__glow {
  position: absolute;

  border-radius: 50%;

  pointer-events: none;
}

.hero-board__glow--gold {
  top: -30%;
  right: -18%;

  width: 70%;
  height: 90%;

}

.hero-board__glow--seal {
  bottom: -40%;
  left: -15%;

  width: 60%;
  height: 80%;

  background: radial-gradient(
    circle,
    rgba(166, 58, 46, 0.5),
    transparent 65%
  );
}

/* vân giấy mờ phủ toàn bảng — chiều sâu cho nền phẳng */
.hero-board__grain {
  position: absolute;
  inset: 0;

  background-image: radial-gradient(
    rgba(253, 246, 236, 0.07) 1px,
    transparent 1px
  );

  background-size: 22px 22px;

  mask-image: radial-gradient(
    ellipse 90% 80% at 50% 40%,
    black,
    transparent 75%
  );

  pointer-events: none;
}

/* =====================================================
   LƯỚI CHÍNH
===================================================== */

.hero-grid {
  position: relative;
  z-index: 1;

  display: grid;
  grid-template-columns: 1fr;

  gap: 44px;
  align-items: center;

  padding: 48px 0 40px;
}

/* =====================================================
   CỘT CHỮ — ngà + foil trên nền đêm
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
  color: var(--studio-foil-bright, #d8bc7e);

  font-family: var(--font-script, cursive);
}

.hero-brand span:last-child {
  color: rgba(253, 246, 236, 0.85);
}

.hero-copy h1 {
  max-width: 620px;

  margin: 0 0 16px;

  color: #fdf6ec;

  font-family: var(--font-heading);
  font-size: clamp(30px, 5vw, 52px);
  font-weight: 700;

  line-height: 1.08;
  letter-spacing: -0.02em;
}

.hero-h1__accent {
  display: block;

  color: var(--studio-foil-bright, #d8bc7e);

  font-style: italic;
}

.hero-quote {
  margin: 0 0 14px;

  color: rgba(253, 246, 236, 0.75);

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

  color: rgba(253, 246, 236, 0.72);

  font-size: 15px;

  line-height: 1.75;
}

/* =====================================================
   NÚT HÀNH ĐỘNG — chính + phụ
===================================================== */

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  gap: 12px;

  margin: 4px 0 0;
}

.hero-cta {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  padding: 15px 34px;

  border-radius: 999px;

  background: linear-gradient(135deg, #e9bd76, #c99a55);
  color: #241811;

  font-size: 16px;
  font-weight: 700;

  letter-spacing: 0.01em;
  white-space: nowrap;
  text-decoration: none;

  box-shadow:
    0 16px 36px rgba(233, 189, 118, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;
}

/* vệt sáng quét ngang nút chính khi hover */
.hero-cta::after {
  content: "";

  position: absolute;
  inset: 0;

  border-radius: inherit;

  background: linear-gradient(
    115deg,
    transparent 30%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 70%
  );

  background-size: 220% 100%;
  background-position: 120% 0;

  opacity: 0;

  transition: opacity 0.2s ease;

  pointer-events: none;
}

.hero-cta:hover {
  transform: scale(1.05);

  filter: brightness(1.05);

  box-shadow:
    0 22px 46px rgba(233, 189, 118, 0.38),
    inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.hero-cta:hover::after {
  opacity: 1;

  animation: hero-shine 0.9s ease forwards;
}

@keyframes hero-shine {
  from {
    background-position: 120% 0;
  }

  to {
    background-position: -120% 0;
  }
}

.hero-cta__arrow {
  transition: transform 0.25s ease;
}

.hero-cta:hover .hero-cta__arrow {
  transform: translateX(4px);
}

/* nút phụ — viền foil mảnh, nền đỏ nhạt trong suốt */
.hero-cta--ghost {
  padding: 14px 30px;

  background: rgba(253, 246, 236, 0.1);
  color: #fdf6ec;

  border: 1px solid rgba(233, 189, 118, 0.45);

  font-size: 15px;
  font-weight: 600;

  box-shadow: none;
}

.hero-cta--ghost::after {
  display: none;
}

.hero-cta--ghost:hover {
  transform: translateY(-2px);

  background: rgba(253, 246, 236, 0.18);

  filter: none;
}

.hero-trust {
  display: inline-flex;
  align-items: center;

  gap: 8px;

  margin: 18px 0 0;

  color: rgba(253, 246, 236, 0.6);

  font-size: 13px;
}

.hero-trust__shield {
  display: flex;

  color: var(--studio-foil-bright, #d8bc7e);
}

.hero-trust__shield svg {
  width: 15px;
  height: 15px;
}

/* =====================================================
   CỘT MOCKUP — bộ ba thiệp vòng cung trên nền đêm
===================================================== */

.hero-mockup {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 400px;
}

/* vòng cung foil mờ phía sau bộ ba thiệp */
.hero-mockup__ring {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 340px;
  height: 340px;

  border: 1px solid rgba(233, 189, 118, 0.22);
  border-radius: 50%;

  transform: translate(-50%, -50%);

  pointer-events: none;
}

.hero-mockup__ring::after {
  content: "";

  position: absolute;

  inset: 26px;

  border: 1px dashed rgba(233, 189, 118, 0.14);

  border-radius: 50%;
}

/*
 * Slot định vị từng thiệp trong vòng cung — giữa cao nhất,
 * hai bên thấp hơn và nghiêng ra ngoài. Độ trôi parallax
 * truyền qua biến --drift (JS chỉ set biến, transform gốc
 * nằm ở CSS nên không bị inline style đè). Ảnh bên trong
 * giữ tỉ lệ 9/16 (cắt phần trên của ảnh xem trước dài).
 */
.hero-mockup__slot {
  position: absolute;
  top: 50%;
  left: 50%;

  --drift: 0px;

  will-change: transform;
}

.hero-mockup__slot.is-0 {
  z-index: 2;

  transform: translate(-178px, calc(-34px + var(--drift))) rotate(-9deg);
}

.hero-mockup__slot.is-1 {
  z-index: 3;

  transform: translate(-50%, calc(-50% + var(--drift)));
}

.hero-mockup__slot.is-2 {
  z-index: 2;

  transform: translate(28px, calc(-34px + var(--drift))) rotate(9deg);
}

.hero-mockup__img {
  display: block;

  width: 150px;
  aspect-ratio: 9 / 16;

  border: 1px solid rgba(233, 189, 118, 0.35);
  border-radius: 14px;

  box-shadow:
    0 30px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(0, 0, 0, 0.2);

  object-fit: cover;
  object-position: center top;
}

.hero-mockup__slot.is-1 .hero-mockup__img {
  width: 166px;

  border-color: rgba(233, 189, 118, 0.5);
}

.hero-mockup__slot.is-0 .hero-mockup__img,
.hero-mockup__slot.is-2 .hero-mockup__img {
  opacity: 0.92;
}

/* =====================================================
   HUY HIỆU NỔI — lơ lửng quanh mockup
===================================================== */

.hero-chip {
  position: absolute;
  z-index: 30;

  display: inline-flex;
  align-items: center;

  gap: 7px;

  padding: 8px 14px;

  border: 1px solid rgba(233, 189, 118, 0.4);
  border-radius: 999px;

  background: rgba(110, 32, 24, 0.72);
  color: #fdf6ec;

  font-size: 12.5px;
  font-weight: 700;

  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);

  backdrop-filter: blur(8px);

  animation: hero-float 5s ease-in-out infinite;
}

.hero-chip svg {
  width: 14px;
  height: 14px;

  color: var(--studio-foil-bright, #d8bc7e);
}

.hero-chip--trial {
  top: 10%;
  right: 0;
}

.hero-chip--forever {
  bottom: 8%;
  left: 0;

  animation-delay: -2.5s;
}

.hero-chip__dot {
  width: 8px;
  height: 8px;

  border-radius: 50%;

  background: var(--studio-foil-bright, #d8bc7e);
}

@keyframes hero-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

/* =====================================================
   SỐ LIỆU LỚN — dải đáy bảng tối
===================================================== */

.hero-stats {
  position: relative;
  z-index: 1;

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 1px;

  margin: 0;
  padding: 0;

  border-top: 1px solid rgba(233, 189, 118, 0.3);

  background: rgba(233, 189, 118, 0.3);

  border-radius: 0 0 18px 18px;

  overflow: hidden;
}

.hero-stats__item {
  display: flex;
  flex-direction: column;

  gap: 2px;

  padding: 18px 16px 16px;

  background: rgba(110, 32, 24, 0.85);

  text-align: center;
}

.hero-stats__item dt {
  order: 2;

  color: rgba(253, 246, 236, 0.65);

  font-size: 11.5px;
  font-weight: 600;

  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-stats__item dd {
  margin: 0;

  color: var(--studio-foil-bright, #d8bc7e);

  font-family: var(--font-num, var(--font-heading));
  font-size: clamp(24px, 3.4vw, 34px);
  font-weight: 700;

  line-height: 1.1;
}

/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .hero {
    padding: 0 0 64px;
  }

  .hero-grid {
    grid-template-columns: 1fr 1fr;

    gap: 48px;

    padding: 80px 0 56px;
  }

  /* máy tính: hiện câu trích + đoạn dẫn đầy đủ, ẩn bản ngắn */
  .hero-quote,
  .hero-lead:not(.hero-lead--mobile) {
    display: block;
  }

  .hero-lead--mobile {
    display: none;
  }

  .hero-actions {
    justify-content: flex-start;
  }

  .hero-copy {
    align-items: flex-start;

    text-align: left;
  }

  .hero-mockup {
    height: 500px;
  }

  .hero-mockup__ring {
    width: 420px;
    height: 420px;
  }

  .hero-mockup__slot.is-0 {
    transform: translate(-232px, calc(-44px + var(--drift))) rotate(-9deg);
  }

  .hero-mockup__slot.is-2 {
    transform: translate(66px, calc(-44px + var(--drift))) rotate(9deg);
  }

  .hero-mockup__img {
    width: 186px;
  }

  .hero-mockup__slot.is-1 .hero-mockup__img {
    width: 206px;
  }

  .hero-chip--trial {
    top: 12%;
    right: -2%;
  }

  .hero-chip--forever {
    bottom: 10%;
    left: -2%;
  }

  .hero-stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .hero-stats__item {
    padding: 22px 20px 20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-cta,
  .hero-cta__arrow,
  .hero-cta--ghost {
    transition: none;
  }

  .hero-cta:hover::after {
    animation: none;

    opacity: 0;
  }

  .hero-chip {
    animation: none;
  }
}

/* =====================================================
   ĐIỆN THOẠI
===================================================== */

@media (max-width: 640px) {
  .hero {
    padding: 0 0 36px;
  }

  .hero-grid {
    gap: 32px;

    padding: 36px 0 28px;
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

  .hero-actions {
    flex-direction: column;

    width: 100%;
  }

  .hero-cta,
  .hero-cta--ghost {
    width: 100%;
    max-width: 320px;
  }

  .hero-cta {
    padding: 15px 28px;
  }

  .hero-trust {
    margin-bottom: 22px;

    font-size: 12.5px;
  }

  .hero-mockup {
    height: 300px;
  }

  .hero-mockup__ring {
    width: 250px;
    height: 250px;
  }

  .hero-mockup__slot.is-0 {
    transform: translate(-128px, calc(-24px + var(--drift))) rotate(-9deg);
  }

  .hero-mockup__slot.is-2 {
    transform: translate(18px, calc(-24px + var(--drift))) rotate(9deg);
  }

  .hero-mockup__img {
    width: 112px;
  }

  .hero-mockup__slot.is-1 .hero-mockup__img {
    width: 124px;
  }

  .hero-chip {
    padding: 6px 11px;

    font-size: 11.5px;
  }

  .hero-chip--trial {
    top: 4%;
    right: 2%;
  }

  .hero-chip--forever {
    bottom: 2%;
    left: 2%;
  }

  .hero-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hero-stats__item {
    padding: 14px 12px 12px;
  }

  .hero-stats__item dd {
    font-size: 22px;
  }
}

@media (max-width: 380px) {
  .hero-mockup {
    height: 260px;
  }

  .hero-mockup__slot.is-0 {
    transform: translate(-114px, calc(-22px + var(--drift))) rotate(-9deg);
  }

  .hero-mockup__slot.is-2 {
    transform: translate(14px, calc(-22px + var(--drift))) rotate(9deg);
  }

  .hero-mockup__img {
    width: 100px;
  }

  .hero-mockup__slot.is-1 .hero-mockup__img {
    width: 112px;
  }

  .hero-stats__item dd {
    font-size: 20px;
  }
}
</style>
