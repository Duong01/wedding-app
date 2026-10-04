<template>
  <!--
    Vòng quay may mắn — CSS conic-gradient, không dependency.

    Mỗi ô 1 phần thưởng; bấm nút QUAY ở tâm → quay 5 vòng +
    dừng đúng ô ngẫu nhiên → hiện kết quả + nút "Quay tiếp".

    Chế độ quà (prizeMode): mỗi khách chỉ quay 1 lần — sau
    lần quay đầu khoá nút và emit win(prizeTitle) để
    GameSection hiện form nhận quà.
  -->
  <div class="lucky-wheel">
    <div class="lucky-wheel__stage">
      <!-- Kim chỉ phía trên -->
      <span class="lucky-wheel__pointer" aria-hidden="true">▼</span>

      <div
        class="lucky-wheel__rotor"
        :style="rotorStyle"
        @transitionend="onSpinEnd"
      >
        <div class="lucky-wheel__disc" :style="discStyle"></div>

        <span
          v-for="(prize, index) in prizes"
          :key="`${index}-${prize}`"
          class="lucky-wheel__label"
          :class="{ 'lucky-wheel__label--on-light': index % 2 === 1 }"
          :style="labelStyle(index)"
        >
          {{ prize }}
        </span>
      </div>

      <button
        type="button"
        class="lucky-wheel__hub"
        :disabled="spinning || locked"
        @click="spin"
      >
        {{ spinning ? "..." : locked ? "✓" : "QUAY" }}
      </button>
    </div>

    <!-- Kết quả — chế độ quà thì GameSection tự hiện form nhận quà -->
    <Transition name="lucky-wheel-pop">
      <div v-if="result && !prizeMode" class="lucky-wheel__result">
        <span class="lucky-wheel__result-orn" aria-hidden="true">✦</span>

        <strong>{{ result }}</strong>

        <button type="button" class="lucky-wheel__again" @click="result = null">
          Quay tiếp
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  prizes: { type: Array, default: () => [] },

  /*
   * Chế độ quà: quà thật từ cô dâu chú rể — khoá sau lần
   * quay đầu, emit win thay vì hộp kết quả nội bộ.
   */
  prizeMode: { type: Boolean, default: false },
});

const emit = defineEmits(["win"]);

const spinning = ref(false);

const result = ref(null);

const rotation = ref(0);

const locked = ref(false);

const count = computed(() => props.prizes.length);

/*
 * Mỗi ô chiếm bao nhiêu độ. 8 phần thưởng → 45°/ô.
 */
const slice = computed(() => (count.value ? 360 / count.value : 360));

/*
 * Nền vòng quay: các ô xen kẽ 2 màu — dùng biến màu của
 * theme (fallback trung tính khi theme hardcode màu).
 */
const discStyle = computed(() => {
  if (!count.value) {
    return {};
  }

  /*
   * --solid / --wheel-light: cặp ô đậm–sáng đã kiểm tra
   * tương phản với chữ trên ô (xem useSectionTheme).
   */
  const a = "var(--solid, var(--primary, #8a7a68))";

  const b = "var(--wheel-light, var(--accent-light, #f7d8a3))";

  const stops = [];

  for (let i = 0; i < count.value; i += 1) {
    const from = i * slice.value;
    const to = from + slice.value;
    const color = i % 2 === 0 ? a : b;
    stops.push(`${color} ${from}deg ${to}deg`);
  }

  return { background: `conic-gradient(${stops.join(", ")})` };
});

const rotorStyle = computed(() => ({
  transform: `rotate(${rotation.value}deg)`,
  transition: spinning.value
    ? "transform 4s cubic-bezier(0.2, 0.8, 0.2, 1)"
    : "none",
}));

/*
 * Nhãn nằm dọc theo bán kính: xoay đến giữa ô rồi đẩy
 * ra ngoài bằng translateY âm.
 */
function labelStyle(index) {
  const angle = index * slice.value + slice.value / 2;

  return {
    transform: `rotate(${angle}deg) translateY(-38%)`,
  };
}

function spin() {
  if (spinning.value || !count.value) {
    return;
  }

  result.value = null;

  const index = Math.floor(Math.random() * count.value);

  /*
   * Kim ở phía trên (0°). Muốn ô index dừng dưới kim:
   * góc tâm ô = index*slice + slice/2 (tính theo chiều kim
   * đồng hồ từ 0°) → rotor phải quay thêm bù sao cho góc
   * đó về 0° (mod 360), cộng 5 vòng cho đã tay.
   */
  const target =
    360 * 5 + (360 - (index * slice.value + slice.value / 2));

  /*
   * Cộng dồn từ vị trí hiện tại (mod 360) để lần quay sau
   * không "nhảy" về 0.
   */
  const current = ((rotation.value % 360) + 360) % 360;

  rotation.value += target - current;

  /*
   * prefers-reduced-motion: transition bị tắt ở CSS dưới —
   * transitionend không bao giờ fire → resolve ngay tại đây.
   */
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    finishSpin(index);

    return;
  }

  spinning.value = true;

  finishSpin.index = index;
}

