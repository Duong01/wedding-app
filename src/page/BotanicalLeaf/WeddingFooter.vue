<template>
  <footer class="bl-footer">
    <div class="bl-footer__glow bl-footer__glow--left"></div>
    <div class="bl-footer__glow bl-footer__glow--right"></div>

    <div class="bl-footer__petal bl-footer__petal--1">❧</div>
    <div class="bl-footer__petal bl-footer__petal--2">✿</div>
    <div class="bl-footer__petal bl-footer__petal--3">✤</div>

    <div class="bl-footer__inner">
      <div class="bl-footer__ring">
        <span class="bl-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p v-if="eyebrow" class="bl-footer__monogram-label">{{ eyebrow }}</p>

      <h2 class="bl-footer__names">
        {{ groomName }}

        <span>&</span>

        {{ brideName }}
      </h2>

      <div class="bl-footer__line">
        <span></span>

        <i>❧</i>

        <span></span>
      </div>

      <p class="bl-footer__thanks">
        CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI<br />
        CÙNG CHÚNG MÌNH
      </p>

      <div class="bl-footer__date">{{ weddingDate }}</div>

      <small class="bl-footer__copyright">© {{ currentYear }} · Made with love</small>
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
.bl-footer {
  position: relative;

  width: 100%;
  min-height: 400px;

  overflow: hidden;

  box-sizing: border-box;

  color: #3d5a47;

  text-align: center;

  font-family: "Cormorant Garamond", Georgia, serif;

  background: linear-gradient(180deg, #f9fbf9 0%, #f1f7f2 55%, #e6f0e7 100%);
}

/* =====================================================
   DECORATIVE FRAME
===================================================== */

.bl-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid rgba(181, 208, 186, 0.4);

  border-radius: 26px;

  pointer-events: none;
}

.bl-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid rgba(181, 208, 186, 0.16);

  border-radius: 20px;

  pointer-events: none;
}

/* =====================================================
   GLOW
===================================================== */

.bl-footer__glow {
  position: absolute;

  z-index: 1;

  width: 240px;
  height: 240px;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(10px);
}

.bl-footer__glow--left {
  left: -90px;
  bottom: -70px;

  background: radial-gradient(circle, rgba(207, 227, 210, 0.55), transparent 70%);
}

.bl-footer__glow--right {
  right: -90px;
  top: -60px;

  background: radial-gradient(circle, rgba(127, 163, 137, 0.22), transparent 70%);
}

/* =====================================================
   PETALS
===================================================== */

.bl-footer__petal {
  position: absolute;

  z-index: 1;

  color: rgba(127, 163, 137, 0.28);

  pointer-events: none;

  animation: bl-footer-sway 6s ease-in-out infinite;
}

.bl-footer__petal--1 {
  top: 44px;
  left: 30px;

  font-size: 20px;
}

.bl-footer__petal--2 {
  top: 90px;
  right: 38px;

  font-size: 15px;

  animation-delay: 1.4s;
}

.bl-footer__petal--3 {
  bottom: 60px;
  right: 70px;

  font-size: 12px;

  color: rgba(181, 208, 186, 0.4);

  animation-delay: 2.6s;
}

@keyframes bl-footer-sway {
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

.bl-footer__inner {
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

.bl-footer__ring {
  position: relative;

  display: flex;

  align-items: center;

  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid rgba(181, 208, 186, 0.55);

  border-radius: 50%;

  background: rgba(253, 254, 253, 0.8);

  box-shadow: 0 8px 24px rgba(61, 90, 71, 0.1);
}

.bl-footer__ring::before {
  content: "";

  position: absolute;

  inset: 6px;

  border: 1px dashed rgba(127, 163, 137, 0.45);

  border-radius: 50%;
}

.bl-footer__ring-inner {
  font-family: "Allura", cursive;

  font-size: 30px;

  color: #57806a;

  line-height: 1;
}

/* =====================================================
   LABEL
===================================================== */

.bl-footer__monogram-label {
  margin: 16px 0 0;

  color: #4a6653;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

/* =====================================================
   NAMES
===================================================== */

.bl-footer__names {
  margin: 10px 0 0;

  font-family: "Allura", cursive;

  font-size: clamp(30px, 8vw, 40px);

  font-weight: 400;

  line-height: 1.25;

  color: #3d5a47;
}

.bl-footer__names span {
  display: inline-block;

  margin: 0 8px;

  color: #4f6b58;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 0.62em;

  font-style: italic;
}

/* =====================================================
   LINE
===================================================== */

.bl-footer__line {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  width: 100%;

  margin: 15px 0 14px;
}

.bl-footer__line span {
  width: 46px;
  height: 1px;

  background: linear-gradient(to right, transparent, rgba(181, 208, 186, 0.8));
}

.bl-footer__line span:last-child {
  background: linear-gradient(to left, transparent, rgba(181, 208, 186, 0.8));
}

.bl-footer__line i {
  color: #4a6653;

  font-size: 12px;

  font-style: normal;
}

/* =====================================================
   THANK YOU
===================================================== */

.bl-footer__thanks {
  max-width: 300px;

  margin: 0 auto;

  color: #526e5a;

  font-size: 11px;

  line-height: 1.85;

  letter-spacing: 0.14em;
}

/* =====================================================
   DATE
===================================================== */

.bl-footer__date {
  margin-top: 18px;

  padding: 8px 18px;

  color: #57806a;

  font-size: 12px;

  font-weight: 600;

  letter-spacing: 0.22em;

  border-top: 1px solid rgba(181, 208, 186, 0.4);

  border-bottom: 1px solid rgba(181, 208, 186, 0.4);
}

/* =====================================================
   COPYRIGHT
===================================================== */

.bl-footer__copyright {
  display: block;

  margin-top: auto;

  padding-top: 24px;

  color: #58715f;

  font-size: 11px;

  letter-spacing: 0.12em;
}

/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {
  .bl-footer {
    min-height: 370px;
  }

  .bl-footer::before {
    inset: 10px;
  }

  .bl-footer::after {
    inset: 15px;
  }

  .bl-footer__inner {
    min-height: 370px;

    padding: 44px 20px 24px;
  }

  .bl-footer__ring {
    width: 74px;
    height: 74px;
  }

  .bl-footer__ring-inner {
    font-size: 26px;
  }

  .bl-footer__monogram-label {
    margin-top: 13px;

    font-size: 10px;
  }

  .bl-footer__names {
    margin-top: 8px;
  }

  .bl-footer__thanks {
    max-width: 260px;

    font-size: 10px;
  }

  .bl-footer__date {
    margin-top: 15px;

    font-size: 11px;
  }

  .bl-footer__copyright {
    font-size: 10px;
  }
}

/* =====================================================
   REDUCE MOTION
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .bl-footer__petal {
    animation: none;
  }
}
</style>
