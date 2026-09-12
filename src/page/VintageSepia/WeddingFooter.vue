<template>
  <footer class="vs-footer">
    <div class="vs-footer__stain vs-footer__stain--left"></div>
    <div class="vs-footer__stain vs-footer__stain--right"></div>

    <div class="vs-footer__speck vs-footer__speck--1">❦</div>
    <div class="vs-footer__speck vs-footer__speck--2">✦</div>
    <div class="vs-footer__speck vs-footer__speck--3">❦</div>

    <div class="vs-footer__inner">
      <div class="vs-footer__ring">
        <span class="vs-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p class="vs-footer__monogram-label">SAVE THE DATE</p>

      <h2 class="vs-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="vs-footer__line">
        <span></span>

        <i>❦</i>

        <span></span>
      </div>

      <p class="vs-footer__thanks">
        {{ thanksMessage }}
      </p>

      <div class="vs-footer__date">{{ weddingDate }}</div>

      <small class="vs-footer__copyright">© {{ currentYear }} · {{ copyrightText }}</small>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

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
    "Chú Rể"
  );
});

const brideName = computed(() => {
  return (
    wedding.value?.footer?.BrideName ||
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    "Cô Dâu"
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
  return wedding.value?.weddingDate || wedding.value?.hero?.weddingDate || "";
});
</script>

<style scoped>
.vs-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: #6b4f3a;

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, #f6efe2 0%, #efe4cb 55%, #e5d5b4 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.vs-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(107, 79, 58, 0.4);

  border-radius: 10px;

  pointer-events: none;
}

.vs-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px dashed rgba(107, 79, 58, 0.22);

  border-radius: 6px;

  pointer-events: none;
}

/* =====================================================
   PAPER STAINS
===================================================== */

.vs-footer__stain {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.vs-footer__stain--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(194, 168, 120, 0.4), transparent 70%);
}

.vs-footer__stain--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(151, 116, 90, 0.22), transparent 70%);
}

/* =====================================================
   SPECKS
===================================================== */

.vs-footer__speck {
  position: absolute;

  z-index: 1;

  color: rgba(151, 116, 90, 0.3);

  pointer-events: none;

  animation: vs-footer-sway 6s ease-in-out infinite;
}

.vs-footer__speck--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.vs-footer__speck--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.vs-footer__speck--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(194, 168, 120, 0.45);

  animation-delay: 2.6s;
}

@keyframes vs-footer-sway {
  0%,
  100% {
    transform: translateY(0) rotate(-8deg);
  }

  50% {
    transform: translateY(-9px) rotate(10deg);
  }
}

/* =====================================================
   INNER
===================================================== */

.vs-footer__inner {
  position: relative;

  z-index: 3;

  display: flex;

  flex-direction: column;

  align-items: center;

  box-sizing: border-box;

  min-height: 400px;

  padding: 50px 24px 28px;
}

/* =====================================================
   MONOGRAM RING (wax seal)
===================================================== */

.vs-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(107, 79, 58, 0.55);

  border-radius: 46% 54% 50% 50% / 53% 47% 55% 45%;

  background: radial-gradient(circle at 34% 28%, #8a6a4f, #6b4f3a 55%, #4a3a2c 100%);

  box-shadow:
    0 8px 24px rgba(61, 47, 36, 0.25),
    inset 0 2px 4px rgba(234, 217, 189, 0.25),
    inset 0 -3px 6px rgba(30, 22, 16, 0.35);
}

.vs-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(234, 217, 189, 0.4);

  border-radius: 46% 54% 50% 50% / 53% 47% 55% 45%;
}

.vs-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: #ead9bd;

  line-height: 1;

  text-shadow: 0 1px 2px rgba(30, 22, 16, 0.5);
}

/* =====================================================
   LABEL
===================================================== */

.vs-footer__monogram-label {
  margin: 16px 0 0;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.32em;
  text-indent: 0.32em;
}

/* =====================================================
   NAMES
===================================================== */

.vs-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: #4a3a2c;
}

.vs-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: #c2a878;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.vs-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.vs-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(107, 79, 58, 0.7));
}

.vs-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(107, 79, 58, 0.7));
}

.vs-footer__line i {
  color: #97745a;

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.vs-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: #97745a;

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;

  white-space: pre-line;
}

/* =====================================================
   DATE
===================================================== */

.vs-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: #6b4f3a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 0.22em;

  border: 1.5px solid rgba(107, 79, 58, 0.45);

  border-radius: 8px;

  background: rgba(255, 253, 246, 0.55);

  transform: rotate(-1deg);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.vs-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: #a89478;

  font-size: 9px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .vs-footer {
    min-height: 370px;
  }

  .vs-footer::before {
    inset: 10px;
  }

  .vs-footer::after {
    inset: 15px;
  }

  .vs-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .vs-footer__ring {
    width: 74px;
    height: 74px;
  }

  .vs-footer__ring-inner {
    font-size: 26px;
  }

  .vs-footer__monogram-label {
    margin-top: 13px;

    font-size: 8px;
  }

  .vs-footer__names {
    margin-top: 8px;
  }

  .vs-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .vs-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .vs-footer__copyright {
    font-size: 8px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .vs-footer__speck {
    animation: none;
  }
}
</style>