function onSpinEnd() {
  if (!spinning.value) {
    return;
  }

  spinning.value = false;

  finishSpin(finishSpin.index);
}

function finishSpin(index) {
  result.value = props.prizes[index] || props.prizes[0] || "";

  /*
   * Chế độ quà: khoá vòng quay (1 quà/khách) và báo
   * GameSection hiện form nhận quà.
   */
  if (props.prizeMode) {
    locked.value = true;

    emit("win", result.value);

    return;
  }

  /*
   * Pháo giấy khi trúng — canvas-confetti đã có trong deps.
   * Bọc try/catch: môi trường SSR / thiếu canvas thì bỏ qua.
   */
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
    /* bỏ qua — pháo giấy chỉ là trang trí */
  }
}
</script>

<style scoped>
.lucky-wheel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}

.lucky-wheel__stage {
  position: relative;

  width: min(78vw, 320px);
  aspect-ratio: 1;
}

.lucky-wheel__pointer {
  position: absolute;
  top: -6px;
  left: 50%;
  z-index: 3;

  transform: translateX(-50%);

  /*
   * --sec-heading: màu đã kiểm tra tương phản với nền thật
   * của thiệp (primary trùng màu nền ở thiệp nền tối).
   */
  color: var(--sec-heading, var(--text, #8a7a68));

  font-size: 22px;
  line-height: 1;

  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.25));
}

.lucky-wheel__rotor {
  position: absolute;
  inset: 0;

  border-radius: 50%;

  /* Vành giấy + viền mảnh màu thiệp tách vòng quay khỏi nền */
  box-shadow: 0 0 0 2px var(--sec-line, transparent),
    0 10px 30px rgba(0, 0, 0, 0.18),
    inset 0 0 0 6px var(--card-bg, #fff);
}

.lucky-wheel__disc {
  position: absolute;
  inset: 0;

  border-radius: 50%;
}

.lucky-wheel__label {
  position: absolute;
  top: 50%;
  left: 50%;

  width: 42%;

  margin: 0;

  transform-origin: 0 0;

  /* Ô đậm --solid: chữ kem đã kiểm tra tương phản */
  color: var(--solid-ink, #fff);

  font-size: clamp(9px, 2.6vw, 12px);
  font-weight: 700;

  text-align: right;

  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);

  /*
   * transform set inline (rotate + translateY) — origin
   * 0 0 tính từ tâm vòng để nhãn tỏa ra theo bán kính.
   */
  transform-origin: 0 0;
}

/*
 * Ô lẻ nền --wheel-light (màu SÁNG) — chữ trắng tàng hình,
 * đổi sang mực tối đã kiểm tra tương phản (xem useSectionTheme).
 */
.lucky-wheel__label--on-light {
  color: var(--card-ink, #5c4d46);

  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.45);
}

.lucky-wheel__hub {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;

  width: 27%;
  aspect-ratio: 1;

  transform: translate(-50%, -50%);

  color: var(--btn-ink, #fff);

  border: 3px solid var(--card-bg, #fff);
  border-radius: 50%;

  background: var(--btn-bg, var(--primary, #8a7a68));

  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);

  font-size: clamp(12px, 3.4vw, 15px);
  font-weight: 800;
  letter-spacing: 0.08em;

  cursor: pointer;

  transition: transform 0.2s ease;
}

.lucky-wheel__hub:hover:not(:disabled) {
  transform: translate(-50%, -50%) scale(1.06);
}

.lucky-wheel__hub:disabled {
  cursor: wait;
}

.lucky-wheel__result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  padding: 16px 22px;

  /*
   * Khung trong suốt — chữ nằm thẳng trên nền thiệp nên
   * dùng --sec-* (--card-ink là mực tối, trên thiệp nền
   * đỏ/đen sẽ tàng hình).
   */
  color: var(--sec-text, var(--text, #5c4d46));

  border: 1px dashed var(--sec-line, var(--accent, #c79d5c));
  border-radius: 16px;

  /* background: var(--white, #613f3f); */
}

.lucky-wheel__result-orn {
  color: var(--sec-eyebrow, var(--accent, #c79d5c));

  font-size: 16px;
}

.lucky-wheel__result strong {
  color: var(--sec-heading, inherit);

  font-family: var(--font-heading, Georgia, serif);

  font-size: clamp(17px, 5vw, 22px);

  text-align: center;
}

.lucky-wheel__again {
  padding: 8px 18px;

  color: var(--btn-ink, #fff);

  border: 0;
  border-radius: 999px;

  background: var(--btn-bg, var(--primary, #8a7a68));

  font-size: 12px;
  font-weight: 700;

  cursor: pointer;
}

.lucky-wheel-pop-enter-active,
.lucky-wheel-pop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.lucky-wheel-pop-enter-from,
.lucky-wheel-pop-leave-to {
  opacity: 0;

  transform: translateY(10px) scale(0.96);
}

@media (prefers-reduced-motion: reduce) {
  .lucky-wheel__rotor {
    transition: none !important;
  }

  .lucky-wheel__hub {
    transition: none;
  }
}
</style>
