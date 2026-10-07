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
            <p class="mw-card__kicker">{{ sectionText(sections, "opening", "Kicker", $t("THIỆP MỜI")) }}</p>

            <h1 class="mw-card__title">{{ $t("LỄ THÀNH HÔN") }}</h1>

            <div class="mw-divider">
              <span></span>
              <i>❖</i>
              <span></span>
            </div>

            <p class="mw-card__invite">{{ sectionText(sections, "opening", "Invite", $t("Trân trọng kính mời")) }}</p>

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
              {{ $t("Sự hiện diện của Quý khách") }}<br />
              {{ $t("là niềm vinh hạnh của gia đình chúng tôi") }}
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
        <span class="mw-open-button__text">{{ sectionText(sections, "opening", "Button", $t("MỞ THIỆP")) }}</span>

        <span class="mw-open-button__arrow">↓</span>
      </button>
    </Transition>
  </section>
</template>

<script setup>
import { sectionText } from "@/data/sectionTitles";
import { computed, ref } from "vue";
const props = defineProps({
  sections: { type: Object, default: () => ({}) },
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
/* =========================================================
   OPENING — GIỮ NGUYÊN PALETTE GỐC
========================================================= */

.mw-opening {
  position: relative;
  isolation: isolate;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  min-height: 100svh;

  padding: 32px 20px;

  overflow: hidden;

  background-color: var(--mw-paper);
  color: var(--mw-ink);

  /* Cho cảm giác chuyển cảnh mềm */
  transition:
    background-color 0.8s ease,
    opacity 0.8s ease;
}

/* =========================================================
   BACKGROUND
========================================================= */

.mw-opening__bg {
  position: absolute;
  inset: 0;

  z-index: -10;

  background:
    radial-gradient(
      ellipse at 50% 15%,
      rgba(72, 108, 125, 0.13),
      transparent 48%
    ),
    radial-gradient(
      ellipse at 10% 90%,
      rgba(72, 108, 125, 0.08),
      transparent 42%
    ),
    radial-gradient(
      ellipse at 90% 85%,
      rgba(72, 108, 125, 0.08),
      transparent 42%
    );

  animation: mw-bg-breathe 7s ease-in-out infinite alternate;
}

@keyframes mw-bg-breathe {
  0% {
    transform: scale(1);
    opacity: 0.85;
  }

  100% {
    transform: scale(1.05);
    opacity: 1;
  }
}

/* =========================================================
   VÒNG ÁNH SÁNG SAU PHONG BÌ
========================================================= */

.mw-opening::before {
  content: "";

  position: absolute;

  top: 50%;
  left: 50%;

  width: min(80vw, 560px);
  height: min(80vw, 560px);

  transform: translate(-50%, -52%);

  border-radius: 50%;

  border: 1px solid rgba(72, 108, 125, 0.07);

  box-shadow:
    0 0 80px rgba(72, 108, 125, 0.06),
    inset 0 0 80px rgba(72, 108, 125, 0.04);

  animation: mw-halo 5s ease-in-out infinite;
}

@keyframes mw-halo {
  0%,
  100% {
    transform: translate(-50%, -52%) scale(0.94);
    opacity: 0.55;
  }

  50% {
    transform: translate(-50%, -52%) scale(1.04);
    opacity: 1;
  }
}

/* =========================================================
   SPARK
========================================================= */

.mw-spark {
  position: absolute;

  z-index: -2;

  color: var(--mw-blue);

  font-size: 12px;

  opacity: 0.25;

  pointer-events: none;

  animation:
    mw-spark
    3.8s
    ease-in-out
    infinite;
}

.mw-spark--1 {
  top: 10%;
  left: 12%;
}

.mw-spark--2 {
  top: 18%;
  right: 14%;

  font-size: 9px;

  animation-delay: -0.5s;
}

.mw-spark--3 {
  top: 32%;
  left: 7%;

  font-size: 10px;

  animation-delay: -1s;
}

.mw-spark--4 {
  top: 44%;
  right: 8%;

  animation-delay: -1.5s;
}

.mw-spark--5 {
  top: 58%;
  left: 13%;

  font-size: 9px;

  animation-delay: -2s;
}

.mw-spark--6 {
  top: 66%;
  right: 12%;

  animation-delay: -2.5s;
}

.mw-spark--7 {
  top: 80%;
  left: 9%;

  font-size: 10px;

  animation-delay: -3s;
}

.mw-spark--8 {
  top: 86%;
  right: 17%;

  font-size: 9px;

  animation-delay: -0.8s;
}

.mw-spark--9 {
  top: 8%;
  right: 32%;

  font-size: 9px;

  animation-delay: -1.3s;
}

.mw-spark--10 {
  top: 92%;
  left: 30%;

  font-size: 9px;

  animation-delay: -1.9s;
}

.mw-spark--11 {
  top: 26%;
  left: 24%;

  font-size: 8px;

  animation-delay: -2.4s;
}

.mw-spark--12 {
  top: 72%;
  right: 28%;

  font-size: 8px;

  animation-delay: -3.1s;
}

@keyframes mw-spark {
  0%,
  100% {
    opacity: 0.15;

    transform:
      translateY(0)
      scale(0.7)
      rotate(0deg);
  }

  50% {
    opacity: 0.9;

    transform:
      translateY(-6px)
      scale(1.25)
      rotate(25deg);
  }
}

/* =========================================================
   ENVELOPE
========================================================= */

.mw-envelope {
  position: relative;

  width: min(100%, 340px);
  height: 460px;

  perspective: 1400px;

  /*
   * Trạng thái chờ:
   * phong bì không đứng im hoàn toàn,
   * có chuyển động "thở" rất nhẹ.
   */
  animation:
    mw-envelope-float
    4.8s
    ease-in-out
    infinite;

  transition:
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.8s ease,
    opacity 0.7s ease;
}

@keyframes mw-envelope-float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-6px) rotate(0.25deg);
  }
}

