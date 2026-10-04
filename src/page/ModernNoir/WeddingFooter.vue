<template>
  <footer class="mn-footer">
    <div class="mn-footer__glow mn-footer__glow--left"></div>
    <div class="mn-footer__glow mn-footer__glow--right"></div>

    <div class="mn-footer__petal mn-footer__petal--1">✧</div>
    <div class="mn-footer__petal mn-footer__petal--2">✿</div>
    <div class="mn-footer__petal mn-footer__petal--3">✧</div>

    <div class="mn-footer__inner">
      <div class="mn-footer__ring">
        <span class="mn-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p v-if="eyebrow" class="mn-footer__monogram-label">{{ eyebrow }}</p>

      <h2 class="mn-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="mn-footer__line">
        <span></span>

        <i>✧</i>

        <span></span>
      </div>

      <p class="mn-footer__thanks">
        CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI<br />
        CÙNG CHÚNG MÌNH
      </p>

      <div class="mn-footer__date">{{ weddingDate }}</div>

      <small class="mn-footer__copyright">© {{ currentYear }} · Made with love</small>
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
.mn-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: var(--tc-3a3a3a, #3a3a3a);

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, var(--tc-fbf8f0, #fbf8f0) 0%, var(--tc-f6eedb, #f6eedb) 55%, var(--tc-ede0c4, #ede0c4) 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.mn-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.4);

  border-radius: 26px;

  pointer-events: none;
}

.mn-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.16);

  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.mn-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.mn-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(var(--tc-dcc9a4-rgb, 220, 201, 164), 0.55), transparent 70%);
}

.mn-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.22), transparent 70%);
}

/* =====================================================
   PETALS
===================================================== */

.mn-footer__petal {
  position: absolute;

  z-index: 1;

  color: rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.28);

  pointer-events: none;

  animation: mn-footer-sway 6s ease-in-out infinite;
}

.mn-footer__petal--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.mn-footer__petal--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.mn-footer__petal--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.4);

  animation-delay: 2.6s;
}

@keyframes mn-footer-sway {
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

.mn-footer__inner {
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

.mn-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.55);

  border-radius: 50%;

  background: rgba(var(--tc-fdfcf7-rgb, 253, 252, 247), 0.8);

  box-shadow: 0 8px 24px rgba(var(--tc-3a3a3a-rgb, 58, 58, 58), 0.1);
}

.mn-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(var(--tc-b8a07a-rgb, 184, 160, 122), 0.45);

  border-radius: 50%;
}

.mn-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: var(--tc-6b6b6b, #6b6b6b);

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.mn-footer__monogram-label {
  margin: 16px 0 0;

  color: var(--tc-474747, #474747);

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.mn-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: var(--tc-3a3a3a, #3a3a3a);
}

.mn-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: var(--tc-4d4d4d, #4d4d4d);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.mn-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.mn-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.8));
}

.mn-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.8));
}

.mn-footer__line i {
  color: var(--tc-474747, #474747);

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.mn-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: var(--tc-4f4f4f, #4f4f4f);

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;
}

/* =====================================================
   DATE
===================================================== */

.mn-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: var(--tc-6b6b6b, #6b6b6b);

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.4);

  border-bottom: 1px solid rgba(var(--tc-c9b48c-rgb, 201, 180, 140), 0.4);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.mn-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: var(--tc-5a5a5a, #5a5a5a);

  font-size: 11px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .mn-footer {
    min-height: 370px;
  }

  .mn-footer::before {
    inset: 10px;
  }

  .mn-footer::after {
    inset: 15px;
  }

  .mn-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .mn-footer__ring {
    width: 74px;
    height: 74px;
  }

  .mn-footer__ring-inner {
    font-size: 26px;
  }

  .mn-footer__monogram-label {
    margin-top: 13px;

    font-size: 10px;
  }

  .mn-footer__names {
    margin-top: 8px;
  }

  .mn-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .mn-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .mn-footer__copyright {
    font-size: 10px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .mn-footer__petal {
    animation: none;
  }
}
</style>
