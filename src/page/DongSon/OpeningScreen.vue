<template>
  <section class="dong-opening">
    <div class="sun-disc">
      <span v-for="n in 16" :key="n" class="sun-ray" :style="{ '--i': n }" />
      <div class="sun-center">
        <div class="drum-star">
          <span v-for="n in 8" :key="n" :style="{ '--i': n }" />
        </div>
      </div>
    </div>

    <div class="opening-pattern top-pattern" />

    <div class="opening-content">
      <div class="eyebrow">{{ sectionText(sections, "opening", "Eyebrow", $t("THIỆP CƯỚI")) }}</div>

      <div class="monogram">
        {{ monogram }}
      </div>

      <div class="opening-line">
        <span />
        <b>✦</b>
        <span />
      </div>

      <p class="invitation-text">
        {{ sectionText(sections, "opening", "Invite", $t("Trân trọng kính mời")) }}
      </p>

      <h1>
        {{ guestName || $t("Quý khách") }}
      </h1>

      <p class="date">
        {{ dateLabel }}
      </p>

      <button class="open-button" @click="$emit('open')">
        <span class="button-ring" />
        <span class="button-icon">◉</span>
        <span>{{ sectionText(sections, "opening", "Button", $t("MỞ THIỆP")) }}</span>
      </button>
    </div>

    <div class="opening-pattern bottom-pattern" />

    <div class="bird bird-left">𓅃</div>
    <div class="bird bird-right">𓅃</div>

    <div class="grain" />
  </section>
</template>

<script setup>
import { sectionText } from "@/data/sectionTitles";
import { computed } from "vue";
const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  wedding: {
    type: Object,
    default: () => ({}),
  },
  monogram: {
    type: String,
    default: "G&B",
  },
  dateLabel: {
    type: String,
    default: "",
  },
});

defineEmits(["open"]);

const guestName = computed(() => {
  return (
    props.wedding?.GuestName ||
    props.wedding?.guestName ||
    props.wedding?.guestBookName ||
    ""
  );
});
</script>

<style scoped>
.dong-opening {
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tc-ead7b5, #ead7b5);
  background:
    radial-gradient(circle at 50% 42%, rgba(var(--tc-b3682c-rgb, 179, 104, 44), 0.16), transparent 28%),
    linear-gradient(145deg, var(--tc-3d100f, #3d100f), var(--tc-641914, #641914) 45%, var(--tc-350b0a, #350b0a));
}

.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.08;
  background-image:
    radial-gradient(rgba(255,255,255,.8) .5px, transparent .5px);
  background-size: 5px 5px;
}

.sun-disc {
  position: absolute;
  width: min(78vw, 430px);
  aspect-ratio: 1;
  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .4);
  border-radius: 50%;
  opacity: .42;
  animation: breathe 7s ease-in-out infinite;
}

.sun-center {
  position: absolute;
  inset: 27%;
  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .55);
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.drum-star {
  position: relative;
  width: 48%;
  aspect-ratio: 1;
  border: 1px solid var(--tc-c99552, #c99552);
  border-radius: 50%;
}

.drum-star::before,
.drum-star::after {
  content: "";
  position: absolute;
  inset: 17%;
  border: 1px solid rgba(var(--tc-c99552-rgb, 201, 149, 82), .7);
  transform: rotate(45deg);
}

.drum-star span {
  position: absolute;
  width: 4px;
  height: 4px;
  left: calc(50% - 2px);
  top: calc(50% - 2px);
  background: var(--tc-d5a966, #d5a966);
  transform: rotate(calc(var(--i) * 45deg)) translateY(-48px);
}

.sun-ray {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 1px;
  height: 49%;
  transform-origin: 50% 100%;
  transform: rotate(calc(var(--i) * 22.5deg));
  background: linear-gradient(
    to top,
    transparent,
    rgba(var(--tc-c99552-rgb, 201, 149, 82), .8)
  );
}

.opening-content {
  position: relative;
  z-index: 4;
  width: min(90%, 390px);
  text-align: center;
  animation: reveal 1.2s ease both;
}

.eyebrow {
  font-size: 11px;
  letter-spacing: .45em;
  color: var(--tc-c99552, #c99552);
  margin-bottom: 22px;
}

.monogram {
  font-family: Georgia, serif;
  font-size: clamp(54px, 16vw, 88px);
  font-weight: 400;
  letter-spacing: -.08em;
  color: var(--tc-d4a35f, #d4a35f);
  text-shadow: 0 5px 30px rgba(0,0,0,.35);
}

.opening-line {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px auto;
  width: 190px;
}

.opening-line span {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--tc-a96b32, #a96b32));
}

.opening-line span:last-child {
  background: linear-gradient(90deg, var(--tc-a96b32, #a96b32), transparent);
}

.opening-line b {
  color: var(--tc-c99552, #c99552);
}

.invitation-text {
  font-family: Georgia, serif;
  font-size: 17px;
  font-style: italic;
  color: var(--tc-cdb99b, #cdb99b);
}

h1 {
  margin: 8px 0 12px;
  font-family: Georgia, serif;
  font-size: clamp(25px, 7vw, 38px);
  font-weight: 400;
}

.date {
  font-size: 12px;
  letter-spacing: .3em;
  color: var(--tc-c99552, #c99552);
}

.open-button {
  position: relative;
  margin-top: 38px;
  width: 148px;
  height: 48px;
  border: 1px solid var(--tc-b9823f, #b9823f);
  background: rgba(0,0,0,.15);
  color: var(--tc-ead7b5, #ead7b5);
  letter-spacing: .2em;
  font-size: 10px;
  cursor: pointer;
  transition: .35s ease;
}

.open-button:hover {
  background: var(--tc-a02b20, #a02b20);
  transform: translateY(-2px);
}

.button-icon {
  margin-right: 9px;
  color: var(--tc-d4a35f, #d4a35f);
}

.bird {
  position: absolute;
  color: rgba(var(--tc-c99552-rgb, 201, 149, 82), .2);
  font-size: 90px;
}

.bird-left {
  left: 3%;
  top: 20%;
  transform: rotate(-25deg);
}

.bird-right {
  right: 3%;
  bottom: 20%;
  transform: scaleX(-1) rotate(-25deg);
}

.opening-pattern {
  position: absolute;
  left: 0;
  width: 100%;
  height: 45px;
  opacity: .22;
  background:
    repeating-linear-gradient(
      90deg,
      transparent 0 15px,
      var(--tc-c99552, #c99552) 16px 17px,
      transparent 18px 30px
    );
}

.top-pattern {
  top: 30px;
}

.bottom-pattern {
  bottom: 30px;
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(25px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes breathe {
  0%,100% { transform: scale(.96); opacity: .3; }
  50% { transform: scale(1.02); opacity: .5; }
}
</style>