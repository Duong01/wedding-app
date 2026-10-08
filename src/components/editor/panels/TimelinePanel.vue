<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> WEDDING DAY </span>

        <h1>{{ $t("sections.timeline") }}</h1>

        <p>{{ $t('timelinePanel.desc') }}</p>
      </div>

      <div class="panel-header-actions">
        <button
          type="button"
          class="small-primary-button"
          @click="addTimeline"
        >
          <v-icon size="17"> mdi-plus </v-icon>

          {{ $t('timelinePanel.add') }}
        </button>

        <PanelProgressBadge
          :done="progress?.done || 0"
          :total="progress?.total || 0"
        />
      </div>
    </div>

    <div class="items-list">
      <article
        v-for="(item, index) in wedding.timeline"
        :key="item.Id || index"
        class="editor-card timeline-card"
      >
        <div class="card-header">
          <div>
            <span> {{ $t('timelinePanel.itemLabel') }} {{ index + 1 }} </span>

            <strong>
              {{ item.Title || $t('panel.untitled') }}
            </strong>
          </div>

          <EditorItemActions
            :index="index"
            :total="wedding.timeline.length"
            :remove-title="$t('timelinePanel.remove')"
            @move="moveTimeline"
            @remove="removeTimeline"
          />
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>{{ $t('timelinePanel.time') }}</label>

            <input v-model="item.Time" type="time" />

            <small class="field-help">
              {{ $t('timelinePanel.timeHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('panel.title') }}</label>

            <input
              v-model="item.Title"
              type="text"
              :placeholder="$t('timelinePanel.titlePlaceholder')"
            />

            <small class="field-help">
              {{ $t('timelinePanel.titleHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('heroPanel.venue') }}</label>

            <input
              v-model="item.Location"
              type="text"
              :placeholder="$t('timelinePanel.venuePlaceholder')"
            />

            <small class="field-help">
              {{ $t('timelinePanel.venueHint') }}
            </small>
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
            <label>{{ $t('panel.description') }}</label>

            <textarea
              v-model="item.Description"
              rows="4"
              :placeholder="$t('timelinePanel.descPlaceholder')"
            />

            <small class="field-help">
              {{ $t('timelinePanel.descHint') }}
            </small>
          </div>
        </div>
      </article>

      <div v-if="!wedding.timeline?.length" class="empty-card">
        <v-icon size="30"> mdi-timeline-outline </v-icon>

        <strong> {{ $t('timelinePanel.empty') }} </strong>

        <span> {{ $t('timelinePanel.emptyHint') }} </span>
      </div>

      <button type="button" class="add-button" @click="addTimeline">
        <v-icon> mdi-plus </v-icon>

        {{ $t('timelinePanel.addFull') }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import EditorItemActions from "@/components/editor/EditorItemActions.vue";

import { confirmDialog } from "@/composables/useConfirm"; import PanelProgressBadge from "@/components/editor/PanelProgressBadge.vue";

const { t } = useI18n();

const props = defineProps({ /* { done, total } từ Editor.vue — badge hoàn thiện mục. */ progress: { type: Object, default: null },
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
    get title() { return t("timelinePanel.confirmTitle"); },
    get message() { return t("timelinePanel.confirmMessage"); },
    detail: item?.Title || t("timelinePanel.itemN", { n: index + 1 }),
    get confirmText() { return t("timelinePanel.remove"); },
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
