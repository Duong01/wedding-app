<template>
  <div class="countdown">

    <div class="countdown-intro">
      {{ sectionText(sections, "countdown", "Eyebrow", $t("NGÀY TRỌNG ĐẠI ĐANG ĐẾN GẦN")) }}
    </div>
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'countdown', 'Heading')" class="ig-cd-custom-head">
      <h2 v-if="sectionOverride(sections, 'countdown', 'Heading')" class="ig-cd-custom-head__heading">{{ sectionOverride(sections, "countdown", "Heading") }}</h2>
    </header>



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

        <span>{{ $t("NGÀY") }}</span>
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

        <span>{{ $t("GIỜ") }}</span>
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

        <span>{{ $t("PHÚT") }}</span>
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

        <span>{{ $t("GIÂY") }}</span>

      </div>

    </div>

  </div>
</template>


<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";


const props = defineProps({
  sections: { type: Object, default: () => ({}) },
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

  color: var(--tc-8d6a35, #8d6a35);

  font-size: 11px;

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

  color: var(--tc-8e1418, #8e1418);

  font-family:
    var(--font-num, "Be Vietnam Pro"),
    "Segoe UI",
    system-ui,
    sans-serif;

  font-size: 29px;

  font-weight: 900;

  line-height: 1;

  letter-spacing: -1px;

  text-shadow:
    0 1px 0 rgba(255,255,255,.7),
    0 2px 5px rgba(var(--tc-781414-rgb, 120, 20, 20), .12);

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

  color: var(--tc-8a6947, #8a6947);

  font-size: 10px;

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

  color: var(--tc-876834, #876834);

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

  color: var(--tc-941519, #941519);

}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 420px) {

  .countdown-intro {

    margin-bottom: 16px;

    font-size: 10px;

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

    font-size: 11px;

    letter-spacing: 1.2px;

  }


  .separator {

    margin-top: 4px;

    font-size: 18px;

    line-height: 28px;

  }

}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ig-cd-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ig-cd-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ig-cd-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ig-cd-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
