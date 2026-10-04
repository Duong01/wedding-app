<template>
  <footer class="ct-footer">
    <div class="ct-footer__glow ct-footer__glow--left"></div>
    <div class="ct-footer__glow ct-footer__glow--right"></div>

    <div class="ct-footer__petal ct-footer__petal--1">❦</div>
    <div class="ct-footer__petal ct-footer__petal--2">✿</div>
    <div class="ct-footer__petal ct-footer__petal--3">✦</div>

    <div class="ct-footer__inner">
      <div class="ct-footer__ring">
        <span class="ct-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p v-if="eyebrow" class="ct-footer__monogram-label">{{ eyebrow }}</p>

      <h2 class="ct-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="ct-footer__line">
        <span></span>

        <i>❦</i>

        <span></span>
      </div>

      <p class="ct-footer__thanks">
        CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI<br />
        CÙNG CHÚNG MÌNH
      </p>

      <div class="ct-footer__date">{{ weddingDate }}</div>

      <small class="ct-footer__copyright">© {{ currentYear }} · Made with love</small>
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
.ct-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: var(--tc-2f3e5c, #2f3e5c);

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, var(--tc-fafbfd, #fafbfd) 0%, var(--tc-eff2f8, #eff2f8) 55%, var(--tc-e4e9f3, #e4e9f3) 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.ct-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.4);

  border-radius: 26px;

  pointer-events: none;
}

.ct-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.16);

  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.ct-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.ct-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(var(--tc-ccd6e8-rgb, 204, 214, 232), 0.55), transparent 70%);
}

.ct-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.22), transparent 70%);
}

/* =====================================================
   PETALS
===================================================== */

.ct-footer__petal {
  position: absolute;

  z-index: 1;

  color: rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.28);

  pointer-events: none;

  animation: ct-footer-sway 6s ease-in-out infinite;
}

.ct-footer__petal--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.ct-footer__petal--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.ct-footer__petal--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.4);

  animation-delay: 2.6s;
}

@keyframes ct-footer-sway {
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

.ct-footer__inner {
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

.ct-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.55);

  border-radius: 50%;

  background: rgba(var(--tc-fdfdfe-rgb, 253, 253, 254), 0.8);

  box-shadow: 0 8px 24px rgba(var(--tc-2f3e5c-rgb, 47, 62, 92), 0.1);
}

.ct-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(var(--tc-7d8fb0-rgb, 125, 143, 176), 0.45);

  border-radius: 50%;
}

.ct-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--tc-5c6d8f, #5c6d8f);

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.ct-footer__monogram-label {
  margin: 16px 0 0;

  color: var(--tc-48546e, #48546e);

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.ct-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: var(--tc-2f3e5c, #2f3e5c);
}

.ct-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: var(--tc-4d5a75, #4d5a75);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.ct-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.ct-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.8));
}

.ct-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.8));
}

.ct-footer__line i {
  color: var(--tc-48546e, #48546e);

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.ct-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: var(--tc-505d78, #505d78);

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;
}

/* =====================================================
   DATE
===================================================== */

.ct-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: var(--tc-5c6d8f, #5c6d8f);

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.4);

  border-bottom: 1px solid rgba(var(--tc-b4c0d8-rgb, 180, 192, 216), 0.4);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.ct-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: var(--tc-586276, #586276);

  font-size: 11px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .ct-footer {
    min-height: 370px;
  }

  .ct-footer::before {
    inset: 10px;
  }

  .ct-footer::after {
    inset: 15px;
  }

  .ct-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .ct-footer__ring {
    width: 74px;
    height: 74px;
  }

  .ct-footer__ring-inner {
    font-size: 26px;
  }

  .ct-footer__monogram-label {
    margin-top: 13px;

    font-size: 10px;
  }

  .ct-footer__names {
    margin-top: 8px;
  }

  .ct-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .ct-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .ct-footer__copyright {
    font-size: 10px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .ct-footer__petal {
    animation: none;
  }
}
</style>
