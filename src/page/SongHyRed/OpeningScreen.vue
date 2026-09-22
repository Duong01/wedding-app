<template>
  <section class="shy-opening" :class="{ 'shy-opening--active': opening }">
    <!-- =====================================================
         TIA SÁNG ĐỎ
    ====================================================== -->

    <div class="shy-opening__sunburst" aria-hidden="true">
      <svg viewBox="0 0 671 671" preserveAspectRatio="none">
        <circle cx="335.5" cy="335.5" r="335.5" fill="currentColor" />
      </svg>
    </div>

    <!-- =====================================================
         THIỆP MỜI
    ====================================================== -->

    <div class="shy-card">
      <div class="shy-card__frame" aria-hidden="true"></div>

      <p class="shy-card__kicker">WEDDING INVITATION</p>

      <p class="shy-card__invite">Trân trọng kính mời</p>

      <h1 class="shy-card__guest">{{ guestName }}</h1>

      <div class="shy-card__divider" aria-hidden="true">
        <span></span>
        <img :src="star" alt="" draggable="false" />
        <span></span>
      </div>

      <p class="shy-card__names">
        <span>{{ groomName }}</span>

        <img class="shy-card__hy" :src="chuHy" alt="Song hỷ" draggable="false" />

        <span>{{ brideName }}</span>
      </p>

      <p class="shy-card__date">{{ dateLabel || "NGÀY CỦA CHÚNG MÌNH" }}</p>
    </div>

    <!-- =====================================================
         NÚT MỞ THIỆP
    ====================================================== -->

    <button type="button" class="shy-open-btn" :disabled="opening" @click="openInvitation">
      <span class="shy-open-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>

      <span class="shy-open-btn__text">MỞ THIỆP</span>
    </button>

    <p class="shy-hint">Một lời mời · Một chữ song hỷ · Một đời hạnh phúc</p>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { chuHy, star } from "./songHyRedAssets";

const props = defineProps({
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
.shy-opening {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);
  --shy-gold: var(--accent, #fbbf24);

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

  color: var(--shy-ink);

  background-color: var(--shy-bg);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   TIA SÁNG ĐỎ
========================================================= */

.shy-opening__sunburst {
  position: absolute;
  z-index: -1;

  left: 50%;
  top: 0;

  width: min(671px, 130vw);
  aspect-ratio: 1;

  transform: translate(-50%, -50%);

  color: var(--shy-red);

  pointer-events: none;
}

.shy-opening__sunburst svg {
  display: block;

  width: 100%;
  height: 100%;
}

/* =========================================================
   THIỆP MỜI
========================================================= */

.shy-card {
  position: relative;

  width: min(100%, 340px);

  padding: 34px 24px 30px;

  border: 1px solid color-mix(in srgb, var(--shy-red) 22%, transparent);
  border-radius: 4px;

  background: var(--shy-bg);

  box-shadow: 0 18px 44px rgba(128, 0, 0, 0.12);

  text-align: center;
}

.shy-card__frame {
  position: absolute;
  inset: 7px;

  border: 1px solid color-mix(in srgb, var(--shy-red) 14%, transparent);
  border-radius: 2px;

  pointer-events: none;
}

.shy-card__kicker {
  margin: 0 0 14px;

  color: var(--shy-red);

  font-family: "Cormorant Garamond", "Times New Roman", serif;
  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.35em;
  text-indent: 0.35em;

  text-transform: uppercase;
}

.shy-card__invite {
  margin: 0 0 6px;

  color: var(--shy-ink);

  font-size: 12px;
  font-style: italic;
}

.shy-card__guest {
  margin: 0;

  color: var(--shy-red);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 30px;
  font-weight: 500;

  line-height: 1.2;
}

.shy-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 16px 0;
}

.shy-card__divider span {
  width: 46px;
  height: 1px;

  background: color-mix(in srgb, var(--shy-red) 40%, transparent);
}

.shy-card__divider img {
  width: 12px;
  height: 12px;

  object-fit: contain;
}

.shy-card__names {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 0;

  color: var(--shy-red);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 19px;

  text-transform: uppercase;
}

.shy-card__hy {
  width: 30px;
  height: 30px;

  object-fit: contain;
}

.shy-card__date {
  margin: 16px 0 0;

  color: var(--shy-ink);

  font-size: 11px;

  letter-spacing: 0.2em;
  text-indent: 0.2em;
}

/* =========================================================
   NÚT MỞ THIỆP
========================================================= */

.shy-open-btn {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  padding: 14px 34px;

  border: 0;
  border-radius: 10px;

  color: var(--shy-cream);

  background: var(--shy-red);

  box-shadow: 0 14px 30px rgba(128, 0, 0, 0.28);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.2em;
  text-indent: 0.2em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.shy-open-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.03);

  box-shadow: 0 18px 38px rgba(128, 0, 0, 0.36);
}

.shy-open-btn:disabled {
  cursor: wait;

  opacity: 0.7;
}

.shy-open-btn__icon {
  display: flex;
  align-items: center;
}

.shy-open-btn__icon svg {
  width: 17px;
  height: 17px;
}

.shy-hint {
  margin: 0;

  color: color-mix(in srgb, var(--shy-ink) 70%, transparent);

  font-size: 11px;
  font-style: italic;
}

/* =========================================================
   HIỆU ỨNG MỞ
========================================================= */

.shy-opening--active .shy-card {
  animation: shy-card-out 1.15s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.shy-opening--active .shy-open-btn,
.shy-opening--active .shy-hint {
  animation: shy-fade-out 0.5s ease forwards;
}

@keyframes shy-card-out {
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

@keyframes shy-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-opening__sunburst {
    width: min(872px, 100%);
  }

  .shy-card {
    width: min(100%, 420px);

    padding: 44px 34px 38px;
  }

  .shy-card__guest {
    font-size: 38px;
  }

  .shy-card__names {
    font-size: 23px;
  }

  .shy-card__hy {
    width: 38px;
    height: 38px;
  }

  .shy-open-btn {
    font-size: 15px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .shy-opening--active .shy-card,
  .shy-opening--active .shy-open-btn,
  .shy-opening--active .shy-hint {
    animation-duration: 0.01ms;
  }

  .shy-open-btn {
    transition: none;
  }
}
</style>
