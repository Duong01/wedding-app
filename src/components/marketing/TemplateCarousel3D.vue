<template>
  <div
    class="carousel"
    :class="{ 'is-dragging': dragging }"
    @mouseenter="pause"
    @mouseleave="resume"
    @focusin="pause"
    @focusout="resume"
  >
    <div
      ref="stageRef"
      class="carousel__stage"
      role="region"
      aria-roledescription="carousel"
      aria-label="Bộ sưu tập mẫu thiệp"
      tabindex="0"
      @keydown="onKeydown"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
    >
      <div class="carousel__track">
        <article
          v-for="(item, index) in items"
          :key="item.id"
          class="carousel__card"
          :class="{
            'is-active': index === activeIndex,
            'is-near': Math.abs(offsetOf(index)) === 1,
          }"
          :style="cardTransform(index)"
          :aria-hidden="index !== activeIndex"
          @click="onCardClick(index)"
        >
          <div class="carousel__cover">
            <img
              :src="item.src"
              :alt="item.label"
              loading="lazy"
              draggable="false"
              @error="handleImageError"
            />

            <span class="carousel__orn" aria-hidden="true">
              {{ item.orn }}
            </span>

            <div class="carousel__veil">
              <span>Xem thiệp</span>
            </div>
          </div>

          <div class="carousel__body">
            <p class="carousel__collection">{{ item.collection }}</p>

            <h3>{{ item.label }}</h3>

            <p class="carousel__couple">{{ item.couple }}</p>

            <p class="carousel__date">{{ item.date }}</p>
          </div>
        </article>
      </div>
    </div>

    <!-- =========================================
         ĐIỀU KHIỂN
    ========================================== -->
    <div class="carousel__controls">
      <button
        type="button"
        class="carousel__btn"
        aria-label="Mẫu trước"
        @click="prev"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div class="carousel__dots">
        <button
          v-for="(item, index) in items"
          :key="`dot-${item.id}`"
          type="button"
          class="carousel__dot"
          :class="{ 'is-active': index === activeIndex }"
          :aria-label="`Tới mẫu ${index + 1}`"
          @click="goTo(index)"
        ></button>
      </div>

      <button
        type="button"
        class="carousel__btn"
        aria-label="Mẫu kế tiếp"
        @click="next"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>

    <p class="carousel__hint">
      Kéo, dùng phím ← → hoặc bấm vào thiệp hai bên để xoay vòng.
    </p>
  </div>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

const props = defineProps({
  /*
   * Mảng item đã chuẩn hoá qua toCardItem() —
   * { id, src, label, collection, couple, date, orn, raw }
   */
  items: { type: Array, default: () => [] },

  autoplayMs: { type: Number, default: 4200 },

  /*
   * Số thiệp hiển thị mỗi bên. 2 nghĩa là thấy tối đa
   * 5 thiệp cùng lúc — đủ để tạo chiều sâu mà không rối.
   */
  visible: { type: Number, default: 2 },
});

const emit = defineEmits(["select"]);

const activeIndex = ref(0);
const stageRef = ref(null);
const paused = ref(false);
const dragging = ref(false);

let timer = null;
let pointerStartX = 0;
let pointerDelta = 0;

const count = computed(() => props.items.length);

/*
 * Khoảng cách vòng tròn ngắn nhất từ card tới vị trí
 * đang active. Nhờ lấy modulo có dấu nên carousel xoay
 * vô hạn được cả hai chiều, không bị kẹt ở hai đầu.
 */
function offsetOf(index) {
  if (count.value === 0) {
    return 0;
  }

  const half = Math.floor(count.value / 2);

  let offset = index - activeIndex.value;

  if (offset > half) {
    offset -= count.value;
  }

  if (offset < -half) {
    offset += count.value;
  }

  return offset;
}

