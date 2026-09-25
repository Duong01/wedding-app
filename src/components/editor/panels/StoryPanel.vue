<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> OUR STORY </span>

        <h1>Chuyện tình yêu</h1>

        <p>Kể lại câu chuyện của hai bạn.</p>
      </div>
    </div>

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
  </section>
</template>

<script setup>
import { computed } from "vue";

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

  color: var(--wine, #a63a2e);
}

.story-ideas-head strong {
  color: #3a2c26;

  font-size: 12.5px;
}

.story-ideas-hint {
  margin: 6px 0 11px;

  color: #a8988a;

  font-size: 10.5px;

  line-height: 1.5;
}

.story-idea-list {
  display: flex;

  flex-wrap: wrap;

  gap: 7px;
}

.story-idea {
  padding: 7px 12px;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 999px;

  background: #fffdfb;

  color: #6b5a4e;

  font-family: inherit;
  font-size: 11px;

  text-align: left;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.story-idea:hover {
  transform: translateY(-1px);

  border-color: var(--wine, #a63a2e);

  color: var(--wine, #a63a2e);
}
</style>
