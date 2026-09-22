<template>
  <section class="bq-opening" :class="{ 'bq-opening--active': opening }">
    <!-- =====================================================
         NỀN
    ====================================================== -->

    <div
      class="bq-opening__bg"
      aria-hidden="true"
      :style="{ backgroundImage: `url(${background})` }"
    ></div>

    <img
      :src="flower5"
      alt=""
      aria-hidden="true"
      class="bq-opening__flower bq-opening__flower--left"
      draggable="false"
    />

    <img
      :src="flower5"
      alt=""
      aria-hidden="true"
      class="bq-opening__flower bq-opening__flower--right"
      draggable="false"
    />

    <!-- =====================================================
         THIỆP MỜI
    ====================================================== -->

    <div class="bq-card">
      <p class="bq-card__kicker">WEDDING INVITATION</p>

      <!-- KHUNG ẢNH BAROQUE -->
      <div class="bq-card__frame">
        <div class="bq-card__photo">
          <img v-if="coverImage" :src="coverImage" alt="Ảnh cưới" draggable="false" />

          <span v-else class="bq-card__photo-empty" aria-hidden="true">❦</span>
        </div>

        <img
          :src="frame"
          alt=""
          aria-hidden="true"
          class="bq-card__frame-img"
          draggable="false"
        />
      </div>

      <!-- TÊN CÔ DÂU CHÚ RỂ -->
      <div class="bq-card__names">
        <span class="bq-card__amp" aria-hidden="true">&amp;</span>

        <span class="bq-card__name">{{ groomName }}</span>

        <span class="bq-card__name">{{ brideName }}</span>
      </div>

      <img
        :src="goldenLine"
        alt=""
        aria-hidden="true"
        class="bq-card__line"
        draggable="false"
      />

      <p class="bq-card__invite">Trân trọng kính mời</p>

      <h1 class="bq-card__guest">{{ guestName }}</h1>

      <p class="bq-card__date">{{ dateLabel || "NGÀY CỦA CHÚNG MÌNH" }}</p>
    </div>

    <!-- =====================================================
         NÚT MỞ THIỆP
    ====================================================== -->

    <button type="button" class="bq-open-btn" :disabled="opening" @click="openInvitation">
      <span class="bq-open-btn__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
          <rect x="2.5" y="5" width="19" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>

      <span class="bq-open-btn__text">MỞ THIỆP</span>
    </button>

    <p class="bq-hint">Một lời mời · Một lời hẹn · Một đời hạnh phúc</p>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { background, flower5, frame, goldenLine } from "./bohoTerracottaAssets";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  monogram: { type: String, default: "&" },
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

const coverImage = computed(
  () =>
    props.wedding?.hero?.Background ||
    props.wedding?.hero?.background ||
    props.wedding?.coverImage ||
    props.wedding?.CoverImage ||
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
.bq-opening {
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

  color: var(--bq-ink);

  background-color: var(--bq-bg);
}

/* =========================================================
   NỀN
========================================================= */

.bq-opening__bg {
  position: absolute;
  inset: 0;
  z-index: -10;

  background-size: 100% auto;
  background-repeat: repeat;
  background-position: top left;

  opacity: 0.65;
}

.bq-opening__flower {
  position: absolute;

  z-index: -4;

  width: 120px;
  height: auto;

  object-fit: contain;

  opacity: 0.5;

  pointer-events: none;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));

  animation: bq-flower-float 7s ease-in-out infinite;
}

.bq-opening__flower--left {
  bottom: 6%;
  left: -30px;
}

.bq-opening__flower--right {
  top: 18%;
  right: -30px;

  width: 96px;

  transform: scaleX(-1);

  animation-delay: -3.2s;
}

/* =========================================================
   THIỆP MỜI
========================================================= */

