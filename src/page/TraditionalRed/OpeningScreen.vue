<template>
  <div class="tr-cover">
    <!-- =====================================================
         HOA VĂN NỀN
    ====================================================== -->

    <div class="tr-cover__bg" aria-hidden="true"></div>

    <!-- =====================================================
         HẠT 囍 BAY LÊN
    ====================================================== -->

    <div class="tr-cover__ambient" aria-hidden="true">
      <span
        v-for="(item, index) in particles"
        :key="index"
        class="tr-cover__particle"
        :style="item"
        >囍</span
      >
    </div>

    <!-- =====================================================
         THIỆP
    ====================================================== -->

    <div class="tr-cover__stage">
      <div class="tr-cover__card-wrap">
        <!-- CON DẤU -->
        <div class="tr-cover__seal" aria-hidden="true">
          <span class="tr-cover__seal-mark"></span>
        </div>

        <!-- THẺ -->
        <div class="tr-cover__card">
          <div class="tr-cover__card-inner" aria-hidden="true">
            <img :src="phuong" alt="" class="tr-cover__deco tr-cover__deco--tl" />
            <img :src="rong" alt="" class="tr-cover__deco tr-cover__deco--br" />
            <img :src="cloud" alt="" class="tr-cover__deco tr-cover__deco--cloud" />
          </div>

          <div class="tr-cover__content">
            <h1 class="tr-cover__names">
              <span class="tr-cover__name">{{ groomShort }}</span>
              <span class="tr-cover__amp">&amp;</span>
              <span class="tr-cover__name">{{ brideShort }}</span>
            </h1>

            <div class="tr-cover__divider" aria-hidden="true">
              <span class="tr-cover__line"></span>
              <span class="tr-cover__leaf">❦</span>
              <span class="tr-cover__line tr-cover__line--rev"></span>
            </div>

            <p v-if="dateLabel" class="tr-cover__date">{{ dateLabel }}</p>

            <div class="tr-cover__invite">
              <p class="tr-cover__invite-label">Thân Mời</p>

              <div class="tr-cover__guest">
                <h2>{{ guestName }}</h2>
              </div>

              <p class="tr-cover__invite-sub">
                đến dự buổi tiệc chung vui cùng gia đình
              </p>
            </div>

            <button type="button" class="tr-cover__button" @click="emit('open')">
              <span>Mở thiệp</span>
              <span class="tr-cover__shine" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

import { cloud, phuong, rong } from "./traditionalRedAssets";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },

  guestName: {
    type: String,
    default: "Quý khách",
  },

  dateLabel: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["open"]);

/* =========================================================
   TÊN CÔ DÂU / CHÚ RỂ
========================================================= */

const groomShort = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    "Chú rể"
);

const brideShort = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    "Cô dâu"
);

/* =========================================================
   HẠT 囍 BAY LÊN
   Bảng cố định (không random mỗi lần render) để chuyển
   động đều và không giật khi re-render.
========================================================= */

const COLORS = ["#C41E3A", "#B22222", "#D4A017", "#E8A735"];

const SEEDS = [
  [55.5, 19.5, 3.5, 21.7, -11.4],
  [69.9, 20.6, 14.8, 23.3, -10.6],
  [58.0, 17.9, -17.6, 21.3, -19.6],
  [85.3, 12.8, -29.0, 24.6, -15.2],
  [43.3, 22.2, 10.7, 20.7, -3.9],
  [48.8, 19.8, -0.7, 18.9, -13.0],
  [29.6, 10.2, 0.5, 21.4, -1.7],
  [73.0, 18.9, -2.5, 24.6, -11.5],
  [49.6, 22.5, 8.4, 25.7, -15.8],
  [27.4, 15.0, 0.8, 25.9, -1.1],
  [70.0, 18.9, -15.4, 22.6, -2.1],
  [39.5, 21.2, -20.5, 19.7, -7.7],
];

const particles = SEEDS.map((seed, index) => {
  const [left, size, sway, duration, delay] = seed;

  return {
    left: `${left}%`,
    fontSize: `${size}px`,
    color: COLORS[index % COLORS.length],
    "--sway": `${sway}px`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  };
});
</script>

<style scoped>
/* =========================================================
   KHUNG NGOÀI
========================================================= */

