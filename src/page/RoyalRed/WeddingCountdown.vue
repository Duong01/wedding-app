<template>
  <section class="rr-countdown">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="rr-top-custom-head">
      <p v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="rr-top-custom-head__eyebrow">{{ sectionOverride(sections, "countdown", "Eyebrow") }}</p>
    </header>

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

import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { t } from "@/lang";
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
  sectionText(props.sections, "countdown", "Heading", t("Đếm ngược"))
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
  position: relative;

  padding: 14px 4px;

  border: 1px solid var(--rr-card-border, var(--rr-hairline));
  border-radius: 8px;

  background-color: var(--rr-white, #fff9ed);

  box-shadow: 0 6px 16px rgba(92, 8, 12, 0.1);

  text-align: center;
}

.rr-countdown__box::before {
  content: "";

  position: absolute;
  inset: 3px;

  border: 1px solid var(--rr-card-inner, var(--rr-hairline-soft));
  border-radius: 5px;

  pointer-events: none;
}

.rr-countdown__number {
  display: block;

  color: var(--rr-red);

  font-family: var(--font-num, "Be Vietnam Pro", "Segoe UI", system-ui, sans-serif);
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

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.rr-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.rr-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.rr-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.rr-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
