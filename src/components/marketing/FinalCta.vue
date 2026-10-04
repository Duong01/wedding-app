<template>
  <section class="mk-final">
    <div class="mk-container">
      <div class="mk-final__box">
        <span class="mk-final__seal" aria-hidden="true">囍</span>

        <h2>
          {{ title || $t("finalCta.title") }}
          <em>{{ titleAccent || $t("finalCta.accent") }}</em>
        </h2>

        <p>{{ text || $t("finalCta.text") }}</p>

        <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--light">
          {{ cta || $t("footer.createNow") }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  /* Bỏ trống → dùng câu mặc định theo ngôn ngữ giao diện ($t trong template) */
  title: { type: String, default: "" },
  titleAccent: { type: String, default: "" },
  text: { type: String, default: "" },
  cta: { type: String, default: "" },
});
</script>
