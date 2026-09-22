<template>
  <header class="cfr-hero" aria-label="Đầu thiệp">
    <div class="cfr-hero__frame">
      <img :src="flowerFrame" alt="" aria-hidden="true" />

      <div class="cfr-hero__names">
        <div class="cfr-hero__slot">
          <span class="cfr-hero__name">{{ groomName }}</span>
        </div>

        <span class="cfr-hero__amp">&amp;</span>

        <div class="cfr-hero__slot">
          <span class="cfr-hero__name">{{ brideName }}</span>
        </div>
      </div>
    </div>
  </header>
</template>


<script setup>
import { computed } from "vue";

import { flowerFrame } from "./crystalFloralAssets";


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


/* ==========================================================
   TÊN CÔ DÂU CHÚ RỂ
========================================================== */

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
/* ==========================================================
   HERO
========================================================== */

.cfr-hero {
  position: relative;

  z-index: 20;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  padding: 72px 16px 24px;
}

.cfr-hero__frame {
  position: relative;

  width: 90%;
  max-width: 340px;
}

.cfr-hero__frame > img {
  position: relative;
  z-index: 10;

  display: block;

  width: 100%;
  height: auto;

  object-fit: contain;
}


/* ==========================================================
   TÊN
========================================================== */

.cfr-hero__names {
  position: absolute;
  inset: 0;

  z-index: 20;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: var(--cfr-red);

  font-family: "Viaoda Libre", "EB Garamond", cursive;

  line-height: 1;
  text-align: center;
  text-transform: uppercase;
}

.cfr-hero__slot {
  display: flex;
  justify-content: center;

  width: 48%;
}

.cfr-hero__name {
  padding-top: 0.16em;

  font-size: 30px;

  line-height: 1.25;
  white-space: nowrap;
}

.cfr-hero__amp {
  margin: 16px 0;

  color: var(--cfr-red);

  font-family: var(--cfr-font-script);
  font-size: 30px;

  line-height: 1;
  text-transform: none;

  opacity: 0.95;
}


/* ==========================================================
   DESKTOP
========================================================== */

@media (min-width: 900px) {
  .cfr-hero {
    padding: 100px 20px 40px;
  }

  .cfr-hero__frame {
    max-width: 520px;
  }

  .cfr-hero__amp {
    margin: 32px 0;
  }
}

@media (min-width: 1024px) {
  .cfr-hero__frame {
    max-width: 580px;
  }

  .cfr-hero__amp {
    margin: 40px 0;
  }
}
</style>
