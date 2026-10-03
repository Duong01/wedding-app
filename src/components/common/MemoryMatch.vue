<template>
  <!--
    Ghép hình cặp đôi — lật 2 thẻ, khớp thì giữ nguyên,
    lệch thì lật lại sau 700ms. Ảnh = wedding.gameImages,
    bỏ trống thì dùng ảnh album (gallery).

    Chế độ quà: ghép xong hết → trúng 1 quà ngẫu nhiên →
    emit win. Chế độ vui: lời chúc + chơi lại.
  -->
  <div class="memory-match">
    <!-- BẢNG THẺ -->
    <div v-if="!finished" class="memory-match__meta">
      <span> Nước đi: {{ moves }} </span>

      <span> Cặp còn lại: {{ remaining }} </span>
    </div>

    <div v-if="!finished" class="memory-match__grid">
      <button
        v-for="card in cards"
        :key="card.key"
        type="button"
        class="memory-match__card"
        :class="{
          'memory-match__card--flipped': card.flipped || card.matched,
          'memory-match__card--matched': card.matched,
        }"
        :disabled="card.matched || busy"
        @click="flip(card)"
      >
        <span class="memory-match__face memory-match__face--back">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </span>

        <span class="memory-match__face memory-match__face--front">
          <img :src="card.image" alt="" loading="lazy" draggable="false" />
        </span>
      </button>
    </div>

    <!-- KẾT QUẢ -->
    <div v-else class="memory-match__result">
      <span class="memory-match__score"> Hoàn thành trong {{ moves }} nước đi </span>

      <p class="memory-match__prize">
        <template v-if="prizeMode">
          🎁 Bạn nhận được:
          <strong>{{ prize }}</strong>
        </template>

        <template v-else> {{ prize }} </template>
      </p>

      <button
        v-if="prizeMode"
        type="button"
        class="memory-match__claim"
        @click="$emit('win', prize)"
      >
        Nhận quà
      </button>

      <button v-else type="button" class="memory-match__again" @click="restart">
        Chơi lại
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";

import { pickRandomPrize } from "@/data/gameData";

const props = defineProps({
  /* Ảnh riêng cho game — bỏ trống dùng ảnh album. */
  images: { type: Array, default: () => [] },

  /* Ảnh album (wedding.gallery) — fallback. */
  gallery: { type: Array, default: () => [] },

  /* Chế độ quà: mảng title quà thật. */
  prizes: { type: Array, default: () => [] },
});

const emit = defineEmits(["win"]);

const cards = ref([]);

const moves = ref(0);

const flippedPair = ref([]);

const busy = ref(false);

const finished = ref(false);

const prize = ref("");

const prizeMode = computed(() => props.prizes.length > 0);

const remaining = computed(
  () => cards.value.filter((c) => !c.matched).length / 2
);

const BLESSINGS = [
  "Tuyệt vời! Chúc bạn trăm năm hạnh phúc!",
  "Ghép nhanh quá! May mắn ngập tràn!",
  "Xuất sắc! Vạn sự như ý!",
];

onMounted(() => {
  /*
   * Shuffle chỉ chạy ở browser (Math.random) — SSR render
   * grid rỗng rồi hydrate, không crash.
   */
  const source = (props.images.length ? props.images : props.gallery)
    .map((item) => (typeof item === "string" ? item : item?.Image))
    .filter(Boolean)
    .slice(0, 6);

  const deck = [];

  source.forEach((image, index) => {
    deck.push({ image, pairId: index });
    deck.push({ image, pairId: index });
  });

  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  cards.value = deck.map((card, index) => ({
    ...card,
    key: `${card.pairId}-${index}`,
    flipped: false,
    matched: false,
  }));
});

function flip(card) {
  if (busy.value || card.matched || card.flipped) {
    return;
  }

  card.flipped = true;

  flippedPair.value.push(card);

  if (flippedPair.value.length === 2) {
    moves.value += 1;

    busy.value = true;

    const [first, second] = flippedPair.value;

    if (first.pairId === second.pairId) {
      first.matched = true;
      second.matched = true;

      flippedPair.value = [];

      busy.value = false;

      if (cards.value.every((c) => c.matched)) {
        finish();
      }

      return;
    }

    setTimeout(() => {
      first.flipped = false;
      second.flipped = false;

      flippedPair.value = [];

      busy.value = false;
    }, 700);
  }
}

function finish() {
  finished.value = true;

  prize.value = prizeMode.value
    ? pickRandomPrize(props.prizes)
    : pickRandomPrize(BLESSINGS);

  try {
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.7 },
        colors: ["#c79d5c", "#f7d8a3", "#ffffff"],
        disableForReducedMotion: true,
      });
    });
  } catch {
    /* pháo giấy chỉ là trang trí */
  }
}

function restart() {
  moves.value = 0;
  flippedPair.value = [];
  busy.value = false;
  finished.value = false;
  prize.value = "";

  cards.value.forEach((card) => {
    card.flipped = false;
    card.matched = false;
  });

  for (let i = cards.value.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));

    [cards.value[i], cards.value[j]] = [cards.value[j], cards.value[i]];
  }
}
</script>

<style scoped>
.memory-match {
  width: 100%;

  max-width: 420px;

  margin: 0 auto;
}

.memory-match__meta {
  display: flex;
  justify-content: space-between;

  margin-bottom: 12px;

  color: var(--text-secondary, #806f66);

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.memory-match__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);

  gap: 8px;
}

.memory-match__card {
  position: relative;

  aspect-ratio: 3 / 4;

  border: 0;
  border-radius: 12px;

  padding: 0;

  background: transparent;

  cursor: pointer;

  perspective: 600px;
}

.memory-match__face {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 12px;

  backface-visibility: hidden;

  transition: transform 0.35s ease;
}

.memory-match__face--back {
  color: #fff;

  background: var(--primary, #8a7a68);
}

.memory-match__face--back svg {
  width: 34%;
  height: 34%;

  opacity: 0.85;
}

.memory-match__face--front {
  transform: rotateY(180deg);

  overflow: hidden;
}

.memory-match__face--front img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

.memory-match__card--flipped .memory-match__face--back {
  transform: rotateY(180deg);
}

.memory-match__card--flipped .memory-match__face--front {
  transform: rotateY(0);
}

.memory-match__card--matched {
  cursor: default;
}

.memory-match__card--matched .memory-match__face--front {
  box-shadow: 0 0 0 2px var(--accent, #c79d5c);
}

.memory-match__result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  padding: 24px 18px;

  border: 1px dashed var(--accent, #c79d5c);
  border-radius: 16px;

  background: var(--white, #fffaf4);
}

.memory-match__score {
  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-ink, var(--text-secondary, #806f66));

  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.memory-match__prize {
  margin: 0;

  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-ink, var(--text, #5c4d46));

  font-size: 15px;
  text-align: center;
}

.memory-match__prize strong {
  display: block;

  margin-top: 4px;

  color: var(--card-ink, var(--heading, var(--primary, #8a7a68)));

  font-family: var(--font-heading, Georgia, serif);

  font-size: clamp(18px, 5vw, 22px);
}

.memory-match__claim,
.memory-match__again {
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
