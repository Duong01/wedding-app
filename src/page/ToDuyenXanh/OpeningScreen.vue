<template>
  <section class="tdx-opening" :class="{ 'tdx-opening--active': opening }">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-opening__decor" aria-hidden="true">
      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-right"
        draggable="false"
      />

      <img
        :src="flowerDecoration"
        alt=""
        class="tdx-decor tdx-decor--flower-right"
        draggable="false"
      />

      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-left"
        draggable="false"
      />

      <img
        :src="ribbonDecoration"
        alt=""
        class="tdx-decor tdx-decor--ribbon"
        draggable="false"
      />
    </div>

    <!-- =====================================================
         THIỆP MỜI
    ====================================================== -->

    <div class="tdx-card">
      <div class="tdx-card__frame" aria-hidden="true"></div>

      <p class="tdx-card__kicker">WEDDING INVITATION</p>

      <p class="tdx-card__invite">Trân trọng kính mời</p>

      <h1 class="tdx-card__guest">{{ guestName }}</h1>

      <div class="tdx-card__divider" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p class="tdx-card__names">
        <span>{{ groomName }}</span>
        <i>&amp;</i>
        <span>{{ brideName }}</span>
      </p>

      <p class="tdx-card__date">{{ dateLabel || "NGÀY CỦA CHÚNG MÌNH" }}</p>
    </div>

    <!-- =====================================================
         NÚT MỞ THIỆP
    ====================================================== -->

    <button type="button" class="tdx-open-btn" :disabled="opening" @click="openInvitation">
      <span class="tdx-open-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>

      <span class="tdx-open-btn__text">MỞ THIỆP</span>
    </button>

    <p class="tdx-hint">Một lời mời · Một nhành hoa · Một đời hạnh phúc</p>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

import {
  flowerDecoration,
  lineDecoration,
  ribbonDecoration,
} from "./toDuyenXanhAssets";

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
  }, 1000);
}
</script>

<style scoped>
.tdx-opening {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);
  --tdx-cream: var(--accent-light, #f3dfc5);

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

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-opening__decor {
  position: absolute;
  inset: 0;
  z-index: -1;

  pointer-events: none;
}

.tdx-decor {
  position: absolute;

  max-width: none;

  object-fit: cover;

  pointer-events: none;
}

.tdx-decor--line-right {
  top: -60px;
  right: -48px;

  width: 198px;
  height: 496px;
}

.tdx-decor--flower-right {
  top: 15px;
  right: -21px;

  width: 320px;
  height: 320px;

  object-fit: contain;
}

.tdx-decor--line-left {
  top: 470px;
  left: -30%;

  width: 198px;
  height: 595px;

  transform: scaleX(-1);
}

.tdx-decor--ribbon {
  bottom: 60px;
  left: -263px;

  width: 700px;
  height: 150px;

  object-fit: contain;
}

/* =========================================================
   THIỆP MỜI
========================================================= */

.tdx-card {
  position: relative;
  z-index: 2;

  width: min(100%, 340px);

  padding: 34px 24px 30px;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  background: rgba(255, 255, 255, 0.94);

  box-shadow: 0 20px 46px rgba(26, 53, 0, 0.1);

  animation: tdx-card-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.tdx-card__frame {
  position: absolute;
  inset: 7px;

  border: 1px solid rgba(209, 219, 156, 0.85);

  pointer-events: none;
}

.tdx-card__kicker {
  margin: 0 0 14px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.tdx-card__invite {
  margin: 0 0 4px;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 12px;

  letter-spacing: 0.08em;
}

.tdx-card__guest {
  margin: 0;

  font-family: Carattere, cursive;

  font-size: clamp(38px, 11vw, 50px);
  font-weight: 400;

  line-height: 1.2;

  color: var(--tdx-green);
}

.tdx-card__divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 12px 0;

  color: var(--tdx-line);
}

.tdx-card__divider span {
  width: 44px;
  height: 1px;

  background: linear-gradient(90deg, transparent, var(--tdx-line));
}

.tdx-card__divider span:last-child {
  transform: rotate(180deg);
}

.tdx-card__divider i {
  font-size: 13px;
  font-style: normal;
}

.tdx-card__names {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin: 0 0 16px;

  font-family: "Times New Roman", serif;

  font-size: 19px;
  font-weight: 400;

  letter-spacing: 0.04em;

  color: var(--tdx-ink);
}

.tdx-card__names i {
  color: var(--tdx-green);

  font-family: "Aguafina Script", cursive;
  font-size: 22px;
  font-style: normal;
}

.tdx-card__date {
  display: inline-block;

  margin: 0;
  padding: 7px 18px;

  border: 1px solid var(--tdx-line);
  border-radius: 999px;

  background: rgba(254, 251, 244, 0.9);

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.2em;
}

/* =========================================================
   NÚT MỞ THIỆP
========================================================= */

.tdx-open-btn {
  position: relative;
  z-index: 3;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 28px;
  padding: 13px 32px;

  border: 0;
  border-radius: 7px;

  color: #fefbf4;

  background: var(--tdx-green);

  box-shadow: 0 12px 26px rgba(94, 129, 60, 0.35);

  font-family: "Times New Roman", serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  cursor: pointer;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.tdx-open-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 16px 32px rgba(94, 129, 60, 0.45);
}

.tdx-open-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.tdx-open-btn__icon {
  display: flex;
  align-items: center;
}

.tdx-open-btn__icon svg {
  width: 16px;
  height: 16px;
}

/* =========================================================
   GỢI Ý
========================================================= */

.tdx-hint {
  position: relative;
  z-index: 3;

  margin: 20px 0 0;

  color: rgba(26, 53, 0, 0.7);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.04em;
}

/* =========================================================
   HIỆU ỨNG ĐÓNG
========================================================= */

.tdx-opening--active .tdx-card {
  animation: tdx-card-out 0.85s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.tdx-opening--active .tdx-open-btn,
.tdx-opening--active .tdx-hint {
  animation: tdx-fade-out 0.4s ease both;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes tdx-card-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes tdx-card-out {
  to {
    opacity: 0;
    transform: translateY(-40px) scale(0.92);
  }
}

@keyframes tdx-fade-out {
  to {
    opacity: 0;
  }
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-decor--line-right {
    top: -82px;
    right: -52px;

    width: 269px;
    height: 811px;
  }

  .tdx-decor--flower-right {
    top: 30px;
    right: -27px;

    width: 408px;
    height: 486px;
  }

  .tdx-decor--line-left {
    top: 762px;
    left: -180px;

    width: 269px;
    height: 810px;
  }

  .tdx-decor--ribbon {
    bottom: 54px;
    left: -358px;

    width: 1403px;
    height: 246px;
  }
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .tdx-card {
    padding: 28px 18px 24px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .tdx-card {
    animation: none;
  }
}
</style>
