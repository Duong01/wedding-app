<template>
  <section class="shc-opening" :class="{ 'shc-opening--active': opening }">
    <!-- =====================================================
         HOẠ TIẾT TRANG TRÍ
    ====================================================== -->

    <div class="shc-opening__decor" aria-hidden="true">
      <img
        class="shc-opening__hy"
        :src="doubleHappiness"
        alt=""
        draggable="false"
      />

      <img
        class="shc-opening__moon"
        :src="moonDecoration"
        alt=""
        draggable="false"
      />

      <img
        class="shc-opening__cloud shc-opening__cloud--1"
        :src="cloud1Decoration"
        alt=""
        draggable="false"
      />

      <img
        class="shc-opening__cloud shc-opening__cloud--2"
        :src="cloud2Decoration"
        alt=""
        draggable="false"
      />

      <img
        class="shc-opening__flower"
        :src="flower1Decoration"
        alt=""
        draggable="false"
      />

      <img
        class="shc-opening__bird shc-opening__bird--1"
        :src="birdDecoration"
        alt=""
        draggable="false"
      />

      <img
        class="shc-opening__bird shc-opening__bird--2"
        :src="birdDecoration"
        alt=""
        draggable="false"
      />
    </div>

    <!-- =====================================================
         THIỆP MỜI
    ====================================================== -->

    <div class="shc-card">
      <p class="shc-card__kicker">{{ sectionText(sections, "opening", "Kicker", "WEDDING INVITATION") }}</p>

      <p class="shc-card__invite">{{ sectionText(sections, "opening", "Invite", "Trân trọng kính mời") }}</p>

      <h1 class="shc-card__guest">{{ guestName }}</h1>

      <div class="shc-card__divider" aria-hidden="true">
        <span></span>
        <img :src="doubleHappiness" alt="" draggable="false" />
        <span></span>
      </div>

      <p class="shc-card__names">
        <span>{{ groomName }}</span>

        <span class="shc-card__amp">&amp;</span>

        <span>{{ brideName }}</span>
      </p>

      <p class="shc-card__date">{{ dateLabel || "NGÀY CỦA CHÚNG MÌNH" }}</p>
    </div>

    <!-- =====================================================
         NÚT MỞ THIỆP
    ====================================================== -->

    <button type="button" class="shc-open-btn" :disabled="opening" @click="openInvitation">
      <span class="shc-open-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>

      <span class="shc-open-btn__text">{{ sectionText(sections, "opening", "Button", "MỞ THIỆP") }}</span>
    </button>

    <p class="shc-hint">{{ sectionText(sections, "opening", "Hint", "Trăng soi đôi hạc · Vạn sự song toàn") }}</p>
  </section>
</template>

<script setup>
import { sectionText } from "@/data/sectionTitles";
import { computed, ref } from "vue";

import {
  birdDecoration,
  cloud1Decoration,
  cloud2Decoration,
  doubleHappiness,
  flower1Decoration,
  moonDecoration,
} from "./songHacRedAssets";

const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  wedding: { type: Object, default: () => ({}) },
  monogram: { type: String, default: "G&B" },
  dateLabel: { type: String, default: "" },
});

const emit = defineEmits(["open"]);

const opening = ref(false);

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

const guestName = computed(
  () =>
    (Array.isArray(props.wedding?.recipientName)
      ? props.wedding?.recipientName[0]?.Name
      : props.wedding?.recipientName?.Name) ||
    props.wedding?.guestName ||
    "Bạn thân mến"
);

function openInvitation() {
  if (opening.value) return;

  opening.value = true;

  window.setTimeout(() => {
    emit("open");
  }, 1150);
}
</script>

