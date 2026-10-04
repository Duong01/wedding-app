<template>
  <!--
    Cào trúng thưởng — canvas lớp bạc, khách cào (pointer /
    touch) để mở quà bên dưới. Cào > 55% → fade lớp bạc,
    hiện quà + emit win (chế độ quà) hoặc lời chúc.

    Không có canvas (SSR / trình duyệt cũ) hoặc khách bật
    giảm chuyển động → nút "Nhận quà" thay thế.
  -->
  <div class="scratch-card">
    <!-- LỚP QUÀ BÊN DƯỚI -->
    <div class="scratch-card__reveal">
      <span class="scratch-card__orn" aria-hidden="true">🎁</span>

      <strong class="scratch-card__prize">{{ prize }}</strong>

      <small v-if="prizeDescription" class="scratch-card__desc">
        {{ prizeDescription }}
      </small>
    </div>

    <!-- LỚP BẠC CÀO -->
    <canvas
      v-if="canvasReady && !revealed"
      ref="canvasRef"
      class="scratch-card__canvas"
      :class="{ 'scratch-card__canvas--fading': fading }"
      @pointerdown="startScratch"
      @pointermove="scratch"
      @pointerup="stopScratch"
      @pointerleave="stopScratch"
    ></canvas>

    <!-- FALLBACK: KHÔNG CÓ CANVAS / REDUCED MOTION -->
    <div v-else-if="!revealed" class="scratch-card__fallback">
      <span class="scratch-card__hint"> CÀO ĐỂ NHẬN QUÀ </span>

      <button type="button" class="scratch-card__button" @click="reveal">
        Nhận quà
      </button>
    </div>

    <!-- SAU KHI MỞ -->
    <div v-if="revealed" class="scratch-card__actions">
      <button
        v-if="prizeMode"
        type="button"
        class="scratch-card__claim"
        @click="$emit('win', prize)"
      >
        Nhận quà
      </button>

      <button v-else type="button" class="scratch-card__again" @click="reset">
        Cào lại
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { pickRandomPrize } from "@/data/gameData";

const props = defineProps({
  /*
   * Danh sách quà [{ Title, Description }] (chế độ quà) —
   * rỗng = chế độ vui (lời chúc mặc định).
   */
  prizes: { type: Array, default: () => [] },
});

const emit = defineEmits(["win"]);

const canvasRef = ref(null);

const canvasReady = ref(false);

const revealed = ref(false);

const fading = ref(false);

const prize = ref("");

const prizeDescription = ref("");

const prizeMode = computed(() => props.prizes.length > 0);

const BLESSINGS = [
  "Trăm năm hạnh phúc!",
  "May mắn ngập tràn!",
  "Vạn sự như ý!",
  "Một đời bên nhau!",
];

let ctx = null;

let scratching = false;

let lastCheck = 0;

onMounted(() => {
  prize.value = prizeMode.value
    ? pickRandomPrize(props.prizes.map((p) => p.Title))
    : pickRandomPrize(BLESSINGS);

  prizeDescription.value = prizeMode.value
    ? (props.prizes.find((p) => p.Title === prize.value) || {}).Description || ""
    : "";

  /*
   * Canvas chỉ vẽ được ở browser — SSR render fallback.
   * Khách bật giảm chuyển động thì cũng cho nút thường
   * (cào là chuyển động).
   */
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    return;
  }

  const canvas = canvasRef.value;

  if (!canvas || !canvas.getContext) {
    return;
  }

  ctx = canvas.getContext("2d");

  if (!ctx) {
    return;
  }

  canvasReady.value = true;

  drawCover();
});

onBeforeUnmount(() => {
  ctx = null;
});

function drawCover() {
  const canvas = canvasRef.value;

  if (!canvas || !ctx) {
    return;
  }

  /*
   * Canvas CSS full-size — set kích thước thật theo device
   * pixel ratio để nét trên màn retina.
   */
  const rect = canvas.getBoundingClientRect();

  const dpr = window.devicePixelRatio || 1;

  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));

  ctx.scale(dpr, dpr);

  /*
   * Màu lớp cào theo thiệp — đọc biến CSS GameSection gắn
   * (useSectionTheme); thiếu biến thì giữ bạc xám cũ.
   */
  const styles = getComputedStyle(canvas);

  const cssVar = (name, fallback) =>
    styles.getPropertyValue(name).trim() || fallback;

  const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);

  gradient.addColorStop(0, cssVar("--scratch-a", "#b8b2a6"));
  gradient.addColorStop(0.5, cssVar("--scratch-b", "#d8d2c6"));
  gradient.addColorStop(1, cssVar("--scratch-c", "#a9a294"));

  ctx.fillStyle = gradient;

  ctx.fillRect(0, 0, rect.width, rect.height);

  ctx.fillStyle = cssVar("--scratch-ink", "rgba(92, 77, 70, 0.55)");

  ctx.font = `700 ${Math.max(11, rect.width / 22)}px sans-serif`;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText("CÀO ĐỂ NHẬN QUÀ", rect.width / 2, rect.height / 2);
}

