<template>
  <footer class="shc-footer">
    <div class="shc-footer__inner">
      <img
        class="shc-footer__hy"
        :src="doubleHappiness"
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      <p class="shc-footer__label">SAVE THE DATE</p>

      <h2 class="shc-footer__names">
        {{ groomName }}

        <span>&amp;</span>

        {{ brideName }}
      </h2>

      <div class="shc-footer__line" aria-hidden="true">
        <span></span>
        <i>❦</i>
        <span></span>
      </div>

      <p class="shc-footer__thanks">{{ thanksMessage }}</p>

      <p v-if="weddingDate" class="shc-footer__date">{{ weddingDate }}</p>

      <small class="shc-footer__copyright">© {{ currentYear }} · {{ copyrightText }}</small>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

import { doubleHappiness } from "./songHacRedAssets";
import { t } from "@/lang";
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
    t("CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI\nCÙNG CHÚNG MÌNH")
  );
});

const copyrightText = computed(() => {
  return wedding.value?.footer?.Copyright || "Made with love";
});

const weddingDate = computed(() => {
  return (
    wedding.value?.weddingDate ||
    wedding.value?.hero?.WeddingDate ||
    wedding.value?.hero?.weddingDate ||
    ""
  );
});
</script>

<style scoped>
.shc-footer {
  --shc-red: var(--primary, #920002);
  --shc-cream: var(--accent, #ffe8a4);

  position: relative;

  width: 100%;
  min-height: 400px;

  box-sizing: border-box;

  overflow: hidden;

  color: var(--shc-cream);

  text-align: center;

  font-family: "Times New Roman", Times, serif;

  background: var(--shc-red);
}

/* =========================================================
   KHUNG VIỀN
========================================================= */

.shc-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid color-mix(in srgb, var(--shc-cream) 30%, transparent);
  border-radius: 10px;

  pointer-events: none;
}

.shc-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid color-mix(in srgb, var(--shc-cream) 14%, transparent);
  border-radius: 6px;

  pointer-events: none;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shc-footer__inner {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 60px 24px 48px;
}

.shc-footer__hy {
  width: 64px;
  height: auto;

  object-fit: contain;
}

.shc-footer__label {
  margin: 18px 0 0;

  color: var(--shc-cream);

  font-size: 10px;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shc-footer__names {
  margin: 8px 0 0;

  color: var(--shc-cream);

  font-family: "Carattere", "Times New Roman", serif;
  font-size: 30px;
  font-weight: 500;

  line-height: 1.3;
}

.shc-footer__names span {
  color: color-mix(in srgb, var(--shc-cream) 70%, transparent);

  font-size: 24px;
}

.shc-footer__line {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 10px;

  margin: 18px 0;
}

.shc-footer__line span {
  width: 54px;
  height: 1px;

  background: color-mix(in srgb, var(--shc-cream) 40%, transparent);
}

.shc-footer__line i {
  color: var(--shc-cream);

  font-size: 13px;
  font-style: normal;
}

.shc-footer__thanks {
  margin: 0;

  color: var(--shc-cream);

  font-size: 13px;

  line-height: 1.7;

  white-space: pre-line;
}

.shc-footer__date {
  margin: 18px 0 0;
  padding: 8px 22px;

  border: 1px solid color-mix(in srgb, var(--shc-cream) 30%, transparent);
  border-radius: 999px;

  color: var(--shc-cream);

  font-size: 12px;

  letter-spacing: 0.12em;
}

.shc-footer__copyright {
  margin-top: 22px;

  color: color-mix(in srgb, var(--shc-cream) 60%, transparent);

  font-size: 10px;

  letter-spacing: 0.1em;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-footer__inner {
    width: min(100%, 600px);

    padding: 76px 5px 60px;
  }

  .shc-footer__hy {
    width: 84px;
  }

  .shc-footer__names {
    font-size: 38px;
  }

  .shc-footer__names span {
    font-size: 30px;
  }

  .shc-footer__thanks {
    font-size: 16px;
  }

  .shc-footer__date {
    font-size: 14px;
  }
}
</style>
