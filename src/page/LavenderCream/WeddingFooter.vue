<template>
  <footer class="lc-footer">
    <div class="lc-footer__glow lc-footer__glow--left"></div>
    <div class="lc-footer__glow lc-footer__glow--right"></div>

    <div class="lc-footer__petal lc-footer__petal--1">❀</div>
    <div class="lc-footer__petal lc-footer__petal--2">✿</div>
    <div class="lc-footer__petal lc-footer__petal--3">✦</div>

    <div class="lc-footer__inner">
      <div class="lc-footer__ring">
        <span class="lc-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p class="lc-footer__monogram-label">SAVE THE DATE</p>

      <h2 class="lc-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="lc-footer__line">
        <span></span>

        <i>❀</i>

        <span></span>
      </div>

      <p class="lc-footer__thanks">
        CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI<br />
        CÙNG CHÚNG MÌNH
      </p>

      <div class="lc-footer__date">{{ weddingDate }}</div>

      <small class="lc-footer__copyright">© {{ currentYear }} · Made with love</small>
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
.lc-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: #584a5b;

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, #faf8fc 0%, #f1ebf4 55%, #e9dcf1 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.lc-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(185, 160, 208, 0.4);

  border-radius: 26px;

  pointer-events: none;
}

.lc-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(185, 160, 208, 0.16);

  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.lc-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.lc-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(216, 192, 222, 0.55), transparent 70%);
}

.lc-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(160, 134, 180, 0.22), transparent 70%);
}

/* =====================================================
   PETALS
===================================================== */

.lc-footer__petal {
  position: absolute;

  z-index: 1;

  color: rgba(160, 134, 180, 0.28);

  pointer-events: none;

  animation: lc-footer-sway 6s ease-in-out infinite;
}

.lc-footer__petal--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.lc-footer__petal--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.lc-footer__petal--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(185, 160, 208, 0.4);

  animation-delay: 2.6s;
}

@keyframes lc-footer-sway {
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

.lc-footer__inner {
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

.lc-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(185, 160, 208, 0.55);

  border-radius: 50%;

  background: rgba(253, 252, 254, 0.8);

  box-shadow: 0 8px 24px rgba(88, 74, 91, 0.1);
}

.lc-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(160, 134, 180, 0.45);

  border-radius: 50%;
}

.lc-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: #7d6390;

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.lc-footer__monogram-label {
  margin: 16px 0 0;

  color: #a086b4;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.lc-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: #584a5b;
}

.lc-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: #b9a0d0;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.lc-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.lc-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(185, 160, 208, 0.8));
}

.lc-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(185, 160, 208, 0.8));
}

.lc-footer__line i {
  color: #a086b4;

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.lc-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: #8d7f92;

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;
}

/* =====================================================
   DATE
===================================================== */

.lc-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: #7d6390;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(185, 160, 208, 0.4);

  border-bottom: 1px solid rgba(185, 160, 208, 0.4);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.lc-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: #a99cb0;

  font-size: 9px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .lc-footer {
    min-height: 370px;
  }

  .lc-footer::before {
    inset: 10px;
  }

  .lc-footer::after {
    inset: 15px;
  }

  .lc-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .lc-footer__ring {
    width: 74px;
    height: 74px;
  }

  .lc-footer__ring-inner {
    font-size: 26px;
  }

  .lc-footer__monogram-label {
    margin-top: 13px;

    font-size: 8px;
  }

  .lc-footer__names {
    margin-top: 8px;
  }

  .lc-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .lc-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .lc-footer__copyright {
    font-size: 8px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .lc-footer__petal {
    animation: none;
  }
}
</style>
