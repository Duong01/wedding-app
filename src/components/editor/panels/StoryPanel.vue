<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> OUR STORY </span>

        <h1>{{ $t('editor.menu.story') }}</h1>

        <p>{{ $t('storyPanel.desc') }}</p>
      </div>
    </div>

    <!-- =====================================================
         CHỌN CHẾ ĐỘ
    ====================================================== -->

    <div class="mode-selector">
      <button
        type="button"
        class="mode-card"
        :class="{ active: isTextMode }"
        @click="setMode('text')"
      >
        <v-icon size="20"> mdi-text-long </v-icon>

        <strong> {{ $t('storyPanel.modeText') }} </strong>

        <small> {{ $t('storyPanel.modeTextHint') }} </small>
      </button>

      <button
        type="button"
        class="mode-card"
        :class="{ active: isMilestoneMode }"
        @click="setMode('milestones')"
      >
        <v-icon size="20"> mdi-map-marker-multiple-outline </v-icon>

        <strong> {{ $t('storyPanel.modeMilestones') }} </strong>

        <small>
          {{ $t('storyPanel.modeMilestonesHint') }}
        </small>
      </button>
    </div>

    <!-- =====================================================
         CHẾ ĐỘ VĂN BẢN
    ====================================================== -->

    <template v-if="isTextMode">
      <div class="editor-field">
        <label>{{ $t('panel.title') }}</label>

        <input
          v-model="wedding.story.Title"
          type="text"
          :placeholder="$t('storyPanel.titlePlaceholder')"
        />

        <small class="field-help">
          {{ $t('storyPanel.titleHint') }}
        </small>
      </div>

      <div class="editor-field">
        <label>{{ $t('storyPanel.content') }}</label>

        <textarea
          v-model="wedding.story.Description"
          rows="12"
          :placeholder="$t('storyPanel.contentPlaceholder')"
        />

        <small class="field-help">
          {{ $t('storyPanel.contentHint') }}
        </small>

        <div class="story-meta">
          <span>
            {{ $t("storyPanel.words", { n: wordCount }) }} ·
            {{ $t("common.chars", { n: (wedding.story.Description || "").length }) }}
          </span>

          <span v-if="readingTime"> {{ $t("storyPanel.readingTime", { n: readingTime }) }} </span>
        </div>
      </div>

      <!-- =====================================================
           GỢI Ý NỘI DUNG
      ====================================================== -->

      <div class="story-ideas">
        <div class="story-ideas-head">
          <v-icon size="17"> mdi-lightbulb-on-outline </v-icon>

          <strong> {{ $t('storyPanel.ideas') }} </strong>
        </div>

        <p class="story-ideas-hint">
          {{ $t('storyPanel.ideasHint') }}
        </p>

        <div class="story-idea-list">
          <button
            v-for="idea in STORY_IDEAS"
            :key="idea"
            type="button"
            class="story-idea"
            @click="appendIdea(idea)"
          >
            {{ idea }}
          </button>
        </div>
      </div>
    </template>

    <!-- =====================================================
         CHẾ ĐỘ DẤU MỐC
    ====================================================== -->

    <template v-else>
      <div class="editor-field">
        <label>{{ $t('panel.title') }}</label>

        <input
          v-model="wedding.story.Title"
          type="text"
          :placeholder="$t('storyPanel.milestonesTitlePlaceholder')"
        />

        <small class="field-help">
          {{ $t('storyPanel.titleHint') }}
        </small>
      </div>

      <div class="items-list">
        <article
          v-for="(item, index) in wedding.storyMilestones"
          :key="item.Id || index"
          class="editor-card"
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
              :total="wedding.storyMilestones.length"
              :remove-title="$t('timelinePanel.remove')"
              @move="moveMilestone"
              @remove="removeMilestone"
            />
          </div>

          <div class="form-grid">
            <div class="editor-field">
              <label>{{ $t('storyPanel.when') }}</label>

              <input
                v-model="item.Date"
                type="text"
                :placeholder="$t('storyPanel.whenPlaceholder')"
              />

              <small class="field-help">
                {{ $t('storyPanel.whenHint') }}
              </small>
            </div>

            <div class="editor-field">
              <label>{{ $t('panel.title') }}</label>

              <input
                v-model="item.Title"
                type="text"
                :placeholder="$t('storyPanel.milestonePlaceholder')"
              />

              <small class="field-help">
                {{ $t('storyPanel.milestoneTitleHint') }}
              </small>
            </div>

            <div class="editor-field full">
              <label>{{ $t('panel.description') }}</label>

              <textarea
                v-model="item.Description"
                rows="4"
                :placeholder="$t('storyPanel.milestoneDescPlaceholder')"
              />
            </div>

            <div class="editor-field full">
              <label>{{ $t('storyPanel.photoOptional') }}</label>

              <UploadField
                v-model="item.Image"
                kind="image"
                :button-text="$t('storyPanel.uploadPhoto')"
                compact
              />
            </div>
          </div>
        </article>

        <div v-if="!wedding.storyMilestones?.length" class="empty-card">
          <v-icon size="30"> mdi-map-marker-multiple-outline </v-icon>

          <strong> {{ $t('storyPanel.emptyMilestones') }} </strong>

          <span>
            {{ $t('storyPanel.emptyMilestonesHint') }}
          </span>
        </div>

        <button type="button" class="add-button" @click="addMilestone">
          <v-icon> mdi-plus </v-icon>

          {{ $t('storyPanel.addMilestone') }}
        </button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";

