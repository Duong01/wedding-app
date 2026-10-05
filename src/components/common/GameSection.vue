<template>
  <!--
    Mục mini game — dùng chung mọi theme (orchestrator import
    1 component này, không cần biết loại game).

    Tự gate: settings.ShowGame === true (orchestrator cũng
    gate ngoài). 4 loại game (game.GameType):
      lucky-wheel  · couple-quiz · scratch-card · memory-match

    Loại game thiếu dữ liệu (quiz không câu hỏi, memory không
    ảnh) → fallback vòng quay để không có mục chết.

    Chế độ quà (gamePrizes có mục): khách trúng → PrizeClaim
    nhập tên, lưu DB để chủ thiệp đối chiếu tại lễ. Chế độ
    vui: phần thưởng là lời chúc mặc định.
  -->
  <section
    v-if="visible"
    ref="rootRef"
    class="game-section"
    :style="sectionStyle"
  >
    <header v-if="eyebrow || heading" class="game-section__head">
      <p v-if="eyebrow" class="game-section__eyebrow">{{ eyebrow }}</p>

      <h2 v-if="heading" class="game-section__heading">{{ heading }}</h2>

      <p v-if="intro" class="game-section__intro">{{ intro }}</p>
    </header>

    <!-- FORM NHẬN QUÀ (chế độ quà, sau khi trúng) -->
    <PrizeClaim
      v-if="claiming"
      :prize-title="wonPrize"
      :game-type="effectiveType"
      :slug="slug"
    />

    <!-- GAME -->
    <template v-else>
      <LuckyWheel
        v-if="effectiveType === 'lucky-wheel'"
        :prizes="wheelPrizes"
        :prize-mode="prizeMode"
        @win="onWin"
      />

      <CoupleQuiz
        v-else-if="effectiveType === 'couple-quiz'"
        :questions="questions"
        :prizes="prizeTitles"
        @win="onWin"
      />

      <ScratchCard
        v-else-if="effectiveType === 'scratch-card'"
        :prizes="prizes"
        @win="onWin"
      />

      <MemoryMatch
        v-else-if="effectiveType === 'memory-match'"
        :images="images"
        :gallery="gallery"
        :prizes="prizeTitles"
        @win="onWin"
      />
    </template>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

import LuckyWheel from "@/components/common/LuckyWheel.vue";
import CoupleQuiz from "@/components/common/CoupleQuiz.vue";
import ScratchCard from "@/components/common/ScratchCard.vue";
import MemoryMatch from "@/components/common/MemoryMatch.vue";
import PrizeClaim from "@/components/common/PrizeClaim.vue";

import { sectionText } from "@/data/sectionTitles";

import { DEFAULT_WHEEL_PRIZES, gameTypeMeta } from "@/data/gameData";

import { useSectionTheme } from "@/composables/useSectionTheme";
import { t } from "@/lang";
const props = defineProps({
  /*
   * Nhận cả object wedding — prop duy nhất mọi orchestrator
   * có sẵn (PreviewRenderer cũng chỉ truyền :wedding).
   */
  wedding: { type: Object, required: true },
});

/*
 * Gắn bảng màu của thiệp lên gốc section — 15/26 theme
 * không có pipeline màu nên game không còn rơi về bảng
 * :root đỏ son của theme.css (xem useSectionTheme).
 */
const rootRef = ref(null);

const { sectionStyle } = useSectionTheme(() => props.wedding, rootRef);

const game = computed(() => props.wedding?.game || {});

const visible = computed(() => props.wedding?.settings?.ShowGame === true);

/*
 * Quà thật từ cô dâu chú rể — có quà là chạy chế độ quà.
 */
const prizes = computed(() => {
  const list = props.wedding?.gamePrizes;

  return Array.isArray(list) ? list.filter((p) => (p?.Title || "").trim()) : [];
});

const prizeMode = computed(() => prizes.value.length > 0);