/* =========================================================
   BACK
========================================================= */

.mw-envelope__back {
  position: absolute;
  inset: 0;

  padding: 12px;

  border: 1px solid var(--mw-hairline);

  border-radius: 16px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.45),
      var(--mw-blue-mist)
    );

  box-shadow:
    inset 0 0 30px rgba(72, 108, 125, 0.035),
    0 22px 50px rgba(30, 50, 60, 0.1);

  overflow: hidden;
}

.mw-envelope__back::before {
  content: "";

  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      120deg,
      transparent 25%,
      rgba(255, 255, 255, 0.35) 50%,
      transparent 75%
    );

  transform: translateX(-120%);

  animation:
    mw-envelope-shine
    5s
    ease-in-out
    infinite;
}

@keyframes mw-envelope-shine {
  0%,
  55% {
    transform: translateX(-120%);
  }

  75%,
  100% {
    transform: translateX(120%);
  }
}

/* =========================================================
   BORDER
========================================================= */

.mw-envelope__border {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  border: 1px dashed var(--mw-hairline);

  border-radius: 10px;
}

.mw-envelope__border::after {
  content: "";

  position: absolute;
  inset: 8px;

  border: 1px solid rgba(72, 108, 125, 0.06);

  border-radius: 7px;
}

.mw-envelope__symbol {
  color: var(--mw-blue);

  font-family: serif;
  font-size: 40px;

  opacity: 0.35;

  transition:
    opacity 0.5s ease,
    transform 0.8s ease;
}

/* =========================================================
   THIỆP
========================================================= */

