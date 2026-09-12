<template>
  <footer class="cb-footer">
    <div class="cb-footer__glow cb-footer__glow--left"></div>
    <div class="cb-footer__glow cb-footer__glow--right"></div>

    <div class="cb-footer__petal cb-footer__petal--1">❀</div>
    <div class="cb-footer__petal cb-footer__petal--2">✿</div>
    <div class="cb-footer__petal cb-footer__petal--3">❀</div>

    <div class="cb-footer__inner">
      <div class="cb-footer__ring">
        <span class="cb-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p class="cb-footer__monogram-label">SAVE THE DATE</p>

      <h2 class="cb-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="cb-footer__line">
        <span></span>

        <i>❀</i>

        <span></span>
      </div>

      <p class="cb-footer__thanks">
        CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI<br />
        CÙNG CHÚNG MÌNH
      </p>

      <div class="cb-footer__date">{{ weddingDate }}</div>

      <small class="cb-footer__copyright">© {{ currentYear }} · Made with love</small>
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
.cb-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: #6c4b4a;

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, #fffaf7 0%, #f6ece2 55%, #efdfcf 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.cb-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(201, 160, 106, 0.4);

  border-radius: 26px;

  pointer-events: none;
}

.cb-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(201, 160, 106, 0.16);

  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.cb-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.cb-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(234, 210, 182, 0.55), transparent 70%);
}

.cb-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(182, 127, 125, 0.22), transparent 70%);
}

/* =====================================================
   PETALS
===================================================== */

.cb-footer__petal {
  position: absolute;

  z-index: 1;

  color: rgba(182, 127, 125, 0.28);

  pointer-events: none;

  animation: cb-footer-sway 6s ease-in-out infinite;
}

.cb-footer__petal--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.cb-footer__petal--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.cb-footer__petal--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(201, 160, 106, 0.4);

  animation-delay: 2.6s;
}

@keyframes cb-footer-sway {
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

.cb-footer__inner {
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

.cb-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(201, 160, 106, 0.55);

  border-radius: 50%;

  background: rgba(255, 253, 250, 0.8);

  box-shadow: 0 8px 24px rgba(108, 75, 74, 0.1);
}

.cb-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(182, 127, 125, 0.45);

  border-radius: 50%;
}

.cb-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: #8f5a56;

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.cb-footer__monogram-label {
  margin: 16px 0 0;

  color: #b67f7d;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.cb-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: #6c4b4a;
}

.cb-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: #c9a06a;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.cb-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.cb-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(201, 160, 106, 0.8));
}

.cb-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(201, 160, 106, 0.8));
}

.cb-footer__line i {
  color: #b67f7d;

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.cb-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: #9a7a72;

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;
}

/* =====================================================
   DATE
===================================================== */

.cb-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: #8f5a56;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(201, 160, 106, 0.4);

  border-bottom: 1px solid rgba(201, 160, 106, 0.4);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.cb-footer__copyright {
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
  .cb-footer {
    min-height: 370px;
  }

  .cb-footer::before {
    inset: 10px;
  }

  .cb-footer::after {
    inset: 15px;
  }

  .cb-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .cb-footer__ring {
    width: 74px;
    height: 74px;
  }

  .cb-footer__ring-inner {
    font-size: 26px;
  }

  .cb-footer__monogram-label {
    margin-top: 13px;

    font-size: 8px;
  }

  .cb-footer__names {
    margin-top: 8px;
  }

  .cb-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .cb-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .cb-footer__copyright {
    font-size: 8px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .cb-footer__petal {
    animation: none;
  }
}
</style>
