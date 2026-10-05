<template>
  <section class="la-countdown">
    <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
    <header v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="la-top-custom-head">
      <p v-if="sectionOverride(sections, 'countdown', 'Eyebrow')" class="la-top-custom-head__eyebrow">{{ sectionOverride(sections, "countdown", "Eyebrow") }}</p>
    </header>

    <h2 class="la-title">{{ sectionText(sections, "countdown", "Heading", $t("Cùng đếm ngược")) }}</h2>

    <p class="la-lead">{{ $t("Từng giây trôi qua là một bước gần hơn đến ngày chúng mình chung đôi") }}</p>

    <div class="la-countdown__grid">
      <article v-for="item in values" :key="item.label" class="la-countdown__item">
        <b>{{ item.value }}</b>

        <span>{{ item.label }}</span>
      </article>
    </div>
  </section>
</template>

<script setup>
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed, onMounted, onUnmounted, ref } from "vue";
import dayjs from "dayjs";
import { t } from "@/lang";
const props = defineProps({
  sections: { type: Object, default: () => ({}) },
  countdown: { type: [String, Date, Object], default: "" },
  weddingDate: { type: [String, Date], default: "" },
});

const now = ref(Date.now());

let timer;

onMounted(() => {
  timer = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
});

onUnmounted(() => window.clearInterval(timer));

const target = computed(() => props.countdown?.Target || props.countdown || props.weddingDate);

const values = computed(() => {
  const seconds = Math.max(0, dayjs(target.value).diff(dayjs(now.value), "second"));

  return [
    [t("NGÀY"), Math.floor(seconds / 86400)],
    [t("GIỜ"), Math.floor((seconds % 86400) / 3600)],
    [t("PHÚT"), Math.floor((seconds % 3600) / 60)],
    [t("GIÂY"), seconds % 60],
  ].map(([label, value]) => ({
    label,
    value: String(value).padStart(2, "0"),
  }));
});
</script>

<style scoped>
.la-countdown {
  text-align: center;
}

.la-countdown__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  margin-top: 20px;
}

.la-countdown__item {
  padding: 14px 2px;

  border: 1px solid var(--la-hairline);
  border-radius: 14px;

  background-color: var(--la-blush);
}

.la-countdown__item b {
  display: block;

  margin-bottom: 4px;

  color: var(--la-red);

  font-family: var(--font-num, "Be Vietnam Pro", "Segoe UI", system-ui, sans-serif);
  font-size: clamp(22px, 7vw, 30px);
  font-weight: 500;

  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.la-countdown__item span {
  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 10px;
  font-weight: 300;

  letter-spacing: 0.14em;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-countdown__grid {
    gap: 14px;

    max-width: 560px;

    margin: 24px auto 0;
  }

  .la-countdown__item {
    padding: 20px 4px;
  }

  .la-countdown__item b {
    font-size: 34px;
  }

  .la-countdown__item span {
    font-size: 11px;
  }
}

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.la-top-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.la-top-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.la-top-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.la-top-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
