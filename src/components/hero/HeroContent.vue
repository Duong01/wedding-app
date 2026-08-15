<template>
  <div ref="container" class="hero-content">
    <div class="hero-card animate-item">
      <p class="eyebrow">The Wedding Of</p>
      <div class="bride-name">{{ hero.groomName }}</div>
      <div class="icon">&</div>
      <div class="groom-name">{{ hero.brideName }}</div>
      
      <p class="hero-subtitle">
        Sự hiện diện của các bạn là niềm vui lớn nhất của chúng mình
      </p>

      <div class="hero-meta">
        <div class="hero-meta-item">
          <span class="hero-meta-label">Save the Date</span>
          <span class="hero-meta-date">
            {{ formatDate(hero.weddingDate) }}
          </span>
        </div>

        <div class="hero-meta-divider">
          <span>✦</span>
        </div>

        <div class="hero-meta-item">
          <span class="hero-meta-label">Wedding Ceremony</span>
          <span class="hero-meta-location">
            {{ hero.location }}
          </span>
        </div>
      </div>

      <HeroCountdown :timeWedding ="hero.weddingDate" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { gsap } from "gsap";
import dayjs from "dayjs";
import HeroCountdown from "./HeroCountdown.vue";

const props = defineProps({
  hero :{
    type: Object,
    required: true,
    default :() => ({})
  }
})

function formatDate(date) {
  if (!date) return "";
  return dayjs(date).format("DD.MM.YYYY");
}


</script>

<style scoped lang="scss">

.hero-content {
  position: absolute;
  inset: 0;
  z-index: 5;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 24px;
}

.hero-card {
  width: min(90vw, 760px);

  padding: 48px 42px;

  text-align: center;

  border-radius: 28px;

  background: rgba(255, 248, 243, 0.88);

  backdrop-filter: blur(18px);

  border: 1px solid rgba(255, 255, 255, 0.6);

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.eyebrow {
  color: #b99155;

  // font-size:15px;

  text-transform: uppercase;

  letter-spacing: 5px;

  margin-bottom: 18px;
}

.hero-names {
  // font-size:clamp(48px,7vw,82px);
  font-family: "The Nautigal", cursive;
  color: #7b0d0d;

  line-height: 1.15;

  margin-bottom: 18px;
}

.hero-names div {
  font-family: "The Nautigal", cursive;
  // font-size:42px;

  color: #c79d5c;

  margin: 10px 0;
}

.hero-names span {
  font-family: "The Nautigal", cursive;
  color: #ffd8be;
  margin: 0 10px;
}

.hero-subtitle {
  max-width: 560px;

  margin: 0 auto;

  color: #5c4d46;

  // font-size:18px;

  line-height: 1.9;
}

/* =========================================================
   HERO META - WEDDING INTRO
   ========================================================= */

.hero-meta {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 680px;

  margin: 28px auto 0;
  padding: 18px 24px;

  gap: 24px;

  text-align: center;
}

/* Nội dung ngày / địa điểm */

.hero-meta-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  min-width: 150px;

  gap: 4px;
}

/* Chữ nhỏ phía trên */

.hero-meta-label {
  font-family: var(--font-main);

  font-size: 10px;
  font-weight: 500;

  letter-spacing: 2.5px;
  text-transform: uppercase;

  color: var(--sub-text);
}

/* Ngày */

.hero-meta-date {
  font-family: var(--font-main);

  font-size: clamp(12px, 2vw, 14px);

  line-height: 1.2;

  color: var(--primary);
}

/* Địa điểm */

.hero-meta-location {
  font-family: var(--font-main);

  max-width: 220px;

  font-size: clamp(12px, 3vw, 14px);
  font-weight: 400;

  line-height: 1.5;

  color: var(--text);
}

/* =========================================================
   DIVIDER
   ========================================================= */

.hero-meta-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 1px;
  height: 48px;

  position: relative;

  background: rgba(216, 180, 109, 0.55);
}

.hero-meta-divider span {
  position: absolute;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 22px;
  height: 22px;

  background: var(--paper);

  color: var(--gold);

  font-size: 11px;
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 600px) {
  .hero-meta {
    margin-top: 22px;
    padding: 14px 10px;

    gap: 12px;
  }

  .hero-meta-item {
    min-width: 0;
    flex: 1;
  }

  .hero-meta-label {
    font-size: 9px;
    letter-spacing: 1.8px;
  }



  .hero-meta-location {
    max-width: 150px;

    font-size: 12px;
  }

  .hero-meta-divider {
    height: 42px;
  }
}

/* =========================================================
   SMALL MOBILE
   ========================================================= */

@media (max-width: 380px) {
  .hero-meta {
    gap: 8px;
  }

  .hero-meta-date {
    font-size: 17px;
  }

  .hero-meta-location {
    font-size: 11px;
  }

  .hero-meta-divider {
    height: 38px;
  }
}
.bride-name,
.groom-name {
    font-family: var(--font-script);

    font-size: clamp(48px, 16vw, 82px);
    font-weight: 400;

    line-height: .9;

    color: var(--primary);

    letter-spacing: .5px;

    text-align: center;
}
.icon {
    margin: 8px 0;

    font-family: var(--font-wedding);

    font-size: clamp(34px, 10vw, 52px);

    font-style: italic;
    font-weight: 400;

    line-height: .7;

    color: var(--primary);
}
</style>
