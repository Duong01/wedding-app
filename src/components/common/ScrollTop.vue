<template>
  <Transition name="scroll-top">
    <button
      v-if="visible"
      type="button"
      class="scroll-top"
      aria-label="Lên đầu trang"
      title="Lên đầu trang"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 5.5 5.5 12l1.4 1.4L11 9.3V19h2V9.3l4.1 4.1L18.5 12z"
          fill="currentColor"
        />
      </svg>

      <span class="scroll-top__ring" aria-hidden="true"></span>
    </button>
  </Transition>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

/*
 * Nút "lên đầu trang" — trang chủ và các trang marketing nay
 * dài hơn hẳn, trên điện thoại khách phải vuốt rất nhiều mới
 * tới được header. Nút chỉ hiện sau khi đã cuộn qua một màn
 * hình để không che nội dung lúc mới mở trang.
 */
const SHOW_AFTER = 420;

const visible = ref(false);

function handleScroll() {
  visible.value = window.scrollY > SHOW_AFTER;
}

function scrollToTop() {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  window.scrollTo({
    top: 0,
    behavior: reduced ? "auto" : "smooth",
  });
}

onMounted(() => {
  handleScroll();

  window.addEventListener("scroll", handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.scroll-top {
  position: fixed;

  right: 20px;
  bottom: calc(20px + env(safe-area-inset-bottom));

  z-index: 40;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 46px;
  height: 46px;

  padding: 0;

  border: 1px solid rgba(185, 151, 91, 0.45);
  border-radius: 50%;

  background: rgba(255, 253, 248, 0.92);
  color: var(--studio-seal, #a63a2e);

  backdrop-filter: blur(10px);

  box-shadow: 0 14px 32px rgba(43, 33, 24, 0.18);

  cursor: pointer;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
}

.scroll-top:hover {
  transform: translateY(-3px);

  background: #fffdf8;

  box-shadow: 0 20px 40px rgba(43, 33, 24, 0.24);
}

.scroll-top:active {
  transform: scale(0.94);
}

.scroll-top svg {
  width: 22px;
  height: 22px;
}

/*
 * Vòng nhấp nháy quanh nút — chỉ để mắt bắt được nút trên
 * nền trang nhiều hoạ tiết.
 */
.scroll-top__ring {
  position: absolute;

  inset: -5px;

  border: 1px solid rgba(166, 58, 46, 0.28);
  border-radius: 50%;

  pointer-events: none;

  animation: scroll-top-pulse 2.6s ease-out infinite;
}

@keyframes scroll-top-pulse {
  0% {
    transform: scale(0.92);

    opacity: 0.7;
  }

  70%,
  100% {
    transform: scale(1.22);

    opacity: 0;
  }
}

.scroll-top-enter-active,
.scroll-top-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;

  transform: translateY(14px) scale(0.8);
}

@media (min-width: 768px) {
  .scroll-top {
    right: 28px;
    bottom: 28px;

    width: 52px;
    height: 52px;
  }

  .scroll-top svg {
    width: 24px;
    height: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-top,
  .scroll-top-enter-active,
  .scroll-top-leave-active {
    transition: none;
  }

  .scroll-top__ring {
    animation: none;

    opacity: 0;
  }
}
</style>