.bq-card {
  position: relative;
  z-index: 2;

  width: min(100%, 360px);

  padding: 26px 20px 28px;

  border: 1px solid var(--bq-line);
  border-radius: 4px;

  background: rgba(var(--bq-bg-rgb), 0.55);

  backdrop-filter: blur(2px);

  animation: bq-card-in 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.bq-card__kicker {
  margin: 0 0 18px;

  color: var(--bq-accent);

  font-family: "Playfair Display", "Times New Roman", serif;
  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.14em;
  text-indent: 0.14em;

  text-transform: uppercase;
}

/* =========================================================
   KHUNG ẢNH
========================================================= */

.bq-card__frame {
  position: relative;

  width: 126.5%;

  margin: 0 0 0 -13.25%;

  aspect-ratio: 1237 / 1254;
}

.bq-card__photo {
  position: absolute;

  left: 25.8%;
  top: 11%;

  width: 47.6%;
  height: 76.5%;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  background: rgba(var(--bq-deep-rgb), 0.6);

  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
}

.bq-card__photo img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.bq-card__photo-empty {
  color: var(--bq-accent);

  font-size: 30px;

  opacity: 0.5;
}

.bq-card__frame-img {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  object-fit: fill;

  pointer-events: none;
}

/* =========================================================
   TÊN
========================================================= */

.bq-card__names {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  margin-top: 22px;
}

.bq-card__amp {
  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, calc(-50% - 0.16em));

  color: rgba(var(--bq-ink-rgb), 0.2);

  font-family: "The Nautigal", cursive;
  font-size: 100px;
  line-height: 1;

  pointer-events: none;
}

.bq-card__name {
  position: relative;
  z-index: 1;

  color: var(--bq-accent);

  font-family: "Viaoda Libre", "EB Garamond", serif;
  font-size: clamp(30px, 9vw, 40px);
  font-weight: 400;

  line-height: 1.1;

  text-transform: uppercase;
  white-space: nowrap;
}

.bq-card__line {
  display: block;

  width: 74.5%;
  max-width: 280px;

  margin: 18px auto 0;

  object-fit: contain;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

/* =========================================================
   KHÁCH MỜI
========================================================= */

.bq-card__invite {
  margin: 18px 0 2px;

  color: var(--bq-soft);

  font-size: 12px;

  letter-spacing: 0.08em;
}

.bq-card__guest {
  margin: 0;

  font-family: "Ms Madi", "The Nautigal", cursive;
  font-size: clamp(34px, 10vw, 44px);
  font-weight: 400;

  line-height: 1.25;

  color: var(--bq-accent);
}

.bq-card__date {
  display: inline-block;

  margin: 14px 0 0;
  padding: 6px 18px;

  border: 1px solid var(--bq-line);
  border-radius: 999px;

  color: var(--bq-soft);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.2em;
  text-indent: 0.2em;
}

/* =========================================================
   NÚT MỞ THIỆP
========================================================= */

.bq-open-btn {
  position: relative;
  z-index: 3;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-top: 28px;
  padding: 12px 32px;

  border: 0;
  border-radius: 999px;

  color: var(--bq-deep);

  background: var(--bq-accent);

  font-family: "Roboto", "Helvetica Neue", sans-serif;
  font-size: 13px;
  font-weight: 500;

  letter-spacing: 0.06em;

  cursor: pointer;

  transition: transform 0.25s ease;
}

.bq-open-btn:hover:not(:disabled) {
  transform: scale(1.03);
}

.bq-open-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.bq-open-btn__icon {
  display: flex;
  align-items: center;
}

.bq-open-btn__icon svg {
  width: 16px;
  height: 16px;
}

/* =========================================================
   GỢI Ý
========================================================= */

.bq-hint {
  position: relative;
  z-index: 3;

  margin: 20px 0 0;

  color: var(--bq-muted);

  font-size: 11px;
  font-style: italic;

  letter-spacing: 0.04em;
}

/* =========================================================
   HIỆU ỨNG ĐÓNG
========================================================= */

.bq-opening--active .bq-card {
  animation: bq-card-out 0.85s cubic-bezier(0.5, 0, 0.75, 0.4) both;
}

.bq-opening--active .bq-open-btn,
.bq-opening--active .bq-hint,
.bq-opening--active .bq-opening__flower {
  animation: bq-fade-out 0.4s ease both;
}

/* =========================================================
   KEYFRAMES
========================================================= */

@keyframes bq-card-in {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes bq-card-out {
  to {
    opacity: 0;
    transform: translateY(-40px) scale(0.92);
  }
}

@keyframes bq-fade-out {
  to {
    opacity: 0;
  }
}

@keyframes bq-flower-float {
  0%,
  100% {
    translate: 0 0;
  }

  50% {
    translate: 0 -12px;
  }
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-card {
    width: min(100%, 420px);

    padding: 32px 26px 34px;
  }

  .bq-card__frame {
    width: 112%;

    margin-left: -6%;
  }

  .bq-card__amp {
    font-size: 118px;
  }

  .bq-card__name {
    font-size: 45px;
  }

  .bq-opening__flower {
    width: 160px;
  }

  .bq-opening__flower--right {
    width: 130px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .bq-card,
  .bq-opening__flower {
    animation: none;
  }
}
</style>
