<template>
  <header class="mw-hero">
    <div class="mw-hero__names">
      <span class="mw-hero__name">{{ brideName }}</span>

      <span class="mw-hero__amp">&amp;</span>

      <span class="mw-hero__name">{{ groomName }}</span>
    </div>

    <p v-if="dateLabel" class="mw-hero__date">{{ dateLabel }}</p>
  </header>
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

  dateLabel: {
    type: String,
    default: "",
  },
});

const wedding = computed(() => props.wedding || {});

const groomName = computed(
  () =>
    wedding.value?.GroomName ||
    wedding.value?.groomName ||
    wedding.value?.hero?.GroomName ||
    wedding.value?.couple?.Groom?.Name ||
    ""
);

const brideName = computed(
  () =>
    wedding.value?.BrideName ||
    wedding.value?.brideName ||
    wedding.value?.hero?.BrideName ||
    wedding.value?.couple?.Bride?.Name ||
    ""
);
</script>

<style scoped>
.mw-hero {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 472px;

  padding: 0 24px;

  text-align: center;
}

.mw-hero__names {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mw-hero__name {
  color: var(--mw-blue);

  font-family: var(--mw-font-script);
  font-size: 50px;
  font-weight: 400;

  line-height: 1.5;
  white-space: nowrap;
}

.mw-hero__amp {
  margin-top: 4px;

  color: var(--mw-blue);

  font-family: var(--mw-font-script);
  font-size: 37px;

  line-height: 1.5;
}

.mw-hero__date {
  margin: 18px 0 0;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 12px;

  letter-spacing: 0.25em;
  text-transform: uppercase;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-hero {
    min-height: 650px;

    padding: 0 40px;
  }

  .mw-hero__name {
    font-size: 50px;

    line-height: 2.1;
  }

  .mw-hero__amp {
    font-size: 50px;

    line-height: 1.5;
  }

  .mw-hero__date {
    font-size: 14px;
  }
}
</style>
