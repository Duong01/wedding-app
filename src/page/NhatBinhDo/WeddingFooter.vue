<template>
  <footer class="cfr-footer">

    <span class="cfr-footer__eyebrow">
      {{ eyebrow }}
    </span>

    <h2 class="cfr-footer__names">
      {{ groomName }}
      <span class="cfr-footer__amp">&amp;</span>
      {{ brideName }}
    </h2>

    <div class="cfr-footer__line" aria-hidden="true">
      <span></span>
      <i>❖</i>
      <span></span>
    </div>

    <p class="cfr-footer__message">
      {{ thanksMessage }}
    </p>

    <div v-if="weddingDate" class="cfr-footer__date">
      {{ weddingDate }}
    </div>

    <small class="cfr-footer__copyright">
      {{ copyrightText }}
    </small>

  </footer>
</template>


<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";


const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },

  monogram: {
    type: String,
    default: "G&B",
  },

  currentYear: {
    type: Number,
    default: 2026,
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});

const wedding = computed(() => props.wedding || {});


/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const eyebrow = computed(() =>
  sectionText(props.sections, "footer", "Eyebrow")
);


const groomName = computed(() => {
  return (
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.footer?.GroomName ||
    wedding.value?.hero?.GroomName ||
    wedding.value?.couple?.Groom?.Name ||
    wedding.value?.groom?.name ||
    ""
  );
});

const brideName = computed(() => {
  return (
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.footer?.BrideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    wedding.value?.bride?.name ||
    ""
  );
});

const weddingDate = computed(() => {
  return (
    wedding.value?.weddingDate ||
    wedding.value?.hero?.WeddingDate ||
    wedding.value?.hero?.weddingDate ||
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
  return wedding.value?.footer?.Copyright || `© ${props.currentYear}`;
});
</script>


<style scoped>
/* =====================================================
   FOOTER
===================================================== */

.cfr-footer {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 10px;

  width: 100%;

  padding: 40px 24px 48px;

  color: var(--cfr-red-deep);

  text-align: center;
}

.cfr-footer__eyebrow {
  display: block;

  color: var(--cfr-red);

  font-family: var(--cfr-font-heading);
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.18em;
  line-height: 1.4;

  text-transform: uppercase;
}

.cfr-footer__names {
  margin: 0;

  color: var(--cfr-red);

  font-family: var(--cfr-font-name);
  font-size: 20px;
  font-weight: 400;

  letter-spacing: 0.04em;
  line-height: 1.3;

  text-transform: uppercase;
}

.cfr-footer__amp {
  color: var(--cfr-red-deep);

  font-family: var(--cfr-font-script);
  font-size: 24px;

  text-transform: none;
}

.cfr-footer__line {
  display: flex;
  align-items: center;

  gap: 10px;

  margin: 4px 0;
}

.cfr-footer__line span {
  width: 40px;
  height: 1px;

  background: linear-gradient(
    to right,
    transparent,
    color-mix(in srgb, var(--cfr-red) 50%, transparent)
  );
}

.cfr-footer__line span:last-child {
  background: linear-gradient(
    to left,
    transparent,
    color-mix(in srgb, var(--cfr-red) 50%, transparent)
  );
}

.cfr-footer__line i {
  color: var(--cfr-red);

  font-size: 11px;

  font-style: normal;
}

.cfr-footer__message {
  max-width: 420px;

  margin: 0;

  font-size: 14px;

  line-height: 1.6;
}

.cfr-footer__date {
  font-size: 13px;

  letter-spacing: 0.15em;

  opacity: 0.8;
}

.cfr-footer__copyright {
  margin-top: 8px;

  font-size: 12px;

  opacity: 0.6;
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .cfr-footer {
    gap: 12px;

    padding: 48px 40px 64px;
  }

  .cfr-footer__eyebrow {
    font-size: 12px;
  }

  .cfr-footer__names {
    font-size: 24px;
  }

  .cfr-footer__amp {
    font-size: 30px;
  }

  .cfr-footer__message {
    font-size: 16px;
  }

  .cfr-footer__date {
    font-size: 14px;
  }
}
</style>