.mw-card {
  position: absolute;

  inset: 0;

  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 16px;

  /*
   * QUAN TRỌNG:
   * Thiệp nằm cao hơn miệng phong bì.
   * Ban đầu chỉ lộ phần vừa đủ.
   */
  transform:
    translateY(-17%)
    scale(0.98);

  transform-origin: center bottom;

  transition:
    transform 0.95s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.7s ease,
    filter 0.7s ease;
}

/* =========================================================
   CARD OUTER
========================================================= */

.mw-card__outer {
  position: relative;

  width: 100%;

  padding: 10px;

  border: 1px solid var(--mw-hairline);

  border-radius: 14px;

  background-color: var(--mw-paper);

  box-shadow:
    0 18px 40px rgba(30, 50, 60, 0.12),
    0 3px 8px rgba(30, 50, 60, 0.05);
}

.mw-card__outer::before {
  content: "";

  position: absolute;
  inset: 5px;

  border: 1px solid var(--mw-hairline-soft);

  border-radius: 9px;

  pointer-events: none;
}

/* =========================================================
   CARD INNER
========================================================= */

.mw-card__inner {
  position: relative;

  min-height: 400px;

  padding: 30px 20px 24px;

  border: 1px solid var(--mw-hairline-soft);

  border-radius: 8px;

  background:
    radial-gradient(
      circle at 50% 15%,
      rgba(72, 108, 125, 0.035),
      transparent 55%
    ),
    var(--mw-paper);

  text-align: center;

  overflow: hidden;
}

/* =========================================================
   DECORATIVE CORNERS
========================================================= */

.mw-card__inner::before,
.mw-card__inner::after {
  content: "✦";

  position: absolute;

  color: var(--mw-blue);

  font-size: 9px;

  opacity: 0.4;
}

.mw-card__inner::before {
  top: 12px;
  left: 14px;
}

.mw-card__inner::after {
  right: 14px;
  bottom: 12px;
}

/* =========================================================
   TEXT
========================================================= */

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

.mw-divider {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  margin: 14px 0 3px;
}

.mw-divider span {
  width: 38px;
  height: 1px;

  background-color: var(--mw-hairline);
}

.mw-divider i {
  color: var(--mw-blue);

  font-size: 9px;

  font-style: normal;
}

.mw-card__invite {
  margin: 15px 0 6px;

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

  gap: 7px;

  margin-bottom: 13px;
}

.mw-card__guest-line {
  width: 55px;
  height: 1px;

  background-color: var(--mw-hairline);
}

.mw-card__guest strong {
  color: var(--mw-blue);

  font-family: var(--mw-font-script);

  font-size: 29px;

  font-weight: 400;
}

.mw-card__names {
  display: flex;
  flex-direction: column;
  align-items: center;
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

  margin-top: 15px;

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
  margin: 15px 0 0;

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
   FRONT ENVELOPE
========================================================= */

.mw-envelope__front {
  position: absolute;

  left: 0;
  right: 0;
  bottom: 0;

  z-index: 3;

  height: 47%;

  overflow: hidden;

  border: 1px solid var(--mw-hairline);

  border-radius: 16px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.38),
      var(--mw-blue-mist)
    );

  transform-origin: 50% 100%;

  transition:
    transform 0.95s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.6s ease;
}

/* Miệng phong bì */

.mw-envelope__front::before {
  content: "";

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 95px;

  background:
    linear-gradient(
      180deg,
      var(--mw-paper),
      var(--mw-blue-mist)
    );

  clip-path:
    polygon(
      0 0,
      50% 100%,
      100% 0
    );

  filter:
    drop-shadow(
      0 2px 4px rgba(30, 50, 60, 0.08)
    );
}

/* =========================================================
   FLOWERS
========================================================= */

