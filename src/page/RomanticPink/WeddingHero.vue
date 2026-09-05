<template>
  <section class="invitation-hero">
    <img :src="hoa" class="floral floral--top" alt="" />
    <img :src="hoa" class="floral floral--bottom" alt="" />
    <div class="hero-frame">
      <div class="hero-content">
        <p class="save-date">SAVE THE DATE</p>
        <div class="motif">
          <span></span><img :src="icon" alt="" /><span></span>
        </div>
        <h1>{{ groomName }}<br> <i>&amp;</i><br> {{ brideName }}</h1>
        <p class="announce">TRÂN TRỌNG KÍNH MỜI</p>
        <p class="guest">{{ guestName }}</p>
        <p class="intro">
          Đến dự buổi tiệc chung vui cùng gia đình chúng mình tại
        </p>
        <p class="place">{{ location }}</p>
        <div class="schedule">
          <p>VÀO LÚC {{ time }}</p>
          <p>{{ dateText }}</p>
        </div>
        <p class="message">
          Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng mình!
        </p>
        <div class="hero-footer">
          <span></span><b>{{ monogram }}</b
          ><span></span>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { computed } from "vue";
import { hoa, icon } from "@/page/RomanticPink/romaticpink";
import dayjs from "dayjs";
const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  monogram: { type: String, default: "G&B" },
  dateLabel: { type: String, default: "" },
});
const groomName = computed(
  () => props.wedding?.GroomName || props.wedding?.groomName || props.wedding?.hero?.GroomName || props.wedding?.couple?.Groom?.Name || "Nguyễn Huy"
);
const brideName = computed(
  () => props.wedding?.BrideName || props.wedding?.brideName || props.wedding?.hero?.BrideName || props.wedding?.couple?.Bride?.Name || "Nguyễn Mai"
);
const location = computed(
  () =>
    props.event?.Location ||
    props.event?.Address ||
    props.wedding?.hero?.Location ||
    "Địa điểm tổ chức tiệc cưới"
);
const time = computed(
  () =>
    props.event?.EventTime ||
    props.event?.Time ||
    props.event?.StartTime ||
    props.wedding?.hero?.Time ||
    "16:00"
);
const dateText = computed(() => {
  const raw =
    props.event?.EventDate ||
    props.event?.Date ||
    props.wedding?.hero?.weddingDate ||
    props.wedding?.weddingDate;
  const date = dayjs(raw);
  if (date.isValid())
    return `${
      date.day() === 0 ? "CHỦ NHẬT" : date.day() + 1
    }, NGÀY ${date.format("DD/MM/YYYY")}`;
  return props.dateLabel || "NGÀY VUI CỦA CHÚNG MÌNH";
});
</script>
<style scoped>
.invitation-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 12px;
  min-height: 690px;
}
.invitation-hero:before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
}
.hero-frame {
  position: relative;
  min-height: 666px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(168, 67, 101, 0.45);
}
.hero-frame:before {
  content: "";
  position: absolute;
  inset: 7px;
  border: 1px solid rgba(168, 67, 101, 0.16);
  pointer-events: none;
}
.hero-content {
  position: relative;
  z-index: 2;
  width: min(100%, 440px);
  padding: 55px 28px 45px;
  text-align: center;
  animation: fade-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.floral {
  position: absolute;
  z-index: 1;
  width: min(74vw, 390px);
  opacity: 0.52;
  pointer-events: none;
  filter: sepia(0.2) saturate(0.82);
}
.floral--top {
  top: -105px;
  left: -128px;
  transform: rotate(-34deg);
}
.floral--bottom {
  right: -135px;
  bottom: -110px;
  transform: scale(-1) rotate(-34deg);
}
.save-date,
.announce,
.intro,
.place,
.schedule p {
  letter-spacing: 0.14em;
}
.save-date {
  margin: 0;
  color: #a34568;
  font-size: 11px;
  font-weight: 700;
}
.motif {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11px;
  margin: 12px auto;
}
.motif span {
  width: 48px;
  height: 1px;
}
.motif span:last-child {
  transform: scaleX(-1);
}
.motif img {
  width: 43px;
  height: 43px;
  object-fit: contain;
  opacity: 0.66;
}
.invitation-hero h1 {
  margin: 0;
  color: #a53f65;
  font-family: "Great Vibes", "Brush Script MT", cursive;
  font-size: clamp(42px, 11vw, 62px);
  font-weight: 400;
  line-height: 1.05;
  text-shadow: 0 1px #fff;
}
.invitation-hero h1 i {
  padding: 0 4px;
  color: #b8788d;
  font-family: Georgia;
  font-size: 0.55em;
  font-style: normal;
}
.announce {
  margin: 30px 0 8px;
  color: #a45a73;
  font-size: 10px;
  font-weight: 700;
}
.guest {
  margin: 0;
  color: #a43e64;
  font-size: 27px;
  font-weight: 700;
}
.intro {
  max-width: 325px;
  margin: 14px auto 8px;
  color: #84445c;
  font-size: 12px;
  line-height: 1.55;
}
.place {
  max-width: 350px;
  margin: 0 auto;
  color: #9d3d61;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.38;
}
.schedule {
  margin: 24px auto 0;
  padding: 14px 0;
  border-top: 1px solid rgba(176, 74, 107, 0.36);
  border-bottom: 1px solid rgba(176, 74, 107, 0.36);
}
.schedule p {
  margin: 4px 0;
  color: #9d3d61;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.45;
}
.message {
  max-width: 295px;
  margin: 24px auto 20px;
  color: #805167;
  font-size: 15px;
  line-height: 1.45;
  font-style: italic;
}
.hero-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #b25676;
}
.hero-footer span {
  width: 50px;
  height: 1px;
}
.hero-footer span:last-child {
  transform: scaleX(-1);
}
.hero-footer b {
  font: 400 14px Georgia;
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
@media (max-width: 380px) {
  .hero-content {
    padding: 43px 20px 35px;
  }
  .hero-frame {
    min-height: 640px;
  }
  .invitation-hero h1 {
    font-size: 43px;
  }
  .guest {
    font-size: 24px;
  }
  .intro {
    font-size: 11px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hero-content {
    animation: none;
  }
}
</style>