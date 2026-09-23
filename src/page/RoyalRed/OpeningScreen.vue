<template>
  <section
    class="rr-open"
    :class="{
      'is-opening': isOpening,
      'is-opened': isOpened,
    }"
    aria-label="Mở thiệp"
  >

    <!-- =====================================================
         NỀN HOA
    ====================================================== -->

    <img
      :src="flower"
      class="rr-open__bloom rr-open__bloom--left"
      alt=""
      aria-hidden="true"
    />

    <img
      :src="flower"
      class="rr-open__bloom rr-open__bloom--right"
      alt=""
      aria-hidden="true"
    />


    <!-- =====================================================
         THIỆP
    ====================================================== -->

    <div class="rr-open__stage">

      <div class="rr-open__card">

        <div class="rr-open__frame">

          <span class="rr-open__kicker">
            {{ kicker }}
          </span>

          <h1 class="rr-open__names">
            <span class="rr-open__name">{{ groomName }}</span>

            <span class="rr-open__amp">&amp;</span>

            <span class="rr-open__name">{{ brideName }}</span>
          </h1>

          <span class="rr-open__rule" aria-hidden="true"></span>

        </div>


        <!-- ===============================================
             NỘI DUNG
        ================================================ -->

        <div class="rr-open__inner">

          <p class="rr-open__eyebrow">
            {{ eyebrow }}
          </p>

          <div v-if="dateLabel" class="rr-open__date">
            <span aria-hidden="true"></span>

            <span>{{ dateLabel }}</span>

            <span aria-hidden="true"></span>
          </div>


          <!-- NGƯỜI ĐƯỢC MỜI -->

          <div v-if="recipient" class="rr-open__guest">
            <span class="rr-open__guest-label">
              {{ invite }}
            </span>

            <strong class="rr-open__guest-name">
              {{ recipient }}
            </strong>
          </div>


          <!-- NÚT MỞ -->

          <button
            type="button"
            class="rr-pill rr-open__button"
            :disabled="isOpening"
            @click="openInvitation"
          >
            {{ isOpening ? "ĐANG MỞ..." : buttonLabel }}
          </button>

          <p class="rr-open__hint">
            {{ hint }}
          </p>

        </div>

      </div>

    </div>

  </section>
</template>


<script setup>
import { computed, ref } from "vue";

import { sectionText } from "@/data/sectionTitles";

import { flower } from "./royalRedAssets";


