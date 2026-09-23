<template>
  <footer class="rr-footer">

    <div class="rr-footer__band">
      <p class="rr-footer__message">
        {{ thanksMessage }}
      </p>
    </div>

    <div class="rr-footer__credit">
      <a
        :href="BRAND.siteUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="rr-footer__link"
      >
        ♡ {{ copyrightText }}
      </a>
    </div>

  </footer>
</template>


<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";
import { BRAND } from "@/data/siteContent";


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
  wedding: {
    type: Object,
    default: () => ({}),
  },

  monogram: {
    type: String,
    default: "G&B",
  },

  currentYear: {
    type: Number,
    default: 2026,
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


const wedding = computed(() => props.wedding || {});


/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const eyebrow = computed(() =>
  sectionText(props.sections, "footer", "Eyebrow")
);


/* =====================================================
   NỘI DUNG
===================================================== */

const thanksMessage = computed(() => {
  return (
    wedding.value?.footer?.Message ||
    eyebrow.value ||
    "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!"
  );
});

const copyrightText = computed(() => {
  return wedding.value?.footer?.Copyright || BRAND.domain;
});
</script>


<style scoped>
/* =====================================================
   FOOTER
===================================================== */

.rr-footer {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;

  color: var(--rr-red);

  text-align: center;
}

.rr-footer__band {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  padding: 24px 16px;

  background-color: var(--rr-red);

  color: var(--rr-cream);
}

.rr-footer__message {
  max-width: 560px;

  margin: 0;

  font-family: var(--rr-font-body);
  font-size: 12px;

  line-height: 1.6;

  white-space: pre-line;
}

.rr-footer__credit {
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 12px 0;
}

.rr-footer__link {
  color: var(--rr-red);

  font-size: 12px;

  text-decoration: none;

  opacity: 0.5;

  transition: opacity 0.2s ease;
}

.rr-footer__link:hover {
  opacity: 0.7;
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .rr-footer__message {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  .rr-footer__message {
    font-size: 18px;
  }
}
</style>
