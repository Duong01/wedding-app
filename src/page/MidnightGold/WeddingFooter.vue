<template>
  <footer class="mg-footer">
    <div class="mg-footer__glow mg-footer__glow--left"></div>
    <div class="mg-footer__glow mg-footer__glow--right"></div>

    <div class="mg-footer__star mg-footer__star--1">✦</div>
    <div class="mg-footer__star mg-footer__star--2">✧</div>
    <div class="mg-footer__star mg-footer__star--3">✦</div>

    <div class="mg-footer__inner">
      <div class="mg-footer__ring">
        <span class="mg-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p class="mg-footer__monogram-label">SAVE THE DATE</p>

      <h2 class="mg-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="mg-footer__line">
        <span></span>

        <i>✦</i>

        <span></span>
      </div>

      <p class="mg-footer__thanks">
        CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI<br />
        CÙNG CHÚNG MÌNH
      </p>

      <div class="mg-footer__date">{{ weddingDate }}</div>

      <small class="mg-footer__copyright">© {{ currentYear }} · Made with love</small>
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
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.hero?.GroomName ||
    wedding.value?.couple?.Groom?.Name ||
    "Chú Rể"
  );
});

const brideName = computed(() => {
  return (
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    "Cô Dâu"
  );
});

const weddingDate = computed(() => {
  return wedding.value?.weddingDate || wedding.value?.hero?.weddingDate || "";
});
</script>

<style scoped>
.mg-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: #f0e6d2;

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background:
    radial-gradient(700px 320px at 50% 0%, rgba(216, 182, 118, 0.1), transparent 65%),
    linear-gradient(180deg, #1d1622 0%, #17121b 55%, #120e15 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.mg-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(216, 182, 118, 0.35);

  border-radius: 26px;

  pointer-events: none;
}

.mg-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(216, 182, 118, 0.14);

  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.mg-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.mg-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(216, 182, 118, 0.18), transparent 70%);
}

.mg-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(155, 125, 77, 0.16), transparent 70%);
}

/* =====================================================
   STARS
===================================================== */

.mg-footer__star {
  position: absolute;

  z-index: 1;

  color: rgba(216, 182, 118, 0.4);

  pointer-events: none;

  animation: mg-footer-sway 6s ease-in-out infinite;
}

.mg-footer__star--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.mg-footer__star--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.mg-footer__star--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(216, 182, 118, 0.55);

  animation-delay: 2.6s;
}

@keyframes mg-footer-sway {
  0%,
  100% {
    transform: translateY(0) rotate(-8deg) scale(1);
    opacity: 0.5;
  }

  50% {
    transform: translateY(-9px) rotate(10deg) scale(1.15);
    opacity: 1;
  }
}

/* =====================================================
   INNER
===================================================== */

.mg-footer__inner {
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

.mg-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(216, 182, 118, 0.55);

  border-radius: 50%;

  background: rgba(216, 182, 118, 0.08);

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45), 0 0 24px rgba(216, 182, 118, 0.12);
}

.mg-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(216, 182, 118, 0.45);

  border-radius: 50%;
}

.mg-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: #d8b676;

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.mg-footer__monogram-label {
  margin: 16px 0 0;

  color: #b9a88f;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.mg-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: #d8b676;
}

.mg-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: #eed9a8;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.mg-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.mg-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(216, 182, 118, 0.8));
}

.mg-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(216, 182, 118, 0.8));
}

.mg-footer__line i {
  color: #d8b676;

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.mg-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: #b9a88f;

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;
}

/* =====================================================
   DATE
===================================================== */

.mg-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: #eed9a8;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(216, 182, 118, 0.4);

  border-bottom: 1px solid rgba(216, 182, 118, 0.4);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.mg-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: #8d7f6d;

  font-size: 9px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .mg-footer {
    min-height: 370px;
  }

  .mg-footer::before {
    inset: 10px;
  }

  .mg-footer::after {
    inset: 15px;
  }

  .mg-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .mg-footer__ring {
    width: 74px;
    height: 74px;
  }

  .mg-footer__ring-inner {
    font-size: 26px;
  }

  .mg-footer__monogram-label {
    margin-top: 13px;

    font-size: 8px;
  }

  .mg-footer__names {
    margin-top: 8px;
  }

  .mg-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .mg-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .mg-footer__copyright {
    font-size: 8px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .mg-footer__star {
    animation: none;
  }
}
</style>
