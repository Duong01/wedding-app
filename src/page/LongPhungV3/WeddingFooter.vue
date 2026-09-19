<template>
  <footer class="lp-footer">
    <!-- Rồng phượng trang trí góc -->
    <img :src="phung" alt="" aria-hidden="true" class="lp-footer__decor lp-footer__decor--phung" draggable="false" />
    <img :src="rong" alt="" aria-hidden="true" class="lp-footer__decor lp-footer__decor--rong" draggable="false" />

    <div class="lp-footer__inner">
      <img :src="chuHy" alt="囍" class="lp-footer__chuhy" draggable="false" />

      <p class="lp-footer__thanks">
        {{ thanksMessage }}
      </p>

      <div class="lp-footer__line">
        <span></span>

        <i>❦</i>

        <span></span>
      </div>

      <h2 class="lp-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div v-if="weddingDate" class="lp-footer__date">{{ weddingDate }}</div>

      <small class="lp-footer__copyright">© {{ currentYear }} · {{ copyrightText }}</small>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import chuHy from "@/assets/decor/longphung-v3/chu-hy.webp";
import phung from "@/assets/decor/longphung-v3/phung.webp";
import rong from "@/assets/decor/longphung-v3/rong.webp";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  monogram: { type: String, default: "G&B" },
  currentYear: { type: Number, default: 2026 },
});

const wedding = computed(() => props.wedding || {});

const groomName = computed(() => {
  return (
    wedding.value?.footer?.GroomName ||
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.hero?.GroomName ||
    wedding.value?.couple?.Groom?.Name ||
    ""
  );
});

const brideName = computed(() => {
  return (
    wedding.value?.footer?.BrideName ||
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    ""
  );
});

const thanksMessage = computed(() => {
  return (
    wedding.value?.footer?.Message ||
    wedding.value?.thankYouNote ||
    "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!"
  );
});

const copyrightText = computed(() => {
  return wedding.value?.footer?.Copyright || "Made with love";
});

const weddingDate = computed(() => {
  return wedding.value?.weddingDate || wedding.value?.hero?.WeddingDate || wedding.value?.hero?.weddingDate || "";
});
</script>

<style scoped>
.lp-footer {
  position: relative;

  width: 100%;
  min-height: 380px;

  overflow: hidden;

  box-sizing: border-box;

  color: #ffbe89;

  text-align: center;

  background: linear-gradient(180deg, rgba(90, 0, 14, 0.6) 0%, rgba(69, 0, 1, 0.9) 100%);
}

/* =====================================================
   RỒNG PHƯỢNG GÓC
===================================================== */

.lp-footer__decor {
  position: absolute;
  z-index: 1;

  width: 200px;

  height: auto;

  opacity: 0.25;

  pointer-events: none;
}

.lp-footer__decor--phung {
  top: -30px;
  left: -40px;

  transform: rotate(20deg);
}

.lp-footer__decor--rong {
  bottom: -40px;
  right: -40px;

  transform: rotate(-20deg);
}

@media (min-width: 768px) {
  .lp-footer__decor {
    width: 280px;
  }
}

/* =====================================================
   INNER
===================================================== */

.lp-footer__inner {
  position: relative;

  z-index: 3;

  display: flex;

  flex-direction: column;

  align-items: center;

  box-sizing: border-box;

  min-height: 380px;

  padding: 50px 24px 28px;
}

/* =====================================================
   CHỮ HY
===================================================== */

.lp-footer__chuhy {
  width: 64px;
  height: 64px;

  object-fit: contain;

  margin-bottom: 16px;

  opacity: 0.9;
}

/* =====================================================
   THANK YOU
===================================================== */

.lp-footer__thanks {
  max-width: 320px;

  margin: 0 auto;

  font-size: 12px;

  line-height: 1.85;

  letter-spacing: 0.08em;

  white-space: pre-line;

  color: rgba(255, 190, 137, 0.85);
}

/* =====================================================
   LINE
===================================================== */

.lp-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 16px 0 14px;
}

.lp-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(255, 190, 137, 0.7));
}

.lp-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(255, 190, 137, 0.7));
}

.lp-footer__line i {
  color: rgba(255, 190, 137, 0.7);

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   NAMES
===================================================== */

.lp-footer__names {
  margin: 0;

  font-family: "EB Garamond", "Baskerville", "Times New Roman", serif;

  font-size: clamp(28px, 7.5vw, 38px);

  font-weight: 500;

  line-height: 1.25;

  color: #ffbe89;
}

.lp-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: rgba(255, 190, 137, 0.7);

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   DATE
===================================================== */

.lp-footer__date {
  margin-top: 16px;

  padding: 8px 18px;

  color: #ffbe89;

  font-family: "Times New Roman", Times, serif;

  font-size: 12px;
  font-weight: 700;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(255, 190, 137, 0.4);

  border-bottom: 1px solid rgba(255, 190, 137, 0.4);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.lp-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: rgba(255, 190, 137, 0.5);

  font-size: 11px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .lp-footer {
    min-height: 350px;
  }

  .lp-footer__inner {
    min-height: 350px;

    padding: 44px 20px 24px;
  }

  .lp-footer__chuhy {
    width: 54px;
    height: 54px;
  }

  .lp-footer__thanks {
    max-width: 270px;

    font-size: 11px;
  }

  .lp-footer__date {
    margin-top: 14px;

    font-size: 11px;
  }

  .lp-footer__copyright {
    font-size: 10px;
  }
}
</style>
