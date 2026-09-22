<template>
  <section class="shy-story">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="shy-bar">CÂU CHUYỆN CỦA CHÚNG MÌNH</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shy-story__inner">
      <h3 v-if="storyTitle" class="shy-story__title">{{ storyTitle }}</h3>

      <p class="shy-story__quote" aria-hidden="true">“</p>

      <p class="shy-story__content">{{ content }}</p>

      <p class="shy-story__tail" aria-hidden="true">❦</p>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({ story: { type: [String, Object], default: "" } });

const content = computed(() =>
  typeof props.story === "string"
    ? props.story
    : props.story?.Content || props.story?.Description || props.story?.Text || ""
);

const storyTitle = computed(() =>
  typeof props.story === "object" ? props.story?.Title || "" : ""
);
</script>

<style scoped>
.shy-story {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);

  position: relative;

  overflow: hidden;

  color: var(--shy-ink);

  background-color: var(--shy-bg);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   THANH TIÊU ĐỀ ĐỎ
========================================================= */

.shy-bar {
  margin: 0;

  padding: 12px 16px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shy-story__inner {
  width: min(100%, 441px);

  margin: 0 auto;

  padding: 28px 8px 36px;

  text-align: center;
}

.shy-story__title {
  margin: 0 0 4px;

  color: var(--shy-red);

  font-family: "EB Garamond", "Times New Roman", serif;
  font-size: 30px;
  font-weight: 500;

  line-height: 1.2;
}

.shy-story__quote {
  height: 30px;

  margin: 0;

  color: color-mix(in srgb, var(--shy-red) 35%, transparent);

  font-family: Georgia, serif;
  font-size: 58px;

  line-height: 1;
}

.shy-story__content {
  max-width: 400px;
  margin: 0 auto;

  color: var(--shy-ink);

  font-size: 15px;
  font-style: italic;

  line-height: 1.7;

  white-space: pre-line;
}

.shy-story__tail {
  margin: 18px 0 0;

  color: var(--shy-red);

  font-size: 15px;

  letter-spacing: 0.2em;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-bar {
    padding: 16px;

    font-size: 24px;
  }

  .shy-story__inner {
    width: min(100%, 600px);

    padding: 36px 5px 44px;
  }

  .shy-story__title {
    font-size: 40px;
  }

  .shy-story__content {
    font-size: 19px;
  }
}
</style>
