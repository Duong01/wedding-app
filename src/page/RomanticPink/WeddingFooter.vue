<template>
  <footer class="footer">
    <!-- =========================
         DECORATIVE FLOWERS
    ========================== -->
    <div class="footer-flower footer-flower--left">
      <img :src="hoa" alt="" />
    </div>

    <div class="footer-flower footer-flower--right">
      <img :src="hoa" alt="" />
    </div>

    <!-- Soft glow -->
    <div class="footer-glow"></div>

    <div class="footer-content">
      <!-- Top ornament -->
      <div class="footer-ornament">
        <span></span>

        <v-icon size="14">mdi-heart</v-icon>

        <span></span>
      </div>

      <!-- Thank you -->
      <div class="footer-eyebrow">THANK YOU</div>

      <p class="footer-subtitle">CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI</p>

      <!-- Monogram -->
      <div class="monogram">
        <div class="monogram-ring"></div>

        <span>{{ monogram }}</span>
      </div>

      <!-- Names -->
      <h2 class="couple-name">
        <span>{{ groom }}</span>

        <i>&amp;</i>

        <span>{{ bride }}</span>
      </h2>

      <!-- Date -->
      <div class="wedding-date">
        <span></span>

        <b>{{ formattedDate }}</b>

        <span></span>
      </div>

      <!-- Message -->
      <p class="footer-message">
        {{ footerMessage }}
      </p>

      <!-- Bottom quote -->
      <div class="footer-quote">
        <v-icon size="13">mdi-flower-outline</v-icon>

        <span>
          Một ngày thật đẹp<br />
          một tình yêu thật đẹp
        </span>

        <v-icon size="13">mdi-flower-outline</v-icon>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <span></span>

        <small>
          © {{ currentYear }} · Cảm ơn bạn đã chung vui cùng chúng mình
        </small>

        <span></span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
import { hoa } from "./romaticpink";

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
    default: 2026,
  },
});

/* =========================================================
   COUPLE
   ========================================================= */

const groom = computed(() => {
  return (
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.footer?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    "Chú rể"
  );
});

const bride = computed(() => {
  return (
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.footer?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    "Cô dâu"
  );
});

/* =========================================================
   DATE
   ========================================================= */

const date = computed(() => {
  return props.wedding?.weddingDate || props.wedding?.hero?.weddingDate || "";
});

const formattedDate = computed(() => {
  if (!date.value) return "";

  const parsed = dayjs(date.value);

  if (!parsed.isValid()) {
    return date.value;
  }

  return parsed.format("DD · MM · YYYY");
});

/* =========================================================
   MESSAGE
   ========================================================= */

const footerMessage = computed(() => {
  return (
    props.wedding?.footer?.Message ||
    props.wedding?.footer?.Content ||
    "Sự hiện diện của Quý khách là niềm vui lớn nhất của chúng mình."
  );
});
</script>

<style scoped>
/* =========================================================
   FOOTER
   ========================================================= */

.footer {
  position: relative;

  min-height: 460px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 72px 22px 42px;

  overflow: hidden;

}

/* =========================================================
   SOFT LIGHT
   ========================================================= */

.footer-glow {
  position: absolute;

  width: 320px;
  height: 320px;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  border-radius: 50%;

  pointer-events: none;
}

/* =========================================================
   FLOWERS
   ========================================================= */

.footer-flower {
  position: absolute;

  width: 270px;

  pointer-events: none;

  opacity: 0.17;

  filter: brightness(1.25) saturate(0.7);

  animation: footerFlowerFloat 7s ease-in-out infinite;
}

.footer-flower img {
  display: block;

  width: 100%;
  height: auto;
}

.footer-flower--left {
  left: -145px;
  bottom: -90px;

  transform: rotate(-15deg);
}

.footer-flower--right {
  right: -145px;
  top: -95px;

  transform: scaleX(-1) rotate(-12deg);

  animation-delay: -3s;
}

/* =========================================================
   CONTENT
   ========================================================= */

.footer-content {
  position: relative;

  z-index: 2;

  width: min(520px, 100%);

  text-align: center;
}

/* =========================================================
   ORNAMENT
   ========================================================= */

