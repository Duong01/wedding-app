<template>
  <section class="lp-hero">
    <!-- Nền rồng phượng parallax -->
    <div class="lp-hero__bg" aria-hidden="true">
      <div ref="parallaxRef" class="lp-hero__bg-track">
        <img
          v-for="n in 12"
          :key="n"
          :src="n % 2 === 1 ? phung : rong"
          alt=""
          class="lp-hero__bg-img"
          :class="{ 'lp-hero__bg-img--first': n === 1 }"
          draggable="false"
        />
      </div>
    </div>

    <!-- Hàng tên: chú rể | 囍 | cô dâu -->
    <header class="lp-hero__header">
      <div class="lp-hero__names-row">
        <div class="lp-hero__name">
          <p>{{ groomName }}</p>
        </div>

        <div class="lp-hero__chuhy">
          <img :src="chuHy" alt="囍" draggable="false" />
        </div>

        <div class="lp-hero__name">
          <p>{{ brideName }}</p>
        </div>
      </div>

      <!-- Khung SVG + ảnh cưới + 2 chim én -->
      <div v-if="showPhotos" class="lp-hero__frame-wrap">
        <img :src="chimEn" alt="" aria-hidden="true" class="lp-hero__bird lp-hero__bird--left" draggable="false" />
        <img :src="chimEn" alt="" aria-hidden="true" class="lp-hero__bird lp-hero__bird--right" draggable="false" />

        <svg
          class="lp-hero__frame"
          viewBox="-7.5 0 754 1099"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="lp-hero-frame-outer">
              <path :d="framePath" />
            </clipPath>

            <clipPath id="lp-hero-clip">
              <path :d="framePath" transform="translate(369.5 553.5) scale(0.98091 0.98804) translate(-369.5 -553.5)" />
            </clipPath>
          </defs>

          <image :href="frame" x="0" y="0" width="754" height="1099" clip-path="url(#lp-hero-frame-outer)" />

          <image
            v-if="heroImage"
            :href="heroImage"
            x="0"
            y="0"
            width="754"
            height="1099"
            clip-path="url(#lp-hero-clip)"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>

        <div v-if="!heroImage" class="lp-hero__frame-fallback">
          <span>囍</span>
        </div>
      </div>

      <!-- Thông tin khách mời + thời gian -->
      <div class="lp-hero__info">
        <p class="lp-hero__guest">{{ guestName }}</p>

        <p class="lp-hero__subtitle">{{ heroSubtitle }}</p>

        <p v-if="location" class="lp-hero__location">{{ location }}</p>

        <div class="lp-hero__schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>

        <p class="lp-hero__message">
          Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!
        </p>
      </div>
    </header>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import dayjs from "dayjs";
import chimEn from "@/assets/decor/longphung-v3/chim-en.webp";
import chuHy from "@/assets/decor/longphung-v3/chu-hy.webp";
import frame from "@/assets/decor/longphung-v3/frame.svg";
import phung from "@/assets/decor/longphung-v3/phung.webp";
import rong from "@/assets/decor/longphung-v3/rong.webp";

/*
 * Đường viền khung ảnh SVG — lấy từ frame.svg gốc của mẫu
 * Long Phụng V3 Đỏ (viewBox "-7.5 0 754 1099").
 */
