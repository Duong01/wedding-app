<template>
  <footer class="rr-footer">
    <div class="rr-footer__glow rr-footer__glow--left"></div>
    <div class="rr-footer__glow rr-footer__glow--right"></div>

    <div class="rr-footer__petal rr-footer__petal--1">❥</div>
    <div class="rr-footer__petal rr-footer__petal--2">✿</div>
    <div class="rr-footer__petal rr-footer__petal--3">♥</div>

    <div class="rr-footer__inner">
      <div class="rr-footer__ring">
        <span class="rr-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p v-if="eyebrow" class="rr-footer__monogram-label">{{ eyebrow }}</p>

      <h2 class="rr-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="rr-footer__line">
        <span></span>

        <i>❥</i>

        <span></span>
      </div>

      <p class="rr-footer__thanks">
        {{ $t("CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI") }}<br />
        {{ $t("CÙNG CHÚNG MÌNH") }}
      </p>

      <div class="rr-footer__date">{{ weddingDate }}</div>

      <small class="rr-footer__copyright">© {{ currentYear }} · Made with love</small>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";
const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  monogram: { type: String, default: "G&B" },
  currentYear: { type: Number, default: 2026 },
  sections: { type: Object, default: () => ({}) },
});

const eyebrow = computed(() =>
  sectionText(props.sections, "footer", "Eyebrow", "SAVE THE DATE")
);

const wedding = computed(() => props.wedding || {});

const groomName = computed(() => {
  return (
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.hero?.GroomName ||
    wedding.value?.couple?.Groom?.Name ||
    ""
  );
});

const brideName = computed(() => {
  return (
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    ""
  );
});

const weddingDate = computed(() => {
  return wedding.value?.weddingDate || wedding.value?.hero?.WeddingDate || wedding.value?.hero?.weddingDate || "";
});
</script>

<style scoped>
.rr-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: var(--tc-8c2f42, #8c2f42);

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, var(--tc-fdf7f8, #fdf7f8) 0%, var(--tc-fce8ec, #fce8ec) 55%, var(--tc-f5d8de, #f5d8de) 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.rr-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.4);

  border-radius: 26px;

  pointer-events: none;
}

.rr-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.16);

  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.rr-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.rr-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(var(--tc-e8b4be-rgb, 232, 180, 190), 0.55), transparent 70%);
}

.rr-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.22), transparent 70%);
}

/* =====================================================
   PETALS
===================================================== */

.rr-footer__petal {
  position: absolute;

  z-index: 1;

  color: rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.28);

  pointer-events: none;

  animation: rr-footer-sway 6s ease-in-out infinite;
}

.rr-footer__petal--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.rr-footer__petal--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.rr-footer__petal--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.4);

  animation-delay: 2.6s;
}

@keyframes rr-footer-sway {
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

.rr-footer__inner {
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

.rr-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.55);

  border-radius: 50%;

  background: rgba(var(--tc-fefcfd-rgb, 254, 252, 253), 0.8);

  box-shadow: 0 8px 24px rgba(var(--tc-6e2632-rgb, 110, 38, 50), 0.1);
}

.rr-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(var(--tc-c46a7e-rgb, 196, 106, 126), 0.45);

  border-radius: 50%;
}

.rr-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--tc-8c4452, #8c4452);

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.rr-footer__monogram-label {
  margin: 16px 0 0;

  color: var(--tc-683440, #683440);

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.rr-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: var(--tc-8c2f42, #8c2f42);
}

.rr-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: var(--tc-6e3844, #6e3844);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.rr-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.rr-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.8));
}

.rr-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.8));
}

.rr-footer__line i {
  color: var(--tc-683440, #683440);

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.rr-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: var(--tc-703a46, #703a46);

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;
}

/* =====================================================
   DATE
===================================================== */

.rr-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: var(--tc-8c4452, #8c4452);

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.4);

  border-bottom: 1px solid rgba(var(--tc-d998a6-rgb, 217, 152, 166), 0.4);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.rr-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: var(--tc-77434e, #77434e);

  font-size: 11px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .rr-footer {
    min-height: 370px;
  }

  .rr-footer::before {
    inset: 10px;
  }

  .rr-footer::after {
    inset: 15px;
  }

  .rr-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .rr-footer__ring {
    width: 74px;
    height: 74px;
  }

  .rr-footer__ring-inner {
    font-size: 26px;
  }

  .rr-footer__monogram-label {
    margin-top: 13px;

    font-size: 10px;
  }

  .rr-footer__names {
    margin-top: 8px;
  }

  .rr-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .rr-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .rr-footer__copyright {
    font-size: 10px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .rr-footer__petal {
    animation: none;
  }
}
</style>