.footer-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin-bottom: 17px;
}

.footer-ornament span {
  width: 52px;
  height: 1px;
}

.footer-ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   TITLE
   ========================================================= */

.footer-eyebrow {
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.38em;

  text-indent: 0.38em;
}

.footer-subtitle {
  margin: 7px 0 0;

  font-size: 8px;
  font-weight: 500;

  letter-spacing: 0.2em;
}

/* =========================================================
   MONOGRAM
   ========================================================= */

.monogram {
  position: relative;

  width: 78px;
  height: 78px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 25px auto 20px;

  border: 1px solid rgba(241, 208, 158, 0.7);

  border-radius: 50%;

  box-shadow: 0 0 0 5px rgba(198, 160, 106, 0.07),
    0 12px 30px rgba(49, 13, 25, 0.16);
}

/* Inner ring */

.monogram-ring {
  position: absolute;

  inset: 6px;

  border: 1px solid rgba(255, 232, 194, 0.35);

  border-radius: 50%;
}

.monogram span {
  position: relative;

  font-family: "Great Vibes", cursive;

  font-size: 28px;

  line-height: 1;
}

/* =========================================================
   COUPLE NAME
   ========================================================= */

.couple-name {
  margin: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-wrap: wrap;

  gap: 9px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(26px, 7vw, 36px);

  font-weight: 500;

  line-height: 1.15;
}

.couple-name i {

  font-family: "Great Vibes", cursive;

  font-size: 28px;

  font-weight: 400;
}

/* =========================================================
   DATE
   ========================================================= */

.wedding-date {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 11px;

  margin-top: 18px;
}

.wedding-date span {
  width: 35px;
  height: 1px;

}

.wedding-date span:last-child {
  transform: rotate(180deg);
}

.wedding-date b {

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.18em;
}

/* =========================================================
   MESSAGE
   ========================================================= */

.footer-message {
  max-width: 390px;

  margin: 22px auto 0;


  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 15px;

  font-style: italic;

  line-height: 1.7;
}

/* =========================================================
   QUOTE
   ========================================================= */

.footer-quote {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 13px;

  margin-top: 24px;

}

.footer-quote .v-icon {
  opacity: 0.8;
}

.footer-quote span {
  font-size: 9px;

  font-style: italic;

  line-height: 1.5;

  letter-spacing: 0.06em;
}

/* =========================================================
   BOTTOM
   ========================================================= */

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  margin-top: 34px;
}

.footer-bottom span {
  width: 28px;
  height: 1px;
}

.footer-bottom small {

  font-size: 7px;

  letter-spacing: 0.08em;
}

/* =========================================================
   ANIMATION
   ========================================================= */

@keyframes footerFlowerFloat {
  0%,
  100% {
    margin-top: 0;
  }

  50% {
    margin-top: -8px;
  }
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 620px) {
  .footer {
    min-height: 440px;

    padding: 62px 17px 35px;
  }

  .footer-flower {
    width: 230px;

    opacity: 0.14;
  }

  .footer-flower--left {
    left: -135px;
    bottom: -80px;
  }

  .footer-flower--right {
    right: -135px;
    top: -80px;
  }

  .monogram {
    width: 70px;
    height: 70px;

    margin-top: 22px;
  }

  .couple-name {
    gap: 7px;

    font-size: 27px;
  }

  .couple-name i {
    font-size: 25px;
  }

  .footer-message {
    padding: 0 10px;

    font-size: 14px;
  }

  .footer-bottom {
    gap: 7px;
  }

  .footer-bottom span {
    width: 18px;
  }

  .footer-bottom small {
    font-size: 6px;
  }
}

/* =========================================================
   SMALL PHONE
   ========================================================= */

@media (max-width: 380px) {
  .footer {
    padding-left: 13px;
    padding-right: 13px;
  }

  .couple-name {
    font-size: 24px;
  }

  .footer-eyebrow {
    font-size: 9px;
  }

  .footer-message {
    font-size: 13px;
  }
}

/* =========================================================
   REDUCE MOTION
   ========================================================= */

@media (prefers-reduced-motion: reduce) {
  .footer-flower {
    animation: none;
  }
}
</style>
