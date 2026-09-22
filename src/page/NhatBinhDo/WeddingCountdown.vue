<template>
  <div class="cfr-countdown">

    <h2 class="cfr-title">
      {{ heading }}
    </h2>


    <div class="cfr-countdown__grid">

      <!-- DAYS -->
      <div class="cfr-countdown__item">
        <div class="cfr-countdown__number">
          <Transition name="cfr-flip" mode="out-in">
            <strong :key="values.days">
              {{ values.days }}
            </strong>
          </Transition>
        </div>

        <span>NGÀY</span>
      </div>


      <div class="cfr-countdown__sep" aria-hidden="true">:</div>


      <!-- HOURS -->
      <div class="cfr-countdown__item">
        <div class="cfr-countdown__number">
          <Transition name="cfr-flip" mode="out-in">
            <strong :key="values.hours">
              {{ values.hours }}
            </strong>
          </Transition>
        </div>

        <span>GIỜ</span>
      </div>


      <div class="cfr-countdown__sep" aria-hidden="true">:</div>


      <!-- MINUTES -->
      <div class="cfr-countdown__item">
        <div class="cfr-countdown__number">
          <Transition name="cfr-flip" mode="out-in">
            <strong :key="values.minutes">
              {{ values.minutes }}
            </strong>
          </Transition>
        </div>

        <span>PHÚT</span>
      </div>


      <div class="cfr-countdown__sep" aria-hidden="true">:</div>


      <!-- SECONDS -->
      <div class="cfr-countdown__item">
        <div class="cfr-countdown__number">
          <Transition name="cfr-flip" mode="out-in">
            <strong :key="values.seconds">
              {{ values.seconds }}
            </strong>
          </Transition>
        </div>

        <span>GIÂY</span>
      </div>

    </div>

  </div>
</template>


<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { sectionText } from "@/data/sectionTitles";


const props = defineProps({
  countdown: {
    type: [Object, String],
    default: null,
  },

  weddingDate: {
    type: [String, Object],
    default: "",
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


/* =========================================================
   TIÊU ĐỀ MỤC
========================================================= */

const heading = computed(() =>
  sectionText(props.sections, "countdown", "Heading")
);


/* =========================================================
   CURRENT TIME
========================================================= */

const now = ref(Date.now());

let timer = null;


/* =========================================================
   TARGET DATE
========================================================= */

const target = computed(() => {
  let value = null;

  if (typeof props.countdown === "string") {
    value = props.countdown;
  } else {
    value =
      props.countdown?.Date ||
      props.countdown?.Target ||
      props.countdown?.WeddingDate ||
      null;
  }

  if (!value) {
    value = props.weddingDate || null;
  }

  if (!value) {
    return Date.now();
  }

  const timestamp = new Date(value).getTime();

  return Number.isFinite(timestamp) ? timestamp : Date.now();
});


/* =========================================================
   COUNTDOWN VALUES
========================================================= */

const values = computed(() => {
  const distance = Math.max(0, target.value - now.value);

  const days = Math.floor(distance / 86400000);

  const hours = Math.floor((distance % 86400000) / 3600000);

  const minutes = Math.floor((distance % 3600000) / 60000);

  const seconds = Math.floor((distance % 60000) / 1000);

  return {
    days: String(days).padStart(2, "0"),

    hours: String(hours).padStart(2, "0"),

    minutes: String(minutes).padStart(2, "0"),

    seconds: String(seconds).padStart(2, "0"),
  };
});


/* =========================================================
   TIMER
========================================================= */

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now();
  }, 1000);
});


onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>


<style scoped>
/* =========================================================
   COUNTDOWN
========================================================= */

.cfr-countdown {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 16px;

  width: 100%;

  text-align: center;
}


/* =========================================================
   GRID
========================================================= */

.cfr-countdown__grid {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  gap: 4px;
}


/* =========================================================
   ITEM
========================================================= */

.cfr-countdown__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 55px;
}


/* =========================================================
   NUMBER
========================================================= */

.cfr-countdown__number {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 55px;
  height: 38px;

  overflow: hidden;

  perspective: 180px;
}

.cfr-countdown__number strong {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--cfr-red);

  font-family: var(--cfr-font-body);
  font-size: 29px;
  font-weight: 700;

  line-height: 1;

  letter-spacing: -0.02em;

  transform-origin: center center;

  backface-visibility: hidden;
}


/* =========================================================
   FLIP
========================================================= */

.cfr-flip-enter-active,
.cfr-flip-leave-active {
  transition:
    transform 0.42s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 0.28s ease;
}

.cfr-flip-enter-from {
  opacity: 0;

  transform: translateY(100%) rotateX(-65deg) scale(0.92);
}

.cfr-flip-enter-to {
  opacity: 1;

  transform: translateY(0) rotateX(0) scale(1);
}

.cfr-flip-leave-from {
  opacity: 1;

  transform: translateY(0) rotateX(0) scale(1);
}

.cfr-flip-leave-to {
  opacity: 0;

  transform: translateY(-100%) rotateX(65deg) scale(0.92);
}


/* =========================================================
   LABEL
========================================================= */

.cfr-countdown__item span {
  display: block;

  margin-top: 6px;

  color: var(--cfr-red-deep);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.15em;
  line-height: 1;
}


/* =========================================================
   SEPARATOR
========================================================= */

.cfr-countdown__sep {
  align-self: flex-start;

  margin-top: 4px;

  color: var(--cfr-red);

  font-size: 21px;
  font-weight: 700;

  line-height: 30px;

  opacity: 0.8;
}


/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .cfr-countdown {
    gap: 20px;
  }

  .cfr-countdown__item,
  .cfr-countdown__number {
    width: 64px;
  }

  .cfr-countdown__number {
    height: 44px;
  }

  .cfr-countdown__number strong {
    font-size: 34px;
  }

  .cfr-countdown__item span {
    font-size: 11px;
  }

  .cfr-countdown__sep {
    font-size: 24px;

    line-height: 36px;
  }
}


/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .cfr-countdown__item,
  .cfr-countdown__number {
    width: 48px;
  }

  .cfr-countdown__number {
    height: 34px;
  }

  .cfr-countdown__number strong {
    font-size: 25px;
  }

  .cfr-countdown__sep {
    font-size: 18px;

    line-height: 26px;
  }
}
</style>
