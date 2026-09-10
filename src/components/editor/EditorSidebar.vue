<template>
  <aside class="editor-sidebar">
    <div class="sidebar-scroll">
      <div class="sidebar-section-title">THIỆP CƯỚI</div>

      <button
        v-for="item in menus"
        :key="item.id"
        type="button"
        class="editor-menu"
        :class="{ active: activeMenu === item.id }"
        @click="$emit('select-menu', item.id)"
      >
        <span class="menu-icon">
          <v-icon size="18">
            {{ item.icon }}
          </v-icon>
        </span>

        <span class="menu-content">
          <strong>
            {{ item.label }}
          </strong>

          <small>
            {{ item.description }}
          </small>
        </span>
      </button>

      <div class="sidebar-divider"></div>

      <div class="sidebar-section-title">CẤU HÌNH</div>

      <button
        type="button"
        class="editor-menu"
        :class="{ active: activeMenu === 'settings' }"
        @click="$emit('select-menu', 'settings')"
      >
        <span class="menu-icon">
          <v-icon size="18"> mdi-tune-variant </v-icon>
        </span>

        <span class="menu-content">
          <strong>Cài đặt hiển thị</strong>

          <small> Bật / tắt nội dung </small>
        </span>
      </button>

      <button
        type="button"
        class="editor-menu"
        :class="{ active: activeMenu === 'theme' }"
        @click="$emit('select-menu', 'theme')"
      >
        <span class="menu-icon">
          <v-icon size="18"> mdi-palette-outline </v-icon>
        </span>

        <span class="menu-content">
          <strong>Giao diện</strong>

          <small> Màu sắc & font </small>
        </span>
      </button>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  menus: { type: Array, default: () => [] },
  activeMenu: { type: [String, Number], default: 'general' },
});
</script>

<style scoped>
/* Presentation handled by parent styles */
</style>