function cardTransform(index) {
  const offset = offsetOf(index);
  const abs = Math.abs(offset);

  /*
   * Card ngoài vùng nhìn vẫn được đặt transform (không
   * display:none) để khi xoay vào là trượt mượt, nhưng
   * ẩn hẳn khỏi mắt và khỏi tab order.
   */
  const hidden = abs > props.visible;

  const translateX = offset * 58;
  const translateZ = -abs * 170;
  const rotateY = offset * -38;
  const scale = Math.max(0.62, 1 - abs * 0.12);

  return {
    /*
     * Bảng màu của từng theme (--card-ink/accent/seal/bg)
     * để viền, nền và con dấu đổi theo mẫu đang xem.
     */
    ...(props.items[index]?.style || {}),
    transform:
      `translate(-50%, -50%) ` +
      `translateX(${translateX}%) ` +
      `translateZ(${translateZ}px) ` +
      `rotateY(${rotateY}deg) ` +
      `scale(${scale})`,
    opacity: hidden ? 0 : Math.max(0.18, 1 - abs * 0.34),
    zIndex: 100 - abs,
    pointerEvents: hidden ? "none" : "auto",
  };
}

/* =====================================================
   ĐIỀU HƯỚNG
===================================================== */

function goTo(index) {
  if (count.value === 0) {
    return;
  }

  activeIndex.value = ((index % count.value) + count.value) % count.value;
}

function next() {
  goTo(activeIndex.value + 1);
}

function prev() {
  goTo(activeIndex.value - 1);
}

function onCardClick(index) {
  /*
   * Kéo xong thì pointerup cũng bắn click — bỏ qua để
   * không vô tình mở thiệp khi người dùng chỉ vuốt.
   */
  if (Math.abs(pointerDelta) > 8) {
    return;
  }

  if (index === activeIndex.value) {
    emit("select", props.items[index]);

    return;
  }

  goTo(index);
}

function onKeydown(event) {
  if (event.key === "ArrowLeft") {
    event.preventDefault();

    prev();
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();

    next();
  }
}

/* =====================================================
   KÉO / VUỐT
===================================================== */

function onPointerDown(event) {
  dragging.value = true;
  pointerStartX = event.clientX;
  pointerDelta = 0;

  stageRef.value?.setPointerCapture?.(event.pointerId);
}

function onPointerMove(event) {
  if (!dragging.value) {
    return;
  }

  pointerDelta = event.clientX - pointerStartX;
}

function onPointerUp(event) {
  if (!dragging.value) {
    return;
  }

  dragging.value = false;

  stageRef.value?.releasePointerCapture?.(event.pointerId);

  /*
   * Vuốt đủ xa mới tính là đổi thiệp — tránh nhảy
   * khi người dùng chỉ bấm nhẹ.
   */
  if (pointerDelta > 60) {
    prev();
  } else if (pointerDelta < -60) {
    next();
  }

  /*
   * Giữ lại delta tới hết vòng lặp sự kiện để onCardClick
   * đọc được rồi mới xoá.
   */
  setTimeout(() => {
    pointerDelta = 0;
  }, 0);
}

/* =====================================================
   AUTOPLAY
===================================================== */

function stopTimer() {
  if (timer) {
    clearInterval(timer);

    timer = null;
  }
}

function startTimer() {
  stopTimer();

  if (props.autoplayMs <= 0 || count.value < 2) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  timer = setInterval(() => {
    if (!paused.value && !dragging.value) {
      next();
    }
  }, props.autoplayMs);
}

function pause() {
  paused.value = true;
}

function resume() {
  paused.value = false;
}

/*
 * Danh sách đổi (lọc bộ sưu tập) → đưa về thiệp đầu
 * để không trỏ vào index không còn tồn tại.
 */
watch(
  () => props.items,
  () => {
    activeIndex.value = 0;

    startTimer();
  }
);

onMounted(startTimer);

onBeforeUnmount(stopTimer);

/* =====================================================
   ẢNH LỖI
===================================================== */

function handleImageError(event) {
  const fallback = props.items[0]?.src;

  if (fallback && event.target.src !== fallback) {
    event.target.src = fallback;
  }
}
</script>

<style scoped>
.carousel {
  position: relative;
}

.carousel__stage {
  position: relative;

  height: 400px;

  perspective: 1200px;

  outline: none;

  touch-action: pan-y;

  cursor: grab;
}

.carousel.is-dragging .carousel__stage {
  cursor: grabbing;
}

.carousel__track {
  position: absolute;
  inset: 0;

  transform-style: preserve-3d;
}

