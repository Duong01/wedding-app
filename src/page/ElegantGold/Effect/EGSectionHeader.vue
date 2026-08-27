<template>
  <header
    class="eg-section-header"
    :class="{
      'eg-section-header--light': light
    }"
  >
    <!-- Eyebrow -->
    <div
      v-if="eyebrow"
      class="eg-eyebrow"
    >
      {{ eyebrow }}
    </div>

    <!-- Script -->
    <div
      v-if="script"
      class="eg-script"
    >
      {{ script }}
    </div>

    <!-- Title -->
    <h2 class="eg-heading">
      {{ title }}
    </h2>

    <!-- Divider -->
    <EGGildedDivider />

    <!-- Description -->
    <p
      v-if="description"
      class="eg-description"
    >
      {{ description }}
    </p>
  </header>
</template>

<script setup>
import EGGildedDivider from "./EGGildedDivider.vue";

defineProps({
  eyebrow: {
    type: String,
    default: "",
  },

  script: {
    type: String,
    default: "",
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  light: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.eg-section-header {
  width: 100%;
  max-width: 680px;

  margin: 0 auto 42px;

  text-align: center;
}

.eg-eyebrow {
  margin-bottom: 8px;

  color: var(--eg-accent);

  font-size: 12px;
  font-weight: 500;

  letter-spacing: 0.28em;

  text-transform: uppercase;
}

.eg-script {
  margin-bottom: 4px;

  color: var(--eg-accent);

  font-family:
    "Allura",
    cursive;

  font-size: 32px;

  line-height: 1;
}

.eg-heading {
  margin: 0;

  color: var(--eg-primary);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(34px, 5vw, 50px);

  line-height: 1.05;

  font-weight: 500;

  letter-spacing: -0.02em;
}

.eg-description {
  max-width: 560px;

  margin: 18px auto 0;

  color: var(--eg-text-soft);

  font-size:
    clamp(16px, 2vw, 19px);

  line-height: 1.7;
}

.eg-section-header--light .eg-heading {
  color: var(--eg-white);
}

.eg-section-header--light .eg-description {
  color: rgba(255, 255, 255, 0.75);
}

@media (max-width: 600px) {
  .eg-section-header {
    margin-bottom: 32px;
  }

  .eg-eyebrow {
    font-size: 10px;
    letter-spacing: 0.2em;
  }

  .eg-script {
    font-size: 28px;
  }

  .eg-heading {
    font-size: 34px;
  }

  .eg-description {
    font-size: 16px;
  }
}
</style>