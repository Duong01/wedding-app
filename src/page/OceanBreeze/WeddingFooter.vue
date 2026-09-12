<template>
  <footer class="ob-footer">
    <div class="ob-footer__glow ob-footer__glow--left"></div>
    <div class="ob-footer__glow ob-footer__glow--right"></div>

    <div class="ob-footer__wave ob-footer__wave--1">〜</div>
    <div class="ob-footer__wave ob-footer__wave--2">❊</div>
    <div class="ob-footer__wave ob-footer__wave--3">〜</div>

    <div class="ob-footer__inner">
      <div class="ob-footer__ring">
        <span class="ob-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p class="ob-footer__monogram-label">SAVE THE DATE</p>

      <h2 class="ob-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="ob-footer__line">
        <span></span>

        <i>〜</i>

        <span class="ob-footer__line-flip"></span>
      </div>

      <p class="ob-footer__thanks">
        {{ thanksMessage }}
      </p>

      <div class="ob-footer__date">{{ weddingDate }}</div>

      <small class="ob-footer__copyright">© {{ currentYear }} · {{ copyrightText }}</small>
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
.ob-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: #274b5c;

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, #f4fafc 0%, #dceef3 55%, #bfe0ea 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.ob-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(74, 154, 184, 0.4);

  border-radius: 24px;

  pointer-events: none;
}

.ob-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(74, 154, 184, 0.16);

  border-radius: 18px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.ob-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.ob-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(168, 208, 220, 0.6), transparent 70%);
}

.ob-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(232, 146, 124, 0.22), transparent 70%);
}

/* =====================================================
   WAVES
===================================================== */

.ob-footer__wave {
  position: absolute;

  z-index: 1;

  color: rgba(74, 154, 184, 0.3);

  pointer-events: none;

  animation: ob-footer-sway 6s ease-in-out infinite;
}

.ob-footer__wave--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.ob-footer__wave--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  color: rgba(232, 146, 124, 0.35);

  animation-delay: 1.4s;
}

.ob-footer__wave--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  animation-delay: 2.6s;
}

@keyframes ob-footer-sway {
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

.ob-footer__inner {
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

.ob-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(74, 154, 184, 0.55);

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.8);

  box-shadow: 0 8px 24px rgba(29, 106, 142, 0.12);
}

.ob-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(232, 146, 124, 0.45);

  border-radius: 50%;
}

.ob-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: #1d6a8e;

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.ob-footer__monogram-label {
  margin: 16px 0 0;

  color: #4a9ab8;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.ob-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: #274b5c;
}

.ob-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: #e8927c;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.ob-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.ob-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(74, 154, 184, 0.8));
}

.ob-footer__line-flip {
  background: linear-gradient(to left, transparent, rgba(74, 154, 184, 0.8)) !important;
}

.ob-footer__line i {
  color: #e8927c;

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.ob-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: #5b8296;

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;

  white-space: pre-line;
}

/* =====================================================
   DATE
===================================================== */

.ob-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: #1d6a8e;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(74, 154, 184, 0.4);

  border-bottom: 1px solid rgba(74, 154, 184, 0.4);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.ob-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: #7ba3b3;

  font-size: 9px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .ob-footer {
    min-height: 370px;
  }

  .ob-footer::before {
    inset: 10px;
  }

  .ob-footer::after {
    inset: 15px;
  }

  .ob-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .ob-footer__ring {
    width: 74px;
    height: 74px;
  }

  .ob-footer__ring-inner {
    font-size: 26px;
  }

  .ob-footer__monogram-label {
    margin-top: 13px;

    font-size: 8px;
  }

  .ob-footer__names {
    margin-top: 8px;
  }

  .ob-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .ob-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .ob-footer__copyright {
    font-size: 8px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .ob-footer__wave {
    animation: none;
  }
}
</style>
