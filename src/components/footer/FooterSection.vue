<template>
  <footer class="footer">

    <!-- Background -->
    <div class="footer-pattern"></div>
    <div class="footer-overlay"></div>

    <!-- Nội dung -->
    <v-container class="footer-container">

      <!-- Message -->
      <p
        v-if="wedding.message"
        class="footer-message"
      >
        {{ wedding.message }}
      </p>

      <!-- Couple -->
      <div class="couple-wrapper">

        <div class="couple-name">
          {{ wedding.groomName }}
        </div>

        <div class="couple-symbol">
          &
        </div>

        <div class="couple-name">
          {{ wedding.brideName }}
        </div>

      </div>

      <!-- Line -->
      <div class="footer-line"></div>

      <!-- Copyright -->
      <div class="copyright">
        © {{ currentYear }}
        {{ wedding.copyright }}
      </div>

      <div class="website">
        ngaychungdoi.com
      </div>

    </v-container>

  </footer>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  footer: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const wedding = computed(() => props.footer ?? {});

const currentYear = new Date().getFullYear();
</script>

<style scoped>

/* =========================================================
   DESIGN SYSTEM
   ========================================================= */

.footer {
  --primary: #7b0d0d;
  --primary-light: #9d2525;

  --gold: #c79d5c;
  --gold-light: #f7d8a3;

  --paper: #f8f5ed;

  --text: #5c4d46;
  --sub-text: #806f66;

  --white: #fffaf4;

  position: relative;

  width: 100%;

  min-height: 420px;

  display: flex;

  align-items: center;
  justify-content: center;

  overflow: hidden;

  background:
    linear-gradient(
      180deg,
      #7b0d0d 0%,
      #861313 50%,
      #720909 100%
    );

  color: var(--white);

  text-align: center;
}


/* =========================================================
   BACKGROUND PATTERN
   ========================================================= */

.footer-pattern {
  position: absolute;

  inset: 0;

  background-image:
    radial-gradient(
      circle at center,
      rgba(247, 216, 163, 0.12) 0,
      transparent 45%
    );

  pointer-events: none;
}


/* =========================================================
   OVERLAY
   ========================================================= */

.footer-overlay {
  position: absolute;

  inset: 0;

  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(247, 216, 163, 0.16),
      transparent 55%
    ),
    linear-gradient(
      180deg,
      transparent,
      rgba(60, 0, 0, 0.18)
    );

  pointer-events: none;
}


/* =========================================================
   CONTAINER
   ========================================================= */

.footer-container {
  position: relative;

  z-index: 2;

  width: 100%;

  max-width: 760px;

  margin: 0 auto;

  padding: 80px 24px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;
}


/* =========================================================
   MESSAGE
   ========================================================= */

.footer-message {
  width: 100%;

  max-width: 600px;

  margin: 0 auto 42px;

  padding: 0;

  font-family: var(--font-main);

  font-size: 14px;

  font-weight: 400;

  line-height: 1.9;

  letter-spacing: 0.3px;

  color: rgba(255, 250, 244, 0.88);

  text-align: center;
}


/* =========================================================
   COUPLE
   ========================================================= */

.couple-wrapper {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 24px;

  width: 100%;
}


/* Tên */

.couple-name {
  font-family: var(--font-wedding);

  font-size: clamp(
    38px,
    7vw,
    58px
  );

  font-weight: 500;

  font-style: italic;

  line-height: 1;

  color: var(--gold-light);

  white-space: nowrap;
}


/* & */

.couple-symbol {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  flex-shrink: 0;

  font-family: var(--font-wedding);

  font-size: 30px;

  font-style: italic;

  color: var(--gold);

  border: 1px solid rgba(
    247,
    216,
    163,
    0.35
  );

  border-radius: 50%;
}


/* =========================================================
   LINE
   ========================================================= */

.footer-line {
  width: 100%;

  max-width: 120px;

  height: 1px;

  margin: 38px auto 28px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(247, 216, 163, 0.75),
      transparent
    );
}


/* =========================================================
   COPYRIGHT
   ========================================================= */

.copyright {
  font-family: var(--font-main);

  font-size: 11px;

  font-weight: 400;

  line-height: 1.8;

  letter-spacing: 1px;

  color: rgba(
    255,
    250,
    244,
    0.65
  );

  text-align: center;
}


/* =========================================================
   WEBSITE
   ========================================================= */

.website {
  margin-top: 8px;

  font-family: var(--font-main);

  font-size: 9px;

  font-weight: 500;

  letter-spacing: 3px;

  text-transform: uppercase;

  color: rgba(
    247,
    216,
    163,
    0.75
  );

  text-align: center;
}


/* =========================================================
   TABLET
   ========================================================= */

@media (max-width: 768px) {

  .footer {
    min-height: 380px;
  }

  .footer-container {
    padding: 65px 20px;
  }

  .footer-message {
    max-width: 500px;

    margin-bottom: 35px;

    font-size: 13px;

    line-height: 1.8;
  }

  .couple-wrapper {
    gap: 15px;
  }

  .couple-name {
    font-size: clamp(
      34px,
      10vw,
      48px
    );
  }

  .couple-symbol {
    width: 36px;
    height: 36px;

    font-size: 25px;
  }

}


/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 600px) {

  .footer {
    min-height: 360px;
  }

  .footer-container {
    padding: 60px 18px;
  }

  .footer-message {
    margin-bottom: 32px;

    font-size: 12px;

    line-height: 1.8;

    max-width: 330px;
  }

  .couple-wrapper {
    gap: 9px;
  }

  .couple-name {
    font-size: clamp(
      30px,
      10vw,
      42px
    );
  }

  .couple-symbol {
    width: 32px;
    height: 32px;

    font-size: 22px;
  }

  .footer-line {
    margin-top: 32px;
    margin-bottom: 24px;
  }

  .copyright {
    font-size: 10px;
  }

  .website {
    font-size: 8px;

    letter-spacing: 2px;
  }

}


/* =========================================================
   SMALL MOBILE
   ========================================================= */

@media (max-width: 380px) {

  .footer-container {
    padding: 50px 14px;
  }

  .footer-message {
    font-size: 11px;

    max-width: 290px;
  }

  .couple-wrapper {
    gap: 6px;
  }

  .couple-name {
    font-size: 28px;
  }

  .couple-symbol {
    width: 29px;
    height: 29px;

    font-size: 20px;
  }

}

</style>