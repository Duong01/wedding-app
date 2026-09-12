<template>
  <footer class="sp-footer">
    <div class="sp-footer__glow sp-footer__glow--left"></div>
    <div class="sp-footer__glow sp-footer__glow--right"></div>

    <div class="sp-footer__petal sp-footer__petal--1">❁</div>
    <div class="sp-footer__petal sp-footer__petal--2">✿</div>
    <div class="sp-footer__petal sp-footer__petal--3">❁</div>

    <div class="sp-footer__inner">
      <div class="sp-footer__ring">
        <span class="sp-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p class="sp-footer__monogram-label">SAVE THE DATE</p>

      <h2 class="sp-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="sp-footer__line">
        <span></span>

        <i>❁</i>

        <span></span>
      </div>

      <p class="sp-footer__thanks">
        CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI<br />
        CÙNG CHÚNG MÌNH
      </p>

      <div class="sp-footer__date">{{ weddingDate }}</div>

      <small class="sp-footer__copyright">© {{ currentYear }} · Made with love</small>
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
.sp-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: #7a4a3d;

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, #fffaf5 0%, #fdeee4 55%, #fbdcc9 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.sp-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(224, 163, 126, 0.45);

  border-radius: 26px;

  pointer-events: none;
}

.sp-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(224, 163, 126, 0.18);

  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.sp-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.sp-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(244, 198, 169, 0.6), transparent 70%);
}

.sp-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(214, 122, 99, 0.22), transparent 70%);
}

/* =====================================================
   PETALS
===================================================== */

.sp-footer__petal {
  position: absolute;

  z-index: 1;

  color: rgba(214, 122, 99, 0.28);

  pointer-events: none;

  animation: sp-footer-sway 6s ease-in-out infinite;
}

.sp-footer__petal--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.sp-footer__petal--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.sp-footer__petal--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(224, 163, 126, 0.45);

  animation-delay: 2.6s;
}

@keyframes sp-footer-sway {
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

.sp-footer__inner {
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

.sp-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(224, 163, 126, 0.6);

  border-radius: 50%;

  background: rgba(255, 253, 250, 0.8);

  box-shadow: 0 8px 24px rgba(122, 74, 61, 0.1);
}

.sp-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(214, 122, 99, 0.45);

  border-radius: 50%;
}

.sp-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: #b85c48;

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.sp-footer__monogram-label {
  margin: 16px 0 0;

  color: #d67a63;

  font-size: 9px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.sp-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: #7a4a3d;
}

.sp-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: #e0a37e;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.sp-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.sp-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(224, 163, 126, 0.8));
}

.sp-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(224, 163, 126, 0.8));
}

.sp-footer__line i {
  color: #d67a63;

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.sp-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: #a3806f;

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;
}

/* =====================================================
   DATE
===================================================== */

.sp-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: #b85c48;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(224, 163, 126, 0.45);

  border-bottom: 1px solid rgba(224, 163, 126, 0.45);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.sp-footer__copyright {
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
  .sp-footer {
    min-height: 370px;
  }

  .sp-footer::before {
    inset: 10px;
  }

  .sp-footer::after {
    inset: 15px;
  }

  .sp-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .sp-footer__ring {
    width: 74px;
    height: 74px;
  }

  .sp-footer__ring-inner {
    font-size: 26px;
  }

  .sp-footer__monogram-label {
    margin-top: 13px;

    font-size: 8px;
  }

  .sp-footer__names {
    margin-top: 8px;
  }

  .sp-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .sp-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .sp-footer__copyright {
    font-size: 8px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .sp-footer__petal {
    animation: none;
  }
}
</style>
