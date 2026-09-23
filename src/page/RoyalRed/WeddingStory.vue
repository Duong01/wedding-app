<template>
  <section class="rr-story">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <p v-if="eyebrow" class="rr-kicker">
      {{ eyebrow }}
    </p>

    <h2 class="rr-title">
      {{ heading }}
    </h2>


    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="rr-story__body">

      <span class="rr-story__quote rr-story__quote--open" aria-hidden="true">
        &ldquo;
      </span>

      <p class="rr-story__text">
        {{ text }}
      </p>

      <span class="rr-story__quote rr-story__quote--close" aria-hidden="true">
        &rdquo;
      </span>

    </div>

  </section>
</template>


<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";


/* =====================================================
   PROPS
===================================================== */

const props = defineProps({
  story: {
    type: [Object, Array],
    default: () => ({}),
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const eyebrow = computed(() =>
  sectionText(props.sections, "story", "Eyebrow")
);


/* =====================================================
   NỘI DUNG
===================================================== */

const items = computed(() => {
  if (Array.isArray(props.story)) {
    return props.story;
  }

  if (Array.isArray(props.story?.items)) {
    return props.story.items;
  }

  return props.story ? [props.story] : [];
});

const title = computed(
  () => props.story?.Title || props.story?.title || ""
);

const heading = computed(() =>
  sectionText(props.sections, "story", "Heading", title.value)
);

const text = computed(() => {
  const first = items.value[0] || {};

  return (
    first.Description ||
    first.Content ||
    first.Text ||
    first.content ||
    first.text ||
    props.story?.Description ||
    props.story?.description ||
    ""
  );
});
</script>


<style scoped>
/* =====================================================
   SECTION
===================================================== */

.rr-story {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 20px;

  width: 100%;

  padding: 0 24px;

  color: var(--rr-red);

  text-align: center;
}


/* =====================================================
   NỘI DUNG
===================================================== */

.rr-story__body {
  position: relative;

  width: 100%;
  max-width: 520px;

  padding: 0 24px;
}

.rr-story__text {
  margin: 0;

  font-size: 15px;

  line-height: 2;

  white-space: pre-line;
}

.rr-story__quote {
  position: absolute;

  color: var(--rr-red);

  font-family: Georgia, serif;
  font-size: 40px;

  line-height: 1;

  opacity: 0.35;
}

.rr-story__quote--open {
  top: -12px;
  left: 0;
}

.rr-story__quote--close {
  right: 0;
  bottom: -20px;
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .rr-story {
    gap: 28px;

    padding: 0 40px;
  }

  .rr-story__text {
    font-size: 16px;
  }
}
</style>
