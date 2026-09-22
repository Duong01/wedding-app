<template>
  <header class="tr-hero">
    <!-- =====================================================
         DẢI VÀNG CHỮ HỶ
    ====================================================== -->

    <div class="tr-hero__band">
      <img :src="chuHy" alt="Chữ Hỷ" class="tr-hero__band-mark" />
    </div>

    <!-- =====================================================
         TÊN CÔ DÂU CHÚ RỂ
    ====================================================== -->

    <div class="tr-hero__names">
      <div class="tr-hero__name">{{ groomShort }}</div>
      <div class="tr-hero__amp">&amp;</div>
      <div class="tr-hero__name">{{ brideShort }}</div>
    </div>

    <!-- =====================================================
         CẶP PHƯỢNG - RỒNG
    ====================================================== -->

    <div class="tr-hero__pair">
      <div class="tr-hero__pair-item tr-hero__pair-item--phuong">
        <img :src="phuong" alt="Phượng" />
      </div>

      <div class="tr-hero__pair-item tr-hero__pair-item--rong">
        <img :src="rong" alt="Rồng" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";

import { chuHy, phuong, rong } from "./traditionalRedAssets";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },
});

const groomShort = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    "Chú rể"
);

const brideShort = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    "Cô dâu"
);
</script>

<style scoped>
/* =========================================================
   HERO
========================================================= */

.tr-hero {
  position: relative;

  z-index: 10;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding-top: 64px;
  padding-bottom: 32px;

  text-align: center;
}

/* =========================================================
   DẢI VÀNG
========================================================= */

.tr-hero__band {
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;

  padding: 12px 0;

  margin-bottom: 32px;

  background-color: #ffe3b1;
}

.tr-hero__band-mark {
  width: 32px;
  height: 32px;

  object-fit: contain;
}

/* =========================================================
   TÊN
========================================================= */

.tr-hero__names {
  display: flex;

  flex-direction: column;

  align-items: center;

  color: #ffe3b1;

  font-family: "The Nautigal", "Great Vibes", cursive;
}

.tr-hero__name {
  font-size: 50px;

  line-height: 1.2;
}

.tr-hero__amp {
  font-size: 38px;

  line-height: 1.2;
}

/* =========================================================
   CẶP PHƯỢNG - RỒNG
========================================================= */

.tr-hero__pair {
  position: relative;

  display: flex;

  align-items: flex-start;
  justify-content: center;

  gap: 8px;

  width: 100%;
  max-width: 420px;

  margin-top: 32px;
}

.tr-hero__pair-item {
  width: 160px;
  height: 240px;
}

.tr-hero__pair-item img {
  width: 100%;
  height: 100%;

  object-fit: contain;
}

.tr-hero__pair-item--rong {
  width: 170px;

  margin-top: 32px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tr-hero {
    padding-top: 64px;
    padding-bottom: 32px;
  }

  .tr-hero__band {
    padding: 16px 0;
  }

  .tr-hero__band-mark {
    width: 48px;
    height: 48px;
  }

  .tr-hero__name {
    font-size: 60px;
  }

  .tr-hero__amp {
    font-size: 45px;
  }

  .tr-hero__pair {
    gap: 16px;

    max-width: 520px;
  }

  .tr-hero__pair-item {
    width: 220px;
    height: 330px;
  }

  .tr-hero__pair-item--rong {
    width: 230px;

    margin-top: 48px;
  }
}

/* =========================================================
   MOBILE NHỎ
========================================================= */

@media (max-width: 380px) {
  .tr-hero__name {
    font-size: 42px;
  }

  .tr-hero__amp {
    font-size: 32px;
  }

  .tr-hero__pair-item {
    width: 140px;
    height: 210px;
  }

  .tr-hero__pair-item--rong {
    width: 148px;
  }
}
</style>
