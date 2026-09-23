<template>
  <Teleport to="body">
    <div
      ref="rootRef"
      class="gm"
      :class="{
        'is-open': opened,
        'is-dragging': drag.mode === 'close',
        'is-panning': drag.mode === 'pan' || drag.mode === 'pinch',
        'is-zoomed': zoomed,
      }"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      tabindex="-1"
      :style="dragStyle"
    >
      <!-- =====================================================
           NỀN
      ====================================================== -->

      <div class="gm__bg" aria-hidden="true"></div>

      <!-- =====================================================
           THANH TRÊN
      ====================================================== -->

      <header class="gm__bar">
        <p v-if="images.length" class="gm__counter">
          <strong>{{ pad(index + 1) }}</strong>
          <span aria-hidden="true">/</span>
          <em>{{ pad(images.length) }}</em>
        </p>

        <p class="gm__title">{{ title }}</p>

        <div class="gm__tools">
          <button
            v-if="zoomed"
            type="button"
            class="gm__tool"
            aria-label="Thu nhỏ ảnh"
            @click="resetZoom"
          >
            <span class="gm__zoom-badge">{{ zoom.toFixed(1) }}×</span>
          </button>

          <button
            type="button"
            class="gm__tool gm__tool--close"
            aria-label="Đóng album"
            @click="close"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <!--
          Thanh tiến độ: cho biết đang ở đâu trong album mà không
          phải đếm số. Chạy bằng transform để không phải layout lại.
        -->
        <div v-if="images.length > 1" class="gm__progress" aria-hidden="true">
          <span :style="{ transform: `scaleX(${progress})` }"></span>
        </div>
      </header>

      <!-- =====================================================
           ẢNH LỚN
      ====================================================== -->

      <main
        class="gm__stage"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @dblclick="onDoubleClick"
        @wheel="onWheel"
      >
        <button
          v-if="images.length > 1"
          type="button"
          class="gm__arrow gm__arrow--prev"
          aria-label="Ảnh trước"
          @click.stop="prev"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div ref="frameRef" class="gm__frame">
          <div class="gm__zoom" :style="zoomStyle">
            <!--
              Không dùng mode="out-in": cần cả hai ảnh cùng tồn tại
              trong lúc chuyển để trượt chồng lên nhau. Ảnh nằm
              position:absolute nên chúng xếp lớp thay vì đẩy nhau.
            -->
            <Transition :name="`gm-swap-${dir > 0 ? 'next' : 'prev'}`">
              <img
                v-if="current"
                :key="current.key"
                :src="current.src"
                :alt="current.title || `Ảnh cưới ${index + 1}`"
                class="gm__photo"
                draggable="false"
                decoding="async"
                @load="markLoaded(current.key)"
                @error="markLoaded(current.key)"
              />
            </Transition>
          </div>

          <!--
            Ảnh lớn thường đã nằm sẵn trong cache nhờ preload hàng
            xóm, nhưng ảnh đầu tiên thì chưa — vòng xoay này lấp
            khoảng trống đó.
          -->
          <span
            v-if="current && !loadedKeys.has(current.key)"
            class="gm__spinner"
            aria-hidden="true"
          ></span>
        </div>

        <button
          v-if="images.length > 1"
          type="button"
          class="gm__arrow gm__arrow--next"
          aria-label="Ảnh tiếp theo"
          @click.stop="next"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 5l7 7-7 7"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </main>

      <!-- =====================================================
           CHÚ THÍCH
      ====================================================== -->

      <p v-if="current?.title" :key="current.key" class="gm__caption">
        {{ current.title }}
      </p>

      <!-- =====================================================
           DẢI ẢNH NHỎ
      ====================================================== -->

      <nav v-if="images.length > 1" class="gm__strip">
        <button
          v-for="(item, i) in images"
          :key="item.id"
          :ref="(el) => setThumbRef(el, i)"
          type="button"
          class="gm__thumb"
          :class="{ 'is-active': i === index }"
          :aria-label="`Xem ảnh ${i + 1}`"
          :aria-current="i === index ? 'true' : undefined"
          @click="goTo(i)"
        >
          <img :src="item.src" alt="" loading="lazy" decoding="async" />
        </button>
      </nav>
    </div>
  </Teleport>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