.mw-envelope__flower {
  position: absolute;

  color: var(--mw-blue-soft);

  font-size: 26px;

  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
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

/* =========================================================
   SEAL
========================================================= */

.mw-envelope__seal {
  position: absolute;

  top: 45px;
  left: 50%;

  z-index: 5;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 76px;
  height: 76px;

  transform:
    translateX(-50%)
    scale(1);

  border: 1px solid var(--mw-blue);

  border-radius: 50%;

  background-color: var(--mw-paper);

  color: var(--mw-blue);

  font-family: serif;

  font-size: 30px;

  box-shadow:
    0 8px 20px rgba(30, 50, 60, 0.08);

  animation:
    mw-seal-breathe
    3.5s
    ease-in-out
    infinite;

  transition:
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.55s ease,
    opacity 0.4s ease;
}

@keyframes mw-seal-breathe {
  0%,
  100% {
    transform:
      translateX(-50%)
      scale(1);
  }

  50% {
    transform:
      translateX(-50%)
      scale(1.045);
  }
}

/* =========================================================
   ⭐ HOVER / USER INTERACTION
========================================================= */

/*
 * Khi người dùng đưa chuột vào:
 *
 * - Phong bì nhích lên
 * - Thiệp trồi lên
 * - Nội dung thiệp lộ ra nhiều hơn
 * - Seal sáng lên
 * - Hoa dịch nhẹ
 *
 * => tạo cảm giác "hãy mở tôi".
 */

.mw-envelope:hover {
  transform:
    translateY(-12px)
    scale(1.015);

  filter:
    drop-shadow(
      0 30px 55px rgba(30, 50, 60, 0.18)
    );
}

.mw-envelope:hover .mw-card {
  transform:
    translateY(-29%)
    scale(1.015);

  filter:
    drop-shadow(
      0 10px 18px rgba(30, 50, 60, 0.08)
    );
}

.mw-envelope:hover .mw-envelope__seal {
  transform:
    translateX(-50%)
    scale(1.12);

  box-shadow:
    0 0 0 7px rgba(72, 108, 125, 0.05),
    0 10px 24px rgba(30, 50, 60, 0.12);
}

.mw-envelope:hover .mw-envelope__symbol {
  opacity: 0.55;

  transform:
    scale(1.08)
    translateY(4px);
}

.mw-envelope:hover .mw-envelope__flower--left {
  transform:
    translate(-4px, -3px)
    rotate(-12deg);
}

.mw-envelope:hover .mw-envelope__flower--right {
  transform:
    translate(4px, -3px)
    rotate(180deg);
}

/* =========================================================
   OPEN BUTTON
========================================================= */

.mw-open-button {
  position: relative;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  margin-top: 28px;

  min-width: 170px;

  padding: 13px 28px;

  border: 1px solid var(--mw-hairline);

  border-radius: 999px;

  background-color: rgba(255, 255, 255, 0.55);

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);

  font-size: 11px;

  font-weight: 600;

  letter-spacing: 0.2em;

  text-indent: 0.1em;

  cursor: pointer;

  overflow: hidden;

  box-shadow:
    0 7px 22px rgba(30, 50, 60, 0.07);

  backdrop-filter: blur(5px);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease,
    background-color 0.3s ease;
}

.mw-open-button::before {
  content: "";

  position: absolute;

  top: 0;
  bottom: 0;

  left: -100%;

  width: 55%;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.8),
      transparent
    );

  transform: skewX(-20deg);

  animation:
    mw-button-shine
    3.5s
    ease-in-out
    infinite;
}

@keyframes mw-button-shine {
  0%,
  55% {
    left: -100%;
  }

  75%,
  100% {
    left: 140%;
  }
}

.mw-open-button:hover {
  transform:
    translateY(-3px)
    scale(1.02);

  background-color: rgba(255, 255, 255, 0.8);

  box-shadow:
    0 12px 30px rgba(30, 50, 60, 0.12);
}

.mw-open-button:active {
  transform:
    translateY(0)
    scale(0.96);
}

.mw-open-button__text,
.mw-open-button__arrow {
  position: relative;

  z-index: 1;
}

