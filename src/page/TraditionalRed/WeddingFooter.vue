<template>
  <footer class="tr-footer">
    <p class="tr-footer__message">{{ thanksMessage }}</p>

    <a
      class="tr-footer__brand"
      :href="BRAND.siteUrl"
      target="_blank"
      rel="noopener noreferrer"
    >
      ♡ {{ BRAND.domain }}
    </a>
  </footer>
</template>

<script setup>
import { computed } from "vue";

import { BRAND } from "@/data/siteContent";

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },
});

/* =========================================================
   LỜI CẢM ƠN
========================================================= */

const thanksMessage = computed(
  () =>
    props.wedding?.footer?.Message ||
    "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!"
);
</script>

<style scoped>
/* =========================================================
   DẢI VÀNG CUỐI THIỆP
========================================================= */

.tr-footer {
  position: relative;

  z-index: 10;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 100%;

  padding: 24px 16px;

  text-align: center;

  background-color: #ffe3b1;

  color: #680e0e;
}

.tr-footer__message {
  margin: 0 auto;

  max-width: 560px;

  white-space: pre-line;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 12px;

  line-height: 1.6;
}

/* =========================================================
   THƯƠNG HIỆU
========================================================= */

.tr-footer__brand {
  margin-top: 12px;

  color: #680e0e;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 12px;

  text-decoration: none;

  opacity: 0.5;

  transition: opacity 0.2s ease;
}

.tr-footer__brand:hover {
  opacity: 0.75;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tr-footer {
    padding: 24px 32px;
  }

  .tr-footer__message {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .tr-footer__message {
    font-size: 18px;
  }
}
</style>