.carousel__card {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 210px;

  overflow: hidden;

  border: 1px solid
    color-mix(in srgb, var(--card-accent, #b9975b) 34%, transparent);
  border-radius: 20px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 22px 50px rgba(43, 33, 24, 0.16);

  cursor: pointer;

  transform-origin: center center;

  transition:
    transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1),
    opacity 0.6s ease,
    box-shadow 0.4s ease,
    border-color 0.4s ease;

  will-change: transform, opacity;
}

.carousel__card.is-active {
  box-shadow: 0 34px 70px rgba(43, 33, 24, 0.26);

  border-color: color-mix(in srgb, var(--card-accent, #b9975b) 72%, transparent);
}

.carousel__cover {
  position: relative;

  aspect-ratio: 3 / 4;

  overflow: hidden;

  background: color-mix(
    in srgb,
    var(--card-bg, #f7f1e6) 82%,
    var(--card-accent, #b9975b)
  );
}

.carousel__cover img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  user-select: none;

  -webkit-user-drag: none;
}

.carousel__orn {
  position: absolute;

  top: 10px;
  left: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 30px;
  height: 30px;

  border-radius: 8px;

  background: color-mix(in srgb, var(--card-seal, #a63a2e) 88%, transparent);
  color: #fff;

  font-family: var(--font-symbol);
  font-size: 15px;
}

.carousel__veil {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: color-mix(
    in srgb,
    var(--card-seal, #a63a2e) 44%,
    rgba(20, 12, 8, 0.4)
  );

  opacity: 0;

  transition: opacity 0.35s ease;
}

.carousel__card.is-active:hover .carousel__veil {
  opacity: 1;
}

.carousel__veil span {
  padding: 10px 20px;

  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 999px;

  color: #fff;

  font-size: 12.5px;
  font-weight: 600;
}

.carousel__body {
  padding: 14px 15px 16px;
}

.carousel__collection {
  margin: 0 0 5px;

  color: var(--card-seal, #a63a2e);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.carousel__body h3 {
  margin: 0 0 5px;

  color: var(--card-ink, var(--studio-ink, #2b2118));

  font-family: var(--font-heading);
  font-size: 17px;
  font-weight: 600;

  line-height: 1.25;
}

.carousel__couple {
  margin: 0 0 3px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 12.5px;
}

.carousel__date {
  margin: 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 11.5px;
}

/* =====================================================
   ĐIỀU KHIỂN
===================================================== */

.carousel__controls {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 18px;

  margin-top: 26px;
}

.carousel__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 44px;
  height: 44px;

  padding: 0;

  border: 1px solid var(--studio-line-strong, rgba(43, 33, 24, 0.28));
  border-radius: 50%;

  background: var(--studio-card, #fffdf8);
  color: var(--studio-ink, #2b2118);

  cursor: pointer;

  transition:
    transform 0.25s ease,
    background 0.25s ease;
}

.carousel__btn svg {
  width: 18px;
  height: 18px;
}

.carousel__btn:hover {
  transform: translateY(-2px);

  background: #fff;
}

.carousel__dots {
  display: flex;
  align-items: center;

  gap: 7px;
}

.carousel__dot {
  width: 8px;
  height: 8px;

  padding: 0;

  border: 0;
  border-radius: 50%;

  background: rgba(43, 33, 24, 0.2);

  cursor: pointer;

  transition:
    width 0.25s ease,
    background 0.25s ease;
}

.carousel__dot.is-active {
  width: 22px;

  border-radius: 999px;

  background: var(--studio-seal, #a63a2e);
}

.carousel__hint {
  margin: 16px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12.5px;

  text-align: center;
}

/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .carousel__stage {
    height: 500px;
  }

  .carousel__card {
    width: 250px;
  }
}

@media (max-width: 420px) {
  .carousel__stage {
    height: 360px;
  }

  .carousel__card {
    width: 178px;
  }

  .carousel__hint {
    display: none;
  }
}

/* =====================================================
   GIẢM CHUYỂN ĐỘNG
===================================================== */

@media (prefers-reduced-motion: reduce) {
  .carousel__card,
  .carousel__veil,
  .carousel__btn,
  .carousel__dot {
    transition: none;
  }
}
</style>
