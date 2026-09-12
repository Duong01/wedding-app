<template>
  <footer class="dh-footer">
    <div class="dh-footer__glow dh-footer__glow--left"></div>
    <div class="dh-footer__glow dh-footer__glow--right"></div>

    <div class="dh-footer__seal dh-footer__seal--1">囍</div>
    <div class="dh-footer__seal dh-footer__seal--2">❖</div>
    <div class="dh-footer__seal dh-footer__seal--3">囍</div>

    <div class="dh-footer__inner">
      <div class="dh-footer__ring">
        <span class="dh-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p class="dh-footer__monogram-label">SAVE THE DATE</p>

      <h2 class="dh-footer__names">
        {{ groomName }}

        <span>&amp;</span>

        {{ brideName }}
      </h2>

      <div class="dh-footer__line">
        <span></span>

        <i>囍</i>

        <span></span>
      </div>

      <p class="dh-footer__thanks">
        {{ thanksMessage }}
      </p>

      <div class="dh-footer__date">{{ weddingDate }}</div>

      <small class="dh-footer__copyright">© {{ currentYear }} · {{ copyrightText }}</small>
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
.dh-footer {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-red-dark: #5c0e10;
  --dh-gold: #d9a441;
  --dh-gold-light: #f3d9a4;
  --dh-cream: #fdf6ec;
  --dh-cream-on-red: #f7e6c4;

  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: var(--dh-cream-on-red);

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, #8f1a1e 0%, var(--dh-red) 55%, var(--dh-red-dark) 100%);
}

/* Subtle repeating pattern */
.dh-footer::before {
  content: "";

  position: absolute;

  inset: 0;

  opacity: 0.5;

  background-image:
    repeating-linear-gradient(45deg, rgba(243, 217, 164, 0.05) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(243, 217, 164, 0.05) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

/* Gold double-line frame */
.dh-footer::after {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(217, 164, 65, 0.45);

  border-radius: 12px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.dh-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.dh-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(217, 164, 65, 0.28), transparent 70%);
}

.dh-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(243, 217, 164, 0.18), transparent 70%);
}

/* =====================================================
   FLOATING SEALS
===================================================== */

.dh-footer__seal {
  position: absolute;

  z-index: 1;

  color: rgba(217, 164, 65, 0.3);

  pointer-events: none;

  animation: dh-footer-sway 6s ease-in-out infinite;
}

.dh-footer__seal--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.dh-footer__seal--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.dh-footer__seal--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(243, 217, 164, 0.4);

  animation-delay: 2.6s;
}

@keyframes dh-footer-sway {
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

.dh-footer__inner {
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
   MONOGRAM RING
===================================================== */

.dh-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(217, 164, 65, 0.65);

  border-radius: 50%;

  background: rgba(92, 14, 16, 0.45);

  box-shadow: 0 8px 24px rgba(30, 4, 6, 0.3);
}

.dh-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(243, 217, 164, 0.5);

  border-radius: 50%;
}

.dh-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--dh-gold-light);

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.dh-footer__monogram-label {
  margin: 16px 0 0;

  color: var(--dh-gold);

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.dh-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: var(--dh-cream-on-red);
}

.dh-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: var(--dh-gold);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.dh-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.dh-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(217, 164, 65, 0.85));
}

.dh-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(217, 164, 65, 0.85));
}

.dh-footer__line i {
  color: var(--dh-gold);

  font-size: 14px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.dh-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: rgba(247, 230, 196, 0.85);

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;

  white-space: pre-line;
}

/* =====================================================
   DATE
===================================================== */

.dh-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: var(--dh-gold-light);

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(217, 164, 65, 0.5);

  border-bottom: 1px solid rgba(217, 164, 65, 0.5);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.dh-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: rgba(247, 230, 196, 0.55);

  font-size: 9px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .dh-footer {
    min-height: 370px;
  }

  .dh-footer::after {
    inset: 10px;
  }

  .dh-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .dh-footer__ring {
    width: 74px;
    height: 74px;
  }

  .dh-footer__ring-inner {
    font-size: 26px;
  }

  .dh-footer__monogram-label {
    margin-top: 13px;

    font-size: 8px;
  }

  .dh-footer__names {
    margin-top: 8px;
  }

  .dh-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .dh-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .dh-footer__copyright {
    font-size: 8px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .dh-footer__seal {
    animation: none;
  }
}
</style>
