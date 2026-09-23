<template>
  <header class="rr-hero">

    <!-- =====================================================
         TÊN CÔ DÂU CHÚ RỂ
    ====================================================== -->

    <div class="rr-hero__names">
      <span class="rr-hero__name">{{ groom }}</span>

      <span class="rr-hero__name rr-hero__name--second">
        {{ bride }}
      </span>
    </div>


    <!-- =====================================================
         KHỐI ẢNH + BĂNG MÀU
    ====================================================== -->

    <div class="rr-hero__stage">

      <span class="rr-hero__band" aria-hidden="true"></span>

      <img
        :src="flower"
        class="rr-hero__bloom rr-hero__bloom--left"
        alt=""
        aria-hidden="true"
      />

      <img
        :src="flower"
        class="rr-hero__bloom rr-hero__bloom--right"
        alt=""
        aria-hidden="true"
      />

      <div class="rr-hero__seal">
        <span>{{ monogram }}</span>
      </div>

    </div>


    <!-- =====================================================
         NGÀY CƯỚI
    ====================================================== -->

    <div class="rr-hero__meta">

      <p v-if="heroTitle" class="rr-hero__title">
        {{ heroTitle }}
      </p>

      <p v-if="dateLabel" class="rr-hero__date">
        {{ dateLabel }}
      </p>

      <p v-if="location" class="rr-hero__location">
        {{ location }}
      </p>

    </div>

  </header>
</template>


<script setup>
import { computed } from "vue";

import { flower } from "./royalRedAssets";


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

  sections: {
    type: Object,
    default: () => ({}),
  },
});


const groom = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    ""
);

const bride = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    ""
);

const heroTitle = computed(() => props.wedding?.hero?.Title || "");

const location = computed(
  () =>
    props.wedding?.hero?.Location ||
    props.wedding?.events?.[0]?.Location ||
    ""
);
</script>


<style scoped>
/* =====================================================
   HERO
===================================================== */

.rr-hero {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  padding: 48px 24px 40px;

  overflow: hidden;

  text-align: center;
}


/* =====================================================
   TÊN
===================================================== */

.rr-hero__names {
  display: flex;
  flex-direction: column;

  gap: 6px;

  width: 100%;
  max-width: 420px;

  margin-bottom: 28px;

  text-align: left;
}

.rr-hero__name {
  color: var(--rr-red);

  font-family: var(--rr-font-hero);
  font-size: 36px;
  font-weight: 400;

  letter-spacing: 0.01em;
  line-height: 1.11;

  text-transform: uppercase;
}

.rr-hero__name--second {
  margin-left: 34px;
}


/* =====================================================
   KHỐI ẢNH + BĂNG MÀU
===================================================== */

.rr-hero__stage {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 240px;
}

.rr-hero__band {
  position: absolute;
  left: 50%;

  top: 50%;

  width: 100vw;
  height: 96px;

  transform: translate(-50%, -50%);

  background-color: var(--rr-red);
}

.rr-hero__bloom {
  position: absolute;

  width: 200px;
  height: auto;

  object-fit: contain;

  opacity: 0.9;

  pointer-events: none;
}

.rr-hero__bloom--left {
  left: -70px;
  top: -10px;

  transform: rotate(-8deg);
}

.rr-hero__bloom--right {
  right: -70px;
  bottom: -10px;

  transform: scaleX(-1) rotate(-8deg);
}

.rr-hero__seal {
  position: relative;

  z-index: 2;

  display: grid;
  place-items: center;

  width: 140px;
  height: 140px;

  border-radius: 50%;

  background-color: var(--rr-cream);

  box-shadow: 0 0 0 1px var(--rr-red);
}

.rr-hero__seal span {
  color: var(--rr-red);

  font-family: var(--rr-font-name);
  font-size: 34px;

  letter-spacing: 0.04em;
}


/* =====================================================
   NGÀY CƯỚI
===================================================== */

.rr-hero__meta {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 6px;

  margin-top: 28px;
}

.rr-hero__title {
  margin: 0;

  color: var(--rr-red);

  font-family: var(--rr-font-heading);
  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.05em;
  line-height: 1.4;

  text-transform: uppercase;
}

.rr-hero__date {
  margin: 0;

  color: var(--rr-red);

  font-size: 14px;

  letter-spacing: 0.2em;
}

.rr-hero__location {
  margin: 0;

  color: var(--rr-red);

  font-size: 13px;

  line-height: 1.6;

  opacity: 0.75;
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .rr-hero {
    padding: 64px 40px 48px;
  }

  .rr-hero__names {
    max-width: 640px;

    margin-bottom: 36px;
  }

  .rr-hero__name {
    font-size: 52px;
  }

  .rr-hero__name--second {
    margin-left: 60px;
  }

  .rr-hero__stage {
    height: 400px;
  }

  .rr-hero__band {
    height: 180px;
  }

  .rr-hero__bloom {
    width: 360px;
  }

  .rr-hero__bloom--left {
    left: -130px;
  }

  .rr-hero__bloom--right {
    right: -130px;
  }

  .rr-hero__seal {
    width: 240px;
    height: 240px;
  }

  .rr-hero__seal span {
    font-size: 56px;
  }

  .rr-hero__title {
    font-size: 15px;
  }

  .rr-hero__date {
    font-size: 16px;
  }

  .rr-hero__location {
    font-size: 15px;
  }
}


/* =====================================================
   MÀN HÌNH NHỎ
===================================================== */

@media (max-width: 380px) {
  .rr-hero__name {
    font-size: 30px;
  }

  .rr-hero__name--second {
    margin-left: 24px;
  }

  .rr-hero__stage {
    height: 200px;
  }

  .rr-hero__seal {
    width: 116px;
    height: 116px;
  }

  .rr-hero__seal span {
    font-size: 28px;
  }
}
</style>
