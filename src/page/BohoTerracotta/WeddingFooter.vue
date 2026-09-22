<template>
  <footer class="bq-footer">
    <img
      :src="goldenLine"
      alt=""
      aria-hidden="true"
      class="bq-footer__line"
      draggable="false"
    />

    <div class="bq-footer__inner">
      <p class="bq-footer__kicker">SAVE THE DATE</p>

      <h2 class="bq-footer__names">
        <span>{{ groomName }}</span>
        <i>&amp;</i>
        <span>{{ brideName }}</span>
      </h2>

      <p class="bq-footer__thanks">{{ thanksMessage }}</p>

      <p v-if="weddingDate" class="bq-footer__date">{{ weddingDate }}</p>

      <small class="bq-footer__copyright">© {{ currentYear }} · {{ copyrightText }}</small>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

import { goldenLine } from "./bohoTerracottaAssets";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  monogram: { type: String, default: "&" },
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
.bq-footer {
  position: relative;
  isolation: isolate;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  padding: 0 24px 40px;

  text-align: center;

  color: var(--bq-ink);
}

.bq-footer__line {
  display: block;

  width: 74.5%;
  max-width: 309px;
  height: auto;

  margin: 0 auto 24px;

  object-fit: contain;

  filter: drop-shadow(4px 4px 2px rgba(0, 0, 0, 0.25));
}

.bq-footer__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bq-footer__kicker {
  margin: 0;

  color: var(--bq-accent);

  font-family: "Playfair Display", "Times New Roman", serif;
  font-size: 13px;
  font-weight: 600;

  letter-spacing: 0.14em;
  text-indent: 0.14em;

  text-transform: uppercase;
}

.bq-footer__names {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 14px 0 0;

  color: var(--bq-accent);

  font-family: "Viaoda Libre", "EB Garamond", serif;
  font-size: clamp(24px, 7vw, 32px);
  font-weight: 400;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

.bq-footer__names i {
  color: var(--bq-accent);

  font-family: "Ms Madi", cursive;
  font-size: 0.8em;
  font-style: normal;
}

.bq-footer__thanks {
  max-width: 320px;
  margin: 18px auto 0;

  color: var(--bq-soft);

  font-size: 12px;

  line-height: 1.7;
}

.bq-footer__date {
  margin: 12px 0 0;

  color: var(--bq-ink);

  font-size: 12px;

  letter-spacing: 0.16em;
}

.bq-footer__copyright {
  margin-top: 20px;

  color: var(--bq-muted);

  font-size: 10px;

  letter-spacing: 0.1em;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-footer {
    padding-bottom: 48px;
  }

  .bq-footer__line {
    max-width: 420px;
  }

  .bq-footer__thanks {
    max-width: 440px;

    font-size: 14px;
  }

  .bq-footer__date {
    font-size: 14px;
  }
}
</style>
