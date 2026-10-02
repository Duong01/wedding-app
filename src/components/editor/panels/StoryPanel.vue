<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> OUR STORY </span>

        <h1>Chuyện tình yêu</h1>

        <p>Kể lại câu chuyện của hai bạn.</p>
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

        <strong> Văn bản </strong>

        <small> Một khối văn bản như hiện tại. </small>
      </button>

      <button
        type="button"
        class="mode-card"
        :class="{ active: isMilestoneMode }"
        @click="setMode('milestones')"
      >
        <v-icon size="20"> mdi-map-marker-multiple-outline </v-icon>

        <strong> Dấu mốc </strong>

        <small>
          Nhiều mốc thời gian — dạng bản đồ hành trình.
        </small>
      </button>
    </div>

    <!-- =====================================================
         CHẾ ĐỘ VĂN BẢN
    ====================================================== -->

    <template v-if="isTextMode">
      <div class="editor-field">
        <label>Tiêu đề</label>

        <input
          v-model="wedding.story.Title"
          type="text"
          placeholder="VD: Chuyện của chúng mình"
        />

        <small class="field-help">
          Tiêu đề của mục trên thiệp. Bỏ trống dùng "Chuyện Tình Yêu".
        </small>
      </div>

      <div class="editor-field">
        <label>Nội dung</label>

        <textarea
          v-model="wedding.story.Description"
          rows="12"
          placeholder="Viết câu chuyện tình yêu..."
        />

        <small class="field-help">
          Gợi ý: bắt đầu từ lúc hai bạn gặp nhau, khoảnh khắc nhớ nhất,
          rồi đến lời cầu hôn. 150–300 từ là vừa đẹp.
        </small>

        <div class="story-meta">
          <span>
            {{ wordCount }} từ · {{ (wedding.story.Description || "").length }}
            ký tự
          </span>

          <span v-if="readingTime"> ~{{ readingTime }} phút đọc </span>
        </div>
      </div>

      <!-- =====================================================
           GỢI Ý NỘI DUNG
      ====================================================== -->

      <div class="story-ideas">
        <div class="story-ideas-head">
          <v-icon size="17"> mdi-lightbulb-on-outline </v-icon>

          <strong> Gợi ý mở đầu </strong>
        </div>

        <p class="story-ideas-hint">
          Bấm để chèn vào cuối nội dung, rồi sửa lại theo câu chuyện của bạn.
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
        <label>Tiêu đề</label>

        <input
          v-model="wedding.story.Title"
          type="text"
          placeholder="VD: Hành trình của chúng mình"
        />

        <small class="field-help">
          Tiêu đề của mục trên thiệp. Bỏ trống dùng "Chuyện Tình Yêu".
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
              <span> MỐC {{ index + 1 }} </span>

              <strong>
                {{ item.Title || "Chưa đặt tên" }}
              </strong>
            </div>

            <EditorItemActions
              :index="index"
              :total="wedding.storyMilestones.length"
              remove-title="Xoá mốc"
              @move="moveMilestone"
              @remove="removeMilestone"
            />
          </div>

          <div class="form-grid">
            <div class="editor-field">
              <label>Thời điểm</label>

              <input
                v-model="item.Date"
                type="text"
                placeholder="VD: Mùa hè 2018"
              />

              <small class="field-help">
                Chuỗi tự do — "Mùa hè 2018", "Tháng 3 năm 2020"...
              </small>
            </div>

            <div class="editor-field">
              <label>Tiêu đề</label>

              <input
                v-model="item.Title"
                type="text"
                placeholder="VD: Lần đầu gặp nhau"
              />

              <small class="field-help">
                VD: Lần đầu gặp nhau, Lời tỏ tình, Ngày cầu hôn...
              </small>
            </div>

            <div class="editor-field full">
              <label>Mô tả</label>

              <textarea
                v-model="item.Description"
                rows="4"
                placeholder="Kể ngắn về khoảnh khắc này..."
              />
            </div>

            <div class="editor-field full">
              <label>Ảnh (tùy chọn)</label>

              <UploadField
                v-model="item.Image"
                kind="image"
                button-text="Tải ảnh lên"
                compact
              />
            </div>
          </div>
        </article>

        <div v-if="!wedding.storyMilestones?.length" class="empty-card">
          <v-icon size="30"> mdi-map-marker-multiple-outline </v-icon>

          <strong> Chưa có dấu mốc </strong>

          <span>
            Thêm mốc đầu tiên — lần gặp nhau, tỏ tình, cầu hôn...
          </span>
        </div>

        <button type="button" class="add-button" @click="addMilestone">
          <v-icon> mdi-plus </v-icon>

          Thêm dấu mốc
        </button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed } from "vue";

import EditorItemActions from "@/components/editor/EditorItemActions.vue";
import UploadField from "@/components/editor/UploadField.vue";

import { confirmDialog } from "@/composables/useConfirm";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Gợi ý mở đầu — giúp người dùng không bị "trắng trang"
 * khi chưa biết viết gì.
 */
const STORY_IDEAS = [
  "Chúng mình gặp nhau lần đầu vào...",
  "Điều mình nhớ nhất về người ấy là...",
  "Sau bao nhiêu năm, điều không đổi là...",
  "Ngày hôm đó trời...",
];

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
    title: "Xoá dấu mốc này?",
    message: "Mốc sẽ bị xoá khỏi thiệp. Bạn vẫn hoàn tác được.",
    detail: item?.Title || `Mốc ${index + 1}`,
    confirmText: "Xoá mốc",
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