.tr-cover {
  position: fixed;

  inset: 0;

  z-index: 999;

  display: flex;

  align-items: center;
  justify-content: center;

  overflow: hidden;

  background-color: #4a0808;

  isolation: isolate;
}

.tr-cover__bg {
  position: absolute;

  inset: 0;

  z-index: 0;

  background: url("@/assets/longphung/bg-frame.jpg") center / cover no-repeat;
}

/* =========================================================
   HẠT 囍
========================================================= */

.tr-cover__ambient {
  position: absolute;

  inset: 0;

  z-index: 1;

  overflow: hidden;

  pointer-events: none;
}

.tr-cover__particle {
  position: absolute;

  bottom: -30px;

  line-height: 1;

  font-family: var(--font-symbol, "Noto Serif SC", serif);

  animation-name: tr-ambient-rise;

  animation-timing-function: ease-in-out;

  animation-iteration-count: infinite;

  will-change: transform, opacity;
}

@keyframes tr-ambient-rise {
  0% {
    transform: translate3d(0, 0, 0) rotate(0deg);

    opacity: 0;
  }

  12% {
    opacity: 0.85;
  }

  50% {
    transform: translate3d(var(--sway, 0px), -46vh, 0) rotate(18deg);
  }

  88% {
    opacity: 0.5;
  }

  100% {
    transform: translate3d(0, -96vh, 0) rotate(-12deg);

    opacity: 0;
  }
}

/* =========================================================
   STAGE
========================================================= */

.tr-cover__stage {
  position: relative;

  z-index: 10;

  width: 100%;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 24px 16px;
}

.tr-cover__card-wrap {
  position: relative;

  width: 310px;

  max-width: 100%;
}

/* =========================================================
   CON DẤU
========================================================= */

.tr-cover__seal {
  position: absolute;

  top: 50px;
  left: 50%;

  z-index: 30;

  width: 56px;
  height: 56px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  transform: translate(-50%, -50%);

  background: radial-gradient(circle at 30% 30%, #e9ce9e, #cbb080);

  box-shadow: 0 4px 20px rgba(233, 206, 158, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);

  animation: tr-seal-pulse 2s ease-in-out infinite;
}

.tr-cover__seal-mark {
  width: 32px;
  height: 32px;

  background-color: #4a0808;

  opacity: 0.9;

  -webkit-mask-image: url("@/assets/longphung/chu-hy.webp");
  mask-image: url("@/assets/longphung/chu-hy.webp");

  -webkit-mask-size: contain;
  mask-size: contain;

  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;

  -webkit-mask-position: center;
  mask-position: center;
}

@keyframes tr-seal-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }

  50% {
    transform: translate(-50%, -50%) scale(1.06);
  }
}

/* =========================================================
   THẺ
========================================================= */

.tr-cover__card {
  position: relative;

  border-radius: 8px;

  box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.45),
    0 8px 24px rgba(0, 0, 0, 0.2), 0 0 40px rgba(233, 206, 158, 0.15);
}

.tr-cover__card-inner {
  position: absolute;

  inset: 0;

  overflow: hidden;

  border-radius: 8px;

  background: #680d0e;

  border: 1px solid rgba(233, 206, 158, 0.15);

  clip-path: inset(0 round 8px);
}

.tr-cover__deco {
  position: absolute;

  width: 200px;

  pointer-events: none;

  opacity: 0.3;
}

.tr-cover__deco--tl {
  top: -10px;
  left: -70px;
}

.tr-cover__deco--br {
  bottom: -40px;
  right: -70px;
}

