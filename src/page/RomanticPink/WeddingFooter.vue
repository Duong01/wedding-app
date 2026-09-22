<template>
  <footer class="footer">
    <!-- Hoa trang trí -->
    <img
      :src="flower"
      class="footer-flower footer-flower--left"
      alt=""
      loading="lazy"
      decoding="async"
    />

    <img
      :src="flower"
      class="footer-flower footer-flower--right"
      alt=""
      loading="lazy"
      decoding="async"
    />

    <div class="footer-content">
      <div class="footer-eyebrow">THANK YOU</div>

      <p class="footer-subtitle">CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI</p>

      <!-- Monogram -->
      <div class="monogram">
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
        <span class="date-line"></span>

        <b>{{ formattedDate }}</b>

        <span class="date-line"></span>
      </div>

      <!-- Message -->
      <p class="footer-message">
        {{ footerMessage }}
      </p>

      <!-- Quote -->
      <p class="footer-quote">
        Một ngày thật đẹp<br />
        một tình yêu thật đẹp
      </p>

      <!-- Copyright -->
      <small class="footer-bottom">
        © {{ currentYear }} · Cảm ơn bạn đã chung vui cùng chúng mình
      </small>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";
import flower from "@/assets/glass-garden-pink/flower2-decoration.webp";

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
    ""
  );
});

const bride = computed(() => {
  return (
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.footer?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    ""
  );
});

/* =========================================================
   DATE
========================================================= */

const date = computed(() => {
  return (
    props.wedding?.weddingDate ||
    props.wedding?.hero?.WeddingDate ||
    props.wedding?.hero?.weddingDate ||
    ""
  );
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
.footer {
  position: relative;

  overflow: hidden;

  padding: 60px 22px 40px;

  text-align: center;
}

/* =========================================================
   HOA
========================================================= */

.footer-flower {
  position: absolute;
  z-index: 0;

  width: 200px;

  object-fit: contain;

  pointer-events: none;
}

.footer-flower--left {
  top: -30px;
  left: -80px;

  opacity: 0.4;
  transform: rotate(-16deg);
}

.footer-flower--right {
  right: -80px;
  bottom: -40px;

  opacity: 0.35;
  transform: scaleX(-1) rotate(-16deg);
}

/* =========================================================
   NỘI DUNG
========================================================= */

.footer-content {
  position: relative;
  z-index: 1;
}

.footer-eyebrow {
  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.3em;

  opacity: 0.7;
}

.footer-subtitle {
  margin: 6px 0 0;

  color: var(--gg-rose, #cb5d6c);
  font-family: "Times New Roman", Times, serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

/* =========================================================
   MONOGRAM
========================================================= */

.monogram {
  width: 74px;
  height: 74px;

  margin: 22px auto 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.4);

  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(7px) saturate(1.08);
  -webkit-backdrop-filter: blur(7px) saturate(1.08);

  box-shadow: inset 1.5px 1.5px 2px rgba(255, 255, 255, 0.5),
    0 14px 34px -8px rgba(147, 56, 69, 0.3);
}

.monogram span {
  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.06em;
}

/* =========================================================
   TÊN
========================================================= */

.couple-name {
  margin: 20px 0 0;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  color: var(--gg-rose, #cb5d6c);
  font-family: "EB Garamond", serif;
  font-size: 24px;
  font-weight: 500;
}

.couple-name i {
  color: var(--gg-rose, #cb5d6c);
  font-family: "Ms Madi", cursive;
  font-size: 24px;
  font-style: normal;
}

/* =========================================================
   NGÀY
========================================================= */

.wedding-date {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  margin-top: 14px;
}

.wedding-date b {
  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.16em;
}

.date-line {
  width: 1px;
  height: 20px;

  background-color: var(--gg-deep, #933845);
  opacity: 0.5;
}

/* =========================================================
   LỜI NHẮN
========================================================= */

.footer-message {
  max-width: 320px;
  margin: 20px auto 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;
  font-style: italic;
  line-height: 1.7;

  opacity: 0.85;
}

.footer-quote {
  margin: 22px 0 0;

  color: var(--gg-rose, #cb5d6c);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;
  line-height: 1.7;

  opacity: 0.8;
}

/* =========================================================
   BẢN QUYỀN
========================================================= */

.footer-bottom {
  display: block;
  margin-top: 26px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 10px;
  letter-spacing: 0.06em;

  opacity: 0.55;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .footer {
    padding: 70px 40px 48px;
  }

  .couple-name {
    font-size: 30px;
  }

  .couple-name i {
    font-size: 30px;
  }

  .footer-flower {
    width: 260px;
  }

  .footer-flower--left {
    left: -50px;
  }

  .footer-flower--right {
    right: -50px;
  }
}
</style>
