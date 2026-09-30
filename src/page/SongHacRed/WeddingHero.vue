<template>
  <header class="shc-hero">
    <!-- =====================================================
         HOẠ TIẾT TRANG TRÍ (chữ hỷ, trăng, mây, hoa, hạc)
    ====================================================== -->

    <div class="shc-hero__decor" aria-hidden="true">
      <img
        class="shc-hero__hy"
        :src="doubleHappiness"
        alt=""
        draggable="false"
      />

      <img
        class="shc-hero__moon"
        :src="moonDecoration"
        alt=""
        draggable="false"
      />

      <img
        class="shc-hero__cloud shc-hero__cloud--1"
        :src="cloud1Decoration"
        alt=""
        draggable="false"
      />

      <img
        class="shc-hero__cloud shc-hero__cloud--2"
        :src="cloud2Decoration"
        alt=""
        draggable="false"
      />

      <img
        class="shc-hero__cloud shc-hero__cloud--3"
        :src="cloud1Decoration"
        alt=""
        draggable="false"
      />

      <img
        class="shc-hero__flower"
        :src="flower1Decoration"
        alt=""
        draggable="false"
      />

      <img
        class="shc-hero__bird shc-hero__bird--1"
        :src="birdDecoration"
        alt=""
        draggable="false"
      />

      <img
        class="shc-hero__bird shc-hero__bird--2"
        :src="birdDecoration"
        alt=""
        draggable="false"
      />
    </div>

    <!-- =====================================================
         HAI TÊN + DẤU "&" LỚN MỜ PHÍA SAU
    ====================================================== -->

    <div class="shc-hero__names">
      <span class="shc-hero__amp" aria-hidden="true">&amp;</span>

      <div class="shc-hero__pair">
        <p class="shc-hero__name shc-hero__name--groom">{{ groomName }}</p>

        <p class="shc-hero__name shc-hero__name--bride">{{ brideName }}</p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";

import {
  birdDecoration,
  cloud1Decoration,
  cloud2Decoration,
  doubleHappiness,
  flower1Decoration,
  moonDecoration,
} from "./songHacRedAssets";

const props = defineProps({
  wedding: { type: Object, default: () => ({}) },
  event: { type: Object, default: () => ({}) },
  guestName: { type: String, default: "Quý khách" },
  monogram: { type: String, default: "G&B" },
  dateLabel: { type: String, default: "" },
});

const groomName = computed(
  () =>
    props.wedding?.GroomName ||
    props.wedding?.groomName ||
    props.wedding?.hero?.GroomName ||
    props.wedding?.couple?.Groom?.Name ||
    ""
);

const brideName = computed(
  () =>
    props.wedding?.BrideName ||
    props.wedding?.brideName ||
    props.wedding?.hero?.BrideName ||
    props.wedding?.couple?.Bride?.Name ||
    ""
);
</script>

<style scoped>
.shc-hero {
  --shc-red: var(--primary, #920002);
  --shc-cream: var(--accent, #ffe8a4);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  color: var(--shc-cream);

  background-color: var(--shc-red);
}

/* =========================================================
   HOẠ TIẾT TRANG TRÍ
========================================================= */

.shc-hero__decor {
  position: relative;

  width: 100%;
  max-width: 441px;

  margin: 0 auto;

  aspect-ratio: 441 / 829;

  pointer-events: none;
}

.shc-hero__decor img {
  position: absolute;

  max-width: none;

  object-fit: contain;
}

/* Chữ hỷ trên đỉnh */

.shc-hero__hy {
  left: 50%;
  top: 75px;

  width: 17.69%;

  transform: translateX(-50%);
}

/* Trăng lưỡi liềm lớn */

.shc-hero__moon {
  left: 50%;
  top: 392px;

  width: 72.79%;

  transform: translateX(-50%);
}

/* Mây */

.shc-hero__cloud--1 {
  left: 39.91%;
  top: 428px;

  width: 49.66%;
}

.shc-hero__cloud--2 {
  left: 10.2%;
  top: 571px;

  width: 33.79%;

  transform: scaleX(-1);
}

.shc-hero__cloud--3 {
  left: 15.86%;
  top: 634px;

  width: 43.99%;

  transform: scaleX(-1);
}

/* Hoa */

.shc-hero__flower {
  left: 21.32%;
  top: 593px;

  width: 22.68%;
}

/* Chim hạc */

.shc-hero__bird--1 {
  left: -3.85%;
  top: 307px;

  width: 68.09%;
}

.shc-hero__bird--2 {
  left: 39.55%;
  top: 504px;

  width: 56.94%;
}

/* =========================================================
   HAI TÊN + DẤU "&"
========================================================= */

.shc-hero__names {
  position: absolute;
  left: 19.73%;
  top: 194px;

  z-index: 1;

  width: 60.32%;
}

.shc-hero__amp {
  position: absolute;
  left: 50.4%;
  top: -18px;

  transform: translateX(-50%);

  color: rgba(255, 237, 185, 0.1);

  font-family: "Whisper", cursive;
  font-size: 160px;
  line-height: 129px;

  user-select: none;

  pointer-events: none;
}

.shc-hero__pair {
  position: relative;

  display: flex;
  flex-direction: column;

  gap: 15px;
}

.shc-hero__name {
  margin: 0;

  color: var(--shc-cream);

  font-family: "Fraunces", "Times New Roman", serif;
  font-size: 30px;

  line-height: 1;

  text-transform: uppercase;

  overflow-wrap: anywhere;
}

.shc-hero__name--groom {
  width: 100%;

  text-align: left;
}

.shc-hero__name--bride {
  width: 100%;

  text-align: right;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-hero__decor {
    max-width: 600px;

    aspect-ratio: 600 / 1128;
  }

  .shc-hero__hy {
    top: 102px;
  }

  .shc-hero__moon {
    top: 534px;
  }

  .shc-hero__cloud--1 {
    top: 583px;
  }

  .shc-hero__cloud--2 {
    top: 777px;
  }

  .shc-hero__cloud--3 {
    top: 863px;
  }

  .shc-hero__flower {
    top: 807px;
  }

  .shc-hero__bird--1 {
    top: 418px;
  }

  .shc-hero__bird--2 {
    top: 686px;
  }

  .shc-hero__names {
    top: 264px;
  }

  .shc-hero__amp {
    top: -25px;

    font-size: 218px;
    line-height: 176px;
  }

  .shc-hero__pair {
    gap: 20px;
  }

  .shc-hero__name {
    font-size: 40px;
  }
}
</style>
