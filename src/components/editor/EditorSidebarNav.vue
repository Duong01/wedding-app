<template>
  <aside class="editor-sidebar">
    <div class="sidebar-scroll">
      <!-- =====================================================
           TÌM MỤC NHANH
      ====================================================== -->

      <div class="sidebar-search">
        <v-icon size="16"> mdi-magnify </v-icon>

        <input
          v-model="keyword"
          type="text"
          placeholder="Tìm mục cần sửa..."
        />

        <button
          v-if="keyword"
          type="button"
          class="sidebar-search-clear"
          title="Xoá tìm kiếm"
          @click="keyword = ''"
        >
          <v-icon size="14"> mdi-close </v-icon>
        </button>
      </div>

      <p v-if="keyword && !filteredMenus.length" class="sidebar-empty">
        Không có mục nào khớp "{{ keyword }}".
      </p>

      <!-- =====================================================
           NHÓM MỤC
      ====================================================== -->

      <template v-for="group in visibleGroups" :key="group.id">
        <div class="sidebar-section-title">
          {{ group.label }}
        </div>

        <button
          v-for="item in group.items"
          :key="item.id"
          type="button"
          class="editor-menu"
          :class="{
            active: activeMenu === item.id,
          }"
          @click="emit('select', item.id)"
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

          <span
            v-if="completion[item.id]"
            class="menu-done"
            title="Đã có nội dung"
          >
            <v-icon size="13"> mdi-check </v-icon>
          </span>
        </button>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  menus: { type: Array, required: true },
  activeMenu: { type: String, required: true },

  /*
   * Bản đồ { menuId: true } cho những mục đã có nội
   * dung — hiện dấu tick để người dùng biết còn thiếu gì.
   */
  completion: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["select"]);

/* =====================================================
   NHÓM
===================================================== */

const GROUP_LABELS = {
  content: "NỘI DUNG THIỆP",
  guests: "KHÁCH MỜI",
  config: "CẤU HÌNH",
};

/*
 * Nhóm theo item.group nhưng giữ đúng thứ tự khai báo
 * trong menus — không phụ thuộc thứ tự key của object.
 */
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

/* =====================================================
   TÌM KIẾM
===================================================== */

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

/*
 * Khi đang tìm thì bỏ tiêu đề nhóm — kết quả trải đều
 * dễ nhìn hơn là nằm rải rác dưới 3 nhóm.
 */
const visibleGroups = computed(() => {
  if (keyword.value.trim()) {
    return [{ id: "search", label: "KẾT QUẢ", items: filteredMenus.value }];
  }

  return groups.value;
});
</script>

<style scoped>
.sidebar-search {
  display: flex;

  align-items: center;

  gap: 8px;

  margin: 0 0 14px;

  padding: 0 11px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 10px;

  background: #fffdfb;

  color: #a8988a;
}

.sidebar-search:focus-within {
  border-color: var(--wine, #a63a2e);

  box-shadow: 0 0 0 3px rgba(166, 58, 46, 0.09);
}

.sidebar-search input {
  flex: 1;

  min-width: 0;

  border: 0;

  outline: none;

  background: transparent;

  color: #2b2118;

  padding: 9px 0;

  font-family: inherit;
  font-size: 12.5px;
}

.sidebar-search-clear {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 22px;

  height: 22px;

  border: 0;

  border-radius: 6px;

  background: #f4eee6;

  color: #6b5a4e;

  cursor: pointer;
}

.sidebar-empty {
  margin: 0 0 12px;

  color: #a8988a;

  font-size: 11.5px;
}

.menu-done {
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
