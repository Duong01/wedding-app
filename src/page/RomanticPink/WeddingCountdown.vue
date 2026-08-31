<template>
  <div class="countdown">

    <div class="countdown-intro">
      NGÀY TRỌNG ĐẠI ĐANG ĐẾN GẦN
    </div>


    <div class="countdown-grid">

      <!-- DAYS -->
      <div class="time-box">
        <div class="number-wrap">

          <Transition
            name="flip-number"
            mode="out-in"
          >
            <strong :key="values.days">
              {{ values.days }}
            </strong>
          </Transition>

        </div>

        <span>NGÀY</span>
      </div>


      <div class="separator">
        :
      </div>


      <!-- HOURS -->
      <div class="time-box">
        <div class="number-wrap">

          <Transition
            name="flip-number"
            mode="out-in"
          >
            <strong :key="values.hours">
              {{ values.hours }}
            </strong>
          </Transition>

        </div>

        <span>GIỜ</span>
      </div>


      <div class="separator">
        :
      </div>


      <!-- MINUTES -->
      <div class="time-box">
        <div class="number-wrap">

          <Transition
            name="flip-number"
            mode="out-in"
          >
            <strong :key="values.minutes">
              {{ values.minutes }}
            </strong>
          </Transition>

        </div>

        <span>PHÚT</span>
      </div>


      <div class="separator">
        :
      </div>


      <!-- SECONDS -->
      <div class="time-box seconds-box">

        <div class="number-wrap">

          <Transition
            name="flip-number"
            mode="out-in"
          >
            <strong
              :key="values.seconds"
              class="seconds"
            >
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
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";


const props = defineProps({
  countdown: {
    type: [Object, String],
    default: null,
  },
});


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
    return Date.now();
  }


  const timestamp =
    new Date(value).getTime();


  return Number.isFinite(timestamp)
    ? timestamp
    : Date.now();

});


/* =========================================================
   COUNTDOWN VALUES
========================================================= */

const values = computed(() => {

  const distance = Math.max(
    0,
    target.value - now.value
  );


  const days = Math.floor(
    distance / 86400000
  );


  const hours = Math.floor(
    (distance % 86400000) / 3600000
  );


  const minutes = Math.floor(
    (distance % 3600000) / 60000
  );


  const seconds = Math.floor(
    (distance % 60000) / 1000
  );


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

.countdown {

  width: 100%;

  text-align: center;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

}


/* =========================================================
   INTRO
========================================================= */

.countdown-intro {

  margin-bottom: 18px;

  color: #a67d3e;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 2.5px;

  line-height: 1.4;

}


/* =========================================================
   GRID
========================================================= */

.countdown-grid {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 5px;

}


/* =========================================================
   TIME BOX
========================================================= */

.time-box {

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  width: 55px;

}


/* =========================================================
   NUMBER CONTAINER
========================================================= */

.number-wrap {

  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 55px;

  height: 38px;

  overflow: hidden;

  perspective: 180px;

}


/* =========================================================
   NUMBER
========================================================= */

.number-wrap strong {

  position: absolute;

  inset: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #8e1418;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 29px;

  font-weight: 900;

  line-height: 1;

  letter-spacing: -1px;

  text-shadow:
    0 1px 0 rgba(255,255,255,.7),
    0 2px 5px rgba(120,20,20,.12);

  transform-origin: center center;

  backface-visibility: hidden;

}


/* =========================================================
   FLIP OUT
========================================================= */

.flip-number-enter-active,
.flip-number-leave-active {

  transition:
    transform .42s cubic-bezier(.22,.61,.36,1),
    opacity .28s ease;

}


/*
 * Số mới:
 * từ phía dưới đi lên.
 */

.flip-number-enter-from {

  opacity: 0;

  transform:
    translateY(100%)
    rotateX(-65deg)
    scale(.92);

}


/*
 * Số mới:
 * về vị trí bình thường.
 */

.flip-number-enter-to {

  opacity: 1;

  transform:
    translateY(0)
    rotateX(0)
    scale(1);

}


/*
 * Số cũ:
 * trượt lên trên.
 */

.flip-number-leave-from {

  opacity: 1;

  transform:
    translateY(0)
    rotateX(0)
    scale(1);

}


/*
 * Số cũ:
 * biến mất phía trên.
 */

.flip-number-leave-to {

  opacity: 0;

  transform:
    translateY(-100%)
    rotateX(65deg)
    scale(.92);

}


/* =========================================================
   LABEL
========================================================= */

.time-box span {

  display: block;

  margin-top: 6px;

  color: #99754f;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 1.5px;

  line-height: 1;

}


/* =========================================================
   SEPARATOR
========================================================= */

.separator {

  align-self: flex-start;

  margin-top: 5px;

  color: #b48a45;

  font-family:
    Georgia,
    serif;

  font-size: 21px;

  font-weight: 700;

  line-height: 30px;

  opacity: .8;

}


/* =========================================================
   SECONDS
========================================================= */

.seconds-box .number-wrap strong {

  color: #941519;

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 420px) {

  .countdown-intro {

    margin-bottom: 16px;

    font-size: 8px;

    letter-spacing: 2px;

  }


  .countdown-grid {

    gap: 2px;

  }


  .time-box {

    width: 49px;

  }


  .number-wrap {

    width: 49px;

    height: 36px;

  }


  .number-wrap strong {

    font-size: 26px;

  }


  .time-box span {

    font-size: 7px;

    letter-spacing: 1.2px;

  }


  .separator {

    margin-top: 4px;

    font-size: 18px;

    line-height: 28px;

  }

}
</style>
