<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> MINI GAME </span>

        <h1>{{ $t('editor.menu.game') }}</h1>

        <p>
          {{ $t('gamePanel.desc') }}
        </p>
      </div>

      <PanelProgressBadge
        :done="progress?.done || 0"
        :total="progress?.total || 0"
      />
    </div>

    <div class="switch-card">
      <div>
        <strong> {{ $t('gamePanel.show') }} </strong>

        <small>
          {{ $t('gamePanel.showHint') }}
        </small>
      </div>

      <v-switch
        v-model="wedding.settings.ShowGame"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field">
      <label>{{ $t('editor.menu.sections') }}</label>

      <input
        v-model="wedding.game.Title"
        type="text"
        :placeholder="$t('gamePanel.titlePlaceholder')"
      />

      <small class="field-help">
        {{ $t('gamePanel.titleHint') }}
      </small>
    </div>

    <!-- =====================================================
         CHỌN TRÒ CHƠI
    ====================================================== -->

    <h3 class="sub-heading">{{ $t('gamePanel.type') }}</h3>

    <p class="field-help block-help">
      {{ $t('gamePanel.typeHint') }}
    </p>

    <div class="mode-selector">
      <button
        v-for="type in GAME_TYPES"
        :key="type.value"
        type="button"
        class="mode-card"
        :class="{ active: wedding.game.GameType === type.value }"
        @click="wedding.game.GameType = type.value"
      >
        <v-icon size="20"> {{ type.icon }} </v-icon>

        <strong> {{ $t(`gamePanel.type.${type.value}`) }} </strong>

        <small> {{ $t(`gamePanel.typeDesc.${type.value}`) }} </small>
      </button>
    </div>

    <!-- =====================================================
         CẤU HÌNH THEO LOẠI
    ====================================================== -->

    <!-- TRẮC NGHIỆM: danh sách câu hỏi -->
    <template v-if="wedding.game.GameType === 'couple-quiz'">
      <h3 class="sub-heading">{{ $t('gamePanel.quiz') }}</h3>

      <p class="field-help block-help">
        {{ $t('gamePanel.quizHint') }}
      </p>

      <div class="items-list">
        <article
          v-for="(question, index) in wedding.gameQuestions"
          :key="question.Id || index"
          class="editor-card"
        >
          <div class="card-header">
            <div>
              <span> {{ $t('gamePanel.questionLabel') }} {{ index + 1 }} </span>

              <strong>
                {{ question.Question || $t('gamePanel.noQuestions') }}
              </strong>
            </div>

            <EditorItemActions
              :index="index"
              :total="wedding.gameQuestions.length"
              :remove-title="$t('gamePanel.removeQuestion')"
              @move="moveQuestion"
              @remove="removeQuestion"
            />
          </div>

          <div class="editor-field full">
            <label>{{ $t('gamePanel.question') }}</label>

            <input
              v-model="question.Question"
              type="text"
              :placeholder="$t('gamePanel.questionPlaceholder')"
            />
          </div>

          <div class="form-grid">
            <div
              v-for="key in ['A', 'B', 'C', 'D']"
              :key="key"
              class="editor-field"
            >
              <label>{{ $t('gamePanel.answers') }} {{ key }}</label>

              <input
                v-model="question[`Option${key}`]"
                type="text"
                :placeholder="$t('gamePanel.answerPlaceholder', { key })" /> </div> </div> <div class="editor-field full"> <label>{{ $t('gamePanel.correct') }}</label>

            <div class="correct-row">
              <button
                v-for="(key, optionIndex) in ['A', 'B', 'C', 'D']"
                :key="key"
                type="button"
                class="correct-btn"
                :class="{ active: question.CorrectIndex === optionIndex }"
                @click="question.CorrectIndex = optionIndex"
              >
                {{ key }}
              </button>
            </div>
          </div>
        </article>

        <div v-if="!wedding.gameQuestions?.length" class="empty-card">
          <v-icon size="30"> mdi-comment-question-outline </v-icon>

          <strong> {{ $t('gamePanel.noQuestions') }} </strong>

          <span> {{ $t('gamePanel.noQuestionsHint') }} </span>
        </div>

        <button type="button" class="add-button" @click="addQuestion">
          <v-icon> mdi-plus </v-icon>

          {{ $t('gamePanel.addQuestion') }}
        </button>
      </div>
    </template>

    <!-- GHÉP HÌNH: danh sách ảnh -->
    <template v-else-if="wedding.game.GameType === 'memory-match'">
      <h3 class="sub-heading">{{ $t('gamePanel.images') }}</h3>

      <p class="field-help block-help">
        {{ $t('gamePanel.imagesHint') }}
      </p>

      <div class="items-list">
        <article
          v-for="(image, index) in wedding.gameImages"
          :key="image.Id || index"
          class="editor-card"
        >
          <div class="card-header">
            <div>
              <span> {{ $t('gamePanel.imageLabel') }} {{ index + 1 }} </span>
            </div>

            <EditorItemActions
              :index="index"
              :total="wedding.gameImages.length"
              :remove-title="$t('galleryPanel.remove')"
              @move="moveImage"
              @remove="removeImage"
            />
          </div>

          <div class="editor-field full">
            <UploadField
              v-model="image.Image"
              kind="image"
              :button-text="$t('storyPanel.uploadPhoto')"
              compact
            />
          </div>
        </article>

        <div v-if="!wedding.gameImages?.length" class="empty-card">
          <v-icon size="30"> mdi-cards-outline </v-icon>

          <strong> {{ $t('gamePanel.noImages') }} </strong>

          <span> {{ $t('gamePanel.noImagesHint') }} </span>
        </div>

        <button type="button" class="add-button" @click="addImage">
          <v-icon> mdi-plus </v-icon>

          {{ $t('galleryPanel.add') }}
        </button>
      </div>
    </template>

    <!-- VÒNG QUAY / CÀO: không cấu hình riêng -->
    <p v-else class="field-help block-help">
      {{ $t('gamePanel.usesPrizes') }}
    </p>

    <!-- =====================================================
         PHẦN QUÀ TỪ CÔ DÂU CHÚ RỂ
    ====================================================== -->

    <h3 class="sub-heading">{{ $t('gamePanel.prizes') }}</h3>

    <p class="field-help block-help">
      {{ $t('gamePanel.prizesHint') }}
    </p>

    <div class="items-list">
      <article
        v-for="(prize, index) in wedding.gamePrizes"
        :key="prize.Id || index"
        class="editor-card"
      >
        <div class="card-header">
          <div>
            <span> {{ $t('gamePanel.prizeLabel') }} {{ index + 1 }} </span>

            <strong>
              {{ prize.Title || $t('panel.untitled') }}
            </strong>
          </div>

          <EditorItemActions
            :index="index"
            :total="wedding.gamePrizes.length"
            :remove-title="$t('gamePanel.removePrize')"
            @move="movePrize"
            @remove="removePrize"
          />
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>{{ $t('gamePanel.prizeName') }}</label>

            <input
              v-model="prize.Title"
              type="text"
              :placeholder="$t('gamePanel.prizePlaceholder')"
            />
          </div>

          <div class="editor-field full">
            <label>{{ $t('gamePanel.prizeDesc') }}</label>

            <input
              v-model="prize.Description"
              type="text"
              :placeholder="$t('gamePanel.prizeDescPlaceholder')"
            />
          </div>
        </div>
      </article>

      <div v-if="!wedding.gamePrizes?.length" class="empty-card">
        <v-icon size="30"> mdi-gift-outline </v-icon>

        <strong> {{ $t('gamePanel.noPrizes') }} </strong>

        <span>
          {{ $t('gamePanel.noPrizesHint') }}
        </span>
      </div>

      <button type="button" class="add-button" @click="addPrize">
        <v-icon> mdi-plus </v-icon>

        {{ $t('gamePanel.addPrize') }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import EditorItemActions from "@/components/editor/EditorItemActions.vue";
import UploadField from "@/components/editor/UploadField.vue";

import { confirmDialog } from "@/composables/useConfirm";

import { deleteMediaFile } from "@/composables/useMediaCleanup";

import { GAME_TYPES } from "@/data/gameData"; import PanelProgressBadge from "@/components/editor/PanelProgressBadge.vue";

const { t } = useI18n();

const props = defineProps({
  wedding: { type: Object, required: true },

  /* { done, total } từ Editor.vue — badge hoàn thiện mục. */
  progress: { type: Object, default: null },
});

/* =========================================================
   CÂU HỎI TRẮC NGHIỆM
========================================================= */

function addQuestion() {
  props.wedding.gameQuestions.push({
    Question: "",
    OptionA: "",
    OptionB: "",
    OptionC: "",
    OptionD: "",
    CorrectIndex: 0,
  });
}

async function removeQuestion(index) {
  const ok = await confirmDialog({
    get title() { return t("gamePanel.confirmQuestion"); },
    get message() { return t("gamePanel.confirmQuestionMsg"); },
    get confirmText() { return t("common.delete"); },
  });

  if (ok) {
    props.wedding.gameQuestions.splice(index, 1);
  }
}

function moveQuestion(index, direction) {
  const list = props.wedding.gameQuestions;

  const target = index + direction;

  if (target < 0 || target >= list.length) {
    return;
  }

  [list[index], list[target]] = [list[target], list[index]];
}

/* =========================================================
   ẢNH GHÉP ĐÔI
========================================================= */

function addImage() {
  props.wedding.gameImages.push({ Image: "" });
}

async function removeImage(index) {
  const ok = await confirmDialog({
    get title() { return t("gamePanel.confirmImage"); },
    get message() { return t("gamePanel.confirmImageMsg"); },
    get confirmText() { return t("common.delete"); },
  });

  if (ok) {
    /* Xóa file gốc trên R2 trước khi bỏ khỏi mảng (best-effort). */
    deleteMediaFile(props.wedding.gameImages[index]?.Image);

    props.wedding.gameImages.splice(index, 1);
  }
}

function moveImage(index, direction) {
  const list = props.wedding.gameImages;

  const target = index + direction;

  if (target < 0 || target >= list.length) {
    return;
  }

  [list[index], list[target]] = [list[target], list[index]];
}

/* =========================================================
   PHẦN QUÀ
========================================================= */

function addPrize() {
  props.wedding.gamePrizes.push({ Title: "", Description: "" });
}

async function removePrize(index) {
  const ok = await confirmDialog({
    get title() { return t("gamePanel.confirmPrize"); },
    get message() { return t("gamePanel.confirmPrizeMsg"); },
    get confirmText() { return t("common.delete"); },
  });

  if (ok) {
    props.wedding.gamePrizes.splice(index, 1);
  }
}

function movePrize(index, direction) {
  const list = props.wedding.gamePrizes;

  const target = index + direction;

  if (target < 0 || target >= list.length) {
    return;
  }

  [list[index], list[target]] = [list[target], list[index]];
}
</script>

<style scoped>
.block-help {
  margin: -6px 0 12px;
}

.mode-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 10px;

  margin-bottom: 18px;
}

.mode-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;

  padding: 14px;

  border: 1px solid #d3c3ae;
  border-radius: 12px;

  background: rgba(255, 253, 251, 0.7);

  text-align: left;

  cursor: pointer;

  transition: border-color 0.15s ease, background 0.15s ease;
}

.mode-card.active {
  border-color: #8a7a68;

  background: rgba(138, 122, 104, 0.08);
}

.mode-card strong {
  color: #5c4d46;

  font-size: 13px;
}

.mode-card small {
  color: #806f66;

  font-size: 11px;
  line-height: 1.4;
}

.correct-row {
  display: flex;
  gap: 8px;
}

.correct-btn {
  width: 38px;
  height: 38px;

  color: #6b5a4e;
  border: 1px solid #d3c3ae;
  border-radius: 10px;

  background: rgba(255, 253, 251, 0.7);

  font-weight: 700;

  cursor: pointer;
}

.correct-btn.active {
  color: #fff;
  border-color: #8a7a68;

  background: #8a7a68;
}

@media (max-width: 520px) {
  .mode-selector {
    grid-template-columns: 1fr;
  }
}
</style>