import EditorItemActions from "@/components/editor/EditorItemActions.vue";
import UploadField from "@/components/editor/UploadField.vue";

import { confirmDialog } from "@/composables/useConfirm";

const { t } = useI18n();

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Gợi ý mở đầu — giúp người dùng không bị "trắng trang"
 * khi chưa biết viết gì.
 */
/* computed: đổi ngôn ngữ giao diện là gợi ý đổi theo */
const STORY_IDEAS = computed(() => [
  t("storyPanel.idea1"),
  t("storyPanel.idea2"),
  t("storyPanel.idea3"),
  t("storyPanel.idea4"),
]);

function appendIdea(idea) {
  const current = props.wedding.story.Description || "";

  props.wedding.story.Description = current
    ? `${current.trimEnd()}\n\n${idea}`
    : idea;
}

/* =========================================================
   CHẾ ĐỘ HIỂN THỊ — text | milestones
========================================================= */

const isTextMode = computed(
  () => (props.wedding.story?.Mode || "text") !== "milestones"
);

const isMilestoneMode = computed(() => !isTextMode.value);

function setMode(mode) {
  if (!props.wedding.story) {
    props.wedding.story = { Title: "", Description: "", Mode: mode };

    return;
  }

  props.wedding.story.Mode = mode;
}

/* =========================================================
   DANH SÁCH DẤU MỐC
========================================================= */

function addMilestone() {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.storyMilestones)) {
    props.wedding.storyMilestones = [];
  }

  props.wedding.storyMilestones.push({
    Id: Date.now(),
    Date: "",
    Title: "",
    Description: "",
    Image: "",
  });
}

async function removeMilestone(index) {
  if (!Array.isArray(props.wedding.storyMilestones)) return;

  const item = props.wedding.storyMilestones[index];

  const ok = await confirmDialog({
    get title() { return t("storyPanel.confirmTitle"); },
    get message() { return t("timelinePanel.confirmMessage"); },
    detail: item?.Title || t("timelinePanel.itemN", { n: index + 1 }),
    get confirmText() { return t("timelinePanel.remove"); },
    danger: true,
  });

  if (!ok) {
    return;
  }

  props.wedding.storyMilestones.splice(index, 1);
}

function moveMilestone(index, direction) {
  const list = props.wedding.storyMilestones;

  const target = index + direction;

  if (!Array.isArray(list) || target < 0 || target >= list.length) {
    return;
  }

  const [item] = list.splice(index, 1);

  list.splice(target, 0, item);
}

/* =========================================================
   THỐNG KÊ VĂN BẢN
========================================================= */

const wordCount = computed(() => {
  const text = (props.wedding.story?.Description || "").trim();

  if (!text) {
    return 0;
  }

  return text.split(/\s+/).length;
});

/*
 * Ước lượng thời gian đọc theo 200 từ/phút — đủ để
 * người dùng biết nội dung có đang quá dài không.
 */
const readingTime = computed(() => {
  if (wordCount.value < 60) {
    return 0;
  }

  return Math.max(1, Math.round(wordCount.value / 200));
});
</script>

<style scoped>
.mode-selector {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;

  margin-bottom: 16px;
}

.mode-card {
  display: flex;

  flex-direction: column;
  align-items: flex-start;

  gap: 4px;

  padding: 13px 14px;

  border: 1px solid #d3c3ae;
  border-radius: 12px;

  background: rgba(255, 253, 251, 0.7);

  color: #6b5a4e;

  text-align: left;

  cursor: pointer;

  transition: border-color 0.2s ease, background 0.2s ease;
}

.mode-card.active {
  border-color: var(--wine, #a63a2e);

  background: rgba(166, 58, 46, 0.06);

  color: #3a2c26;
}

.mode-card strong {
  font-size: 13px;
}

.mode-card small {
  font-size: 10.5px;

  line-height: 1.4;
}

.story-meta {
  display: flex;

  justify-content: space-between;

  gap: 12px;

  color: #a8988a;

  font-size: 10.5px;
}

.story-ideas {
  margin-top: 8px;

  padding: 15px 16px;

  border: 1px dashed #d3c3ae;
  border-radius: 14px;

  background: rgba(255, 253, 251, 0.7);
}

.story-ideas-head {
  display: flex;

  align-items: center;

  gap: 7px;
}
</style>
