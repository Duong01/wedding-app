<template>
  <footer class="tdx-footer">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-footer__decor" aria-hidden="true">
      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-right"
        draggable="false"
      />

      <img
        :src="flowerDecoration"
        alt=""
        class="tdx-decor tdx-decor--flower-right"
        draggable="false"
      />

      <img
        :src="ribbonDecoration"
        alt=""
        class="tdx-decor tdx-decor--ribbon"
        draggable="false"
      />
    </div>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="tdx-footer__inner">
      <div class="tdx-footer__ring">
        <span class="tdx-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p class="tdx-footer__label">SAVE THE DATE</p>

      <h2 class="tdx-footer__names">
        {{ groomName }}

        <span>&amp;</span>

        {{ brideName }}
      </h2>

      <div class="tdx-footer__line" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span class="tdx-footer__line-flip"></span>
      </div>

      <p class="tdx-footer__thanks">{{ thanksMessage }}</p>

      <p v-if="weddingDate" class="tdx-footer__date">{{ weddingDate }}</p>

      <small class="tdx-footer__copyright">© {{ currentYear }} · {{ copyrightText }}</small>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

import {
  flowerDecoration,
  lineDecoration,
  ribbonDecoration,
} from "./toDuyenXanhAssets";

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
    "CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI\nCÙNG CHÚNG MÌNH"
  );
});

const copyrightText = computed(() => {
  return wedding.value?.footer?.Copyright || "Made with love";
});

const weddingDate = computed(() => {
  return (
    wedding.value?.weddingDate ||
    wedding.value?.hero?.WeddingDate ||
    wedding.value?.hero?.weddingDate ||
    ""
  );
});
</script>

<style scoped>
.tdx-footer {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);
  --tdx-cream: var(--accent-light, #f3dfc5);

  position: relative;
  isolation: isolate;

  width: 100%;
  min-height: 380px;

  box-sizing: border-box;

  overflow: hidden;

  text-align: center;

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   KHUNG VIỀN
========================================================= */

.tdx-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid var(--tdx-line);

  pointer-events: none;
}

.tdx-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(209, 219, 156, 0.5);

  pointer-events: none;
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-footer__decor {
  position: absolute;
  inset: 0;
  z-index: -1;

  pointer-events: none;
}

.tdx-decor {
  position: absolute;

  max-width: none;

  object-fit: cover;

  pointer-events: none;
}

.tdx-decor--line-right {
  top: 40px;
  right: -70px;

  width: 198px;
  height: 420px;

  transform: rotate(-177.25deg);
}

.tdx-decor--flower-right {
  top: 10px;
  right: -80px;

  width: 190px;
  height: 190px;

  object-fit: contain;

  transform: scaleX(-1) rotate(50deg);
}

.tdx-decor--ribbon {
  bottom: -10px;
  left: -365px;

  width: 700px;
  height: 155px;

  object-fit: contain;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tdx-footer__inner {
  position: relative;
  z-index: 3;

  min-height: 380px;

  box-sizing: border-box;

  padding: 50px 24px 28px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

/* =========================================================
   MONOGRAM
========================================================= */

.tdx-footer__ring {
  position: relative;

  width: 84px;
  height: 84px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--tdx-line);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.8);
}

.tdx-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(94, 129, 60, 0.4);
  border-radius: 50%;
}

.tdx-footer__ring-inner {
  color: var(--tdx-green);

  font-family: Carattere, cursive;
  font-size: 32px;

  line-height: 1;
}

.tdx-footer__label {
  margin: 16px 0 0;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =========================================================
   TÊN
========================================================= */

.tdx-footer__names {
  margin: 10px 0 0;

  color: var(--tdx-green);

  font-family: Carattere, cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  line-height: 1.25;
}

.tdx-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: var(--tdx-ink);

  font-family: "Aguafina Script", cursive;
  font-size: 0.62em;
}

/* =========================================================
   ĐƯỜNG KẺ
========================================================= */

.tdx-footer__line {
  width: 100%;

  margin: 15px 0 14px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.tdx-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, var(--tdx-line));
}

.tdx-footer__line-flip {
  background: linear-gradient(to left, transparent, var(--tdx-line)) !important;
}

.tdx-footer__line i {
  color: var(--tdx-green);

  font-size: 12px;
  font-style: normal;
}

/* =========================================================
   LỜI CẢM ƠN
========================================================= */

.tdx-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;

  white-space: pre-line;
}

.tdx-footer__date {
  margin: 18px 0 0;

  padding: 8px 18px;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid var(--tdx-line);
  border-bottom: 1px solid var(--tdx-line);
}

.tdx-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: rgba(26, 53, 0, 0.55);

  font-family: "Times New Roman", serif;
  font-size: 11px;

  letter-spacing: 0.12em;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-footer,
  .tdx-footer__inner {
    min-height: 440px;
  }

  .tdx-decor--line-right {
    top: 60px;
    left: -150px;
    right: auto;

    width: 158px;
    height: 560px;
  }

  .tdx-decor--flower-right {
    top: 0;
    left: -300px;
    right: auto;

    width: 420px;
    height: 420px;
  }

  .tdx-decor--ribbon {
    bottom: 20px;
    left: -538px;

    width: 1403px;
    height: 246px;
  }

  .tdx-footer__ring {
    width: 100px;
    height: 100px;
  }

  .tdx-footer__ring-inner {
    font-size: 40px;
  }

  .tdx-footer__label {
    font-size: 13px;
  }

  .tdx-footer__thanks {
    max-width: 420px;

    font-size: 14px;
  }

  .tdx-footer__date {
    font-size: 15px;
  }

  .tdx-footer__copyright {
    font-size: 13px;
  }
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 420px) {
  .tdx-footer,
  .tdx-footer__inner {
    min-height: 350px;
  }

  .tdx-footer::before {
    inset: 10px;
  }

  .tdx-footer::after {
    inset: 15px;
  }

  .tdx-footer__inner {
    padding: 44px 20px 24px;
  }

  .tdx-footer__ring {
    width: 74px;
    height: 74px;
  }

  .tdx-footer__ring-inner {
    font-size: 28px;
  }

  .tdx-footer__label {
    margin-top: 13px;

    font-size: 10px;
  }

  .tdx-footer__names {
    margin-top: 8px;
  }

  .tdx-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .tdx-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .tdx-footer__copyright {
    font-size: 10px;
  }
}
</style>