const prizeTitles = computed(() => prizes.value.map((p) => p.Title));

const questions = computed(() => {
  const list = props.wedding?.gameQuestions;

  return Array.isArray(list)
    ? list.filter((q) => (q?.Question || "").trim() && (q?.OptionA || "").trim())
    : [];
});

const images = computed(() => {
  const list = props.wedding?.gameImages;

  return Array.isArray(list) ? list.filter((i) => (i?.Image || "").trim()) : [];
});

const gallery = computed(() => {
  const list = props.wedding?.gallery;

  return Array.isArray(list) ? list : [];
});

/*
 * Loại game thật sự render — thiếu dữ liệu thì rơi về vòng
 * quay (luôn chạy được: prizes mặc định là lời chúc).
 */
const effectiveType = computed(() => {
  const type = game.value.GameType || "lucky-wheel";

  if (type === "couple-quiz" && questions.value.length === 0) {
    return "lucky-wheel";
  }

  if (
    type === "memory-match" &&
    images.value.length === 0 &&
    gallery.value.length === 0
  ) {
    return "lucky-wheel";
  }

  return type;
});

/*
 * Ô vòng quay: chế độ quà dùng title quà, chế độ vui dùng
 * lời chúc mặc định.
 */
const wheelPrizes = computed(() =>
  prizeMode.value ? prizeTitles.value : DEFAULT_WHEEL_PRIZES
);

const slug = computed(() => props.wedding?.slug || props.wedding?.Slug || "");

const eyebrow = computed(() =>
  sectionText(props.wedding?.sections, "game", "Eyebrow", t("CÙNG VUI CHƠI"))
);

const heading = computed(() =>
  sectionText(
    props.wedding?.sections,
    "game",
    "Heading",
    game.value.Title || gameTypeMeta(effectiveType.value).label
  )
);

const intro = computed(() =>
  sectionText(
    props.wedding?.sections,
    "game",
    "Intro",
    gameTypeMeta(effectiveType.value).intro
  )
);

/*
 * Chế độ quà: sau khi trúng, thay game bằng form nhận quà.
 */
const claiming = ref(false);

const wonPrize = ref("");

function onWin(prizeTitle) {
  if (!prizeMode.value) {
    return;
  }

  wonPrize.value = prizeTitle || "";

  claiming.value = true;
}
</script>

<style scoped>
.game-section {
  width: min(100%, 640px);

  margin: 0 auto;

  /*
   * Padding dọc CỐ ĐỊNH — không dùng --section-padding (một
   * số theme đặt 80–85px khiến mục game trống quá xa các
   * mục quanh nó).
   */
  padding: 28px 10px;

  text-align: center;
}

.game-section__eyebrow {
  margin: 0 0 6px;

  /*
   * --sec-*: màu đã kiểm tra tương phản với nền THẬT phía
   * sau section của từng thiệp (xem useSectionTheme).
   */
  color: var(--sec-eyebrow, var(--text-secondary, #806f66));

  /* font-size: 10px; */
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.game-section__heading {
  margin: 0 0 8px;

  /*
   * Màu tường minh — h2 toàn cục (theme.css) lấy --primary,
   * trùng màu nền ở thiệp nền tối → tiêu đề tàng hình.
   */
  color: var(--sec-heading, var(--heading, var(--primary, #8a7a68)));

  /* font-family: var(--font-heading, Georgia, serif); */

  /* font-size: clamp(22px, 6vw, 30px); */
  font-weight: 600;
}

/* Gạch trang trí dưới tiêu đề — màu viền của thiệp */
.game-section__heading::after {
  content: "";

  display: block;

  width: 56px;
  height: 1px;

  margin: 12px auto 0;

  background: var(--sec-line, var(--accent, #c79d5c));
}

.game-section__intro {
  margin: 0 0 20px;

  color: var(--sec-muted, var(--text-secondary, #806f66));

  /* font-size: 13px; */
}
</style>
