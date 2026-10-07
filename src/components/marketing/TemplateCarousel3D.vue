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
      :aria-label="$t('carousel.label')"
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
          <div
            class="carousel__cover"
            @mouseenter="scroll.start"
            @mouseleave="scroll.stop"
          >
            <img
              v-if="!isFailed(item.id)"
              :src="item.src"
              :alt="item.label"
              :data-card-id="item.id"
              loading="lazy"
              draggable="false"
              @load="onImgLoad(item.id)"
              @error="onImgError(item.id, $event)"
            />

            <!-- mạng treo / server không phản hồi — chỗ giữ chỗ + thử lại -->
            <div v-else class="carousel__fallback">
              <span class="carousel__fallback-orn" aria-hidden="true">
                {{ item.orn }}
              </span>

              <p>{{ $t('carousel.imgFailed') }}</p>

              <button
                type="button"
                class="carousel__retry"
                @click.stop="retryImage(item.id)"
              >
                {{ $t('common.retry') }}
              </button>
            </div>

            <span
              v-if="item.isNew"
              class="carousel__new"
            >
              {{ $t('templates.new') }}
            </span>

            <span class="carousel__orn" aria-hidden="true">
              {{ item.orn }}
            </span>

            <span v-if="!isFailed(item.id)" class="carousel__veil">
              {{ $t('payment.viewCard') }}
            </span>
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
        :aria-label="$t('carousel.prev')"
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
          :aria-label="$t('carousel.goTo', { n: index + 1 })" @click="goTo(index)" ></button> </div> <button type="button" class="carousel__btn" :aria-label="$t('carousel.next')"
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
      {{ $t('carousel.hint') }}
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

import { useHoverAutoScroll } from "@/composables/useHoverAutoScroll";

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

  /*
   * Mức timeout tải ảnh (ms). Quá thời gian này mà ảnh chưa
   * load xong (mạng treo, server không phản hồi) thì thay
   * bằng chỗ giữ chỗ + nút thử lại.
   */
  imgTimeoutMs: { type: Number, default: 8000 },
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

/* =====================================================
   TẢI ẢNH — TIMEOUT + THỬ LẠI
   -----------------------------------------------------------
   Ảnh lazy-load (chỉ tải khi card vào khung nhìn). Mỗi ảnh
   treo một đồng hồ: quá imgTimeoutMs mà chưa load xong thì
   đánh dấu thất bại → hiện chỗ giữ chỗ + nút thử lại. Ảnh
   lỗi (onerror — 404, mất mạng ngay lập tức) cũng rơi vào
   trạng thái này sau khi đã thử ảnh fallback một lần.
===================================================== */

const failedIds = ref(new Set());

const imgTimers = new Map();

function isFailed(id) {
  return failedIds.value.has(id);
}

function clearImgTimer(id) {
  const t = imgTimers.get(id);

  if (t) {
    clearTimeout(t);

    imgTimers.delete(id);
  }
}

function markFailed(id) {
  clearImgTimer(id);

  failedIds.value = new Set(failedIds.value).add(id);
}

/*
 * Gắn đồng hồ cho ảnh — gọi khi component gắn vào và khi
 * bấm thử lại. Ảnh đã tải xong rồi thì bỏ qua.
 */
function armImgTimer(id) {
  if (isFailed(id)) return;

  clearImgTimer(id);

  imgTimers.set(
    id,
    setTimeout(function check() {
      const img = stageRef.value?.querySelector(
        `img[data-card-id="${CSS.escape(String(id))}"]`
      );

      /* ảnh không còn trong DOM (đổi bộ lọc) — thôi theo dõi */
      if (!img) {
        imgTimers.delete(id);

        return;
      }

      /*
       * Ảnh lazy chưa bắt đầu tải (card còn ngoài khung
       * nhìn — currentSrc rỗng): lên lịch lại chờ tới khi
       * nó thật sự bắt đầu tải rồi mới canh timeout.
       */
      if (!img.currentSrc) {
        imgTimers.set(id, setTimeout(check, props.imgTimeoutMs));

        return;
      }

      /*
       * Đang tải mà quá hạn — mạng treo, mất kết nối,
       * server không phản hồi → đánh dấu thất bại.
       */
      if (!img.complete) {
        markFailed(id);
      }
    }, props.imgTimeoutMs)
  );
}

function onImgLoad(id) {
  clearImgTimer(id);
}

