<template>
  <section class="dh-story">
    <p class="dh-eyebrow">CÂU CHUYỆN CỦA CHÚNG MÌNH</p>

    <h2>{{ storyTitle }}</h2>

    <div class="dh-quote">“</div>

    <p>{{ content }}</p>

    <div class="dh-tail">囍</div>
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
  typeof props.story === "object" ? props.story?.Title || "Love story" : "Love story"
);
</script>

<style scoped>
.dh-story {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-gold: #d9a441;
  --dh-ink: #5a3d2e;

  text-align: center;

  color: var(--dh-ink);
}

.dh-eyebrow {
  margin: 0;

  color: var(--dh-red-bright);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.dh-story h2 {
  margin: 6px 0 4px;

  font-family: "Allura", cursive;
  font-size: clamp(30px, 8vw, 40px);
  font-weight: 400;

  color: var(--dh-red);
}

.dh-quote {
  height: 35px;

  color: var(--dh-gold);

  font: 64px Georgia, serif;
  line-height: 1;
}

.dh-story p {
  max-width: 400px;
  margin: 0 auto;

  font-size: clamp(15px, 4.2vw, 18px);
  font-style: italic;

  line-height: 1.7;
}

.dh-tail {
  margin-top: 18px;

  color: var(--dh-gold);

  font-size: 16px;
}
</style>
