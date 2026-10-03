<template>
  <!--
    Trắc nghiệm về cặp đôi — câu hỏi do chủ thiệp tự ra
    (wedding.gameQuestions). Từng câu 1 lần: chọn đáp án →
    xanh/đỏ + hiện đáp án đúng → tự chuyển câu tiếp.

    Chế độ quà (prizes có mục): trả lời xong trúng 1 quà
    ngẫu nhiên → emit win. Chế độ vui: hiện lời chúc.
  -->
  <div class="couple-quiz">
    <!-- CÂU HỎI HIỆN TẠI -->
    <div v-if="!finished" class="couple-quiz__card">
      <div class="couple-quiz__progress">
        <span> CÂU {{ currentIndex + 1 }}/{{ questions.length }} </span>

        <span> Đúng: {{ score }} </span>
      </div>

      <h3 class="couple-quiz__question">
        {{ currentQuestion.Question }}
      </h3>

      <div class="couple-quiz__options">
        <button
          v-for="(option, index) in currentOptions"
          :key="index"
          type="button"
          class="couple-quiz__option"
          :class="optionClass(index)"
          :disabled="answered"
          @click="answer(index)"
        >
          <span class="couple-quiz__option-key">{{ "ABCD"[index] }}</span>

          <span>{{ option }}</span>
        </button>
      </div>
    </div>

    <!-- KẾT QUẢ -->
    <div v-else class="couple-quiz__result">
      <span class="couple-quiz__score">
        {{ score }}/{{ questions.length }} câu đúng
      </span>

      <p class="couple-quiz__blessing">
        <template v-if="prizeMode">
          🎁 Bạn nhận được:
          <strong>{{ prize }}</strong>
        </template>

        <template v-else> {{ prize }} </template>
      </p>

      <button
        v-if="prizeMode"
        type="button"
        class="couple-quiz__claim"
        @click="$emit('win', prize)"
      >
        Nhận quà
      </button>

      <button v-else type="button" class="couple-quiz__again" @click="restart">
        Làm lại
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

import { pickRandomPrize } from "@/data/gameData";

const props = defineProps({
  /*
   * Danh sách câu hỏi (wedding.gameQuestions) — mỗi câu:
   * Question, OptionA..D, CorrectIndex 0–3.
   */
  questions: { type: Array, default: () => [] },

  /*
   * Chế độ quà: mảng title quà thật. Rỗng = chế độ vui
   * (lời chúc mặc định).
   */
  prizes: { type: Array, default: () => [] },
});

const emit = defineEmits(["win"]);

const currentIndex = ref(0);

const score = ref(0);

const answered = ref(null);

const finished = ref(false);

const prize = ref("");

const prizeMode = computed(() => props.prizes.length > 0);

const currentQuestion = computed(
  () => props.questions[currentIndex.value] || {}
);

const currentOptions = computed(() => [
  currentQuestion.value.OptionA,
  currentQuestion.value.OptionB,
  currentQuestion.value.OptionC,
  currentQuestion.value.OptionD,
]);

function optionClass(index) {
  if (answered.value === null) {
    return "";
  }

  if (index === currentQuestion.value.CorrectIndex) {
    return "correct";
  }

  if (index === answered.value) {
    return "wrong";
  }

  return "";
}

function answer(index) {
  if (answered.value !== null) {
    return;
  }

  answered.value = index;

  if (index === currentQuestion.value.CorrectIndex) {
    score.value += 1;
  }

  /*
   * Dừng 1.1s cho khách thấy đáp án đúng/sai rồi mới
   * chuyển câu (hoặc sang kết quả).
   */
  setTimeout(next, 1100);
}

function next() {
  answered.value = null;

  if (currentIndex.value < props.questions.length - 1) {
    currentIndex.value += 1;

    return;
  }

  finished.value = true;

  /*
   * Chế độ quà: trúng 1 quà ngẫu nhiên. Chế độ vui: lời
   * chúc cảm ơn chung.
   */
  prize.value = prizeMode.value
    ? pickRandomPrize(props.prizes)
    : "Cảm ơn bạn đã cùng vui với chúng mình!";
}

function restart() {
  currentIndex.value = 0;
  score.value = 0;
  answered.value = null;
  finished.value = false;
  prize.value = "";
}
</script>

<style scoped>
.couple-quiz {
  width: 100%;

  max-width: 460px;

  margin: 0 auto;
}

.couple-quiz__card {
  padding: 22px 18px;

  border: 1px solid var(--accent, #c79d5c);
  border-radius: 16px;

  background: var(--white, #fffaf4);
}

.couple-quiz__progress {
  display: flex;
  justify-content: space-between;

  margin-bottom: 12px;

  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-ink, var(--text-secondary, #806f66));

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.couple-quiz__question {
  margin: 0 0 16px;

  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-ink, var(--heading, var(--primary, #8a7a68)));

  font-family: var(--font-heading, Georgia, serif);

  font-size: clamp(16px, 4.5vw, 19px);
  font-weight: 600;
  line-height: 1.4;
}

.couple-quiz__options {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.couple-quiz__option {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 11px 14px;

  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-ink, var(--text, #5c4d46));

  border: 1px solid var(--accent, #c79d5c);
  border-radius: 12px;

  background: transparent;

  font-size: 14px;
  text-align: left;

  cursor: pointer;

  transition: background 0.15s ease, border-color 0.15s ease;
}

.couple-quiz__option:hover:not(:disabled) {
  background: rgba(199, 157, 92, 0.1);
}

.couple-quiz__option:disabled {
  cursor: default;
}

.couple-quiz__option.correct {
  border-color: #3d9a50;

  background: rgba(61, 154, 80, 0.12);
}

.couple-quiz__option.wrong {
  border-color: #c0392b;

  background: rgba(192, 57, 43, 0.1);
}

.couple-quiz__option-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  flex: 0 0 24px;

  width: 24px;
  height: 24px;

  color: #fff;
  border-radius: 50%;

  background: var(--primary, #8a7a68);

  font-size: 11px;
  font-weight: 800;
}

.couple-quiz__option.correct .couple-quiz__option-key {
  background: #3d9a50;
}

.couple-quiz__option.wrong .couple-quiz__option-key {
  background: #c0392b;
}

.couple-quiz__result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  padding: 24px 18px;

  border: 1px dashed var(--accent, #c79d5c);
  border-radius: 16px;

  background: var(--white, #fffaf4);
}

.couple-quiz__score {
  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-ink, var(--text-secondary, #806f66));

  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.couple-quiz__blessing {
  margin: 0;

  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-ink, var(--text, #5c4d46));

  font-size: 15px;
  text-align: center;
}

.couple-quiz__blessing strong {
  display: block;

  margin-top: 4px;

  color: var(--card-ink, var(--heading, var(--primary, #8a7a68)));

  font-family: var(--font-heading, Georgia, serif);

  font-size: clamp(18px, 5vw, 22px);
}

.couple-quiz__claim,
.couple-quiz__again {
  padding: 9px 22px;

  color: #fff;
  border: 0;
  border-radius: 999px;

  background: var(--primary, #8a7a68);

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
}
</style>