function onImgError(id, event) {
  clearImgTimer(id);

  /*
   * Ảnh lỗi → thử ảnh fallback của thư viện một lần; nếu
   * fallback cũng lỗi (mất mạng thật sự) thì đánh dấu thất
   * bại để hiện chỗ giữ chỗ + nút thử lại.
   */
  const fallback = props.items[0]?.src;

  if (fallback && event.target.src !== fallback) {
    event.target.src = fallback;

    armImgTimer(id);

    return;
  }

  markFailed(id);
}

function retryImage(id) {
  const next = new Set(failedIds.value);

  next.delete(id);

  failedIds.value = next;

  /*
   * v-if quay lại render ảnh — đợi DOM cập nhật rồi mới
   * gắn lại đồng hồ cho lượt tải mới.
   */
  requestAnimationFrame(() => armImgTimer(id));
}

/* Danh sách đổi (lọc bộ sưu tập) → xoá trạng thái cũ */
watch(
  () => props.items,
  () => {
    imgTimers.forEach((t) => clearTimeout(t));

    imgTimers.clear();

    failedIds.value = new Set();
  }
);

onBeforeUnmount(() => {
  imgTimers.forEach((t) => clearTimeout(t));

  imgTimers.clear();
});

/* Gắn đồng hồ cho mọi ảnh khi component gắn vào */
onMounted(() => {
  props.items.forEach((item) => armImgTimer(item.id));
});

/* =====================================================
   HOVER — ẢNH TỰ CUỘN
   -----------------------------------------------------------
   Ảnh xem trước là ảnh nguyên trang thiệp (~1:12); hover
   vào card, ảnh tự cuộn xuống chậm rãi cho xem trọn bộ
   thiết kế (xem composables/useHoverAutoScroll.js).
===================================================== */

const scroll = useHoverAutoScroll();

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

/*
 * Ảnh để height:auto — phần tràn của ảnh nguyên trang nằm
 * dưới khung, useHoverAutoScroll cuộn bằng translateY khi
 * hover (xem composables/useHoverAutoScroll.js).
 */
.carousel__cover img {
  display: block;

  width: 100%;
  height: auto;

  user-select: none;

  -webkit-user-drag: none;
}

/* =====================================================
   CHỖ GIỮ CHỖ KHI ẢNH THẤT BẠI — ornament + thử lại
===================================================== */

.carousel__fallback {
  position: absolute;
  inset: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 10px;

  padding: 16px;

  background: color-mix(
    in srgb,
    var(--card-bg, #f7f1e6) 82%,
    var(--card-accent, #b9975b)
  );

  text-align: center;
}

.carousel__fallback-orn {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 44px;
  height: 44px;

  border: 1px solid color-mix(in srgb, var(--card-accent, #b9975b) 40%, transparent);
  border-radius: 12px;

  color: var(--card-seal, #a63a2e);

  font-family: var(--font-symbol);
  font-size: 20px;
}

.carousel__fallback p {
  margin: 0;

  color: var(--card-ink, var(--studio-ink, #2b2118));

  font-size: 12px;

  line-height: 1.5;
}

.carousel__retry {
  padding: 8px 18px;

  border: 1px solid color-mix(in srgb, var(--card-seal, #a63a2e) 45%, transparent);
  border-radius: 999px;

  background: transparent;
  color: var(--card-seal, #a63a2e);

  font-family: inherit;
  font-size: 12.5px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.carousel__retry:hover {
  background: var(--card-seal, #a63a2e);
  color: #fff;
}

.carousel__new {
  position: absolute;

  top: 10px;
  left: 10px;

  z-index: 2;

  padding: 3px 10px;

  border-radius: 999px;

  background: var(--studio-seal, #a63a2e);

  color: #fff;

  font-size: 9.5px;
  font-weight: 700;

  letter-spacing: 0.1em;
  text-transform: uppercase;

  box-shadow: 0 6px 16px rgba(166, 58, 46, 0.4);
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

/*
 * Pill "Xem thiệp" trượt lên từ đáy khi hover — không phủ
 * toàn ảnh để khách vẫn xem được ảnh đang tự cuộn.
 */
.carousel__veil {
  position: absolute;

  bottom: 12px;
  left: 50%;

  padding: 8px 18px;

  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 999px;

  background: rgba(20, 12, 8, 0.55);
  color: #fff;

  font-size: 12px;
  font-weight: 600;

  white-space: nowrap;

  transform: translate(-50%, 10px);

  opacity: 0;

  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  pointer-events: none;

  backdrop-filter: blur(4px);
}

.carousel__card.is-active:hover .carousel__veil {
  transform: translate(-50%, 0);

  opacity: 1;
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

  background: rgba(43, 33, 24, 0.18);

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
