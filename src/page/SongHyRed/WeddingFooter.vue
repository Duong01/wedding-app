<template>
  <footer class="shy-footer">
    <div class="shy-footer__inner">
      <div class="shy-footer__ring">
        <span class="shy-footer__ring-inner">{{ monogram }}</span>
      </div>

      <p class="shy-footer__label">SAVE THE DATE</p>

      <h2 class="shy-footer__names">
        {{ groomName }}

        <span>&amp;</span>

        {{ brideName }}
      </h2>

      <div class="shy-footer__line" aria-hidden="true">
        <span></span>
        <i>❦</i>
        <span></span>
      </div>

      <p class="shy-footer__thanks">{{ thanksMessage }}</p>

      <p v-if="weddingDate" class="shy-footer__date">{{ weddingDate }}</p>

      <small class="shy-footer__copyright">© {{ currentYear }} · {{ copyrightText }}</small>
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
    "CẢM ƠN BẠN ĐÃ ĐẾN CHUNG VUI\nCÙNG CHÚNG MÌNH"
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
.shy-footer {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);

  position: relative;

  width: 100%;
  min-height: 400px;

  box-sizing: border-box;

  overflow: hidden;

  color: var(--shy-ink);

  text-align: center;

  font-family: Baskerville, "Times New Roman", serif;

  background: var(--shy-bg);
}

/* =========================================================
   KHUNG VIỀN
========================================================= */

.shy-footer::before {
  content: "";

  position: absolute;

  inset: 14px;

  border: 1px solid color-mix(in srgb, var(--shy-red) 30%, transparent);
  border-radius: 10px;

  pointer-events: none;
}

.shy-footer::after {
  content: "";

  position: absolute;

  inset: 20px;

  border: 1px solid color-mix(in srgb, var(--shy-red) 14%, transparent);
  border-radius: 6px;

  pointer-events: none;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shy-footer__inner {
  position: relative;
  z-index: 2;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 60px 24px 48px;
}

.shy-footer__ring {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 84px;
  height: 84px;

  border: 1px solid var(--shy-red);
  border-radius: 50%;
}

.shy-footer__ring-inner {
  color: var(--shy-red);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 32px;

  line-height: 1;
}

.shy-footer__label {
  margin: 18px 0 0;

  color: var(--shy-ink);

  font-size: 10px;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.shy-footer__names {
  margin: 8px 0 0;

  color: var(--shy-red);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 30px;
  font-weight: 500;

  line-height: 1.3;
}

.shy-footer__names span {
  color: var(--shy-ink);

  font-size: 24px;
}

.shy-footer__line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin: 18px 0;
}

.shy-footer__line span {
  width: 54px;
  height: 1px;

  background: color-mix(in srgb, var(--shy-red) 40%, transparent);
}

.shy-footer__line i {
  color: var(--shy-red);

  font-size: 13px;
  font-style: normal;
}

.shy-footer__thanks {
  margin: 0;

  color: var(--shy-ink);

  font-size: 13px;

  line-height: 1.7;

  white-space: pre-line;
}

.shy-footer__date {
  margin: 18px 0 0;
  padding: 8px 22px;

  border: 1px solid color-mix(in srgb, var(--shy-red) 30%, transparent);
  border-radius: 999px;

  color: var(--shy-red);

  font-size: 12px;

  letter-spacing: 0.12em;
}

.shy-footer__copyright {
  margin-top: 22px;

  color: color-mix(in srgb, var(--shy-ink) 60%, transparent);

  font-size: 10px;

  letter-spacing: 0.1em;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-footer__inner {
    width: min(100%, 600px);

    padding: 76px 5px 60px;
  }

  .shy-footer__ring {
    width: 100px;
    height: 100px;
  }

  .shy-footer__ring-inner {
    font-size: 40px;
  }

  .shy-footer__names {
    font-size: 38px;
  }

  .shy-footer__names span {
    font-size: 30px;
  }

  .shy-footer__thanks {
    font-size: 16px;
  }

  .shy-footer__date {
    font-size: 14px;
  }
}
</style>
