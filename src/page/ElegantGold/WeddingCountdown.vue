<template>
  <section class="eg-countdown">
    <div class="countdown-bg"></div>

    <div class="countdown-inner">

      <div class="section-label">
        COUNTING DOWN
      </div>

      <div class="script-title">
        Đếm ngược đến ngày chung đôi
      </div>

      <h2>
        Một ngày đặc biệt
        <br />
        đang đến gần...
      </h2>

      <div class="gold-divider">
        <span></span>
        <i>✦</i>
        <span></span>
      </div>

      <!-- COUNTDOWN -->

      <div class="countdown-grid">

        <div
          v-for="item in countdownItems"
          :key="item.key"
          class="countdown-item"
        >
          <div class="number-wrap">
            <span class="number">
              {{ item.value }}
            </span>

            <span class="corner corner-tl"></span>
            <span class="corner corner-tr"></span>
            <span class="corner corner-bl"></span>
            <span class="corner corner-br"></span>
          </div>

          <div class="unit">
            {{ item.label }}
          </div>
        </div>

      </div>

      <!-- DATE -->

      <div
        v-if="targetDate"
        class="target-date"
      >
        <span>✦</span>

        {{ formattedTargetDate }}

        <span>✦</span>
      </div>

      <!-- COMPLETE -->

      <div
        v-if="completed"
        class="completed-message"
      >
        <div class="completed-icon">
          ♥
        </div>

        <div>
          Ngày chung đôi đã đến
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

import dayjs from "dayjs";
import "dayjs/locale/vi";

const props = defineProps({
  countdown: {
    type: Object,
    default: () => ({}),
  },
});

const now = ref(
  Date.now()
);

let timer = null;

const targetDate = computed(() => {
  return (
    props.countdown?.target ||
    props.countdown?.date ||
    ""
  );
});

const targetTime = computed(() => {
  if (!targetDate.value) {
    return 0;
  }

  const time = new Date(
    targetDate.value
  ).getTime();

  return Number.isNaN(time)
    ? 0
    : time;
});

const remaining = computed(() => {
  if (!targetTime.value) {
    return 0;
  }

  return Math.max(
    0,
    targetTime.value - now.value
  );
});

const completed = computed(() => {
  return (
    targetTime.value > 0 &&
    remaining.value <= 0
  );
});

const days = computed(() => {
  return Math.floor(
    remaining.value /
      (1000 * 60 * 60 * 24)
  );
});

const hours = computed(() => {
  return Math.floor(
    (remaining.value %
      (1000 * 60 * 60 * 24)) /
      (1000 * 60 * 60)
  );
});

const minutes = computed(() => {
  return Math.floor(
    (remaining.value %
      (1000 * 60 * 60)) /
      (1000 * 60)
  );
});

const seconds = computed(() => {
  return Math.floor(
    (remaining.value %
      (1000 * 60)) /
      1000
  );
});

function pad(value) {
  return String(value)
    .padStart(2, "0");
}

const countdownItems = computed(() => [
  {
    key: "days",
    value: String(days.value).padStart(2, "0"),
    label: "NGÀY",
  },
  {
    key: "hours",
    value: pad(hours.value),
    label: "GIỜ",
  },
  {
    key: "minutes",
    value: pad(minutes.value),
    label: "PHÚT",
  },
  {
    key: "seconds",
    value: pad(seconds.value),
    label: "GIÂY",
  },
]);

const formattedTargetDate = computed(() => {
  if (!targetDate.value) {
    return "";
  }

  const parsed = dayjs(
    targetDate.value
  );

  if (!parsed.isValid()) {
    return "";
  }

  return parsed
    .locale("vi")
    .format(
      "dddd, DD [tháng] MM [năm] YYYY"
    );
});

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>

<style scoped>
.eg-countdown {
  position: relative;

  min-height: 500px;

  display: flex;

  align-items: center;
  justify-content: center;

  padding:
    95px 30px;

  overflow: hidden;

  color: #f7efd9;

  background:
    #201d17;
}

