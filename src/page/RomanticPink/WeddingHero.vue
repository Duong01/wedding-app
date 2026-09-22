<template>
  <section class="invitation-hero">
    <img
      :src="leaf"
      class="floral floral--leaf"
      alt=""
      loading="lazy"
      decoding="async"
    />
    <img
      :src="flower"
      class="floral floral--flower"
      alt=""
      loading="lazy"
      decoding="async"
    />

    <div class="hero-card">
      <div class="hero-content">
        <p class="save-date">{{ heroTitle }}</p>

        <div class="motif">
          <span></span>
          <img :src="icon" alt="" loading="lazy" decoding="async" />
          <span></span>
        </div>

        <h1>
          <span class="name">{{ groomName }}</span>
          <i>&amp;</i>
          <span class="name">{{ brideName }}</span>
        </h1>

        <p class="announce">{{ heroSubtitle }}</p>

        <div class="guest-block">
          <span class="guest-label">KÍNH MỜI</span>
          <p class="guest">{{ guestName }}</p>
        </div>

        <p class="intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>

        <p class="place">{{ location }}</p>

        <div class="schedule">
          <p class="schedule-time">VÀO LÚC {{ time }}</p>
          <p class="schedule-date">{{ dateText }}</p>
        </div>

        <p class="message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>

        <div class="hero-footer">
          <span></span><b>{{ monogram }}</b><span></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
import { icon } from "@/page/RomanticPink/romaticpink";
import leaf from "@/assets/glass-garden-pink/leaf1-bloom.webp";
import flower from "@/assets/glass-garden-pink/flower1-decoration.webp";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  monogram: { type: String, default: "G&B" },
  dateLabel: { type: String, default: "" },
});

const heroTitle = computed(() => props.wedding?.hero?.Title || "SAVE THE DATE");

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
    const weekdays = [
      "CHỦ NHẬT",
      "THỨ HAI",
      "THỨ BA",
      "THỨ TƯ",
      "THỨ NĂM",
      "THỨ SÁU",
      "THỨ BẢY",
    ];

    return `${weekdays[date.day()]}, NGÀY ${date.format("DD/MM/YYYY")}`;
  }

  return props.dateLabel || "";
});
</script>

<style scoped>
.invitation-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  padding: 34px 18px 10px;

  display: flex;
  justify-content: center;
}

/* =========================================================
   HOA TRANG TRÍ
   ========================================================= */

.floral {
  position: absolute;
  z-index: 1;

  pointer-events: none;

  object-fit: contain;
}

.floral--leaf {
  top: -40px;
  left: -90px;

  width: 260px;

  opacity: 0.6;
  transform: rotate(-18deg);
}

.floral--flower {
  right: -100px;
  bottom: -60px;

  width: 250px;

  opacity: 0.55;
  transform: rotate(14deg);
}

/* =========================================================
   THẺ KÍNH HÌNH CUNG
   ========================================================= */

.hero-card {
  position: relative;
  z-index: 2;

  width: min(100%, 300px);
  aspect-ratio: 239 / 368;

  display: grid;
  place-items: center;

  padding: 26px 20px;

  border-radius: 500px;
  border: 1px solid rgba(255, 255, 255, 0.35);

  background-color: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(7px) saturate(1.08);
  -webkit-backdrop-filter: blur(7px) saturate(1.08);

  box-shadow: inset 1.5px 1.5px 2px rgba(255, 255, 255, 0.45),
    inset -1.5px -1.5px 3px rgba(180, 120, 130, 0.12),
    0 18px 50px -6px rgba(147, 56, 69, 0.3),
    0 6px 20px 2px rgba(147, 56, 69, 0.14);

  animation: fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.hero-content {
  width: 100%;
  text-align: center;
}

/* =========================================================
   NỘI DUNG
   ========================================================= */

.save-date {
  margin: 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.24em;
  text-transform: uppercase;

  opacity: 0.8;
}

.motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin: 8px auto;
}

.motif span {
  width: 30px;
  height: 1px;
  background-color: rgba(203, 93, 108, 0.4);
}

.motif span:last-child {
  transform: scaleX(-1);
}

.motif img {
  width: 34px;
  object-fit: contain;
  opacity: 0.7;
}

.invitation-hero h1 {
  margin: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.invitation-hero h1 .name {
  color: var(--gg-rose, #cb5d6c);
  font-family: "Viaoda Libre", "EB Garamond", cursive;
  font-size: 26px;
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: 0.01em;
}

.invitation-hero h1 i {
  color: var(--gg-rose, #cb5d6c);
  font-family: "Alex Brush", "The Nautigal", cursive;
  font-size: 20px;
  font-style: normal;
  line-height: 1;
}

.announce {
  margin: 12px 0 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;

  opacity: 0.8;
}

.guest-block {
  margin-top: 12px;
}

.guest-label {
  display: block;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 8px;
  letter-spacing: 0.22em;

  opacity: 0.65;
}

.guest {
  margin: 2px 0 0;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 19px;
  font-weight: 500;
  line-height: 1.2;
}

.intro {
  max-width: 210px;
  margin: 12px auto 4px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  line-height: 1.55;

  opacity: 0.85;
}

.place {
  max-width: 220px;
  margin: 0 auto;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
}

.schedule {
  margin: 12px auto 0;
  padding: 9px 0;

  border-top: 1px solid rgba(203, 93, 108, 0.3);
  border-bottom: 1px solid rgba(203, 93, 108, 0.3);
}

.schedule p {
  margin: 2px 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.08em;
  line-height: 1.5;
}

.schedule-time {
  font-weight: 700;
}

.message {
  max-width: 200px;
  margin: 12px auto 10px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  font-style: italic;
  line-height: 1.5;

  opacity: 0.8;
}

.hero-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: var(--gg-rose, #cb5d6c);
}

.hero-footer span {
  width: 28px;
  height: 1px;
  background-color: rgba(203, 93, 108, 0.4);
}

.hero-footer span:last-child {
  transform: scaleX(-1);
}

.hero-footer b {
  font-family: "EB Garamond", serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* =========================================================
   DESKTOP
   ========================================================= */

@media (min-width: 900px) {
  .invitation-hero {
    padding: 48px 40px 16px;
  }

  .hero-card {
    width: min(100%, 360px);
    padding: 34px 26px;
  }

  .invitation-hero h1 .name {
    font-size: 33px;
  }

  .invitation-hero h1 i {
    font-size: 23px;
  }

  .guest {
    font-size: 22px;
  }

  .place {
    font-size: 15px;
  }

  .floral--leaf {
    left: -60px;
    width: 320px;
  }

  .floral--flower {
    right: -70px;
    width: 300px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-card {
    animation: none;
  }
}
</style>