<style scoped>
.shc-opening {
  --shc-red: var(--primary, #920002);
  --shc-cream: var(--accent, #ffe8a4);

  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 22px;

  padding: 40px 20px;

  overflow: hidden;

  color: var(--shc-cream);

  background-color: var(--shc-red);

  font-family: "Times New Roman", Times, serif;
}

/* =========================================================
   HOẠ TIẾT TRANG TRÍ
========================================================= */

.shc-opening__decor {
  position: absolute;
  inset: 0;
  z-index: 0;

  pointer-events: none;
}

.shc-opening__decor img {
  position: absolute;

  max-width: none;

  object-fit: contain;
}

.shc-opening__hy {
  left: 50%;
  top: 6%;

  width: 15%;

  transform: translateX(-50%);
}

.shc-opening__moon {
  left: 50%;
  top: 50%;

  width: 85%;

  transform: translate(-50%, -50%);

  opacity: 0.35;
}

.shc-opening__cloud--1 {
  left: -8%;
  bottom: 12%;

  width: 55%;
}

.shc-opening__cloud--2 {
  right: -10%;
  bottom: 22%;

  width: 45%;

  transform: scaleX(-1);
}

.shc-opening__flower {
  left: 8%;
  bottom: 30%;

  width: 26%;
}

.shc-opening__bird--1 {
  left: -12%;
  top: 18%;

  width: 60%;

  opacity: 0.5;
}

.shc-opening__bird--2 {
  right: -10%;
  top: 28%;

  width: 50%;

  opacity: 0.5;
}

/* =========================================================
   THIỆP MỜI
========================================================= */

.shc-card {
  position: relative;
  z-index: 1;

  width: min(100%, 340px);

  padding: 34px 24px 30px;

  border: 1px solid rgba(255, 232, 164, 0.35);
  border-radius: 4px;

  background: rgba(146, 0, 2, 0.55);

  backdrop-filter: blur(2px);

  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.35);

  text-align: center;
}

.shc-card__kicker {
  margin: 0 0 14px;

  color: var(--shc-cream);

  font-family: "Fraunces", "Times New Roman", serif;
  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.35em;
  text-indent: 0.35em;

  text-transform: uppercase;
}

.shc-card__invite {
  margin: 0 0 6px;

  color: rgba(255, 232, 164, 0.8);

  font-size: 12px;

  font-style: italic;
}

.shc-card__guest {
  margin: 0;

  color: var(--shc-cream);

  font-family: "Carattere", cursive;
  font-size: 34px;
  font-weight: 400;

  line-height: 1.2;
}

.shc-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  margin: 16px 0;
}

.shc-card__divider span {
  width: 46px;
  height: 1px;

  background: rgba(255, 232, 164, 0.4);
}

.shc-card__divider img {
  width: 22px;
  height: 22px;

  object-fit: contain;
}

.shc-card__names {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  margin: 0;

  color: var(--shc-cream);

  font-family: "Fraunces", "Times New Roman", serif;
  font-size: 19px;

  text-transform: uppercase;
}

.shc-card__amp {
  font-family: "Ms Madi", cursive;
  font-size: 24px;
}

.shc-card__date {
  margin: 16px 0 0;

  color: rgba(255, 232, 164, 0.8);

  font-size: 11px;

  letter-spacing: 0.2em;
  text-indent: 0.2em;
}

/* =========================================================
   NÚT MỞ THIỆP
========================================================= */

.shc-open-btn {
  position: relative;
  z-index: 1;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  padding: 14px 34px;

  border: 1px solid rgba(255, 232, 164, 0.5);
  border-radius: 10px;

  color: var(--shc-cream);

  background: rgba(146, 0, 2, 0.7);

  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.3);

  font-family: "Times New Roman", Times, serif;
  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.2em;
  text-indent: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.shc-open-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.03);

  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.4);
}

.shc-open-btn:disabled {
  cursor: wait;

  opacity: 0.7;
}

.shc-open-btn__icon {
  display: flex;
  align-items: center;
}

.shc-open-btn__icon svg {
  width: 17px;
  height: 17px;
}

.shc-hint {
  position: relative;
  z-index: 1;

  margin: 0;

  color: rgba(255, 232, 164, 0.7);

  font-size: 11px;

  font-style: italic;
}

/* =========================================================
   HIỆU ỨNG MỞ
========================================================= */

.shc-opening--active .shc-card {
  animation: shc-card-out 1.15s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.shc-opening--active .shc-open-btn,
.shc-opening--active .shc-hint {
  animation: shc-fade-out 0.5s ease forwards;
}

@keyframes shc-card-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  45% {
    transform: scale(1.04);
    opacity: 1;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes shc-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-card {
    width: min(100%, 420px);

    padding: 44px 34px 38px;
  }

  .shc-card__guest {
    font-size: 42px;
  }

  .shc-card__names {
    font-size: 23px;
  }

  .shc-card__amp {
    font-size: 28px;
  }

  .shc-open-btn {
    font-size: 15px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .shc-opening--active .shc-card,
  .shc-opening--active .shc-open-btn,
  .shc-opening--active .shc-hint {
    animation-duration: 0.01ms;
  }

  .shc-open-btn {
    transition: none;
  }
}
</style>
