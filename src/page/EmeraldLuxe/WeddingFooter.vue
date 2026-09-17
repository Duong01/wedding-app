<template>
  <footer class="el-footer">
    <div class="el-footer__glow el-footer__glow--left"></div>
    <div class="el-footer__glow el-footer__glow--right"></div>

    <div class="el-footer__leaf el-footer__leaf--1">❦</div>
    <div class="el-footer__leaf el-footer__leaf--2">✦</div>
    <div class="el-footer__leaf el-footer__leaf--3">❦</div>

    <div class="el-footer__inner">
      <div class="el-footer__ring">
        <span class="el-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p class="el-footer__monogram-label">SAVE THE DATE</p>

      <h2 class="el-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="el-footer__line">
        <span></span>

        <i>❦</i>

        <span></span>
      </div>

      <p class="el-footer__thanks">
        {{ thanksMessage }}
      </p>

      <div class="el-footer__date">{{ weddingDate }}</div>

      <small class="el-footer__copyright">© {{ currentYear }} · {{ copyrightText }}</small>
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
    "CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI CÙNG CHÚNG MÌNH"
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
.el-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: #2e3d36;

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, #f2ecdc 0%, #e3dcc4 55%, #123b2e 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.el-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(201, 164, 92, 0.55);

  border-radius: 60% 60% 26px 26px / 10% 10% 26px 26px;

  pointer-events: none;
}

.el-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(201, 164, 92, 0.22);

  border-radius: 60% 60% 20px 20px / 10% 10% 20px 20px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.el-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.el-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(201, 164, 92, 0.4), transparent 70%);
}

.el-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(18, 59, 46, 0.3), transparent 70%);
}

/* =====================================================
   LEAF STROKES
===================================================== */

.el-footer__leaf {
  position: absolute;

  z-index: 1;

  color: rgba(201, 164, 92, 0.4);

  pointer-events: none;

  animation: el-footer-sway 6s ease-in-out infinite;
}

.el-footer__leaf--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.el-footer__leaf--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.el-footer__leaf--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(201, 164, 92, 0.55);

  animation-delay: 2.6s;
}

@keyframes el-footer-sway {
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

.el-footer__inner {
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

.el-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(201, 164, 92, 0.75);

  border-radius: 50%;

  background: rgba(255, 253, 246, 0.85);

  box-shadow: 0 8px 24px rgba(12, 43, 33, 0.14);

  transform: rotate(-3deg);
}

.el-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(201, 164, 92, 0.5);

  border-radius: 50%;
}

.el-footer__ring-inner {
  font-family: "Playfair Display", Georgia, serif;

  font-size: 26px;

  font-weight: 600;

  color: #123b2e;

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.el-footer__monogram-label {
  margin: 16px 0 0;

  color: #8a7a52;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.el-footer__names {
  margin: 10px 0 0;

  font-family: "Great Vibes", cursive;

  font-size: clamp(32px, 8.5vw, 44px);

  font-weight: 400;

  line-height: 1.25;

  color: #123b2e;
}

.el-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: #c9a45c;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.el-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.el-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(201, 164, 92, 0.85));
}

.el-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(201, 164, 92, 0.85));
}

.el-footer__line i {
  color: #c9a45c;

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.el-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: #55645b;

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;

  white-space: pre-line;
}

/* =====================================================
   DATE
===================================================== */

.el-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: #123b2e;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(201, 164, 92, 0.5);

  border-bottom: 1px solid rgba(201, 164, 92, 0.5);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.el-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: #8a7a52;

  font-size: 9px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .el-footer {
    min-height: 370px;
  }

  .el-footer::before {
    inset: 10px;
  }

  .el-footer::after {
    inset: 15px;
  }

  .el-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .el-footer__ring {
    width: 74px;
    height: 74px;
  }

  .el-footer__ring-inner {
    font-size: 23px;
  }

  .el-footer__monogram-label {
    margin-top: 13px;

    font-size: 8px;
  }

  .el-footer__names {
    margin-top: 8px;
  }

  .el-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .el-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .el-footer__copyright {
    font-size: 8px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .el-footer__leaf {
    animation: none;
  }
}
</style>