/* =========================================================
   PROPS
========================================================= */

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

  guestName: {
    type: String,
    default: "",
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


const emit = defineEmits(["open"]);


/* =========================================================
   TIÊU ĐỀ MỤC
========================================================= */

const eyebrow = computed(() =>
  sectionText(props.sections, "opening", "Eyebrow")
);

const kicker = computed(() =>
  sectionText(props.sections, "opening", "Kicker")
);

const invite = computed(() =>
  sectionText(props.sections, "opening", "Invite")
);

const buttonLabel = computed(() =>
  sectionText(props.sections, "opening", "Button")
);

const hint = computed(() =>
  sectionText(props.sections, "opening", "Hint")
);


/* =========================================================
   STATE
========================================================= */

const isOpening = ref(false);

const isOpened = ref(false);


/* =========================================================
   TÊN CÔ DÂU CHÚ RỂ
========================================================= */

const groomName = computed(() => {
  return (
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    props.wedding?.groom?.name ||
    ""
  );
});


const brideName = computed(() => {
  return (
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    props.wedding?.bride?.name ||
    ""
  );
});


/* =========================================================
   NGƯỜI ĐƯỢC MỜI
========================================================= */

const recipient = computed(() => {
  const list = props.wedding?.recipientName;

  if (Array.isArray(list)) {
    return list[0]?.Name || props.guestName || "";
  }

  if (typeof list === "string") {
    return list;
  }

  return list?.Name || props.guestName || "";
});


/* =========================================================
   MỞ THIỆP
========================================================= */

function openInvitation() {
  if (isOpening.value) return;

  isOpening.value = true;

  /*
   * Giai đoạn 1: thiệp sáng lên và phóng nhẹ.
   */
  setTimeout(() => {
    isOpened.value = true;
  }, 320);

  /*
   * Giai đoạn 2: đợi hiệu ứng chạy xong mới chuyển
   * sang trang chính, tránh cảm giác giật.
   */
  setTimeout(() => {
    emit("open");
  }, 1150);
}
</script>


<style scoped>
/* =========================================================
   ROOT
========================================================= */

.rr-open {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100dvh;

  overflow: hidden;

  background-color: var(--rr-cream, #f4eee2);

  color: var(--rr-red, #5c080c);

  font-family: var(--rr-font-body, Baskerville, serif);
}


/* =========================================================
   NỀN HOA
========================================================= */

.rr-open__bloom {
  position: absolute;

  width: 52%;
  height: auto;

  object-fit: contain;

  opacity: 0.1;

  pointer-events: none;
  user-select: none;
}

.rr-open__bloom--left {
  left: -14%;
  bottom: 2%;

  transform: rotate(18deg);
}

.rr-open__bloom--right {
  right: -14%;
  top: 12%;

  transform: scaleX(-1) rotate(-18deg);
}


/* =========================================================
   THIỆP
========================================================= */

.rr-open__stage {
  position: relative;

  z-index: 5;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  animation: rr-open-rise 900ms cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes rr-open-rise {
  from {
    opacity: 0;

    transform: translateY(24px) scale(0.97);
  }

  to {
    opacity: 1;

    transform: none;
  }
}

.rr-open__card {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: min(88vw, 400px);

  transition:
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 500ms ease;
}

.rr-open.is-opening .rr-open__card {
  transform: scale(1.015);
}

.rr-open.is-opened .rr-open__card {
  transform: translateY(-14px) scale(1.02);

  opacity: 0;
}


/* =========================================================
   KHUNG TÊN
========================================================= */

.rr-open__frame {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 6px;

  width: 100%;

  padding: 0 8%;
}

.rr-open__kicker {
  color: var(--rr-red, #5c080c);

  font-family: var(--rr-font-body, Baskerville, serif);
  font-size: 11px;
  font-weight: 400;

  letter-spacing: 0.28em;
  line-height: 1.4;

  text-align: center;
  text-transform: uppercase;

  opacity: 0.8;
}

.rr-open__names {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 2px;

  margin: 0;

  color: var(--rr-red, #5c080c);

  font-family: var(--rr-font-hero, "Playfair Display", serif);
  font-size: 34px;
  font-weight: 400;

  letter-spacing: 0.01em;
  line-height: 1.15;

  text-align: center;
  text-transform: uppercase;
}

.rr-open__name {
  display: block;

  padding-top: 0.12em;

  white-space: nowrap;
}

.rr-open__amp {
  display: block;

  margin: 2px 0;

  font-family: var(--rr-font-name, "EB Garamond", serif);
  font-size: 26px;

  line-height: 1;

  text-transform: none;
}

.rr-open__rule {
  display: block;

  width: 60px;
  height: 1px;

  margin-top: 10px;

  background-color: var(--rr-red, #5c080c);
}


/* =========================================================
   NỘI DUNG
========================================================= */

.rr-open__inner {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;

  width: 100%;

  margin-top: 22px;

  text-align: center;
}

.rr-open__eyebrow {
  margin: 0;

  color: var(--rr-red, #5c080c);

  font-family: var(--rr-font-heading, "Times New Roman", serif);
  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.05em;
  line-height: 1.4;

  text-transform: uppercase;
}

.rr-open__date {
  display: flex;
  align-items: center;

  gap: 10px;

  color: var(--rr-red, #5c080c);

  font-size: 13px;

  letter-spacing: 0.15em;
}

.rr-open__date span[aria-hidden] {
  width: 28px;
  height: 1px;

  background-color: color-mix(
    in srgb,
    var(--rr-red, #5c080c) 45%,
    transparent
  );
}


/* =========================================================
   NGƯỜI ĐƯỢC MỜI
========================================================= */

.rr-open__guest {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 4px;

  width: 100%;
  max-width: 280px;

  margin-top: 8px;
  padding-top: 14px;

  border-top: 1px solid var(--rr-hairline-soft, rgba(92, 8, 12, 0.13));
}

.rr-open__guest-label {
  font-size: 12px;

  letter-spacing: 0.1em;

  opacity: 0.75;
}

.rr-open__guest-name {
  color: var(--rr-red, #5c080c);

  font-size: 17px;
  font-weight: 700;

  line-height: 1.3;
}


/* =========================================================
   NÚT MỞ
========================================================= */

.rr-open__button {
  margin-top: 14px;
}

.rr-open__hint {
  max-width: 280px;

  margin: 4px 0 0;

  color: var(--rr-red, #5c080c);

  font-size: 11px;

  letter-spacing: 0.08em;
  line-height: 1.6;

  opacity: 0.7;
}


/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .rr-open__names {
    font-size: 44px;
  }

  .rr-open__amp {
    font-size: 32px;
  }

  .rr-open__kicker {
    font-size: 12px;
  }

  .rr-open__eyebrow {
    font-size: 15px;
  }

  .rr-open__guest-name {
    font-size: 19px;
  }

  .rr-open__hint {
    font-size: 12px;
  }
}


/* =========================================================
   MÀN HÌNH NHỎ
========================================================= */

@media (max-width: 380px) {
  .rr-open__names {
    font-size: 28px;
  }

  .rr-open__amp {
    font-size: 22px;
  }

  .rr-open__eyebrow {
    font-size: 12px;
  }
}


/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .rr-open__stage {
    animation: none;
  }

  .rr-open__card {
    transition: none;
  }
}
</style>
