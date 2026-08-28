<template>
    
    <div class="footer-content">

      <!-- Message -->
      <p
        v-if="wedding.Message"
        class="footer-message"
      >
        {{ wedding.Message }}
      </p>

      <!-- Small label -->
      <div class="footer-label">
        <span class="label-line"></span>

        <span>
          Hạnh phúc trăm năm
        </span>

        <span class="label-line"></span>
      </div>

      <!-- =================================================
           COUPLE
      ================================================== -->

      <div
        v-if="wedding.GroomName || wedding.BrideName"
        class="couple-wrapper"
      >
        <!-- Groom -->
        <div
          v-if="wedding.GroomName"
          class="couple-name"
        >
          {{ wedding.GroomName }}
        </div>

        <!-- Symbol -->
        <div
          v-if="wedding.GroomName && wedding.BrideName"
          class="couple-symbol"
          aria-hidden="true"
        >
          <span>&</span>
        </div>

        <!-- Bride -->
        <div
          v-if="wedding.BrideName"
          class="couple-name"
        >
          {{ wedding.BrideName }}
        </div>
      </div>
      <!-- =================================================
           COPYRIGHT
      ================================================== -->

      <div
        v-if="wedding.Copyright"
        class="copyright"
      >
        <p>{{ wedding.Copyright }}</p>
        © {{ currentYear }}
      </div>

    </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  footer: {
    type: Object,
    default: () => ({}),
  },
});

const wedding = computed(() => props.footer ?? {});

const currentYear = new Date().getFullYear();
</script>

<style scoped>
/* =========================================================
   FOOTER
========================================================= */

