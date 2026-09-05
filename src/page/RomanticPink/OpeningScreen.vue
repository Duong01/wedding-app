<template>
  <section class="opening" :class="{ 'opening--active': opening }">
    <div class="opening__glow"></div>
    <img :src="hoa" class="opening__flower opening__flower--top" alt="" />
    <img :src="hoa" class="opening__flower opening__flower--bottom" alt="" />
    <div class="envelope">
      <div class="envelope__card">
        <span class="eyebrow">SAVE THE DATE</span>
        <img :src="icon" class="icon" alt="Biểu tượng cưới" />
        <p class="invite">Trân trọng kính mời</p>
        <h1>{{ guestName }}</h1>
        <p class="names">{{ groomName }} <i>&amp;</i> {{ brideName }}</p>
        <div class="date">{{ dateLabel || "WEDDING INVITATION" }}</div>
      </div>
      <div class="envelope__flap">
        <span>{{ monogram }}</span>
      </div>
    </div>
    <button type="button" class="open-button" @click="openInvitation">
      <span>MỞ THIỆP</span><b>↗</b>
    </button>
    <p class="hint">Chạm để mở lời mời của chúng mình</p>
  </section>
</template>
<script setup>
import { computed, ref } from "vue";
import { hoa } from "@/page/RomanticPink/romaticpink";
const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  monogram: { type: String, default: "G & B" },
  dateLabel: { type: String, default: "" },
});
const emit = defineEmits(["open"]);
const opening = ref(false);
const groomName = computed(
  () => props.wedding?.GroomName || props.wedding?.groomName || "Chú rể"
);
const brideName = computed(
  () => props.wedding?.BrideName || props.wedding?.brideName || "Cô dâu"
);
const guestName = computed(
  () =>
    props.wedding?.recipientName?.Name ||
    props.wedding?.guestName ||
    "Bạn thân mến"
);
function openInvitation() {
  if (opening.value) return;
  opening.value = true;
  window.setTimeout(() => emit("open"), 720);
}
</script>
<style scoped>
.opening {
  --pink: #b64f72;
  position: relative;
  isolation: isolate;
  min-height: 100svh;
  display: grid;
  place-content: center;
  gap: 24px;
  overflow: hidden;
  padding: 30px 18px;
  text-align: center;
  color: #fff8f4;
  background: radial-gradient(circle at 50% 18%, #eaa2b9 0, transparent 30%),
    linear-gradient(145deg, #54142f, #9e345a 52%, #4d132b);
}
.opening__glow {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(
    circle at 50% 65%,
    rgba(255, 235, 218, 0.24),
    transparent 32%
  );
  animation: breathe 4s ease-in-out infinite;
}
.opening__flower {
  position: absolute;
  width: min(62vw, 330px);
  opacity: 0.42;
  pointer-events: none;
  filter: sepia(0.2) saturate(0.7);
}
.opening__flower--top {
  top: -90px;
  left: -110px;
  transform: rotate(-30deg);
}
.opening__flower--bottom {
  right: -115px;
  bottom: -90px;
  transform: scale(-1) rotate(-30deg);
}
.envelope {
  position: relative;
  width: min(86vw, 365px);
  height: 420px;
  margin: auto;
  filter: drop-shadow(0 24px 30px rgba(31, 4, 18, 0.32));
  animation: card-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.envelope__card {
  position: absolute;
  inset: 0;
  padding: 40px 26px;
  border: 1px solid rgba(255, 231, 214, 0.72);
  background: linear-gradient(145deg, #c65c81, #8a294d);
  box-shadow: inset 0 0 0 7px rgba(255, 238, 227, 0.1),
    inset 0 0 55px rgba(73, 8, 34, 0.32);
}
.envelope__card:before {
  content: "";
  position: absolute;
  inset: 14px;
  border: 1px solid rgba(255, 238, 227, 0.34);
  pointer-events: none;
}
.icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
  margin: 15px auto;
  filter: brightness(0) invert(1);
  opacity: 0.86;
}
.eyebrow,
.date {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.28em;
}
.invite {
  margin: 24px 0 7px;
  font-size: 13px;
  letter-spacing: 0.08em;
}
.envelope h1 {
  margin: 0;
  color: #fff6ef;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 42px;
  font-weight: 600;
  line-height: 1.05;
}
.names {
  margin: 22px 0;
  color: #ffe4d5;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 25px;
}
.names i {
  padding: 0 3px;
  color: #fff;
  font-family: Georgia;
}
.date {
  padding-top: 17px;
  border-top: 1px solid rgba(255, 235, 218, 0.45);
}
.envelope__flap {
  position: absolute;
  z-index: 2;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 112px;
  display: grid;
  place-items: end center;
  padding-bottom: 20px;
  clip-path: polygon(0 0, 50% 78%, 100% 0, 100% 100%, 0 100%);
  background: linear-gradient(160deg, #b24870, #76203f);
}
.envelope__flap span {
  display: grid;
  place-items: center;
  width: 50px;
  height: 50px;
  border: 1px solid #ffe3cf;
  border-radius: 50%;
  font: 600 11px/1 Georgia;
  color: #ffeada;
  background: #9b3458;
}
.open-button {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 22px;
  min-width: 200px;
  margin: auto;
  padding: 15px 23px;
  border: 1px solid rgba(255, 233, 219, 0.85);
  background: rgba(255, 247, 241, 0.1);
  color: #fff9f6;
  font: 600 12px "Cormorant Garamond", serif;
  letter-spacing: 0.22em;
  cursor: pointer;
  transition: transform 0.25s, background 0.25s;
}
.open-button:before {
  content: "";
  position: absolute;
  width: 50%;
  height: 220%;
  background: rgba(255, 255, 255, 0.22);
  transform: translateX(-250%) rotate(25deg);
  animation: shine 3.4s ease-in-out infinite;
}
.open-button:hover {
  transform: translateY(-3px);
  background: rgba(255, 247, 241, 0.22);
}
.open-button span,
.open-button b {
  position: relative;
}
.open-button b {
  font-size: 18px;
}
.hint {
  margin: 0;
  color: rgba(255, 239, 232, 0.7);
  font-size: 11px;
  letter-spacing: 0.08em;
}
.opening--active .envelope {
  animation: open-card 0.7s ease forwards;
}
.opening--active .open-button,
.opening--active .hint {
  opacity: 0;
  transition: opacity 0.2s;
}
@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.94);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes open-card {
  to {
    opacity: 0;
    transform: translateY(-80px) scale(0.92);
  }
}
@keyframes shine {
  0%,
  50% {
    transform: translateX(-250%) rotate(25deg);
  }
  75%,
  100% {
    transform: translateX(400%) rotate(25deg);
  }
}
@keyframes breathe {
  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
</style>