/*
 * =========================================================
 * ALBUM ẢNH TOÀN MÀN HÌNH — DÙNG CHUNG CHO MỌI MẪU THIỆP
 * =========================================================
 * Mọi theme đều có một lưới hoặc carousel ảnh nhỏ; bấm vào đó
 * thì mở component này để xem ảnh lớn. Trước đây mỗi theme tự
 * dựng lightbox riêng nên giao diện lệch nhau và sửa một chỗ
 * không áp cho chỗ khác — nay gom về đây.
 *
 * Cách dùng:
 *   <GalleryModal
 *     v-if="open"
 *     :images="gallery"
 *     :start-index="currentIndex"
 *     @close="open = false"
 *   />
 *
 * `images` nhận cả hai dạng đang tồn tại trong repo:
 *   - mảng chuỗi đường dẫn ảnh
 *   - mảng object thô từ API (Image / Url / Src / ImageUrl)
 * nên theme không phải chuẩn hoá trước khi truyền.
 *
 * Component tự khoá cuộn trang và tự trả lại như cũ khi đóng,
 * nên theme không cần đụng tới document.body.
 *
 * ---------------------------------------------------------
 * NHỮNG THỨ LÀM NÊN CẢM GIÁC "MƯỢT"
 * ---------------------------------------------------------
 * 1. Chuyển ảnh có hướng — ảnh mới trượt vào từ phía mà người
 *    dùng vừa đi tới, ảnh cũ trượt ra ngược lại, hai ảnh chồng
 *    lớp nhau nên không có khoảng trắng ở giữa.
 * 2. Tải trước hàng xóm — ảnh kế tiếp thường đã nằm trong cache
 *    trước khi người dùng bấm, nên chuyển gần như tức thì.
 * 3. Kéo xuống để đóng — khung ảnh đi theo ngón tay rồi mờ dần,
 *    đúng thói quen xem ảnh trên điện thoại.
 * 4. Phóng to tại điểm chạm — nhấp đúp hoặc chụm hai ngón để
 *    xem chi tiết, kéo để di chuyển khi đang phóng to.
 * 5. Tôn trọng prefers-reduced-motion — tắt hết chuyển động.
 * =========================================================
 */

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },

  /* Ảnh mở sẵn khi album vừa hiện */
  startIndex: {
    type: Number,
    default: 0,
  },

  title: {
    type: String,
    default: "Album ảnh",
  },
});

const emit = defineEmits(["close"]);

/* =========================================================
   CHUẨN HOÁ ẢNH
========================================================= */

const images = computed(() =>
  (props.images || [])
    .map((item, i) => {
      if (typeof item === "string") {
        return { id: `s-${i}`, key: `s-${i}`, src: item, title: "" };
      }

      const data = item || {};
      const id = data.Id ?? data.id ?? `o-${i}`;

      return {
        id,
        key: String(id),
        src:
          data.Image ||
          data.Url ||
          data.Src ||
          data.ImageUrl ||
          data.image ||
          "",
        title: data.Title || data.Caption || "",
      };
    })
    .filter((item) => item.src)
);

/* =========================================================
   VỊ TRÍ HIỆN TẠI
========================================================= */

function clamp(value) {
  const total = images.value.length;

  if (!total) {
    return 0;
  }

  return Math.min(Math.max(Number(value) || 0, 0), total - 1);
}

/*
 * Khởi tạo ngay từ prop thay vì đợi onMounted: nếu để đến lúc
 * mount mới nhảy tới ảnh cần xem thì khung hình đầu tiên đã
 * hiện ảnh số 1 rồi mới nhảy — thấy rõ một cái chớp.
 */
const index = ref(clamp(props.startIndex));

const current = computed(() => images.value[index.value] || null);

/* Hướng đi của lần chuyển gần nhất: 1 = tới, -1 = lùi. */
const dir = ref(1);

const progress = computed(() => {
  const total = images.value.length;

  return total > 1 ? (index.value + 1) / total : 1;
});

/* =========================================================
   THEO DÕI ẢNH ĐÃ TẢI
========================================================= */

const loadedKeys = ref(new Set());

function markLoaded(key) {
  const next = new Set(loadedKeys.value);

  next.add(key);

  loadedKeys.value = next;
}

/*
 * Tải trước ảnh kế tiếp và ảnh liền trước. Album cưới hay được
 * xem tuần tự nên chỉ cần hai hướng này là đủ; tải cả album sẽ
 * tốn băng thông vô ích.
 */