const framePath =
  "M228.5,1055 C334.984,1055 441.468,1055.014 547.953,1054.954 C552.565,1054.951 557.299,1054.816 561.77,1053.818 C587.42,1048.092 605.609,1033.486 613.947,1008.096 C616.121,1001.475 616.769,994.353 618.145,987.324 C635.537,985.235 643.773,982.674 655.945,973.945 C673.843,961.11 683.913,943.592 683.924,921.395 C684.045,677.096 684.005,432.797 683.96,188.498 C683.959,184.385 683.56,180.244 683,176.163 C679.281,149.073 659.695,127.409 632.889,120.926 C627.506,119.624 621.924,119.145 616.263,118.259 C615.743,106.246 612.673,94.898 606.242,84.598 C593.381,63.998 574.69,52.259 550.521,52.178 C433.372,51.783 316.221,51.985 199.071,52.042 C192.958,52.045 186.798,52.289 180.739,53.048 C157.947,55.903 140.708,67.665 130.359,87.905 C125.447,97.514 123.518,108.648 120.074,119.613 C115.916,120.411 110.303,121.01 105.008,122.641 C99.7,124.276 94.421,126.447 89.63,129.241 C67.002,142.437 55.184,162.706 55.156,188.519 C54.894,431.151 54.993,673.784 55.05,916.416 C55.051,921.358 55.314,926.397 56.285,931.223 C59.49,947.166 66.483,961.038 79.179,971.747 C88.756,979.825 99.385,985.395 111.912,987.02 C115.34,987.465 119.765,986.747 121.912,988.635 C123.923,990.403 123.503,994.917 124.196,998.214 C124.365,999.018 124.792,999.769 124.943,1000.574 C130.73,1031.288 158.409,1054.584 190.006,1054.975 C202.502,1055.129 215.002,1055 228,1055 Z";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  monogram: { type: String, default: "G&B" },
  dateLabel: { type: String, default: "" },
});

/* =========================================
   PARALLAX NỀN RỒNG PHƯỢNG
========================================= */

const parallaxRef = ref(null);
let ticking = false;

function onScroll() {
  if (ticking) return;

  ticking = true;

  window.requestAnimationFrame(() => {
    if (parallaxRef.value) {
      parallaxRef.value.style.transform = `translateY(${window.scrollY * 0.08}px)`;
    }

    ticking = false;
  });
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

/* =========================================
   DỮ LIỆU
========================================= */

const showPhotos = computed(() => props.wedding?.hero?.ShowPhotos !== false);

const heroSubtitle = computed(
  () => props.wedding?.hero?.Subtitle || "TRÂN TRỌNG KÍNH MỜI"
);

const groomName = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    ""
);

const brideName = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    ""
);

const heroImage = computed(
  () =>
    props.wedding?.hero?.Photo ||
    props.wedding?.hero?.Background ||
    props.wedding?.hero?.background ||
    props.wedding?.coverImage ||
    props.wedding?.CoverImage ||
    ""
);

const location = computed(
  () =>
    props.event?.Location ||
    props.event?.Address ||
    props.wedding?.hero?.Location ||
    props.wedding?.events?.[0]?.Location ||
    ""
);

const time = computed(
  () =>
    props.event?.EventTime ||
    props.event?.Time ||
    props.event?.StartTime ||
    props.wedding?.hero?.Time ||
    props.wedding?.events?.[0]?.EventTime ||
    ""
);

const dateText = computed(() => {
  const raw =
    props.event?.EventDate ||
    props.event?.Date ||
    props.wedding?.hero?.WeddingDate ||
    props.wedding?.hero?.weddingDate ||
    props.wedding?.weddingDate;

  const date = dayjs(raw);

  if (date.isValid()) {
    return `${date.day() === 0 ? "CHỦ NHẬT" : `THỨ ${date.day() + 1}`}, NGÀY ${date.format("DD/MM/YYYY")}`;
  }

  return props.dateLabel || "";
});
</script>

<style scoped>
.lp-hero {
  position: relative;
  isolation: isolate;

  width: 100%;

  padding: 32px 0 16px;

  overflow: hidden;
}

/* =========================================================
   NỀN RỒNG PHƯỢNG PARALLAX
========================================================= */

.lp-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;

  overflow: hidden;

  pointer-events: none;
}

.lp-hero__bg-track {
  position: absolute;

  top: 0;
  left: 50%;

  width: 130%;

  transform: translateX(-50%);

  display: flex;
  flex-direction: column;
  gap: 30px;

  will-change: transform;
}

@media (min-width: 768px) {
  .lp-hero__bg-track {
    gap: 50px;
  }
}

@media (min-width: 1024px) {
  .lp-hero__bg-track {
    gap: 80px;
  }
}

.lp-hero__bg-img {
  width: 100%;

  height: auto;

  opacity: 0.4;
}

