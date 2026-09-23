<template>
  <section class="rr-countdown">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="rr-title">
      {{ heading }}
    </h2>


    <!-- =====================================================
         ĐỒNG HỒ
    ====================================================== -->

    <div class="rr-countdown__boxes">

      <div
        v-for="unit in units"
        :key="unit.key"
        class="rr-countdown__box"
      >
        <b class="rr-countdown__number">
          {{ values[unit.key] }}
        </b>

        <small class="rr-countdown__label">
          {{ unit.label }}
        </small>
      </div>

    </div>

  </section>
</template>


<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";

import { sectionText } from "@/data/sectionTitles";


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
  countdown: {
    type: Object,
    default: () => ({}),
  },

  weddingDate: {
    type: [String, Date],
    default: "",
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const heading = computed(() =>
  sectionText(props.sections, "countdown", "Heading", "Đếm ngược")
);


/* =====================================================
   ĐẾM NGƯỢC
===================================================== */

const end = computed(
  () =>
    props.countdown?.Date ||
    props.countdown?.Target ||
    props.countdown?.WeddingDate ||
    props.weddingDate
);

const values = ref({ d: "00", h: "00", m: "00", s: "00" });

const units = [
  { key: "d", label: "NGÀY" },
  { key: "h", label: "GIỜ" },
  { key: "m", label: "PHÚT" },
  { key: "s", label: "GIÂY" },
];

let timer;

function tick() {
  const diff = new Date(end.value).getTime() - Date.now();

  if (diff <= 0) return;

  values.value = {
    d: String(Math.floor(diff / 864e5)).padStart(2, "0"),
    h: String(Math.floor(diff / 36e5) % 24).padStart(2, "0"),
    m: String(Math.floor(diff / 6e4) % 60).padStart(2, "0"),
    s: String(Math.floor(diff / 1e3) % 60).padStart(2, "0"),
  };
}

onMounted(() => {
  tick();

  timer = setInterval(tick, 1000);
});

onUnmounted(() => clearInterval(timer));
</script>


<style scoped>
/* =====================================================
   SECTION
===================================================== */

.rr-countdown {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 24px;

  width: 100%;

  padding: 0 24px;

  color: var(--rr-red);
}


/* =====================================================
   ĐỒNG HỒ
===================================================== */

.rr-countdown__boxes {
  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 8px;

  width: 100%;
  max-width: 440px;
}

.rr-countdown__box {
  padding: 14px 4px;

  border: 1px solid var(--rr-hairline);
  border-radius: 8px;

  background-color: color-mix(in srgb, var(--rr-white) 40%, transparent);

  text-align: center;
}

.rr-countdown__number {
  display: block;

  color: var(--rr-red);

  font-size: 27px;
  font-weight: 500;

  line-height: 1.1;

  font-variant-numeric: tabular-nums;
}

.rr-countdown__label {
  display: block;

  margin-top: 6px;

  font-size: 10px;

  letter-spacing: 0.12em;
  line-height: 1.4;

  text-transform: uppercase;

  opacity: 0.75;
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .rr-countdown {
    gap: 32px;

    padding: 0 40px;
  }

  .rr-countdown__boxes {
    gap: 12px;
  }

  .rr-countdown__box {
    padding: 18px 6px;
  }

  .rr-countdown__number {
    font-size: 34px;
  }

  .rr-countdown__label {
    font-size: 11px;
  }
}
</style>