function startScratch(event) {
  scratching = true;

  scratch(event);
}

function scratch(event) {
  if (!scratching || !ctx || revealed.value) {
    return;
  }

  const canvas = canvasRef.value;

  const rect = canvas.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  ctx.globalCompositeOperation = "destination-out";

  ctx.beginPath();

  ctx.arc(x, y, 22, 0, Math.PI * 2);

  ctx.fill();

  /*
   * Kiểm tra % đã cào mỗi 150ms (đọc imageData đắt —
   * không check mỗi pointermove).
   */
  const now = Date.now();

  if (now - lastCheck > 150) {
    lastCheck = now;

    checkProgress();
  }
}

function stopScratch() {
  scratching = false;
}

function checkProgress() {
  const canvas = canvasRef.value;

  if (!canvas || !ctx) {
    return;
  }

  const rect = canvas.getBoundingClientRect();

  /*
   * Sample lưới 24x24 thay vì mọi pixel — đủ chính xác
   * cho ngưỡng 55% mà nhẹ hơn nhiều.
   */
  const step = 24;

  let clear = 0;

  let total = 0;

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const alpha = data[(y * canvas.width + x) * 4 + 3];

      total += 1;

      if (alpha < 40) {
        clear += 1;
      }
    }
  }

  if (total > 0 && clear / total > 0.55) {
    reveal();
  }
}

function reveal() {
  if (revealed.value) {
    return;
  }

  revealed.value = true;

  fading.value = true;

  try {
    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#c79d5c", "#f7d8a3", "#ffffff"],
        disableForReducedMotion: true,
      });
    });
  } catch {
    /* pháo giấy chỉ là trang trí */
  }
}

function reset() {
  revealed.value = false;
  fading.value = false;

  prize.value = prizeMode.value
    ? pickRandomPrize(props.prizes.map((p) => p.Title))
    : pickRandomPrize(BLESSINGS);

  prizeDescription.value = prizeMode.value
    ? (props.prizes.find((p) => p.Title === prize.value) || {}).Description || ""
    : "";

  if (canvasReady.value) {
    drawCover();
  }
}
</script>

<style scoped>
.scratch-card {
  position: relative;

  width: min(100%, 340px);

  margin: 0 auto;
}

.scratch-card__reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 150px;

  padding: 22px 16px;

  border: 1px solid var(--card-line, var(--accent, #c79d5c));
  border-radius: 16px;

  background: var(--card-bg, var(--white, #fffaf4));
}

.scratch-card__orn {
  font-size: 30px;
}

.scratch-card__prize {
  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-heading, var(--card-ink, var(--primary, #8a7a68)));

  font-family: var(--font-heading, Georgia, serif);

  font-size: clamp(17px, 5vw, 21px);
  font-weight: 600;

  text-align: center;
}

.scratch-card__desc {
  /* --card-ink: mực tối đã kiểm tra tương phản với card sáng */
  color: var(--card-ink, var(--text-secondary, #806f66));

  font-size: 12px;
  text-align: center;
}

.scratch-card__canvas {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;

  border-radius: 16px;

  cursor: grab;

  touch-action: none;

  transition: opacity 0.5s ease;
}

.scratch-card__canvas--fading {
  opacity: 0;

  pointer-events: none;
}

.scratch-card__fallback {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  border-radius: 16px;

  /* Lớp cào ánh kim theo màu nhấn của thiệp (useSectionTheme) */
  background: linear-gradient(
    135deg,
    var(--scratch-a, #b8b2a6),
    var(--scratch-b, #d8d2c6),
    var(--scratch-c, #a9a294)
  );
}

.scratch-card__hint {
  color: var(--scratch-ink, #5c4d46);

  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

/*
 * Nút trên lớp cào sáng: khối đậm --solid. Nút bên dưới
 * thẻ nằm trên nền thiệp: --btn-* (nền tối → khối vàng).
 */
.scratch-card__button,
.scratch-card__claim,
.scratch-card__again {
  padding: 9px 22px;

  color: var(--btn-ink, #fff);
  border: 0;
  border-radius: 999px;

  background: var(--btn-bg, var(--primary, #8a7a68));

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
}

.scratch-card__button {
  color: var(--solid-ink, #fff);

  background: var(--solid, var(--primary, #8a7a68));
}

.scratch-card__actions {
  display: flex;
  justify-content: center;

  margin-top: 12px;
}
</style>
