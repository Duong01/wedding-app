<template>
  <footer class="mw-footer">
    <div class="mw-footer__card">
      <p class="mw-footer__message">{{ thanksMessage }}</p>
    </div>

    <div class="mw-footer__names">
      <span>{{ groomName }}</span>

      <i>&amp;</i>

      <span>{{ brideName }}</span>
    </div>

    <div class="mw-footer__actions">
      <a
        v-if="facebookUrl"
        :href="facebookUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mw-footer__link"
      >
        Facebook
      </a>

      <a v-if="phoneUrl" :href="phoneUrl" class="mw-footer__link">
        {{ phoneDisplay }}
      </a>

      <a v-if="emailUrl" :href="emailUrl" class="mw-footer__link">
        {{ emailDisplay }}
      </a>
    </div>

    <p class="mw-footer__copyright">{{ copyrightText }}</p>
  </footer>
</template>

<script setup>
import { computed } from "vue";

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
});

const wedding = computed(() => props.wedding || {});

const groomName = computed(
  () =>
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.footer?.GroomName ||
    wedding.value?.hero?.GroomName ||
    wedding.value?.couple?.Groom?.Name ||
    ""
);

const brideName = computed(
  () =>
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.footer?.BrideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    ""
);

const thanksMessage = computed(
  () =>
    wedding.value?.footer?.Message ||
    "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!"
);

const copyrightText = computed(
  () =>
    wedding.value?.footer?.Copyright ||
    `© ${props.currentYear} · ${props.monogram}`
);

const facebookUrl = computed(() => {
  const raw =
    wedding.value?.footer?.Facebook ||
    wedding.value?.footer?.FacebookUrl ||
    wedding.value?.contact?.Facebook ||
    "";

  if (!raw) {
    return "";
  }

  return raw.startsWith("http") ? raw : `https://${raw}`;
});

const phoneDisplay = computed(
  () => wedding.value?.footer?.Phone || wedding.value?.contact?.Phone || ""
);

const phoneUrl = computed(() => {
  const raw = phoneDisplay.value;

  return raw ? `tel:${String(raw).replace(/[^\d+]/g, "")}` : "";
});

const emailDisplay = computed(
  () => wedding.value?.footer?.Email || wedding.value?.contact?.Email || ""
);

const emailUrl = computed(() => (emailDisplay.value ? `mailto:${emailDisplay.value}` : ""));
</script>

<style scoped>
.mw-footer {
  position: relative;
  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  width: 100%;
  max-width: 480px;

  margin: 0 auto;
  padding: 24px 24px 12px;

  text-align: center;
}

.mw-footer__card {
  width: 100%;
  max-width: 100%;

  padding: 16px 24px;

  border: 1px solid var(--mw-blue-soft);
  border-radius: 16px;

  background-color: var(--mw-blue-mist);
}

.mw-footer__message {
  margin: 0;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 14px;

  letter-spacing: 0.03em;
  line-height: 1.7;
  white-space: pre-line;
}

.mw-footer__names {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-top: 6px;

  color: var(--mw-blue);

  font-family: var(--mw-font-script);
  font-size: 22px;
}

.mw-footer__names i {
  color: var(--mw-ink-soft);

  font-size: 16px;
  font-style: normal;
}

.mw-footer__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.mw-footer__link {
  padding: 6px 14px;

  border: 1px solid var(--mw-hairline);
  border-radius: 999px;

  color: var(--mw-blue);

  font-family: var(--mw-font-serif);
  font-size: 12px;

  text-decoration: none;

  transition: background-color 0.25s ease;
}

.mw-footer__link:hover {
  background-color: var(--mw-hairline-soft);
}

.mw-footer__copyright {
  margin: 6px 0 0;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 11px;

  letter-spacing: 0.16em;

  opacity: 0.6;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-footer {
    max-width: 900px;

    padding: 32px 40px 16px;
  }

  .mw-footer__card {
    max-width: 600px;

    padding: 20px 32px;
  }

  .mw-footer__message {
    font-size: 18px;
  }

  .mw-footer__names {
    font-size: 26px;
  }
}
</style>
