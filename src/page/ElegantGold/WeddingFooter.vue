<template>
  <footer class="la-footer">
    <img :src="thanks" alt="" class="la-footer__thanks" aria-hidden="true" />

    <p class="la-footer__message">{{ thanksMessage }}</p>

    <div class="la-footer__names">
      <span>{{ groomName }}</span>

      <i>&amp;</i>

      <span>{{ brideName }}</span>
    </div>

    <div class="la-footer__actions">
      <a v-if="facebookUrl" :href="facebookUrl" target="_blank" rel="noopener noreferrer" class="la-footer__link">
        Facebook
      </a>

      <a v-if="phoneUrl" :href="phoneUrl" class="la-footer__link">{{ phoneDisplay }}</a>

      <a v-if="emailUrl" :href="emailUrl" class="la-footer__link">{{ emailDisplay }}</a>
    </div>

    <p class="la-footer__copyright">{{ copyrightText }}</p>
  </footer>
</template>

<script setup>
import { computed } from "vue";

import thanks from "@/assets/love-art/thanks.webp";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },
  monogram: String,
  currentYear: Number,
});

const groomName = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.footer?.GroomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    ""
);

const brideName = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.footer?.BrideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    ""
);

const thanksMessage = computed(
  () =>
    props.wedding?.footer?.Message ||
    "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!"
);

const copyrightText = computed(
  () => props.wedding?.footer?.Copyright || `© ${props.currentYear ?? ""} · ${props.monogram ?? ""}`
);

const facebookUrl = computed(() => {
  const raw =
    props.wedding?.footer?.Facebook ||
    props.wedding?.footer?.FacebookUrl ||
    props.wedding?.contact?.Facebook ||
    "";

  if (!raw) return "";

  return raw.startsWith("http") ? raw : `https://${raw}`;
});

const phoneDisplay = computed(
  () => props.wedding?.footer?.Phone || props.wedding?.contact?.Phone || ""
);

const phoneUrl = computed(() => {
  const raw = phoneDisplay.value;

  return raw ? `tel:${String(raw).replace(/[^\d+]/g, "")}` : "";
});

const emailDisplay = computed(
  () => props.wedding?.footer?.Email || props.wedding?.contact?.Email || ""
);

const emailUrl = computed(() => {
  const raw = emailDisplay.value;

  return raw ? `mailto:${raw}` : "";
});
</script>

<style scoped>
.la-footer {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  max-width: 360px;

  margin: 0 auto;
  padding: 32px 16px 28px;

  text-align: center;
}

.la-footer__thanks {
  width: 100px;
  height: auto;

  margin-bottom: 12px;

  object-fit: contain;

  opacity: 0.8;
}

.la-footer__message {
  margin: 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 13px;
  font-weight: 300;

  line-height: 1.5;
  white-space: pre-line;
}

.la-footer__names {
  display: flex;
  align-items: center;
  gap: 8px;

  margin-top: 18px;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 18px;
  font-weight: 500;
}

.la-footer__names i {
  color: var(--la-ink);

  font-size: 15px;
  font-style: normal;
}

.la-footer__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 18px;
}

.la-footer__link {
  padding: 6px 14px;

  border: 1px solid var(--la-hairline);
  border-radius: 999px;

  color: var(--la-red);

  font-family: var(--la-font-hand);
  font-size: 12px;

  text-decoration: none;

  transition: background-color 0.25s ease;
}

.la-footer__link:hover {
  background-color: var(--la-hairline-soft);
}

.la-footer__copyright {
  margin: 24px 0 0;

  color: var(--la-ink-soft);

  font-family: var(--la-font-hand);
  font-size: 11px;

  letter-spacing: 0.16em;

  opacity: 0.6;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-footer {
    max-width: 640px;

    padding: 40px 40px 34px;
  }

  .la-footer__thanks {
    width: 124px;
  }

  .la-footer__message {
    max-width: 560px;

    font-size: 15px;
  }

  .la-footer__names {
    font-size: 20px;
  }
}
</style>
