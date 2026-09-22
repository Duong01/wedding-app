<template>
  <section
    class="mw-opening"
    :class="{
      'is-opening': isOpening,
      'is-opened': isOpened,
    }"
  >
    <!-- =====================================================
         NỀN
    ====================================================== -->

    <div class="mw-opening__bg" aria-hidden="true"></div>

    <span
      v-for="n in 12"
      :key="n"
      class="mw-spark"
      :class="`mw-spark--${n}`"
      aria-hidden="true"
    >✦</span>

    <!-- =====================================================
         PHONG BÌ
    ====================================================== -->

    <div class="mw-envelope">
      <div class="mw-envelope__back">
        <div class="mw-envelope__border">
          <div class="mw-envelope__inner">
            <span class="mw-envelope__symbol">囍</span>
          </div>
        </div>
      </div>

      <!-- =================================================
           THIỆP
      ================================================== -->

      <div class="mw-card">
        <div class="mw-card__outer">
          <div class="mw-card__inner">
            <p class="mw-card__kicker">THIỆP MỜI</p>

            <h1 class="mw-card__title">LỄ THÀNH HÔN</h1>

            <div class="mw-divider">
              <span></span>
              <i>❖</i>
              <span></span>
            </div>

            <p class="mw-card__invite">Trân trọng kính mời</p>

            <div v-if="recipient" class="mw-card__guest">
              <span class="mw-card__guest-line"></span>

              <strong>{{ recipient }}</strong>
            </div>

            <div class="mw-card__names">
              <span class="mw-card__name">{{ groomName }}</span>

              <span class="mw-card__amp">&amp;</span>

              <span class="mw-card__name">{{ brideName }}</span>
            </div>

            <div class="mw-card__date">
              <span class="mw-card__date-line"></span>

              <span>{{ dateLabel }}</span>

              <span class="mw-card__date-line"></span>
            </div>

            <p class="mw-card__message">
              Sự hiện diện của Quý khách<br />
              là niềm vinh hạnh của gia đình chúng tôi
            </p>

            <div class="mw-card__bottom">
              <span>✦</span>

              <small>WEDDING INVITATION</small>

              <span>✦</span>
            </div>
          </div>
        </div>
      </div>

      <!-- =================================================
           MẶT TRƯỚC PHONG BÌ
      ================================================== -->

      <div class="mw-envelope__front">
        <span class="mw-envelope__flower mw-envelope__flower--left">❀</span>

        <span class="mw-envelope__flower mw-envelope__flower--right">❀</span>

        <span class="mw-envelope__seal">囍</span>
      </div>
    </div>

    <!-- =====================================================
         NÚT MỞ
    ====================================================== -->

    <Transition name="mw-open-button">
      <button
        v-if="!isOpening"
        type="button"
        class="mw-open-button"
        @click="openInvitation"
      >
        <span class="mw-open-button__text">MỞ THIỆP</span>

        <span class="mw-open-button__arrow">↓</span>
      </button>
    </Transition>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  wedding: {
    type: Object,
    required: true,
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

const emit = defineEmits(["open"]);

const isOpening = ref(false);

const isOpened = ref(false);

/* =========================================================
   NAMES
========================================================= */

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

const recipient = computed(() => {
  const value = props.wedding?.recipientName;

  if (Array.isArray(value)) {
    return value[0]?.Name || "";
  }

  if (value && typeof value === "object") {
    return value.Name || "";
  }

  return typeof value === "string" ? value : "";
});

/* =========================================================
   OPEN
========================================================= */

function openInvitation() {
  if (isOpening.value) {
    return;
  }

  isOpening.value = true;

  setTimeout(() => {
    isOpened.value = true;
  }, 380);

  setTimeout(() => {
    emit("open");
  }, 1250);
}
</script>

<style scoped>
.mw-opening {
  position: relative;
  isolation: isolate;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 100svh;

  padding: 40px 20px;

  overflow: hidden;

  background-color: var(--mw-paper);
  color: var(--mw-ink);
}

/* =========================================================
   NỀN
========================================================= */

.mw-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background:
    radial-gradient(ellipse at 50% 4%, rgba(72, 108, 125, 0.1), transparent 55%),
    radial-gradient(ellipse at 8% 92%, rgba(72, 108, 125, 0.07), transparent 48%),
    radial-gradient(ellipse at 92% 86%, rgba(72, 108, 125, 0.06), transparent 48%);
}

.mw-spark {
  position: absolute;
  z-index: -2;

  color: rgba(72, 108, 125, 0.5);

  font-size: 12px;

  pointer-events: none;

  animation: mw-spark-twinkle 3.6s ease-in-out infinite;
}

.mw-spark--1 { top: 10%; left: 12%; }
.mw-spark--2 { top: 18%; right: 14%; font-size: 11px; animation-delay: -0.5s; }
.mw-spark--3 { top: 32%; left: 7%; font-size: 10px; animation-delay: -1.1s; }
.mw-spark--4 { top: 44%; right: 8%; animation-delay: -1.7s; }
.mw-spark--5 { top: 58%; left: 13%; font-size: 10px; animation-delay: -2.2s; }
.mw-spark--6 { top: 66%; right: 12%; font-size: 11px; animation-delay: -2.8s; }
.mw-spark--7 { top: 80%; left: 9%; animation-delay: -3.2s; }
.mw-spark--8 { top: 86%; right: 17%; font-size: 11px; animation-delay: -0.9s; }
.mw-spark--9 { top: 8%; right: 32%; font-size: 10px; animation-delay: -1.4s; }
.mw-spark--10 { top: 92%; left: 30%; font-size: 10px; animation-delay: -2s; }
.mw-spark--11 { top: 26%; left: 24%; font-size: 10px; animation-delay: -2.6s; }
.mw-spark--12 { top: 72%; right: 28%; font-size: 10px; animation-delay: -3.4s; }

