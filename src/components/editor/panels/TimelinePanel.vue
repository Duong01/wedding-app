<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> WEDDING DAY </span>

        <h1>Timeline</h1>

        <p>Các mốc thời gian trong ngày cưới.</p>
      </div>

      <button
        type="button"
        class="small-primary-button"
        @click="addTimeline"
      >
        <v-icon size="17"> mdi-plus </v-icon>

        Thêm mốc
      </button>
    </div>

    <div class="items-list">
      <article
        v-for="(item, index) in wedding.timeline"
        :key="item.Id || index"
        class="editor-card timeline-card"
      >
        <div class="card-header">
          <div>
            <span> MỐC {{ index + 1 }} </span>

            <strong>
              {{ item.Title || "Chưa đặt tên" }}
            </strong>
          </div>

          <EditorItemActions
            :index="index"
            :total="wedding.timeline.length"
            remove-title="Xoá mốc"
            @move="moveTimeline"
            @remove="removeTimeline"
          />
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>Thời gian</label>

            <input v-model="item.Time" type="time" />
          </div>

          <div class="editor-field">
            <label>Tiêu đề</label>

            <input v-model="item.Title" type="text" />
          </div>

          <div class="editor-field">
            <label>Địa điểm</label>

            <input v-model="item.Location" type="text" />
          </div>

          <div class="editor-field">
            <label>Icon</label>

            <div class="icon-picker">
              <input v-model="item.Icon" type="text" placeholder="♡" />

              <div class="icon-suggestions">
                <button
                  v-for="icon in ICON_SUGGESTIONS"
                  :key="icon"
                  type="button"
                  class="icon-chip"
                  :class="{ active: item.Icon === icon }"
                  @click="item.Icon = icon"
                >
                  {{ icon }}
                </button>
              </div>
            </div>
          </div>

          <div class="editor-field full">
            <label>Mô tả</label>

            <textarea v-model="item.Description" rows="4" />
          </div>
        </div>
      </article>

      <div v-if="!wedding.timeline?.length" class="empty-card">
        <v-icon size="30"> mdi-timeline-outline </v-icon>

        <strong> Chưa có mốc thời gian </strong>

        <span> Thêm mốc đầu tiên để khách mời theo dõi ngày cưới. </span>
      </div>

      <button type="button" class="add-button" @click="addTimeline">
        <v-icon> mdi-plus </v-icon>

        Thêm mốc thời gian
      </button>
    </div>
  </section>
</template>

<script setup>
import EditorItemActions from "@/components/editor/EditorItemActions.vue";

import { confirmDialog } from "@/composables/useConfirm";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Bộ icon gợi ý — chọn nhanh thay vì phải tự tìm
 * ký tự ở nơi khác rồi dán vào.
 */
const ICON_SUGGESTIONS = [
  "♡",
  "❦",
  "✿",
  "❀",
  "✦",
  "❖",
  "✽",
  "囍",
  "💍",
  "🥂",
  "📸",
  "🎊",
];

function addTimeline() {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.timeline)) {
    props.wedding.timeline = [];
  }

  props.wedding.timeline.push({
    Id: Date.now(),
    Time: "",
    Title: "",
    Description: "",
    Location: "",
    Icon: "",
  });
}

async function removeTimeline(index) {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.timeline)) return;

  const item = props.wedding.timeline[index];

  const ok = await confirmDialog({
    title: "Xoá mốc thời gian này?",
    message: "Mốc sẽ bị xoá khỏi thiệp. Bạn vẫn hoàn tác được.",
    detail: item?.Title || `Mốc ${index + 1}`,
    confirmText: "Xoá mốc",
    danger: true,
  });

  if (!ok) {
    return;
  }

  props.wedding.timeline.splice(index, 1);
}

function moveTimeline(index, direction) {
  const list = props.wedding.timeline;

  const target = index + direction;

  if (!Array.isArray(list) || target < 0 || target >= list.length) {
    return;
  }

  const [item] = list.splice(index, 1);

  list.splice(target, 0, item);
}
</script>

<style scoped>
.icon-picker {
  display: flex;

  flex-direction: column;

  gap: 8px;
}

.icon-suggestions {
  display: flex;

  flex-wrap: wrap;

  gap: 5px;
}

.icon-chip {
  width: 30px;

  height: 30px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 8px;

  background: #fffdfb;

  color: #6b5a4e;

  font-size: 14px;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.icon-chip:hover {
  transform: translateY(-1px);

  border-color: var(--wine, #a63a2e);
}

.icon-chip.active {
  border-color: var(--wine, #a63a2e);

  background: rgba(166, 58, 46, 0.08);

  color: var(--wine, #a63a2e);
}
</style>
