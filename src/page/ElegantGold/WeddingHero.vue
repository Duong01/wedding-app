<template>
  <header class="la-hero">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->
    <p class="la-hero__title">OUR WEDDING</p>

    <!-- =====================================================
         CỤM KHUNG ẢNH NGHIÊNG
    ====================================================== -->
    <div class="la-hero__stage">
      <div class="la-hero__inner">
        <!-- Khung cô dâu -->
        <div class="la-frame la-frame--bride">
          <div class="la-frame__box">
            <img
              v-if="bridePhoto"
              :src="bridePhoto"
              alt="Cô dâu"
              class="la-frame__photo"
              draggable="false"
            />

            <img :src="brideFrame" alt="" class="la-frame__overlay" aria-hidden="true" />
          </div>
        </div>

        <!-- Khung chú rể -->
        <div class="la-frame la-frame--groom">
          <div class="la-frame__box">
            <img
              v-if="groomPhoto"
              :src="groomPhoto"
              alt="Chú rể"
              class="la-frame__photo"
              draggable="false"
            />

            <img :src="groomFrame" alt="" class="la-frame__overlay" aria-hidden="true" />
          </div>
        </div>

        <!-- Hoạ tiết trang trí -->
        <img :src="hy" alt="" class="la-deco la-deco--hy" aria-hidden="true" />
        <img :src="hoaTim" alt="" class="la-deco la-deco--hoa" aria-hidden="true" />
      </div>
    </div>

    <!-- =====================================================
         TÊN CÔ DÂU — CHÚ RỂ
    ====================================================== -->
    <div class="la-hero__names">
      <div class="la-person la-person--bride">
        <p class="la-person__role">{{ brideRole }}</p>

        <p class="la-person__name">{{ brideName }}</p>

        <img :src="dau" alt="" class="la-person__icon" aria-hidden="true" />
      </div>

      <img :src="tim" alt="" class="la-hero__heart" aria-hidden="true" />

      <div class="la-person la-person--groom">
        <img :src="re" alt="" class="la-person__icon" aria-hidden="true" />

        <div class="la-person__text">
          <p class="la-person__role">{{ groomRole }}</p>

          <p class="la-person__name">{{ groomName }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";

import brideFrame from "@/assets/love-art/bride frame.webp";
import groomFrame from "@/assets/love-art/groom frame.webp";
import hy from "@/assets/love-art/hy.webp";
import hoaTim from "@/assets/love-art/hoa tim.webp";
import dau from "@/assets/love-art/dau.webp";
import re from "@/assets/love-art/re.webp";
import tim from "@/assets/love-art/tim.webp";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  monogram: { type: String, default: "G&B" },
  dateLabel: { type: String, default: "" },
});

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

const groomRole = computed(() => props.wedding?.couple?.Groom?.Role || "Trưởng Nam");

const brideRole = computed(() => props.wedding?.couple?.Bride?.Role || "Thứ Nữ");

const bridePhoto = computed(
  () =>
    props.wedding?.couple?.Bride?.Avatar ||
    props.wedding?.couple?.Bride?.Cover ||
    props.wedding?.bride?.avatar ||
    ""
);

const groomPhoto = computed(
  () =>
    props.wedding?.couple?.Groom?.Avatar ||
    props.wedding?.couple?.Groom?.Cover ||
    props.wedding?.groom?.avatar ||
    ""
);
</script>

<style scoped>
.la-hero {
  position: relative;

  width: 100%;

  padding: 64px 16px 0;

  overflow: hidden;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.la-hero__title {
  margin: 0;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: clamp(32px, 9vw, 56px);
  font-weight: 700;

  letter-spacing: 0.02em;
  line-height: 1;
  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   SÂN KHẤU ẢNH
========================================================= */

.la-hero__stage {
  position: relative;

  width: 82%;
  max-width: 340px;

  margin: 44px auto 0;
}

.la-hero__inner {
  position: relative;

  padding-bottom: 115%;
}

/* --- Khung ảnh --- */

.la-frame {
  position: absolute;
}

.la-frame--bride {
  top: 0;
  left: 0;
  z-index: 5;

  width: 57%;

  transform: rotate(-4deg);
}

.la-frame--groom {
  right: 0;
  bottom: -50px;
  z-index: 6;

  width: 55%;

  transform: rotate(3deg);
}

.la-frame__box {
  position: relative;

  width: 100%;

  padding-bottom: 133.33%;
}

.la-frame__photo {
  position: absolute;
  top: 2%;
  left: 2%;

  width: 96%;
  height: 96%;

  border-radius: 6px;

  object-fit: cover;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.16);
}

.la-frame__overlay {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

/* --- Hoạ tiết --- */

.la-deco {
  position: absolute;
  z-index: 4;

  height: auto;

  pointer-events: none;

  animation: la-deco-float 6s ease-in-out infinite;
}

.la-deco--hy {
  top: 2%;
  right: calc(-16% + 80px);

  width: 26%;
}

.la-deco--hoa {
  top: 34%;
  right: calc(-16% + 80px);

  width: 18%;

  animation-delay: -2.6s;
}

/* =========================================================
   TÊN CÔ DÂU — CHÚ RỂ
========================================================= */

.la-hero__names {
  position: relative;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;

  margin-top: 62px;
  padding-bottom: 26px;
}

.la-person {
  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
}

.la-person--groom {
  flex-direction: row;
  align-items: center;
  gap: 15px;
}

.la-person__text {
  text-align: center;
}

.la-person__role {
  margin: 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 13px;
  font-weight: 300;
}

.la-person__name {
  margin: 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 19px;
  font-weight: 700;

  line-height: 1.2;
  text-transform: uppercase;
}

.la-person__icon {
  width: 70px;
  height: auto;

  margin-top: 15px;

  object-fit: contain;
}

.la-person--groom .la-person__icon {
  width: 113px;

  margin-top: 0;
}

.la-hero__heart {
  width: 11%;
  max-width: 48px;
  height: auto;

  margin-bottom: 4px;

  object-fit: contain;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes la-deco-float {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-9px);
  }
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-hero {
    padding: 80px 40px 0;
  }

  .la-hero__stage {
    max-width: 510px;

    margin-top: 50px;
  }

  .la-deco--hy {
    right: calc(-16% + 40px);
  }

  .la-deco--hoa {
    top: 31%;
    right: calc(-16% + 90px);
  }

  .la-hero__names {
    margin-top: 78px;
    padding-bottom: 34px;
  }

  .la-person__role {
    font-size: 15px;
  }

  .la-person__name {
    font-size: 23px;
  }

  .la-person__icon {
    width: 85px;

    margin-top: 25px;
  }

  .la-person--groom .la-person__icon {
    width: 135px;
  }

  .la-hero__heart {
    max-width: 58px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .la-deco {
    animation: none;
  }
}
</style>
