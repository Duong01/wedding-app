<template>
  <div
    class="countdown"
    :class="{ 'is-finished': isFinished }"
  >
    <div
      v-for="item in countdownItems"
      :key="item.label"
      class="count-item"
    >
      <!-- NUMBER -->

      <div class="number-wrapper">
        <Transition
          name="flip"
          mode="out-in"
        >
          <div
            :key="item.value"
            class="number"
          >
            {{ format(item.value) }}
          </div>
        </Transition>
      </div>

      <!-- LABEL -->

      <div class="label">
        {{ item.label }}
      </div>
    </div>
  </div>
</template>


<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from "vue";

import dayjs from "dayjs";

import duration from "dayjs/plugin/duration";

dayjs.extend(duration);


/* =========================================================
   PROPS
========================================================= */

const props = defineProps({
  timeWedding: {
    type: String,

    required: true,

    default: "2026/12/12T08:00:00",
  },
});


/* =========================================================
   TIME
========================================================= */

const now = ref(dayjs());

let timer = null;


/* =========================================================
   REMAINING TIME
========================================================= */

const remain = computed(() => {
  const target = dayjs(
    props.timeWedding
  );

  const diff = target.diff(
    now.value
  );


  if (diff <= 0) {
    return {
      days: 0,

      hours: 0,

      minutes: 0,

      seconds: 0,
    };
  }


  const d = dayjs.duration(diff);


  return {
    days: Math.floor(
      d.asDays()
    ),

    hours: d.hours(),

    minutes: d.minutes(),

    seconds: d.seconds(),
  };
});


/* =========================================================
   FINISHED
========================================================= */

const isFinished = computed(() => {
  return dayjs(
    props.timeWedding
  ).diff(now.value) <= 0;
});


/* =========================================================
   COUNTDOWN ITEMS
========================================================= */

const countdownItems = computed(() => [
  {
    label: "Ngày",

    value: remain.value.days,
  },

  {
    label: "Giờ",

    value: remain.value.hours,
  },

  {
    label: "Phút",

    value: remain.value.minutes,
  },

  {
    label: "Giây",

    value: remain.value.seconds,
  },
]);


/* =========================================================
   FORMAT
========================================================= */

function format(value) {
  return String(value).padStart(
    2,
    "0"
  );
}


/* =========================================================
   TIMER
========================================================= */

onMounted(() => {
  timer = setInterval(() => {
    now.value = dayjs();
  }, 1000);
});


onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>


<style scoped lang="scss">

/* =========================================================
   COUNTDOWN
========================================================= */

.countdown {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  width: min(
    100%,
    430px
  );

  margin: 0 auto;

  gap: clamp(
    8px,
    2vw,
    16px
  );

  perspective: 600px;
}


/* =========================================================
   ITEM
========================================================= */

.count-item {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  min-width: 0;

  padding:
    11px
    8px
    9px;

  /*
   * Nền kính rất nhẹ.
   * Không dùng trắng quá mạnh.
   */
  background:
    rgba(
      255,
      247,
      229,
      0.08
    );

  border:
    1px solid
    rgba(
      247,
      216,
      163,
      0.28
    );

  border-radius: 12px;

  box-shadow:
    0 8px 22px
    rgba(
      45,
      0,
      0,
      0.12
    );

  backdrop-filter:
    blur(8px);

  -webkit-backdrop-filter:
    blur(8px);

  text-align: center;

  transition:
    transform 0.3s ease,
    background 0.3s ease,
    border-color 0.3s ease;
}


/* =========================================================
   HOVER
========================================================= */

.count-item:hover {
  transform:
    translateY(-2px);

  background:
    rgba(
      255,
      247,
      229,
      0.13
    );

  border-color:
    rgba(
      247,
      216,
      163,
      0.42
    );
}


/* =========================================================
   NUMBER WRAPPER
========================================================= */

.number-wrapper {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  min-width: 0;

  height: 34px;

  overflow: hidden;
}


/* =========================================================
   NUMBER
========================================================= */

.number {
  color: #f7d8a3;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: clamp(
    24px,
    4vw,
    34px
  );

  font-weight: 600;

  line-height: 1;

  letter-spacing: 0.02em;

  font-variant-numeric: lining-nums;

  text-shadow:
    0 2px 8px rgba(45, 0, 0, 0.18);

  transform-origin: center center;

  will-change:
    transform,
    opacity;
}



/* =========================================================
   LABEL
========================================================= */

.label {
  margin-top: 6px;

  color:
    rgba(
      247,
      216,
      163,
      0.72
    );

  font-family:
    var(
      --font-main,
      "Cormorant Garamond",
      Georgia,
      serif
    );

  font-size: clamp(
    8px,
    1.2vw,
    10px
  );

  font-weight: 500;

  line-height: 1.2;

  letter-spacing: 0.12em;

  text-transform: uppercase;

  white-space: nowrap;
}


/* =========================================================
   FLIP ANIMATION
========================================================= */

.flip-enter-active,
.flip-leave-active {
  transition:
    transform 0.38s
      cubic-bezier(
        0.22,
        1,
        0.36,
        1
      ),
    opacity 0.25s ease;
}


.flip-enter-from {
  opacity: 0;

  transform:
    perspective(300px)
    rotateX(-70deg)
    translateY(-4px);
}


.flip-leave-to {
  opacity: 0;

  transform:
    perspective(300px)
    rotateX(70deg)
    translateY(4px);
}


/* =========================================================
   FINISHED
========================================================= */

.countdown.is-finished {
  opacity: 0.85;
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 768px) {

  .countdown {
    width: min(
      100%,
      390px
    );

    gap: 9px;
  }


  .count-item {
    padding:
      10px
      6px
      8px;

    border-radius: 10px;
  }


  .number-wrapper {
    height: 31px;
  }


  .number {
    font-size: 26px;
  }


  .label {
    font-size: 8px;

    letter-spacing: 0.1em;
  }
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {

  .countdown {
    width: min(
      100%,
      350px
    );

    gap: 7px;
  }


  .count-item {
    padding:
      9px
      5px
      7px;

    border-radius: 9px;

    backdrop-filter:
      blur(6px);

    -webkit-backdrop-filter:
      blur(6px);
  }


  .number-wrapper {
    height: 28px;
  }


  .number {
    font-size: clamp(
      21px,
      7vw,
      26px
    );
  }


  .label {
    margin-top: 5px;

    font-size: 8px;

    letter-spacing: 0.08em;
  }
}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 380px) {

  .countdown {
    width: min(
      100%,
      310px
    );

    gap: 5px;
  }


  .count-item {
    padding:
      8px
      4px
      6px;

    border-radius: 8px;
  }


  .number-wrapper {
    height: 25px;
  }


  .number {
    font-size: 20px;
  }


  .label {
    margin-top: 4px;

    font-size: 7px;

    letter-spacing: 0.05em;
  }
}


/* =========================================================
   VERY SHORT SCREEN
========================================================= */

@media (
  max-width: 600px
) and (
  max-height: 700px
) {

  .count-item {
    padding:
      7px
      4px
      6px;
  }


  .number-wrapper {
    height: 24px;
  }


  .number {
    font-size: 20px;
  }


  .label {
    font-size: 7px;
  }
}


/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
  prefers-reduced-motion: reduce
) {

  .flip-enter-active,
  .flip-leave-active {
    transition:
      opacity 0.15s ease;
  }

  .flip-enter-from,
  .flip-leave-to {
    transform: none;
  }

  .count-item {
    transition: none;
  }
}

</style>