function preloadAround() {
  const total = images.value.length;

  if (!total) {
    return;
  }

  [index.value + 1, index.value - 1].forEach((i) => {
    const item = images.value[(i + total) % total];

    if (!item || loadedKeys.value.has(item.key)) {
      return;
    }

    const img = new Image();

    img.onload = () => markLoaded(item.key);
    img.src = item.src;
  });
}

/* =========================================================
   ĐIỀU HƯỚNG
========================================================= */

function goTo(target) {
  const next = clamp(target);

  if (next === index.value) {
    return;
  }

  dir.value = next > index.value ? 1 : -1;

  index.value = next;

  resetZoom();
  scrollThumbIntoView(next);
  preloadAround();
}

/*
 * Vòng qua hai đầu: ảnh cuối → ảnh đầu. Album cưới thường được
 * xem hết một lượt nên vòng lại tiện hơn là chặn cứng.
 */
function prev() {
  if (images.value.length < 2) {
    return;
  }

  goTo(index.value === 0 ? images.value.length - 1 : index.value - 1);
}

function next() {
  if (images.value.length < 2) {
    return;
  }

  goTo(index.value === images.value.length - 1 ? 0 : index.value + 1);
}

function pad(number) {
  return String(number).padStart(2, "0");
}

/* =========================================================
   DẢI ẢNH NHỎ
========================================================= */

const thumbRefs = ref([]);

function setThumbRef(el, i) {
  if (el) {
    thumbRefs.value[i] = el;
  }
}

/*
 * Giữ ảnh nhỏ đang xem nằm trong tầm mắt. `block: "nearest"`
 * để không kéo trang chính, `inline: "center"` để ảnh nằm giữa
 * dải — hai ảnh kề hai bên vẫn thấy được.
 */
