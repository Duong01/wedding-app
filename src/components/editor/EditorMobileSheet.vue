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

      <!-- =====================================================
           TÌM MỤC NHANH
      ====================================================== -->

      <div class="sheet-search">
        <v-icon size="17"> mdi-magnify </v-icon>

        <input
          v-model="keyword"
          type="text"
          placeholder="Tìm mục cần sửa..."
        />

        <button
          v-if="keyword"
          type="button"
          class="sheet-search-clear"
          title="Xoá tìm kiếm"
          @click="keyword = ''"
        >
          <v-icon size="15"> mdi-close </v-icon>
        </button>
      </div>

      <div class="mobile-menu-list">
        <p v-if="keyword && !filteredMenus.length" class="sheet-empty">
          Không có mục nào khớp "{{ keyword }}".
        </p>

        <template v-for="group in visibleGroups" :key="group.id">
          <div class="mobile-menu-group">
            {{ group.label }}
          </div>

          <button
            v-for="item in group.items"
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

            <span
              v-else-if="completion[item.id]"
              class="mobile-done"
              title="Đã có nội dung"
            >
              <v-icon size="13"> mdi-check </v-icon>
            </span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  menus: { type: Array, required: true },
  activeMenu: { type: String, required: true },
  completion: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["select", "close"]);

const GROUP_LABELS = {
  content: "NỘI DUNG THIỆP",
  guests: "KHÁCH MỜI",
  config: "CẤU HÌNH",
};

const groups = computed(() => {
  const result = [];

  props.menus.forEach((item) => {
    const id = item.group || "content";

    let group = result.find((entry) => entry.id === id);

    if (!group) {
      group = { id, label: GROUP_LABELS[id] || "KHÁC", items: [] };

      result.push(group);
    }

    group.items.push(item);
  });

  return result;
});

const keyword = ref("");

const filteredMenus = computed(() => {
  const query = keyword.value.trim().toLowerCase();

  if (!query) {
    return props.menus;
  }

  return props.menus.filter((item) => {
    return (
      item.label.toLowerCase().includes(query) ||
      String(item.description || "")
        .toLowerCase()
        .includes(query)
    );
  });
});

const visibleGroups = computed(() => {
  if (keyword.value.trim()) {
    return [{ id: "search", label: "KẾT QUẢ", items: filteredMenus.value }];
  }

  return groups.value;
});
</script>

<style scoped>
.sheet-search {
  display: flex;

  align-items: center;

  gap: 9px;

  margin: 0 18px 12px;

  padding: 0 12px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 11px;

  background: #fffdfb;

  color: #a8988a;
}

.sheet-search:focus-within {
  border-color: var(--wine, #a63a2e);

  box-shadow: 0 0 0 3px rgba(166, 58, 46, 0.09);
}

.sheet-search input {
  flex: 1;

  min-width: 0;

  border: 0;

  outline: none;

  background: transparent;

  color: #2b2118;

  padding: 10px 0;

  font-family: inherit;
  font-size: 13px;
}

.sheet-search-clear {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 24px;

  height: 24px;

  border: 0;

  border-radius: 7px;

  background: #f4eee6;

  color: #6b5a4e;

  cursor: pointer;
}

.mobile-menu-group {
  padding: 14px 18px 6px;

  color: #a8988a;

  font-size: 9.5px;
  font-weight: 700;

  letter-spacing: 0.14em;
}

.sheet-empty {
  margin: 0 18px 12px;

  color: #a8988a;

  font-size: 12px;
}

.mobile-done {
  flex: 0 0 auto;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 18px;

  height: 18px;

  border-radius: 50%;

  background: rgba(46, 125, 50, 0.12);

  color: #2e7d32;
}
</style>
