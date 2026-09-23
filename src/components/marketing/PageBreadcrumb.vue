<template>
  <nav class="mk-crumb" aria-label="Đường dẫn">
    <router-link :to="{ name: 'Home' }">Trang chủ</router-link>

    <template v-for="item in trail" :key="item.label">
      <i aria-hidden="true">/</i>

      <router-link v-if="item.routeName" :to="{ name: item.routeName }">
        {{ item.label }}
      </router-link>

      <span v-else>{{ item.label }}</span>
    </template>
  </nav>
</template>

<script setup>
defineProps({
  /*
   * Mảng { label, routeName? } — mục cuối thường không có
   * routeName vì đó là trang đang mở.
   */
  trail: { type: Array, default: () => [] },
});
</script>
