<template>
  <!--
    Tự cuộn thiệp tới cuối trang khi khách không thao tác.

    Không có giao diện — chỉ hiện 1 nhãn nhỏ "Chạm để dừng"
    trong lúc đang tự cuộn để khách biết vì sao trang chạy.

    Gắn ở trang khách mời (WeddingApi / WeddingOpen /
    WeddingDetail) SAU khi thiệp đã mở phong bì.
  -->
  <Transition name="auto-scroll-hint">
    <button
      v-if="running"
      type="button"
      class="auto-scroll-hint"
      @click="stop(true)"
    >
      <span class="auto-scroll-hint__dot" aria-hidden="true"></span>
      Đang tự cuộn · chạm để dừng
    </button>
  </Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  wedding: { type: Object, default: null },
});

/*
 * Chờ bao lâu không thao tác thì bắt đầu cuộn:
 *   - lần đầu (vừa mở thiệp): để khách kịp ngắm phần đầu.
 *   - sau khi khách tự cuộn / chạm: lâu hơn, tránh giành
 *     quyền điều khiển khi khách đang đọc.
 */
const START_DELAY = 5000;
const RESUME_DELAY = 9000;

/* Tốc độ cuộn (px/giây) — đủ chậm để đọc kịp */
const SPEED = 42;

const running = ref(false);

/*
 * Chủ thiệp tắt ở panel Cài đặt (settings.AutoScroll =
 * false). Mặc định bật.
 */
const enabled = computed(() => props.wedding?.settings?.AutoScroll !== false);

let idleTimer = null;
let frame = null;
let lastTime = 0;
let carry = 0;
let finished = false;

/*
 * Không tự cuộn khi:
 *   - nằm trong iframe (preview editor — đang chỉnh mà trang
 *     tự chạy thì rất phiền)
 *   - khách bật giảm chuyển động
 */
const blocked =
  typeof window === "undefined" ||
  window.self !== window.top ||
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function scroller() {
  return document.scrollingElement || document.documentElement;
}

function atBottom() {
  const el = scroller();

  return el.scrollTop + window.innerHeight >= el.scrollHeight - 2;
}

/*
 * Đang mở lightbox / hộp quà / dialog → body bị khoá cuộn,
 * không chạy (và không coi là đã tới cuối).
 */
function pageLocked() {
  const body = getComputedStyle(document.body);

  const html = getComputedStyle(document.documentElement);

  return body.overflow === "hidden" || html.overflow === "hidden" || body.position === "fixed";
}

function tick(time) {
  if (!running.value) {
    return;
  }

  if (!lastTime) {
    lastTime = time;
  }

  const dt = Math.min(64, time - lastTime);

  lastTime = time;

  if (!document.hidden && !pageLocked()) {
    /* Cộng dồn phần lẻ — scrollTop chỉ nhận số nguyên trên nhiều máy */
    carry += (SPEED * dt) / 1000;

    const step = Math.floor(carry);

    if (step >= 1) {
      carry -= step;

      const el = scroller();

      el.scrollTo({ top: el.scrollTop + step, behavior: "instant" });
    }

    if (atBottom()) {
      finished = true;

      stop(false);

      return;
    }
  }

  frame = requestAnimationFrame(tick);
}

function start() {
  if (blocked || !enabled.value || finished || running.value) {
    return;
  }

  if (atBottom()) {
    finished = true;

    return;
  }

  running.value = true;
  lastTime = 0;
  carry = 0;

  frame = requestAnimationFrame(tick);
}

/*
 * byUser: khách bấm nút "chạm để dừng" → dừng hẳn, không
 * tự chạy lại nữa.
 */
function stop(byUser = false) {
  running.value = false;

  cancelAnimationFrame(frame);

  frame = null;

  if (byUser) {
    finished = true;

    clearTimeout(idleTimer);
  }
}

function schedule(delay) {
  clearTimeout(idleTimer);

  if (blocked || !enabled.value || finished) {
    return;
  }

  idleTimer = setTimeout(start, delay);
}

/*
 * Mọi thao tác của khách: dừng ngay, đợi rảnh tay lại rồi
 * mới cuộn tiếp.
 */
function onInteract() {
  if (running.value) {
    stop(false);
  }

  schedule(RESUME_DELAY);
}

const EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"];

onMounted(() => {
  EVENTS.forEach((name) =>
    window.addEventListener(name, onInteract, { passive: true, capture: true })
  );

  schedule(START_DELAY);
});

onBeforeUnmount(() => {
  stop(false);

  clearTimeout(idleTimer);

  EVENTS.forEach((name) =>
    window.removeEventListener(name, onInteract, { capture: true })
  );
});

watch(enabled, (value) => {
  if (value) {
    schedule(START_DELAY);
  } else {
    stop(false);

    clearTimeout(idleTimer);
  }
});
</script>

<style scoped>
.auto-scroll-hint {
  position: fixed;
  left: 50%;
  bottom: calc(18px + env(safe-area-inset-bottom, 0px));
  z-index: 900;

  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 7px 14px;

  color: #fff;

  border: 0;
  border-radius: 999px;

  background: rgba(20, 16, 14, 0.62);

  backdrop-filter: blur(6px);

  font-size: 11.5px;
  letter-spacing: 0.03em;

  transform: translateX(-50%);

  cursor: pointer;
}

.auto-scroll-hint__dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #fff;

  animation: auto-scroll-pulse 1.4s ease-in-out infinite;
}

@keyframes auto-scroll-pulse {
  50% {
    opacity: 0.3;
  }
}

.auto-scroll-hint-enter-active,
.auto-scroll-hint-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.auto-scroll-hint-enter-from,
.auto-scroll-hint-leave-to {
  opacity: 0;

  transform: translate(-50%, 8px);
}
</style>