function scrollThumbIntoView(i) {
  nextTick(() => {
    thumbRefs.value[i]?.scrollIntoView({
      behavior: prefersReduced() ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  });
}

/* =========================================================
   PHÓNG TO & DI CHUYỂN
========================================================= */

const zoom = ref(1);
const panX = ref(0);
const panY = ref(0);

/* Gốc phóng to tính theo % kích thước khung — đặt tại điểm chạm. */
const originX = ref(50);
const originY = ref(50);

const zoomed = computed(() => zoom.value > 1.01);

const zoomStyle = computed(() => ({
  transform: `translate3d(${panX.value}px, ${panY.value}px, 0) scale(${zoom.value})`,
  transformOrigin: `${originX.value}% ${originY.value}%`,
}));

const MAX_ZOOM = 4;

function resetZoom() {
  zoom.value = 1;
  panX.value = 0;
  panY.value = 0;
  originX.value = 50;
  originY.value = 50;
}

function zoomAt(clientX, clientY, factor) {
  const frame = frameRef.value;

  if (!frame) {
    return;
  }

  const rect = frame.getBoundingClientRect();

  originX.value = ((clientX - rect.left) / rect.width) * 100;
  originY.value = ((clientY - rect.top) / rect.height) * 100;

  zoom.value = Math.min(Math.max(zoom.value * factor, 1), MAX_ZOOM);

  if (!zoomed.value) {
    resetZoom();

    return;
  }

  clampPan();
}

/*
 * Chặn không cho kéo ảnh ra khỏi khung. Ở mức phóng to z, ảnh
 * rộng hơn khung (z - 1) lần, nên phần được phép dịch chuyển
 * mỗi chiều đúng bằng một nửa khoảng dư đó.
 */
function clampPan() {
  const frame = frameRef.value;

  if (!frame) {
    return;
  }

  const rect = frame.getBoundingClientRect();

  const maxX = (rect.width * (zoom.value - 1)) / 2;
  const maxY = (rect.height * (zoom.value - 1)) / 2;

  panX.value = Math.min(Math.max(panX.value, -maxX), maxX);
  panY.value = Math.min(Math.max(panY.value, -maxY), maxY);
}

function onDoubleClick(event) {
  if (zoomed.value) {
    resetZoom();

    return;
  }

  zoomAt(event.clientX, event.clientY, 2.2);
}

/*
 * Lăn chuột: giữ Ctrl (hoặc chụm hai ngón trên trackpad, trình
 * duyệt báo về dưới dạng ctrlKey) là phóng to; lăn thường là
 * chuyển ảnh. Có chốt chặn thời gian để một cú vuốt trackpad
 * không nhảy qua mấy ảnh một lúc.
 */
let wheelLock = 0;

function onWheel(event) {
  if (event.ctrlKey || event.metaKey) {
    event.preventDefault();

    zoomAt(event.clientX, event.clientY, event.deltaY < 0 ? 1.15 : 1 / 1.15);

    return;
  }

  if (zoomed.value || images.value.length < 2) {
    return;
  }

  event.preventDefault();

  const now = Date.now();

  if (now - wheelLock < 320) {
    return;
  }

  wheelLock = now;

  if (event.deltaY > 0) {
    next();
  } else {
    prev();
  }
}

/* =========================================================
   KÉO & VUỐT
========================================================= */

const frameRef = ref(null);

const drag = ref({ mode: null, x: 0, y: 0, dx: 0, dy: 0 });

/*
 * Danh sách ngón đang chạm. Cần cả map chứ không chỉ một toạ độ
 * vì thao tác chụm cần biết hai ngón cùng lúc.
 */
const pointers = new Map();

/* Trạng thái chụm hai ngón: khoảng cách và mức phóng to lúc bắt đầu. */
let pinchStart = 0;
let pinchZoom = 1;

const SWIPE_MIN = 45;
const CLOSE_MIN = 90;

/*
 * Kéo xuống để đóng: khung ảnh đi theo ngón tay và mờ dần, nên
 * người dùng thấy trước là thả ra sẽ đóng — không phải đoán.
 */
const dragStyle = computed(() => {
  if (drag.value.mode !== "close") {
    return null;
  }

  const dy = Math.max(drag.value.dy, 0);

  return {
    "--gm-drag-y": `${dy}px`,
    "--gm-drag-fade": String(Math.max(1 - dy / 420, 0.35)),
  };
});

function pointerDistance() {
  const [a, b] = [...pointers.values()];

  return Math.hypot(a.x - b.x, a.y - b.y);
}

function pointerMidpoint() {
  const [a, b] = [...pointers.values()];

  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function onPointerDown(event) {
  if (event.pointerType === "mouse" && event.button !== 0) {
    return;
  }

  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  /*
   * Ngón thứ hai hạ xuống: chuyển hẳn sang chế độ chụm, huỷ mọi
   * phán đoán kéo/vuốt đang dở — nếu không thì vừa chụm vừa
   * chuyển ảnh.
   */
  if (pointers.size === 2) {
    pinchStart = pointerDistance();
    pinchZoom = zoom.value;

    drag.value = { mode: "pinch", x: 0, y: 0, dx: 0, dy: 0 };

    return;
  }

  if (pointers.size > 2) {
    return;
  }

  drag.value = {
    mode: null,
    x: event.clientX,
    y: event.clientY,
    dx: 0,
    dy: 0,
  };
}

function onPointerMove(event) {
  if (!pointers.has(event.pointerId)) {
    return;
  }

  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (drag.value.mode === "pinch") {
    if (pointers.size < 2 || !pinchStart) {
      return;
    }

    const mid = pointerMidpoint();

    zoomAt(mid.x, mid.y, (pointerDistance() / pinchStart) * (pinchZoom / zoom.value));

    return;
  }

  if (!drag.value.x && !drag.value.y) {
    return;
  }

  const dx = event.clientX - drag.value.x;
  const dy = event.clientY - drag.value.y;

  drag.value.dx = dx;
  drag.value.dy = dy;

  if (drag.value.mode) {
    return;
  }

  /* Chưa đủ xa thì chưa đoán ý người dùng. */
  if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
    return;
  }

  if (zoomed.value) {
    drag.value.mode = "pan";

    return;
  }

  /*
   * Nghiêng về chiều dọc thì hiểu là muốn đóng; nghiêng về chiều
   * ngang là muốn chuyển ảnh. So sánh có hệ số để thao tác chéo
   * không bị nhận nhầm.
   */
  drag.value.mode = Math.abs(dy) > Math.abs(dx) * 1.2 ? "close" : "nav";
}

function onPointerUp(event) {
  pointers.delete(event.pointerId);

  const { mode, dx, dy } = drag.value;

  /*
   * Còn một ngón sau khi nhấc: kết thúc chụm nhưng chưa kết thúc
   * thao tác — người dùng có thể đang muốn kéo ảnh đã phóng to.
   */
  if (mode === "pinch") {
    if (pointers.size < 2) {
      pinchStart = 0;

      /*
       * Ngón còn lại tiếp tục làm mốc kéo ảnh — lấy toạ độ hiện
       * tại của nó, nếu không thì lần di chuyển sau bị coi là
       * chưa bắt đầu và thao tác kéo bị nuốt.
       */
      const rest = [...pointers.values()][0];

      drag.value = {
        mode: zoomed.value ? "pan" : null,
        x: rest?.x ?? 0,
        y: rest?.y ?? 0,
        dx: 0,
        dy: 0,
      };
    }

    return;
  }

  drag.value = { mode: null, x: 0, y: 0, dx: 0, dy: 0 };

  if (mode === "close") {
    if (dy > CLOSE_MIN) {
      close();
    }

    return;
  }

  if (mode === "pan") {
    panX.value += dx;
    panY.value += dy;

    clampPan();

    return;
  }

  if (mode === "nav" && Math.abs(dx) > SWIPE_MIN) {
    if (dx < 0) {
      next();
    } else {
      prev();
    }
  }
}

/* =========================================================
   BÀN PHÍM
========================================================= */

function onKeydown(event) {
  if (event.key === "Escape") {
    event.preventDefault();

    if (zoomed.value) {
      resetZoom();
    } else {
      close();
    }

    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    prev();

    return;
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    next();

    return;
  }

  if (event.key === "0") {
    resetZoom();
  }
}

/* =========================================================
   ĐÓNG
========================================================= */

function close() {
  emit("close");
}

/* =========================================================
   VÒNG ĐỜI
========================================================= */

const rootRef = ref(null);

const opened = ref(false);

let prevOverflow = "";
let prevOverscroll = "";

function prefersReduced() {
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
  );
}

onMounted(async () => {
  prevOverflow = document.body.style.overflow;
  prevOverscroll = document.body.style.overscrollBehavior;

  document.body.style.overflow = "hidden";
  document.body.style.overscrollBehavior = "none";

  /*
   * Lắng nghe ở window chứ không chỉ trên root: nút điều hướng
   * có thể giữ focus, mà Escape thì phải ăn ở mọi nơi.
   */
  window.addEventListener("keydown", onKeydown);

  await nextTick();

  rootRef.value?.focus({ preventScroll: true });

  scrollThumbIntoView(index.value);
  preloadAround();

  /*
   * Bật cờ sau khi đã vẽ xong khung hình đầu — nếu bật ngay từ
   * đầu thì trình duyệt gộp hai trạng thái làm một và mất hiệu
   * ứng mở.
   */
  requestAnimationFrame(() => {
    opened.value = true;
  });
});

onBeforeUnmount(() => {
  document.body.style.overflow = prevOverflow;
  document.body.style.overscrollBehavior = prevOverscroll;

  window.removeEventListener("keydown", onKeydown);
});

/* Ảnh đổi từ bên ngoài (theme đổi bộ lọc) thì kéo chỉ số về. */
watch(
  () => images.value.length,
  (total) => {
    if (index.value > total - 1) {
      index.value = Math.max(total - 1, 0);
    }
  }
);
</script>

<style scoped>
/* =========================================================
   KHUNG
========================================================= */

.gm {
  position: fixed;
  inset: 0;

  z-index: 99999;

  display: grid;

  /*
   * THANH TRÊN · ẢNH · CHÚ THÍCH · DẢI ẢNH NHỎ
   * Hàng ảnh dùng minmax(0, 1fr) để ảnh cao bao nhiêu cũng
   * không đẩy các hàng còn lại ra khỏi màn hình.
   */
  grid-template-rows: 56px minmax(0, 1fr) auto auto;

  overflow: hidden;

  color: #f6efe4;

  background: #0d0a09;

  outline: none;

  isolation: isolate;

  opacity: 0;

  transition: opacity 0.32s ease;
}

.gm.is-open {
  opacity: 1;
}

/*
 * Lúc kéo xuống để đóng, cả khung trôi theo ngón tay và nhạt
 * dần. Dùng biến do JS đặt để không phải ghi inline style đè
 * lên transform của chính khung.
 */
.gm.is-dragging {
  transform: translate3d(0, var(--gm-drag-y, 0), 0);

  opacity: var(--gm-drag-fade, 1);

  transition: none;
}

.gm__bg {
  position: absolute;
  inset: 0;

  z-index: -1;

  background:
    radial-gradient(
      ellipse at 50% 38%,
      rgba(255, 255, 255, 0.07),
      transparent 42%
    ),
    linear-gradient(150deg, #1a1210 0%, #0b0807 52%, #16100d 100%);

  pointer-events: none;
}

/* =========================================================
   THANH TRÊN
========================================================= */

.gm__bar {
  position: relative;

  z-index: 3;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  gap: 12px;

  padding: 0 14px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  background: rgba(11, 8, 7, 0.72);

  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);

  transform: translateY(-100%);

  transition: transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

.gm.is-open .gm__bar {
  transform: translateY(0);
}

.gm__counter {
  display: flex;
  align-items: baseline;

  gap: 5px;

  margin: 0;

  font-variant-numeric: tabular-nums;
}

.gm__counter strong {
  color: #f0d9a4;

  font-size: 15px;
  font-weight: 600;
}

.gm__counter span,
.gm__counter em {
  color: rgba(246, 239, 228, 0.42);

  font-size: 12px;
  font-style: normal;
}

.gm__title {
  margin: 0;

  color: #f0d9a4;

  font-size: 11px;
  font-weight: 600;

  letter-spacing: 0.2em;
  text-transform: uppercase;

  text-align: center;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gm__tools {
  justify-self: end;

  display: flex;
  align-items: center;

  gap: 8px;
}

.gm__tool {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 36px;
  min-width: 36px;

  padding: 0 10px;

  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.05);
  color: #f6efe4;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.gm__tool svg {
  width: 18px;
  height: 18px;
}

.gm__tool:hover {
  border-color: rgba(240, 217, 164, 0.5);

  background: rgba(240, 217, 164, 0.14);
}

.gm__zoom-badge {
  font-size: 11.5px;
  font-weight: 600;

  font-variant-numeric: tabular-nums;

  letter-spacing: 0.02em;
}

/* =========================================================
   THANH TIẾN ĐỘ
========================================================= */

.gm__progress {
  position: absolute;

  right: 0;
  bottom: -1px;
  left: 0;

  height: 2px;

  overflow: hidden;
}

.gm__progress span {
  display: block;

  width: 100%;
  height: 100%;

  transform-origin: left center;

  background: linear-gradient(
    90deg,
    rgba(240, 217, 164, 0.35),
    #f0d9a4
  );

  transition: transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

/* =========================================================
   ẢNH LỚN
========================================================= */

.gm__stage {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  min-height: 0;

  padding: 14px;

  /*
   * Chặn trình duyệt tự cuộn/kéo trang khi người dùng vuốt —
   * mọi thao tác chạm đều do component xử lý.
   */
  touch-action: none;
}

.gm__frame {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  min-height: 0;

  transform: scale(0.94);

  opacity: 0;

  transition:
    transform 0.46s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.36s ease;
}

.gm.is-open .gm__frame {
  transform: scale(1);

  opacity: 1;
}

.gm__zoom {
  position: absolute;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

/*
 * Khi đang kéo ảnh hoặc chụm ngón, bỏ hẳn hiệu ứng trượt của
 * transform — nếu giữ, ảnh sẽ đuổi theo ngón tay một cách trễ
 * nhịp và cảm giác rất "dính".
 */
.gm.is-panning .gm__zoom {
  transition: none;
}

.gm__photo {
  position: absolute;
  inset: 0;

  width: auto;
  height: auto;

  max-width: 100%;
  max-height: 100%;

  margin: auto;

  object-fit: contain;

  border-radius: 4px;

  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);

  user-select: none;
  -webkit-user-drag: none;
}

/* =========================================================
   CHUYỂN ẢNH CÓ HƯỚNG
   ---------------------------------------------------------
   Ảnh mới trượt vào từ phía người dùng vừa đi tới, ảnh cũ
   trượt ra ngược lại. Cả hai cùng tồn tại nên không có
   khoảng trắng ở giữa như kiểu mode="out-in".
========================================================= */

.gm-swap-next-enter-active,
.gm-swap-next-leave-active,
.gm-swap-prev-enter-active,
.gm-swap-prev-leave-active {
  transition:
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.34s ease;
}

.gm-swap-next-enter-from {
  transform: translate3d(7%, 0, 0) scale(1.03);

  opacity: 0;
}

.gm-swap-next-leave-to {
  transform: translate3d(-7%, 0, 0) scale(0.97);

  opacity: 0;
}

.gm-swap-prev-enter-from {
  transform: translate3d(-7%, 0, 0) scale(1.03);

  opacity: 0;
}

.gm-swap-prev-leave-to {
  transform: translate3d(7%, 0, 0) scale(0.97);

  opacity: 0;
}

/* =========================================================
   VÒNG XOAY CHỜ ẢNH
========================================================= */

.gm__spinner {
  position: absolute;

  width: 26px;
  height: 26px;

  border: 2px solid rgba(240, 217, 164, 0.22);
  border-top-color: #f0d9a4;
  border-radius: 50%;

  animation: gm-spin 0.8s linear infinite;
}

@keyframes gm-spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   NÚT CHUYỂN ẢNH
========================================================= */

.gm__arrow {
  position: absolute;
  top: 50%;

  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 42px;
  height: 42px;

  padding: 0;

  transform: translateY(-50%);

  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50%;

  background: rgba(11, 8, 7, 0.55);
  color: #f6efe4;

  cursor: pointer;

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.3s ease;
}

.gm__arrow svg {
  width: 20px;
  height: 20px;
}

.gm__arrow:hover {
  border-color: rgba(240, 217, 164, 0.5);

  background: rgba(240, 217, 164, 0.16);
}

.gm__arrow--prev {
  left: 10px;
}

.gm__arrow--next {
  right: 10px;
}

/* Đang phóng to thì nút chuyển ảnh chỉ vướng mắt. */
.gm.is-zoomed .gm__arrow {
  opacity: 0;

  pointer-events: none;
}

/* =========================================================
   CHÚ THÍCH
========================================================= */

.gm__caption {
  margin: 0;

  padding: 0 20px 12px;

  color: rgba(246, 239, 228, 0.72);

  font-size: 13px;

  line-height: 1.6;

  text-align: center;

  animation: gm-caption-in 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes gm-caption-in {
  from {
    transform: translateY(6px);

    opacity: 0;
  }
}

/* =========================================================
   DẢI ẢNH NHỎ
========================================================= */

.gm__strip {
  display: flex;

  gap: 7px;

  padding: 10px 14px calc(12px + env(safe-area-inset-bottom));

  overflow-x: auto;

  border-top: 1px solid rgba(255, 255, 255, 0.08);

  background: rgba(11, 8, 7, 0.6);

  overscroll-behavior-x: contain;

  scrollbar-width: none;

  transform: translateY(100%);

  transition: transform 0.42s cubic-bezier(0.22, 1, 0.36, 1);
}

.gm.is-open .gm__strip {
  transform: translateY(0);
}

.gm__strip::-webkit-scrollbar {
  display: none;
}

.gm__thumb {
  flex: 0 0 auto;

  width: 54px;
  height: 54px;

  padding: 0;

  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;

  background: rgba(255, 255, 255, 0.04);

  cursor: pointer;

  opacity: 0.45;

  transition:
    opacity 0.24s ease,
    border-color 0.24s ease,
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.gm__thumb img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

.gm__thumb:hover {
  opacity: 0.85;
}

.gm__thumb.is-active {
  border-color: #f0d9a4;

  opacity: 1;

  transform: translateY(-3px);
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .gm {
    grid-template-rows: 62px minmax(0, 1fr) auto auto;
  }

  .gm__bar {
    padding: 0 22px;
  }

  .gm__stage {
    padding: 22px 76px;
  }

  .gm__arrow {
    width: 48px;
    height: 48px;
  }

  .gm__arrow--prev {
    left: 18px;
  }

  .gm__arrow--next {
    right: 18px;
  }

  .gm__strip {
    justify-content: center;

    padding: 12px 22px 16px;
  }

  .gm__thumb {
    width: 64px;
    height: 64px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .gm,
  .gm__bar,
  .gm__frame,
  .gm__strip,
  .gm__zoom,
  .gm__photo,
  .gm__thumb,
  .gm__arrow,
  .gm__tool,
  .gm__progress span,
  .gm-swap-next-enter-active,
  .gm-swap-next-leave-active,
  .gm-swap-prev-enter-active,
  .gm-swap-prev-leave-active {
    transition: none;
  }

  .gm__caption {
    animation: none;
  }

  .gm__spinner {
    animation-duration: 1.6s;
  }
}
</style>
