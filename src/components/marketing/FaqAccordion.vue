<template>
  <div class="mk-faq-list">
    <article
      v-for="(item, index) in items"
      :key="item.q"
      class="mk-faq-item"
      :class="{ 'is-open': openIndex === index }"
    >
      <button
        type="button"
        class="mk-faq-q"
        :aria-expanded="openIndex === index"
        @click="toggle(index)"
      >
        <span>{{ item.q }}</span>

        <i class="mk-faq-sign" aria-hidden="true"></i>
      </button>

      <div class="mk-faq-a">
        <p>{{ item.a }}</p>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  items: { type: Array, default: () => [] },

  /*
   * Mở sẵn câu đầu tiên — giúp khối FAQ trông có nội
   * dung ngay thay vì một loạt thanh trống.
   */
  startOpen: { type: Boolean, default: true },
});

const openIndex = ref(props.startOpen ? 0 : -1);

function toggle(index) {
  openIndex.value = openIndex.value === index ? -1 : index;
}
</script>
