<template>
  <section class="cr-opening" :class="{ 'cr-opening--active': opening }">
    <!-- =====================================================
         NỀN
    ====================================================== -->

    <div class="cr-opening__bg" aria-hidden="true"></div>

    <img
      :src="decorativeHeader"
      alt=""
      aria-hidden="true"
      class="cr-opening__header"
      draggable="false"
    />

    <img
      :src="cherryBlossom"
      alt=""
      aria-hidden="true"
      class="cr-opening__blossom cr-opening__blossom--left"
      draggable="false"
    />

    <img
      :src="cherryBlossom"
      alt=""
      aria-hidden="true"
      class="cr-opening__blossom cr-opening__blossom--right"
      draggable="false"
    />

    <!-- =====================================================
         THIỆP MỜI
    ====================================================== -->

    <div class="cr-card">
      <div class="cr-card__frame" aria-hidden="true"></div>

      <img
        :src="doubleHappiness"
        alt="囍"
        class="cr-card__happiness"
        draggable="false"
      />

      <p class="cr-card__kicker">WEDDING INVITATION</p>

      <p class="cr-card__invite">Trân trọng kính mời</p>

      <h1 class="cr-card__guest">{{ guestName }}</h1>

      <div class="cr-card__divider" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p class="cr-card__names">
        <span>{{ groomName }}</span>
        <i>&amp;</i>
        <span>{{ brideName }}</span>
      </p>

      <p class="cr-card__date">{{ dateLabel || "NGÀY CỦA CHÚNG MÌNH" }}</p>
    </div>

    <!-- =====================================================
         NÚT MỞ THIỆP
    ====================================================== -->

    <button type="button" class="cr-open-btn" :disabled="opening" @click="openInvitation">
      <span class="cr-open-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>

      <span class="cr-open-btn__text">MỞ THIỆP</span>
    </button>

    <p class="cr-hint">Một lời mời · Một lời hẹn · Một đời hạnh phúc</p>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

import {
  cherryBlossom,
  decorativeHeader,
  doubleHappiness,
} from "./emeraldLuxeAssets";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  monogram: { type: String, default: "囍" },
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
  }, 1000);
}
</script>

<style scoped>
.cr-opening {
  position: relative;
  isolation: isolate;

  min-height: 100svh;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 40px 20px 32px;

  overflow: hidden;

  text-align: center;

  color: var(--cr-ink);

  background-color: var(--cr-bg);
}

/* =========================================================
   NỀN
========================================================= */

.cr-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 0%, rgba(var(--cr-accent-rgb), 0.5), transparent 55%),
    radial-gradient(ellipse at 50% 100%, rgba(var(--cr-accent-rgb), 0.35), transparent 55%);
}

.cr-opening__header {
  position: absolute;

  top: 0;
  left: 50%;

  z-index: -6;

  width: min(100%, 420px);

  transform: translateX(-50%);

  object-fit: contain;

  opacity: 0.9;

  pointer-events: none;
}

.cr-opening__blossom {
  position: absolute;

  z-index: -4;

  width: 120px;
  height: 120px;

  object-fit: contain;

  opacity: 0.55;

  pointer-events: none;

  animation: cr-blossom-float 7s ease-in-out infinite;
}

.cr-opening__blossom--left {
  bottom: 8%;
  left: -34px;
}

.cr-opening__blossom--right {
  top: 22%;
  right: -30px;

  width: 96px;
  height: 96px;

  animation-delay: -3.2s;
}

/* =========================================================
   THIỆP MỜI
========================================================= */

.cr-card {
  position: relative;
  z-index: 2;

  width: min(100%, 340px);

  margin-top: 60px;
  padding: 34px 24px 30px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.28);
  border-radius: 18px;

  background: rgba(var(--cr-surface-rgb), 0.92);

  box-shadow: 0 20px 46px rgba(var(--cr-ink-rgb), 0.14);

  animation: cr-card-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.cr-card__frame {
  position: absolute;
  inset: 7px;

  border: 1px solid rgba(var(--cr-accent-rgb), 0.85);
  border-radius: 12px;

  pointer-events: none;
}

