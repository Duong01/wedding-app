<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> MINI GAME </span>

        <h1>Trò chơi</h1>

        <p>
          Trò chơi liên quan tới cô dâu chú rể — kèm phần quà
          cho khách khi tham dự lễ cưới.
        </p>
      </div>
    </div>

    <div class="switch-card">
      <div>
        <strong> Hiển thị trò chơi </strong>

        <small>
          Thêm một khoảng vui vẻ cho khách mời khi xem thiệp.
        </small>
      </div>

      <v-switch
        v-model="wedding.settings.ShowGame"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field">
      <label>Tiêu đề mục</label>

      <input
        v-model="wedding.game.Title"
        type="text"
        placeholder="VD: Vòng quay may mắn"
      />

      <small class="field-help">
        Bỏ trống dùng tên trò chơi. Đổi được ở panel "Tiêu đề
        mục".
      </small>
    </div>

    <!-- =====================================================
         CHỌN TRÒ CHƠI
    ====================================================== -->

    <h3 class="sub-heading">Loại trò chơi</h3>

    <p class="field-help block-help">
      Chọn 1 trò chơi hiển thị trong thiệp.
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

        <strong> {{ type.label }} </strong>

        <small> {{ type.description }} </small>
      </button>
    </div>

    <!-- =====================================================
         CẤU HÌNH THEO LOẠI
    ====================================================== -->

    <!-- TRẮC NGHIỆM: danh sách câu hỏi -->
    <template v-if="wedding.game.GameType === 'couple-quiz'">
      <h3 class="sub-heading">Câu hỏi trắc nghiệm</h3>

      <p class="field-help block-help">
        Ra câu hỏi về hai bạn — khách trả lời và xem điểm.
      </p>

      <div class="items-list">
        <article
          v-for="(question, index) in wedding.gameQuestions"
          :key="question.Id || index"
          class="editor-card"
        >
          <div class="card-header">
            <div>
              <span> CÂU {{ index + 1 }} </span>

              <strong>
                {{ question.Question || "Chưa có câu hỏi" }}
              </strong>
            </div>

            <EditorItemActions
              :index="index"
              :total="wedding.gameQuestions.length"
              remove-title="Xoá câu hỏi"
              @move="moveQuestion"
              @remove="removeQuestion"
            />
          </div>

          <div class="editor-field full">
            <label>Câu hỏi</label>

            <input
              v-model="question.Question"
              type="text"
              placeholder="VD: Hai người gặp nhau lần đầu ở đâu?"
            />
          </div>

          <div class="form-grid">
            <div
              v-for="key in ['A', 'B', 'C', 'D']"
              :key="key"
              class="editor-field"
            >
              <label>Đáp án {{ key }}</label>

              <input
                v-model="question[`Option${key}`]"
                type="text"
                :placeholder="`Đáp án ${key}...`"
              />
            </div>
          </div>

          <div class="editor-field full">
            <label>Đáp án đúng</label>

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

          <strong> Chưa có câu hỏi </strong>

          <span> Thêm câu hỏi đầu tiên về hai bạn. </span>
        </div>

        <button type="button" class="add-button" @click="addQuestion">
          <v-icon> mdi-plus </v-icon>

          Thêm câu hỏi
        </button>
      </div>
    </template>

    <!-- GHÉP HÌNH: danh sách ảnh -->
    <template v-else-if="wedding.game.GameType === 'memory-match'">
      <h3 class="sub-heading">Ảnh ghép đôi</h3>

      <p class="field-help block-help">
        4–6 ảnh cưới của hai bạn. Bỏ trống dùng ảnh album.
      </p>

      <div class="items-list">
        <article
          v-for="(image, index) in wedding.gameImages"
          :key="image.Id || index"
          class="editor-card"
        >
          <div class="card-header">
            <div>
              <span> ẢNH {{ index + 1 }} </span>
            </div>

            <EditorItemActions
              :index="index"
              :total="wedding.gameImages.length"
              remove-title="Xoá ảnh"
              @move="moveImage"
              @remove="removeImage"
            />
          </div>

          <div class="editor-field full">
            <UploadField
              v-model="image.Image"
              kind="image"
              button-text="Tải ảnh lên"
              compact
            />
          </div>
        </article>

        <div v-if="!wedding.gameImages?.length" class="empty-card">
          <v-icon size="30"> mdi-cards-outline </v-icon>

          <strong> Chưa có ảnh riêng </strong>

          <span> Bỏ trống thì trò chơi dùng ảnh album của thiệp. </span>
        </div>

        <button type="button" class="add-button" @click="addImage">
          <v-icon> mdi-plus </v-icon>

          Thêm ảnh
        </button>
      </div>
    </template>

    <!-- VÒNG QUAY / CÀO: không cấu hình riêng -->
    <p v-else class="field-help block-help">
      Trò chơi này dùng danh sách phần quà bên dưới (hoặc lời
      chúc mặc định nếu bỏ trống).
    </p>

    <!-- =====================================================
         PHẦN QUÀ TỪ CÔ DÂU CHÚ RỂ
    ====================================================== -->

    <h3 class="sub-heading">Phần quà từ cô dâu &amp; chú rể</h3>

    <p class="field-help block-help">
      Quà thật bạn chuẩn bị cho khách (VD: thiệp cảm ơn, kẹo
      mứt, voucher...). Khách trúng nhập tên — bạn xem danh
      sách ở trang Quản lý để đối chiếu khi khách đến lễ.
      Bỏ trống = khách nhận lời chúc (chế độ vui).
    </p>

    <div class="items-list">
      <article
        v-for="(prize, index) in wedding.gamePrizes"
        :key="prize.Id || index"
        class="editor-card"
      >
        <div class="card-header">
          <div>
            <span> QUÀ {{ index + 1 }} </span>

            <strong>
              {{ prize.Title || "Chưa đặt tên" }}
            </strong>
          </div>

          <EditorItemActions
            :index="index"
            :total="wedding.gamePrizes.length"
            remove-title="Xoá quà"
            @move="movePrize"
            @remove="removePrize"
          />
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>Tên quà</label>

            <input
              v-model="prize.Title"
              type="text"
              placeholder="VD: Thiệp cảm ơn"
            />
          </div>

          <div class="editor-field full">
            <label>Mô tả (tùy chọn)</label>

            <input
              v-model="prize.Description"
              type="text"
              placeholder="VD: Kèm kẹo dâu handmade"
            />
          </div>
        </div>
      </article>

      <div v-if="!wedding.gamePrizes?.length" class="empty-card">
        <v-icon size="30"> mdi-gift-outline </v-icon>

        <strong> Chưa có quà </strong>

        <span>
          Bỏ trống thì khách nhận lời chúc — thêm quà để bật
          chế độ nhận quà.
        </span>
      </div>

      <button type="button" class="add-button" @click="addPrize">
        <v-icon> mdi-plus </v-icon>

        Thêm quà
      </button>
    </div>
  </section>
</template>

<script setup>
import EditorItemActions from "@/components/editor/EditorItemActions.vue";
import UploadField from "@/components/editor/UploadField.vue";

import { confirmDialog } from "@/composables/useConfirm";

import { GAME_TYPES } from "@/data/gameData";

const props = defineProps({
  wedding: { type: Object, required: true },
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
    title: "Xoá câu hỏi?",
    message: "Câu hỏi này sẽ bị xoá khỏi thiệp.",
    confirmText: "Xoá",
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
    title: "Xoá ảnh?",
    message: "Ảnh này sẽ bị xoá khỏi trò chơi.",
    confirmText: "Xoá",
  });

  if (ok) {
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
    title: "Xoá phần quà?",
    message: "Quà này sẽ bị xoá khỏi trò chơi.",
    confirmText: "Xoá",
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
