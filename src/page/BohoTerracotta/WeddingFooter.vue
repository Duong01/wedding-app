<template>
  <footer class="bt-footer">
    <div class="bt-footer__glow bt-footer__glow--left"></div>
    <div class="bt-footer__glow bt-footer__glow--right"></div>

    <div class="bt-footer__pampas bt-footer__pampas--1">❋</div>
    <div class="bt-footer__pampas bt-footer__pampas--2">✽</div>
    <div class="bt-footer__pampas bt-footer__pampas--3">❁</div>

    <div class="bt-footer__inner">
      <div class="bt-footer__ring">
        <span class="bt-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p class="bt-footer__monogram-label">SAVE THE DATE</p>

      <h2 class="bt-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="bt-footer__line">
        <span></span>

        <i>❋</i>

        <span></span>
      </div>

      <p class="bt-footer__thanks">
        {{ thanksMessage }}
      </p>

      <div class="bt-footer__date">{{ weddingDate }}</div>

      <small class="bt-footer__copyright">© {{ currentYear }} · {{ copyrightText }}</small>
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
    "CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI CÙNG CHÚNG MÌNH"
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
.bt-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: #5c4636;

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, #faf3ec 0%, #f2e2d0 55%, #e3c4a6 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.bt-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 2px dashed rgba(156, 91, 63, 0.4);

  border-radius: 60% 60% 26px 26px / 10% 10% 26px 26px;

  pointer-events: none;
}

.bt-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(156, 91, 63, 0.18);

  border-radius: 60% 60% 20px 20px / 10% 10% 20px 20px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.bt-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.bt-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(217, 176, 140, 0.55), transparent 70%);
}

.bt-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(201, 123, 93, 0.22), transparent 70%);
}

/* =====================================================
   PAMPAS STROKES
===================================================== */

.bt-footer__pampas {
  position: absolute;

  z-index: 1;

  color: rgba(156, 91, 63, 0.28);

  pointer-events: none;

  animation: bt-footer-sway 6s ease-in-out infinite;
}

.bt-footer__pampas--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.bt-footer__pampas--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.bt-footer__pampas--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(201, 123, 93, 0.4);

  animation-delay: 2.6s;
}

@keyframes bt-footer-sway {
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

.bt-footer__inner {
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

.bt-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(156, 91, 63, 0.55);

  border-radius: 50% 50% 50% 20%;

  background: rgba(255, 251, 245, 0.8);

  box-shadow: 0 8px 24px rgba(92, 70, 54, 0.1);

  transform: rotate(-3deg);
}

.bt-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(201, 123, 93, 0.45);

  border-radius: 50% 50% 50% 20%;
}

.bt-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: #9c5b3f;

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.bt-footer__monogram-label {
  margin: 16px 0 0;

  color: #8a9b7c;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.bt-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: #9c5b3f;
}

.bt-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: #c97b5d;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.bt-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.bt-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(156, 91, 63, 0.8));
}

.bt-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(156, 91, 63, 0.8));
}

.bt-footer__line i {
  color: #c97b5d;

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.bt-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: #8a6f5c;

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;

  white-space: pre-line;
}

/* =====================================================
   DATE
===================================================== */

.bt-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: #9c5b3f;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px dashed rgba(156, 91, 63, 0.4);

  border-bottom: 1px dashed rgba(156, 91, 63, 0.4);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.bt-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: #b09a8c;

  font-size: 9px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .bt-footer {
    min-height: 370px;
  }

  .bt-footer::before {
    inset: 10px;
  }

  .bt-footer::after {
    inset: 15px;
  }

  .bt-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .bt-footer__ring {
    width: 74px;
    height: 74px;
  }

  .bt-footer__ring-inner {
    font-size: 26px;
  }

  .bt-footer__monogram-label {
    margin-top: 13px;

    font-size: 8px;
  }

  .bt-footer__names {
    margin-top: 8px;
  }

  .bt-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .bt-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .bt-footer__copyright {
    font-size: 8px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .bt-footer__pampas {
    animation: none;
  }
}
</style>