.cr-card__happiness {
  width: 62px;
  height: 62px;

  margin: 0 auto 14px;

  object-fit: contain;

  animation: cr-happiness-pulse 3.6s ease-in-out infinite;
}

.cr-card__kicker {
  margin: 0 0 14px;

  color: var(--cr-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.cr-card__invite {
  margin: 0 0 4px;

  color: var(--cr-soft);

  font-size: 12px;

  letter-spacing: 0.08em;
}

.cr-card__guest {
  margin: 0;

  font-family: "Babylonica", "Great Vibes", cursive;

  font-size: clamp(38px, 11vw, 50px);
  font-weight: 400;

  line-height: 1.2;

  color: var(--cr-ink);
}

.cr-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 12px 0;

  color: var(--cr-accent);
}

.cr-card__divider span {
  width: 44px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-card__divider span:last-child {
  transform: rotate(180deg);
}

.cr-card__divider i {
  font-size: 13px;
  font-style: normal;
}

.cr-card__names {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin: 0 0 16px;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: 19px;
  font-weight: 400;

  letter-spacing: 0.04em;

  color: var(--cr-ink);
}

.cr-card__names i {
  color: var(--cr-accent);

  font-family: Georgia, serif;
  font-size: 17px;
  font-style: italic;
}

.cr-card__date {
  display: inline-block;

  margin: 0;
  padding: 7px 18px;

  border: 1px solid rgba(var(--cr-accent-rgb), 0.9);
  border-radius: 999px;

  background: rgba(var(--cr-bg-rgb), 0.8);

  color: var(--cr-soft);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.2em;
  text-indent: 0.2em;
}

/* =========================================================
   NÚT MỞ THIỆP
========================================================= */

.cr-open-btn {
  position: relative;
  z-index: 3;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 28px;
  padding: 13px 32px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 999px;

  color: var(--cr-ink);

  background: linear-gradient(135deg, var(--cr-accent-light), var(--cr-accent));

  box-shadow: 0 12px 26px rgba(var(--cr-accent-rgb), 0.5);

  font-family: inherit;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.cr-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 16px 32px rgba(var(--cr-accent-rgb), 0.62);
}

.cr-open-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.cr-open-btn__icon {
  display: flex;
  align-items: center;
}

.cr-open-btn__icon svg {
  width: 16px;
  height: 16px;
}

/* =========================================================
   GỢI Ý
========================================================= */

.cr-hint {
  position: relative;
  z-index: 3;

  margin: 20px 0 0;

  color: rgba(var(--cr-soft-rgb), 0.75);

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.04em;
}

/* =========================================================
   HIỆU ỨNG ĐÓNG
========================================================= */

.cr-opening--active .cr-card {
  animation: cr-card-out 0.85s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.cr-opening--active .cr-open-btn,
.cr-opening--active .cr-hint,
.cr-opening--active .cr-opening__blossom {
  animation: cr-fade-out 0.4s ease both;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes cr-card-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes cr-card-out {
  to {
    opacity: 0;
    transform: translateY(-40px) scale(0.92);
  }
}

@keyframes cr-fade-out {
  to {
    opacity: 0;
  }
}

@keyframes cr-happiness-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.07);
  }
}

@keyframes cr-blossom-float {
  0%,
  100% {
    transform: translateY(0) rotate(-6deg);
  }

  50% {
    transform: translateY(-12px) rotate(6deg);
  }
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .cr-card {
    padding: 28px 18px 24px;
  }

  .cr-card__happiness {
    width: 52px;
    height: 52px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .cr-card,
  .cr-card__happiness,
  .cr-opening__blossom {
    animation: none;
  }
}
</style>