.footer {
  --footer-red: var(--p-primary, #7b0d0d);
  --footer-red-dark: var(--p-primary-dark, #65090c);

  --footer-gold: var(--p-gold, #c79d5c);
  --footer-gold-light: var(--p-gold-light, #f7d8a3);

  --footer-white: var(--white, #fffaf4);

  position: relative;

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;


  overflow: hidden;

  color: var(--footer-white);

  text-align: center;

  isolation: isolate;
}



/* =========================================================
   LIGHT GLOW
========================================================= */

.footer-content::before {
  content: "";

  position: absolute;

  inset: 0;

  z-index: -2;

  pointer-events: none;

  background:
    radial-gradient(
      ellipse at center top,
      rgba(199, 157, 92, 0.18),
      transparent 48%
    ),
    radial-gradient(
      ellipse at center bottom,
      rgba(199, 157, 92, 0.12),
      transparent 45%
    );

  opacity: 1;
}


/* =========================================================
   CONTENT
========================================================= */

.footer-content {

  --footer-red: var(--p-primary, #7b0d0d);
  --footer-red-dark: var(--p-primary-dark, #65090c);

  --footer-gold: var(--p-gold, #c79d5c);
  --footer-gold-light: var(--p-gold-light, #f7d8a3);

  --footer-white: var(--white, #fffaf4);

  position: relative;

  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;


  overflow: hidden;

  color: var(--footer-white);

  text-align: center;

  isolation: isolate;

  padding-top: 50px;

  position: relative;

  width: 100%;
  max-width: 760px;

  display: flex;
  flex-direction: column;
  align-items: center;

  margin: 0 auto;

  z-index: 2;
}

.ornament-diamond {
  font-size: 9px;

  color: var(--footer-gold-light);

  text-shadow:
    0 0 12px rgba(247, 216, 163, 0.45);
}

.ornament-flower {
  font-family: serif;

  font-size: 22px;

  color: var(--footer-gold-light);

  transform: rotate(180deg);
}


/* =========================================================
   MESSAGE
========================================================= */

.footer-message {
  width: 100%;
  max-width: 620px;

  margin: 0 auto 24px;

  font-family: var(--font-main, "Cormorant Garamond", serif);

  font-size: 17px;

  font-weight: 400;

  line-height: 1.9;

  letter-spacing: 0.35px;

  color: rgba(255, 250, 244, 0.88);

  text-align: center;
}


/* =========================================================
   LABEL
========================================================= */

.footer-label {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 12px;

  margin-bottom: 24px;

  font-family: var(--font-main, "Cormorant Garamond", serif);

  font-size: 11px;

  font-weight: 600;

  letter-spacing: 4px;

  text-transform: uppercase;

  color: rgba(247, 216, 163, 0.82);
}

.label-line {
  width: 26px;

  height: 1px;

  background: rgba(247, 216, 163, 0.45);
}


/* =========================================================
   COUPLE
========================================================= */

.couple-wrapper {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;

  gap: 26px;

  margin-top: 4px;
}

.couple-name {

  font-family: var(
    --font-wedding,
    "Allura",
    cursive
  );

  font-size: clamp(30px, 6vw, 50px);

  font-weight: 400;

  font-style: normal;

  line-height: 1.1;

  color: var(--footer-gold-light);

  white-space: nowrap;

  text-shadow:
    0 2px 12px rgba(0, 0, 0, 0.18);
}


/* =========================================================
   &
========================================================= */

.couple-symbol {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 46px;
  height: 46px;

  flex: 0 0 46px;
}

.couple-symbol::before,
.couple-symbol::after {
  content: "";

  position: absolute;

  width: 100%;
  height: 100%;

  border: 1px solid rgba(
    247,
    216,
    163,
    0.38
  );

  transform: rotate(45deg);

  border-radius: 5px;
}

.couple-symbol::after {
  width: 36px;
  height: 36px;

  border-color: rgba(
    247,
    216,
    163,
    0.18
  );
}

.couple-symbol span {
  position: relative;

  z-index: 2;

  font-family: var(
    --font-wedding,
    "Allura",
    cursive
  );

  font-size: 28px;

  font-style: italic;

  color: var(--footer-gold-light);
}


/* =========================================================
   COPYRIGHT
========================================================= */

.copyright {
  font-family: var(--font-main, "Cormorant Garamond", serif);

  font-size: 13px;

  font-weight: 400;

  line-height: 1.8;

  letter-spacing: 1.5px;

  color: rgba(
    255,
    250,
    244,
    0.62
  );

  text-transform: uppercase;
}

.copyright span {
  color: rgba(
    247,
    216,
    163,
    0.82
  );
}


/* =========================================================
   TABLET
========================================================= */

@media (max-width: 768px) {
  .footer {
    min-height: 450px;

    padding:
      75px 24px
      60px;
  }

  .footer-message {
    max-width: 500px;

    font-size: 16px;
  }

  .couple-wrapper {
    gap: 18px;
  }

  .couple-name {
    font-size: clamp(
      25px,
      8vw,
      45px
    );
  }

  .couple-symbol {
    width: 40px;
    height: 40px;

    flex-basis: 40px;
  }

  .couple-symbol::after {
    width: 31px;
    height: 31px;
  }

  .couple-symbol span {
    font-size: 24px;
  }
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .footer {
    min-height: 430px;

    padding:
      68px 18px
      55px;
  }


  .footer-message {
    max-width: 330px;

    margin-bottom: 20px;

    font-size: 15px;

    line-height: 1.8;
  }

  .footer-label {
    gap: 8px;

    margin-bottom: 20px;

    font-size: 9px;

    letter-spacing: 3px;
  }

  .label-line {
    width: 18px;
  }

  .couple-wrapper {
    gap: 9px;
  }

  .couple-name {
    font-size: clamp(
      20px,
      10vw,
      35px
    );
  }

  .couple-symbol {
    width: 34px;
    height: 34px;

    flex-basis: 34px;
  }

  .couple-symbol::after {
    width: 26px;
    height: 26px;
  }

  .couple-symbol span {
    font-size: 20px;
  }

  .copyright {
    font-size: 11px;

    letter-spacing: 1px;
  }

}


/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 380px) {
  .footer {
    padding-left: 12px;
    padding-right: 12px;
  }

  .couple-wrapper {
    gap: 5px;
  }

  .couple-name {
    font-size: 26px;
  }

  .couple-symbol {
    width: 30px;
    height: 30px;

    flex-basis: 30px;
  }

  .couple-symbol::after {
    width: 23px;
    height: 23px;
  }

  .couple-symbol span {
    font-size: 18px;
  }

  .footer-message {
    max-width: 290px;
  }
}

</style>
