<template>
  <section
    class="cfr-open"
    :class="{
      'is-opening': isOpening,
      'is-opened': isOpened,
    }"
    aria-label="Mở thiệp"
  >

    <!-- =====================================================
         NỀN HOA
    ====================================================== -->

    <div class="cfr-open__garland" aria-hidden="true">
      <img :src="flower1" alt="" />
    </div>

    <img
      :src="flower3"
      class="cfr-open__bloom cfr-open__bloom--left"
      alt=""
      aria-hidden="true"
    />

    <img
      :src="flower2"
      class="cfr-open__bloom cfr-open__bloom--right"
      alt=""
      aria-hidden="true"
    />


    <!-- =====================================================
         THIỆP
    ====================================================== -->

    <div class="cfr-open__stage">

      <div class="cfr-open__card">

        <!-- KHUNG HOA + TÊN -->

        <div class="cfr-open__frame">

          <img
            :src="flowerFrame"
            class="cfr-open__frame-art"
            alt=""
            aria-hidden="true"
          />

          <div class="cfr-open__frame-names">

            <span class="cfr-open__kicker">
              {{ kicker }}
            </span>

            <h1 class="cfr-open__names">
              <span class="cfr-open__name">{{ groomName }}</span>

              <span class="cfr-open__amp">&amp;</span>

              <span class="cfr-open__name">{{ brideName }}</span>
            </h1>

          </div>

        </div>


        <!-- NỘI DUNG -->

        <div class="cfr-open__inner">

          <p class="cfr-open__eyebrow">
            {{ eyebrow }}
          </p>

          <div v-if="dateLabel" class="cfr-open__date">
            <span aria-hidden="true"></span>

            <span>{{ dateLabel }}</span>

            <span aria-hidden="true"></span>
          </div>


          <!-- NGƯỜI ĐƯỢC MỜI -->

          <div v-if="recipient" class="cfr-open__guest">
            <span class="cfr-open__guest-label">
              {{ invite }}
            </span>

            <strong class="cfr-open__guest-name">
              {{ recipient }}
            </strong>
          </div>


          <!-- NÚT MỞ -->

          <button
            type="button"
            class="cfr-pill cfr-open__button"
            :disabled="isOpening"
            @click="openInvitation"
          >
            {{ isOpening ? "ĐANG MỞ..." : buttonLabel }}
          </button>

          <p class="cfr-open__hint">
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

import {
  flower1,
  flower2,
  flower3,
  flowerFrame,
} from "./crystalFloralAssets";


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
    return list[0]?.Name || "";
  }

  if (typeof list === "string") {
    return list;
  }

  return list?.Name || "";
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