.countdown-bg {
  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at center,
      rgba(212,175,55,0.11),
      transparent 42%
    ),
    radial-gradient(
      circle at 10% 90%,
      rgba(212,175,55,0.07),
      transparent 25%
    ),
    radial-gradient(
      circle at 90% 10%,
      rgba(212,175,55,0.06),
      transparent 25%
    );
}

.eg-countdown::before {
  content: "";

  position: absolute;

  inset: 20px;

  border:
    1px solid
    rgba(212,175,55,0.15);

  pointer-events: none;
}

.countdown-inner {
  position: relative;

  width: min(
    100%,
    700px
  );

  text-align: center;
}

.section-label {
  color: #d4af37;

  font-family: Arial, sans-serif;

  font-size: 9px;

  letter-spacing: 4px;
}

.script-title {
  margin-top: 18px;

  color: #d8bb69;

  font-family:
    "Allura",
    cursive;

  font-size: 34px;
}

.countdown-inner h2 {
  margin:
    5px 0 20px;

  color: #fff8e7;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(35px, 6vw, 48px);

  font-weight: 400;

  line-height: 0.95;
}

.countdown-inner h2 em {
  color: #c8ad70;

  font-style: italic;
}

/* DIVIDER */

.gold-divider {
  width: 170px;

  display: flex;

  align-items: center;

  gap: 10px;

  margin:
    0 auto 42px;
}

.gold-divider span {
  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      #d4af37
    );
}

.gold-divider span:last-child {
  background:
    linear-gradient(
      90deg,
      #d4af37,
      transparent
    );
}

.gold-divider i {
  color: #d4af37;

  font-size: 7px;

  font-style: normal;
}

/* COUNTDOWN */

.countdown-grid {
  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 15px;
}

.countdown-item {
  text-align: center;
}

.number-wrap {
  position: relative;

  min-height: 120px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    rgba(212,175,55,0.35);

  background:
    rgba(255,255,255,0.025);
}

.number {
  color: #f4df9e;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(42px, 7vw, 58px);

  font-weight: 300;

  line-height: 1;
}

.unit {
  margin-top: 12px;

  color:
    rgba(239,219,166,0.62);

  font-family: Arial, sans-serif;

  font-size: 8px;

  letter-spacing: 3px;
}

/* CORNERS */

.corner {
  position: absolute;

  width: 12px;
  height: 12px;

  border-color:
    rgba(212,175,55,0.7);

  border-style: solid;
}

.corner-tl {
  top: -1px;
  left: -1px;

  border-width:
    1px 0 0 1px;
}

.corner-tr {
  top: -1px;
  right: -1px;

  border-width:
    1px 1px 0 0;
}

.corner-bl {
  bottom: -1px;
  left: -1px;

  border-width:
    0 0 1px 1px;
}

.corner-br {
  right: -1px;
  bottom: -1px;

  border-width:
    0 1px 1px 0;
}

/* TARGET */

.target-date {
  margin-top: 35px;

  display: flex;

  justify-content: center;
  align-items: center;

  gap: 12px;

  color:
    rgba(247,239,217,0.65);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 16px;

  font-style: italic;
}

.target-date span {
  color: #d4af37;

  font-size: 7px;
}

/* COMPLETE */

.completed-message {
  margin-top: 30px;

  color: #e4cc8a;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 22px;
}

.completed-icon {
  margin-bottom: 8px;

  color: #d4af37;

  font-size: 24px;
}

/* MOBILE */

@media (max-width: 600px) {
  .eg-countdown {
    padding:
      75px 20px;
  }

  .eg-countdown::before {
    inset: 10px;
  }

  .countdown-grid {
    gap: 8px;
  }

  .number-wrap {
    min-height: 90px;
  }

  .number {
    font-size: 36px;
  }

  .unit {
    font-size: 7px;

    letter-spacing: 1.5px;
  }

  .target-date {
    font-size: 14px;
  }
}
</style>