/* =========================================================
   PHONG BÌ
========================================================= */

.mw-envelope {
  position: relative;

  width: min(100%, 340px);
  height: 460px;

  perspective: 1200px;
}

.mw-envelope__back {
  position: absolute;
  inset: 0;

  padding: 12px;

  border: 1px solid var(--mw-hairline);
  border-radius: 16px;

  background-color: var(--mw-blue-mist);
}

.mw-envelope__border {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  border: 1px dashed var(--mw-hairline);
  border-radius: 10px;
}

.mw-envelope__symbol {
  color: var(--mw-blue);

  font-family: serif;
  font-size: 40px;

  opacity: 0.35;
}

/* =========================================================
   THIỆP
========================================================= */

.mw-card {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;

  transform-origin: 50% 100%;

  transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

.mw-card__outer {
  width: 100%;

  padding: 10px;

  border: 1px solid var(--mw-hairline);
  border-radius: 14px;

  background-color: var(--mw-paper);

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
}

.mw-card__inner {
  padding: 30px 20px 24px;

  border: 1px solid var(--mw-hairline-soft);
  border-radius: 8px;

  text-align: center;
}

.mw-card__kicker {
  margin: 0 0 10px;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 10px;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.mw-card__title {
  margin: 0;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 22px;
  font-weight: 400;

  letter-spacing: 0.1em;
}

.mw-card__invite {
  margin: 18px 0 6px;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 11px;

  letter-spacing: 0.24em;
  text-indent: 0.24em;
}

.mw-card__guest {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  margin-bottom: 14px;
}

.mw-card__guest-line {
  width: 60px;
  height: 1px;

  background-color: var(--mw-hairline);
}

.mw-card__guest strong {
  color: var(--mw-blue);

  font-family: var(--mw-font-script);
  font-size: 30px;
  font-weight: 400;
}

.mw-card__names {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.mw-card__name {
  color: var(--mw-blue);

  font-family: var(--mw-font-script);
  font-size: 26px;

  line-height: 1.4;
}

.mw-card__amp {
  color: var(--mw-blue);

  font-family: var(--mw-font-script);
  font-size: 20px;
}

.mw-card__date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 16px;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 11px;

  letter-spacing: 0.2em;
}

.mw-card__date-line {
  width: 30px;
  height: 1px;

  background-color: var(--mw-hairline);
}

.mw-card__message {
  margin: 16px 0 0;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 11px;

  line-height: 1.7;
}

.mw-card__bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 18px;

  color: var(--mw-blue-soft);
}

.mw-card__bottom small {
  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 9px;

  letter-spacing: 0.24em;
}

/* =========================================================
   MẶT TRƯỚC PHONG BÌ
========================================================= */

.mw-envelope__front {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--mw-hairline);
  border-radius: 16px;

  background-color: var(--mw-blue-mist);

  transform-origin: 50% 100%;

  transition: transform 0.9s cubic-bezier(0.5, 0, 0.75, 0.4), opacity 0.6s ease;
}

.mw-envelope__flower {
  position: absolute;

  color: var(--mw-blue-soft);

  font-size: 26px;
}

.mw-envelope__flower--left {
  top: 24px;
  left: 24px;
}

.mw-envelope__flower--right {
  right: 24px;
  bottom: 24px;

  transform: rotate(180deg);
}

.mw-envelope__seal {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 76px;
  height: 76px;

  border: 1px solid var(--mw-blue);
  border-radius: 50%;

  background-color: var(--mw-paper);
  color: var(--mw-blue);

  font-family: serif;
  font-size: 30px;

  animation: mw-seal-pulse 3.4s ease-in-out infinite;
}

/* =========================================================
   NÚT MỞ
========================================================= */

.mw-open-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;

  margin-top: 30px;
  padding: 13px 32px;

  border: none;
  border-radius: 999px;

  background-color: var(--mw-blue);
  color: var(--mw-paper);

  font-family: var(--mw-font-serif);
  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, background-color 0.25s ease;
}

.mw-open-button:hover {
  transform: translateY(-2px);

  background-color: var(--mw-blue-deep);
}

.mw-open-button__arrow {
  font-size: 14px;
}

/* =========================================================
   ANIMATION KHI MỞ
========================================================= */

.is-opening .mw-envelope__front {
  transform: rotateX(-160deg);

  opacity: 0;
}

.is-opening .mw-card {
  transform: translateY(-40px) scale(1.04);
}

.is-opened .mw-card {
  transform: translateY(-120px) scale(1.06);

  opacity: 0;
}

.is-opened .mw-envelope {
  opacity: 0;

  transition: opacity 0.4s ease;
}

.mw-open-button-enter-active,
.mw-open-button-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.mw-open-button-enter-from,
.mw-open-button-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes mw-spark-twinkle {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.8) rotate(0deg);
  }

  50% {
    opacity: 1;
    transform: scale(1.25) rotate(25deg);
  }
}

@keyframes mw-seal-pulse {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .mw-envelope {
    height: 420px;
  }

  .mw-card__inner {
    padding: 24px 14px 20px;
  }

  .mw-card__guest strong {
    font-size: 26px;
  }

  .mw-card__name {
    font-size: 23px;
  }
}

/* =========================================================
   REDUCE MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mw-spark,
  .mw-envelope__seal {
    animation: none;
  }
}
</style>
