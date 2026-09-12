<template>
  <div class="mobile-menu-overlay" @click.self="emit('close')">
    <div class="mobile-menu-sheet">
      <div class="sheet-handle"></div>

      <div class="sheet-header">
        <div>
          <span> WEDDING EDITOR </span>

          <strong> Chọn nội dung </strong>
        </div>

        <button
          type="button"
          class="sheet-close"
          @click="emit('close')"
        >
          <v-icon> mdi-close </v-icon>
        </button>
      </div>

      <div class="mobile-menu-list">
        <button
          v-for="item in menus"
          :key="item.id"
          type="button"
          class="mobile-menu-item"
          :class="{
            active: activeMenu === item.id,
          }"
          @click="emit('select', item.id)"
        >
          <span class="mobile-menu-icon">
            <v-icon size="19">
              {{ item.icon }}
            </v-icon>
          </span>

          <span>
            <strong>
              {{ item.label }}
            </strong>

            <small>
              {{ item.description }}
            </small>
          </span>

          <v-icon
            v-if="activeMenu === item.id"
            class="mobile-check"
            size="18"
          >
            mdi-check
          </v-icon>
        </button>

        <div class="mobile-menu-divider"></div>

        <button
          type="button"
          class="mobile-menu-item"
          :class="{
            active: activeMenu === 'settings',
          }"
          @click="emit('select', 'settings')"
        >
          <span class="mobile-menu-icon">
            <v-icon size="19"> mdi-tune-variant </v-icon>
          </span>

          <span>
            <strong> Cài đặt hiển thị </strong>

            <small> Bật / tắt nội dung </small>
          </span>

          <v-icon
            v-if="activeMenu === 'settings'"
            class="mobile-check"
            size="18"
          >
            mdi-check
          </v-icon>
        </button>

        <button
          type="button"
          class="mobile-menu-item"
          :class="{
            active: activeMenu === 'theme',
          }"
          @click="emit('select', 'theme')"
        >
          <span class="mobile-menu-icon">
            <v-icon size="19"> mdi-palette-outline </v-icon>
          </span>

          <span>
            <strong> Giao diện </strong>

            <small> Màu sắc & font </small>
          </span>

          <v-icon
            v-if="activeMenu === 'theme'"
            class="mobile-check"
            size="18"
          >
            mdi-check
          </v-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  menus: { type: Array, required: true },
  activeMenu: { type: String, required: true },
});

const emit = defineEmits(["select", "close"]);
</script>