.cfr-open {
  position: fixed;

  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100dvh;

  overflow: hidden;

  background-color: var(--cfr-cream, #fbf8f3);

  color: var(--cfr-red-deep, #560207);

  font-family: var(--cfr-font-body, Baskerville, serif);
}


/* =========================================================
   NỀN HOA
========================================================= */

.cfr-open__garland {
  position: absolute;
  top: -20px;
  left: 50%;

  width: 90%;

  transform: translateX(-50%);

  overflow: hidden;

  pointer-events: none;
}

.cfr-open__garland img {
  width: 100%;
  height: auto;

  transform: scaleX(-1);
}

.cfr-open__bloom {
  position: absolute;

  width: 50%;
  height: auto;

  object-fit: contain;

  opacity: 0.07;

  pointer-events: none;
  user-select: none;
}

.cfr-open__bloom--left {
  left: -10%;
  bottom: 4%;

  transform: rotate(20deg);
}

.cfr-open__bloom--right {
  right: -10%;
  top: 18%;

  transform: scaleX(-1) rotate(-20deg);
}


/* =========================================================
   THIỆP
========================================================= */

.cfr-open__stage {
  position: relative;

  z-index: 5;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  animation: cfr-open-rise 900ms cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes cfr-open-rise {
  from {
    opacity: 0;

    transform: translateY(24px) scale(0.97);
  }

  to {
    opacity: 1;

    transform: none;
  }
}

.cfr-open__card {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: min(88vw, 400px);

  transition:
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1),
    opacity 500ms ease;
}

.cfr-open.is-opening .cfr-open__card {
  transform: scale(1.015);
}

.cfr-open.is-opened .cfr-open__card {
  transform: translateY(-14px) scale(1.02);

  opacity: 0;
}


/* =========================================================
   KHUNG HOA + TÊN
========================================================= */

.cfr-open__frame {
  position: relative;

  width: 90%;
  max-width: 340px;

  margin: 0 auto;
}

.cfr-open__frame-art {
  position: relative;

  z-index: 10;

  width: 100%;
  height: auto;
}

.cfr-open__frame-names {
  position: absolute;
  inset: 0;

  z-index: 20;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 4px;

  padding: 0 12%;
}

.cfr-open__kicker {
  color: var(--cfr-red-deep, #560207);

  font-family: var(--cfr-font-heading, "Times New Roman", serif);
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
  line-height: 1.4;

  text-align: center;
  text-transform: uppercase;
}

.cfr-open__names {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 2px;

  margin: 0;

  color: var(--cfr-red, #9c1f2c);

  font-family: "Viaoda Libre", "EB Garamond", cursive;
  font-size: 24px;
  font-weight: 400;

  line-height: 1.25;

  text-align: center;
  text-transform: uppercase;
}

.cfr-open__name {
  display: block;

  padding-top: 0.16em;

  white-space: nowrap;
}

.cfr-open__amp {
  display: block;

  margin: 4px 0;

  font-family: var(--cfr-font-script, "Alex Brush", cursive);
  font-size: 24px;

  line-height: 1;

  opacity: 0.95;

  text-transform: none;
}


/* =========================================================
   NỘI DUNG
========================================================= */

.cfr-open__inner {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;

  width: 100%;

  margin-top: 8px;

  text-align: center;
}

.cfr-open__eyebrow {
  margin: 0;

  color: var(--cfr-red, #9c1f2c);

  font-family: var(--cfr-font-heading, "Times New Roman", serif);
  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.2em;
  line-height: 1.4;

  text-transform: uppercase;
}

.cfr-open__date {
  display: flex;
  align-items: center;

  gap: 10px;

  color: var(--cfr-red-deep, #560207);

  font-size: 13px;

  letter-spacing: 0.15em;
}

.cfr-open__date span[aria-hidden] {
  width: 28px;
  height: 1px;

  background-color: color-mix(
    in srgb,
    var(--cfr-red, #9c1f2c) 45%,
    transparent
  );
}


/* =========================================================
   NGƯỜI ĐƯỢC MỜI
========================================================= */

.cfr-open__guest {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 4px;

  width: 100%;
  max-width: 280px;

  margin-top: 8px;
  padding-top: 14px;

  border-top: 1px solid var(--cfr-hairline-soft, rgba(156, 31, 44, 0.13));
}

.cfr-open__guest-label {
  font-size: 12px;

  letter-spacing: 0.1em;

  opacity: 0.75;
}

.cfr-open__guest-name {
  color: var(--cfr-red, #9c1f2c);

  font-size: 17px;
  font-weight: 700;

  line-height: 1.3;
}


/* =========================================================
   NÚT MỞ
========================================================= */

.cfr-open__button {
  margin-top: 14px;
}

.cfr-open__hint {
  max-width: 280px;

  margin: 4px 0 0;

  color: var(--cfr-red-deep, #560207);

  font-size: 11px;

  letter-spacing: 0.08em;
  line-height: 1.6;

  opacity: 0.7;
}


/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .cfr-open__garland {
    top: -40px;
  }

  .cfr-open__frame {
    max-width: 420px;
  }

  .cfr-open__kicker {
    font-size: 11px;
  }

  .cfr-open__names {
    font-size: 30px;
  }

  .cfr-open__amp {
    font-size: 30px;

    margin: 8px 0;
  }

  .cfr-open__eyebrow {
    font-size: 15px;
  }

  .cfr-open__guest-name {
    font-size: 19px;
  }

  .cfr-open__hint {
    font-size: 12px;
  }
}


/* =========================================================
   MÀN HÌNH NHỎ
========================================================= */

@media (max-width: 380px) {
  .cfr-open__frame {
    max-width: 280px;
  }

  .cfr-open__names {
    font-size: 20px;
  }

  .cfr-open__amp {
    font-size: 20px;
  }

  .cfr-open__eyebrow {
    font-size: 12px;
  }
}


/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .cfr-open__stage {
    animation: none;
  }

  .cfr-open__card {
    transition: none;
  }
}
</style>
