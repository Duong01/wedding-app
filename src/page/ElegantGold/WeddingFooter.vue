<template>
  <footer class="eg-footer">

    <div class="footer-inner">

      <div class="footer-ornament">
        <span></span>
        <i>✦</i>
        <span></span>
      </div>

      <div class="footer-script">
        Thank you
      </div>

      <p class="footer-message">
        Cảm ơn bạn đã dành thời gian
        đến với câu chuyện của chúng mình.
      </p>

      <!-- MONOGRAM -->

      <div class="monogram">

        <span class="monogram-line"></span>

        <div class="monogram-circle">
          {{ monogram }}
        </div>

        <span class="monogram-line"></span>

      </div>

      <!-- NAMES -->

      <h2>
        {{ wedding?.GroomName || "Groom" }}

        <small>
          &
        </small>

        {{ wedding?.BrideName || "Bride" }}
      </h2>

      <!-- DATE -->

      <div
        v-if="wedding?.weddingDate"
        class="footer-date"
      >
        {{ formattedDate }}
      </div>

      <!-- COPYRIGHT -->

      <div class="footer-bottom">

        <span>
          {{ currentYear }}
        </span>

        <span class="dot">
          ·
        </span>

        <span>
          OUR WEDDING DAY
        </span>

      </div>

    </div>

  </footer>
</template>

<script setup>
import { computed } from "vue";

import dayjs from "dayjs";
import "dayjs/locale/vi";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },

  monogram: {
    type: String,
    default: "G&B",
  },

  currentYear: {
    type: Number,
    default: () =>
      new Date().getFullYear(),
  },
});

const formattedDate = computed(() => {
  if (!props.wedding?.weddingDate) {
    return "";
  }

  const date = dayjs(
    props.wedding.weddingDate
  );

  if (!date.isValid()) {
    return "";
  }

  return date
    .locale("vi")
    .format(
      "DD · MM · YYYY"
    );
});
</script>

<style scoped>
.eg-footer {
  position: relative;

  padding:
    110px 30px 45px;

  background:
    #201d17;

  color: #f7eedb;

  text-align: center;

  overflow: hidden;
}

.eg-footer::before {
  content: "";

  position: absolute;

  inset: 20px;

  border:
    1px solid
    rgba(212,175,55,.13);
}

.footer-inner {
  position: relative;

  width: min(
    100%,
    650px
  );

  margin: auto;
}

/* ORNAMENT */

.footer-ornament {
  width: 170px;

  display: flex;

  align-items: center;

  gap: 10px;

  margin:
    0 auto 25px;
}

.footer-ornament span {
  flex: 1;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      #b89548
    );
}

.footer-ornament span:last-child {
  background:
    linear-gradient(
      90deg,
      #b89548,
      transparent
    );
}

.footer-ornament i {
  color: #d4af37;

  font-size: 7px;

  font-style: normal;
}

/* SCRIPT */

.footer-script {
  color: #d4b86d;

  font-family:
    "Allura",
    cursive;

  font-size: 48px;
}

/* MESSAGE */

.footer-message {
  max-width: 400px;

  margin:
    10px auto 35px;

  color:
    rgba(246,233,201,.6);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 16px;

  line-height: 1.6;
}

/* MONOGRAM */

.monogram {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 18px;

  margin-bottom: 30px;
}

.monogram-line {
  width: 55px;

  height: 1px;

  background:
    rgba(212,175,55,.35);
}

.monogram-circle {
  width: 75px;
  height: 75px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    #c39c42;

  border-radius: 50%;

  color: #e1c778;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 19px;

  letter-spacing: 2px;
}

/* NAMES */

.footer-inner h2 {
  margin: 0;

  color: #fff4d8;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(30px, 6vw, 44px);

  font-weight: 400;
}

.footer-inner h2 small {
  margin:
    0 8px;

  color: #c9a85d;

  font-family:
    "Allura",
    cursive;

  font-size: 32px;

  font-weight: 400;
}

/* DATE */

.footer-date {
  margin-top: 14px;

  color:
    rgba(227,202,143,.7);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 15px;

  letter-spacing: 3px;
}

/* BOTTOM */

.footer-bottom {
  margin-top: 70px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  color:
    rgba(230,213,177,.3);

  font-family: Arial, sans-serif;

  font-size: 7px;

  letter-spacing: 2px;
}

.dot {
  color: #b89548;
}

/* MOBILE */

@media (max-width:600px) {
  .eg-footer {
    padding:
      85px 20px 35px;
  }

  .eg-footer::before {
    inset: 10px;
  }

  .monogram-line {
    width: 35px;
  }

  .monogram-circle {
    width: 65px;
    height: 65px;
  }

  .footer-bottom {
    margin-top: 55px;
  }
}
</style>