.mw-open-button__arrow {
  font-size: 14px;

  animation:
    mw-arrow
    1.8s
    ease-in-out
    infinite;
}

@keyframes mw-arrow {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(4px);
  }
}

/* =========================================================
   OPENING
========================================================= */

.is-opening .mw-envelope {
  animation: none;

  transform:
    translateY(-8px)
    scale(1.02);

  filter:
    drop-shadow(
      0 35px 65px rgba(30, 50, 60, 0.2)
    );
}

/*
 * Nắp phong bì mở ra
 */

.is-opening .mw-envelope__front {
  transform:
    rotateX(-165deg);

  opacity: 0;
}

/*
 * Thiệp trồi mạnh lên
 */

.is-opening .mw-card {
  transform:
    translateY(-46%)
    scale(1.045);

  filter:
    drop-shadow(
      0 25px 35px rgba(30, 50, 60, 0.12)
    );
}

/*
 * Seal biến mất
 */

.is-opening .mw-envelope__seal {
  transform:
    translateX(-50%)
    translateY(-25px)
    scale(0.5);

  opacity: 0;
}

/*
 * Nội dung nền biến mất nhẹ
 */

.is-opening .mw-spark {
  animation-play-state: paused;
}

/* =========================================================
   OPENED
========================================================= */

.is-opened {
  background-color: var(--mw-paper);
}

.is-opened .mw-envelope {
  transform:
    translateY(-25px)
    scale(1.08);

  opacity: 0;

  filter: blur(5px);

  transition:
    transform 0.7s ease,
    opacity 0.75s ease,
    filter 0.75s ease;
}

.is-opened .mw-spark {
  opacity: 0;

  transition: opacity 0.5s ease;
}

/* =========================================================
   BUTTON TRANSITION
========================================================= */

.mw-open-button-enter-active,
.mw-open-button-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.mw-open-button-enter-from,
.mw-open-button-leave-to {
  opacity: 0;

  transform:
    translateY(10px)
    scale(0.95);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .mw-opening {
    padding:
      24px
      16px;
  }

  .mw-envelope {
    width: min(92vw, 330px);
    height: min(125vw, 440px);
  }

  .mw-card__inner {
    min-height: 380px;

    padding:
      26px
      16px
      22px;
  }

  .mw-card__name {
    font-size: 24px;
  }

  .mw-card__guest strong {
    font-size: 27px;
  }

  /*
   * Mobile không có hover.
   * :active giúp tạo phản hồi khi người dùng chạm.
   */
  .mw-envelope:active {
    transform:
      translateY(-7px)
      scale(1.01);
  }

  .mw-envelope:active .mw-card {
    transform:
      translateY(-28%)
      scale(1.015);
  }

  .mw-envelope:active .mw-envelope__seal {
    transform:
      translateX(-50%)
      scale(1.08);
  }
}

/* =========================================================
   VERY SMALL PHONE
========================================================= */

@media (max-width: 380px) {
  .mw-envelope {
    height: 410px;
  }

  .mw-card__inner {
    min-height: 350px;

    padding:
      22px
      13px
      18px;
  }

  .mw-card__title {
    font-size: 19px;
  }

  .mw-card__name {
    font-size: 22px;
  }

  .mw-card__guest strong {
    font-size: 24px;
  }

  .mw-card__message {
    font-size: 10px;
  }

  .mw-envelope__seal {
    width: 68px;
    height: 68px;

    font-size: 27px;
  }
}

/* =========================================================
   ACCESSIBILITY
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .mw-opening__bg,
  .mw-opening::before,
  .mw-envelope,
  .mw-spark,
  .mw-envelope__seal,
  .mw-envelope__back::before,
  .mw-open-button::before,
  .mw-open-button__arrow {
    animation: none !important;
  }

  .mw-envelope,
  .mw-card,
  .mw-envelope__front,
  .mw-envelope__seal {
    transition-duration: 0.01ms !important;
  }
}
</style>