.lp-hero__bg-img--first {
  margin-top: -50%;
}

/* =========================================================
   HEADER
========================================================= */

.lp-hero__header {
  position: relative;
  z-index: 10;

  width: 100%;

  padding-top: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Hàng tên: tên | 囍 | tên */
.lp-hero__names-row {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  padding: 0 24px;
}

@media (min-width: 768px) {
  .lp-hero__names-row {
    max-width: 480px;

    padding: 0 40px;
  }
}

@media (min-width: 1024px) {
  .lp-hero__names-row {
    max-width: 540px;
  }
}

.lp-hero__name {
  flex: 1;
  min-width: 0;

  text-align: center;
}

.lp-hero__name p {
  margin: 0;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  text-transform: uppercase;

  font-family: "Big Caslon", "Baskerville", "Times New Roman", serif;

  font-size: clamp(15px, 4.2vw, 22px);

  letter-spacing: 0.12em;

  color: #ffbe89;
}

.lp-hero__chuhy {
  flex-shrink: 0;

  width: 64px;

  display: flex;
  align-items: center;
  justify-content: center;
}

@media (min-width: 768px) {
  .lp-hero__chuhy {
    width: 82px;
  }
}

.lp-hero__chuhy img {
  width: 100%;

  height: auto;

  object-fit: contain;
}

/* =========================================================
   KHUNG ẢNH SVG + CHIM ÉN
========================================================= */

.lp-hero__frame-wrap {
  position: relative;

  margin-top: 28px;

  width: 360px;
  height: 525px;
}

@media (min-width: 768px) {
  .lp-hero__frame-wrap {
    margin-top: 36px;

    width: 450px;
    height: 657px;
  }
}

@media (min-width: 1024px) {
  .lp-hero__frame-wrap {
    width: 500px;
    height: 729px;
  }
}

.lp-hero__frame {
  display: block;

  width: 100%;
  height: 100%;

  overflow: visible;

  flex-shrink: 0;
}

.lp-hero__frame-fallback {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;
}

.lp-hero__frame-fallback span {
  font-size: 90px;

  color: rgba(255, 190, 137, 0.25);
}

.lp-hero__bird {
  position: absolute;
  z-index: 10;

  width: 88px;

  height: auto;

  top: -28px;

  pointer-events: none;
}

@media (min-width: 768px) {
  .lp-hero__bird {
    width: 110px;
  }
}

@media (min-width: 1024px) {
  .lp-hero__bird {
    width: 128px;

    top: -42px;
  }
}

.lp-hero__bird--left {
  left: -8px;

  transform: scaleX(-1);
}

.lp-hero__bird--right {
  right: -8px;
}

/* =========================================================
   THÔNG TIN
========================================================= */

.lp-hero__info {
  width: 100%;

  padding: 26px 24px 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  text-align: center;
}

.lp-hero__guest {
  margin: 0;

  font-family: "EB Garamond", "Baskerville", "Times New Roman", serif;

  font-size: 24px;

  color: #ffbe89;
}

.lp-hero__subtitle {
  margin: 0;

  text-transform: uppercase;

  font-size: 13px;

  letter-spacing: 0.14em;

  color: rgba(255, 190, 137, 0.85);
}

.lp-hero__location {
  margin: 0;

  font-size: 14px;

  color: rgba(255, 190, 137, 0.75);
}

.lp-hero__schedule {
  margin-top: 6px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  font-family: "Times New Roman", Times, serif;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.12em;

  color: #ffbe89;
}

.lp-hero__schedule p {
  margin: 0;
}

.lp-hero__message {
  margin: 8px 0 0;

  max-width: 340px;

  font-size: 12px;
  font-style: italic;

  line-height: 1.7;

  color: rgba(255, 190, 137, 0.7);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 380px) {
  .lp-hero__frame-wrap {
    width: 300px;
    height: 438px;
  }

  .lp-hero__bird {
    width: 74px;
  }

  .lp-hero__chuhy {
    width: 54px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .lp-hero__bg-track {
    will-change: auto;
  }
}
</style>
