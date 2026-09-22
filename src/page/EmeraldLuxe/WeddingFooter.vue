<template>
  <footer class="cr-footer">
    <img
      :src="decorativeHeader"
      alt=""
      aria-hidden="true"
      class="cr-footer__header"
      draggable="false"
    />

    <img
      :src="cherryBlossom"
      alt=""
      aria-hidden="true"
      class="cr-footer__blossom cr-footer__blossom--left"
      draggable="false"
    />

    <img
      :src="cherryBlossom"
      alt=""
      aria-hidden="true"
      class="cr-footer__blossom cr-footer__blossom--right"
      draggable="false"
    />

    <div class="cr-footer__inner">
      <div class="cr-footer__seal">
        <img :src="doubleHappiness" alt="囍" draggable="false" />
      </div>

      <p class="cr-footer__kicker">SAVE THE DATE</p>

      <h2 class="cr-footer__names">
        <span>{{ groomName }}</span>
        <i>&amp;</i>
        <span>{{ brideName }}</span>
      </h2>

      <div class="cr-footer__ornament" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>

      <p class="cr-footer__thanks">{{ thanksMessage }}</p>

      <p v-if="weddingDate" class="cr-footer__date">{{ weddingDate }}</p>

      <small class="cr-footer__copyright">© {{ currentYear }} · {{ copyrightText }}</small>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

import {
  cherryBlossom,
  decorativeHeader,
  doubleHappiness,
} from "./emeraldLuxeAssets";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  monogram: { type: String, default: "囍" },
  currentYear: { type: Number, default: 2026 },
});

const wedding = computed(() => props.wedding || {});

const groomName = computed(
  () =>
    wedding.value?.footer?.GroomName ||
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.hero?.GroomName ||
    wedding.value?.couple?.Groom?.Name ||
    ""
);

const brideName = computed(
  () =>
    wedding.value?.footer?.BrideName ||
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    ""
);

const thanksMessage = computed(
  () =>
    wedding.value?.footer?.Message ||
    "CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI CÙNG CHÚNG MÌNH"
);

const copyrightText = computed(
  () => wedding.value?.footer?.Copyright || "Made with love"
);

const weddingDate = computed(() => {
  const raw =
    wedding.value?.weddingDate ||
    wedding.value?.hero?.WeddingDate ||
    wedding.value?.hero?.weddingDate ||
    "";

  if (!raw) return "";

  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) return String(raw);

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
});
</script>

<style scoped>
.cr-footer {
  position: relative;

  width: 100%;

  margin-top: 40px;
  padding: 0 0 34px;

  overflow: hidden;

  text-align: center;

  color: var(--cr-ink);

  background: linear-gradient(180deg, var(--cr-bg) 0%, var(--cr-bg-2) 100%);
}

.cr-footer__header {
  position: absolute;

  top: -10px;
  left: 50%;

  width: min(100%, 420px);

  transform: translateX(-50%) rotate(180deg);

  object-fit: contain;

  opacity: 0.5;

  pointer-events: none;
}

.cr-footer__blossom {
  position: absolute;

  width: 96px;
  height: 96px;

  object-fit: contain;

  opacity: 0.4;

  pointer-events: none;
}

.cr-footer__blossom--left {
  bottom: 20px;
  left: -26px;
}

.cr-footer__blossom--right {
  top: 40px;
  right: -26px;

  width: 78px;
  height: 78px;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.cr-footer__inner {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 96px 20px 0;
}

.cr-footer__seal {
  width: 76px;
  height: 76px;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 50%;

  background: var(--cr-surface);

  box-shadow: 0 10px 26px rgba(var(--cr-ink-rgb), 0.12);
}

.cr-footer__seal img {
  width: 48px;
  height: 48px;

  object-fit: contain;
}

.cr-footer__kicker {
  margin: 16px 0 0;

  color: var(--cr-muted);

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.34em;
  text-indent: 0.34em;
}

.cr-footer__names {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  margin: 8px 0 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(26px, 7.5vw, 38px);
  font-weight: 400;

  line-height: 1.2;

  letter-spacing: 0.04em;
}

.cr-footer__names i {
  color: var(--cr-accent);

  font-family: Georgia, serif;
  font-size: 0.55em;
  font-style: italic;
}

.cr-footer__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 14px 0;

  color: var(--cr-accent);
}

.cr-footer__ornament span {
  width: 46px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-footer__ornament span:last-child {
  transform: rotate(180deg);
}

.cr-footer__ornament i {
  font-size: 12px;
  font-style: normal;
}

.cr-footer__thanks {
  max-width: 320px;

  margin: 0 auto;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.85;

  letter-spacing: 0.06em;

  white-space: pre-line;
}

.cr-footer__date {
  margin: 18px 0 0;
  padding: 8px 18px;

  border-top: 1px solid rgba(var(--cr-accent-rgb), 1);
  border-bottom: 1px solid rgba(var(--cr-accent-rgb), 1);

  color: var(--cr-ink);

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.2em;
}

.cr-footer__copyright {
  display: block;

  margin-top: 22px;

  color: var(--cr-muted);

  font-size: 11px;

  letter-spacing: 0.1em;
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 420px) {
  .cr-footer__inner {
    padding-top: 84px;
  }

  .cr-footer__seal {
    width: 66px;
    height: 66px;
  }

  .cr-footer__seal img {
    width: 42px;
    height: 42px;
  }

  .cr-footer__thanks {
    max-width: 270px;

    font-size: 11px;
  }
}
</style>