.tr-cover__deco--cloud {
  width: 80px;

  top: 8px;
  right: 8px;

  opacity: 0.2;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tr-cover__content {
  position: relative;

  z-index: 10;

  padding: 112px 24px 56px;

  text-align: center;
}

.tr-cover__names {
  margin: 0 0 8px;

  display: flex;

  flex-direction: column;

  align-items: center;

  line-height: 1.15;

  color: #e9ce9e;

  font-family: "EB Garamond", "Cormorant Garamond", serif;

  font-size: 30px;

  font-weight: 500;
}

.tr-cover__name {
  display: block;

  width: 100%;

  text-align: center;
}

.tr-cover__amp {
  display: block;

  width: 100%;

  text-align: center;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 18px;

  line-height: 1;
}

/* =========================================================
   ĐƯỜNG CHIA
========================================================= */

.tr-cover__divider {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  margin-bottom: 8px;
}

.tr-cover__line {
  width: 40px;
  height: 1px;

  background: linear-gradient(to right, transparent, #e9ce9e);
}

.tr-cover__line--rev {
  background: linear-gradient(to left, transparent, #e9ce9e);
}

.tr-cover__leaf {
  color: #e9ce9e;

  opacity: 0.7;

  font-size: 14px;
}

/* =========================================================
   NGÀY
========================================================= */

.tr-cover__date {
  margin: 0 0 20px;

  color: rgba(233, 206, 158, 0.8);

  font-family: "Lora", "Times New Roman", serif;

  font-size: 18px;
}

/* =========================================================
   LỜI MỜI
========================================================= */

.tr-cover__invite {
  margin-bottom: 24px;
}

.tr-cover__invite-label {
  margin: 0 0 8px;

  color: rgba(233, 206, 158, 0.8);

  font-family: "Lora", "Times New Roman", serif;

  font-size: 18px;

  font-weight: 300;
}

.tr-cover__guest {
  display: inline-block;

  max-width: 100%;

  margin-bottom: 8px;

  padding: 10px 20px;

  border-radius: 12px;

  background-color: rgba(233, 206, 158, 0.15);

  overflow-wrap: anywhere;
}

.tr-cover__guest h2 {
  margin: 0;

  color: #e9ce9e;

  font-family: "Lora", "Times New Roman", serif;

  font-size: 18px;

  font-weight: 600;
}

.tr-cover__invite-sub {
  margin: 0;

  color: rgba(233, 206, 158, 0.8);

  font-family: "Lora", "Times New Roman", serif;

  font-size: 16px;

  font-weight: 300;
}

/* =========================================================
   NÚT MỞ THIỆP
========================================================= */

.tr-cover__button {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: fit-content;

  margin: 0 auto;

  padding: 10px 32px;

  border: none;

  border-radius: 999px;

  overflow: hidden;

  cursor: pointer;

  background-color: #e9ce9e;

  color: #4a0808;

  font-family: "Lora", "Times New Roman", serif;

  font-size: 18px;

  font-weight: 600;

  box-shadow: 0 4px 14px rgba(233, 206, 158, 0.35);

  -webkit-tap-highlight-color: transparent;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.tr-cover__button:hover {
  transform: translateY(-1px);

  box-shadow: 0 8px 22px rgba(233, 206, 158, 0.45);
}

.tr-cover__button:active {
  transform: translateY(0);
}

.tr-cover__shine {
  position: absolute;

  top: 0;

  height: 100%;

  width: 32px;

  pointer-events: none;

  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );

  animation: tr-shine 3s ease-in-out infinite;
}

@keyframes tr-shine {
  0% {
    left: -20%;
  }

  55%,
  100% {
    left: 120%;
  }
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 640px) {
  .tr-cover__card-wrap {
    width: 340px;
  }

  .tr-cover__names {
    font-size: 36px;
  }

  .tr-cover__amp {
    font-size: 20px;
  }

  .tr-cover__guest h2 {
    font-size: 20px;
  }
}

@media (min-width: 768px) {
  .tr-cover__card-wrap {
    width: 520px;
  }

  .tr-cover__content {
    padding: 96px 24px 32px;
  }

  .tr-cover__deco {
    width: 280px;
  }

  .tr-cover__deco--tl {
    top: -20px;
    left: -90px;
  }

  .tr-cover__deco--br {
    bottom: -100px;
    right: -90px;
  }

  .tr-cover__deco--cloud {
    width: 100px;

    top: 12px;
    right: 12px;
  }
}

@media (min-width: 1024px) {
  .tr-cover__card-wrap {
    width: 600px;
  }
}

/* =========================================================
   MÀN HÌNH THẤP
========================================================= */

@media (max-height: 700px) {
  .tr-cover__content {
    padding-top: 88px;
    padding-bottom: 36px;
  }

  .tr-cover__names {
    font-size: 26px;
  }

  .tr-cover__date,
  .tr-cover__invite-label {
    font-size: 16px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .tr-cover__particle,
  .tr-cover__seal,
  .tr-cover__shine {
    animation: none;
  }

  .tr-cover__particle {
    opacity: 0.35;
  }
}
</style>
