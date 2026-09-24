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
      <div class="gm__backdrop" aria-hidden="true"></div>

      <div class="gm__inner">
        <!-- =====================================================
             SỐ THỨ TỰ · ĐÓNG
        ====================================================== -->

        <p v-if="images.length" class="gm__counter">
          {{ index + 1 }} / {{ images.length }}
        </p>

        <button
          type="button"
          class="gm__close"
          aria-label="Đóng album"
          @click="close"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <!-- =====================================================
             ẢNH LỚN
        ====================================================== -->

        <div
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
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div class="gm__frame">
            <!--
              Không dùng mode="out-in": cần cả hai ảnh cùng tồn tại
              trong lúc chuyển để trượt chồng lên nhau. Ảnh nằm
              position:absolute nên chúng xếp lớp thay vì đẩy nhau.
            -->
            <Transition :name="`gm-swap-${dir > 0 ? 'next' : 'prev'}`">
              <img
                v-if="current"
                :key="current.key"
                ref="setPhotoRef"
                :src="current.src"
                :alt="current.title || `Ảnh cưới ${index + 1}`"
                class="gm__photo"
                :class="{ 'is-loaded': loadedKeys.has(current.key) }"
                :style="zoomed ? zoomStyle : null"
                draggable="false"
                decoding="async"
                @load="markLoaded(current.key)"
                @error="markLoaded(current.key)"
              />
            </Transition>

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
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

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
            :style="i === index ? { outlineColor: accent } : null"
            :aria-label="`Xem ảnh ${i + 1}`"
            :aria-current="i === index ? 'true' : undefined"
            @click="goTo(i)"
          >
            <img :src="item.src" alt="" loading="lazy" decoding="async" />
          </button>
        </nav>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";

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
 * BỐ CỤC
 * ---------------------------------------------------------
 * Nền đen mờ, ảnh nằm giữa khung, mọi thứ khác trôi nổi trên
 * ảnh chứ không chiếm chỗ: số thứ tự góc trái, nút đóng góc
 * phải, hai mũi tên hai bên, dải ảnh nhỏ dưới cùng. Nhờ vậy ảnh
 * được rộng tối đa mà vẫn đủ điều khiển — đúng cách các thư viện
 * xem ảnh hiện đại vẫn làm.
 *
 * ---------------------------------------------------------
 * NHỮNG THỨ LÀM NÊN CẢM GIÁC "MƯỢT"
 * ---------------------------------------------------------
 * 1. Chuyển ảnh có hướng — ảnh mới trượt vào từ phía người dùng
 *    vừa đi tới, ảnh cũ trượt ra ngược lại, hai ảnh chồng lớp
 *    nên không có khoảng trắng ở giữa.
 * 2. Tải trước hàng xóm — ảnh kế tiếp thường đã nằm trong cache
 *    trước khi người dùng bấm, nên chuyển gần như tức thì.
 * 3. Thả tay có tính vận tốc — vuốt nhanh thì đi thêm một ảnh,
 *    vuốt chậm thì trả về ảnh gần nhất.
 * 4. Kéo xuống để đóng — cả khung trôi theo ngón tay rồi mờ dần,
 *    người dùng thấy trước kết quả chứ không phải đoán.
 * 5. Phóng to tại điểm chạm — nhấp đúp hoặc chụm hai ngón, kéo
 *    để di chuyển khi đang phóng to.
 * 6. Tôn trọng prefers-reduced-motion — tắt hết chuyển động.
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

  /*
   * Màu nhấn của theme — dùng cho viền ảnh nhỏ đang xem. Mặc
   * định là đỏ son, hợp với phần lớn bộ sưu tập.
   *
   * Nhận cả giá trị cụ thể (`#9c1f2c`) lẫn tham chiếu biến CSS
   * (`var(--bq-accent)`) vì mỗi theme khai báo một kiểu. Tham
   * chiếu vẫn giải được vì các theme chép biến màu của mình
   * sang <body>, mà modal thì teleport ra đó.
   */
  accent: {
    type: String,
    default: "#a63a2e",
  },
});

const emit = defineEmits(["close"]);

/*
 * Màu nhấn của theme, đã chắc chắn có giá trị. Gộp về một chỗ
 * để template không phải lặp lại màu dự phòng.
 */
const accent = computed(() => props.accent || "#a63a2e");

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
    if (i < 0 || i >= total) {
      return;
    }

    const item = images.value[i];

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

function prev() {
  goTo(index.value - 1);
}

function next() {
  goTo(index.value + 1);
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

/* Gốc phóng to tính theo % khung ảnh — đặt tại điểm chạm. */
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

/*
 * Phóng to quanh đúng điểm người dùng chạm. Gốc transform tính
 * theo toạ độ tương đối trên chính tấm ảnh — ảnh giữ tỉ lệ nên
 * nó không trùng khít khung, lấy khung làm mốc thì ảnh sẽ trôi
 * lệch khỏi ngón tay.
 */
function zoomAt(clientX, clientY, factor) {
  const photo = photoRef.value;

  if (!photo) {
    return;
  }

  const rect = photo.getBoundingClientRect();

  /*
   * Ảnh chưa tải xong thì kích thước bằng 0, chia cho nó sẽ ra
   * NaN và làm hỏng cả transform lẫn phép giới hạn kéo.
   */
  if (!rect.width || !rect.height) {
    return;
  }

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
 * rộng hơn kích thước gốc (z - 1) lần, nên phần được phép dịch
 * chuyển mỗi chiều đúng bằng một nửa khoảng dư đó.
 *
 * Đo trên chính tấm ảnh chứ không phải khung: ảnh giữ đúng tỉ
 * lệ nên thường thấp hơn khung, lấy khung sẽ cho phép kéo lố.
 * Lúc này ảnh đang bị scale nên phải chia lại cho z mới ra
 * kích thước thật.
 */
function clampPan() {
  const photo = photoRef.value;

  if (!photo) {
    return;
  }

  const rect = photo.getBoundingClientRect();

  const baseW = rect.width / zoom.value;
  const baseH = rect.height / zoom.value;

  const maxX = (baseW * (zoom.value - 1)) / 2;
  const maxY = (baseH * (zoom.value - 1)) / 2;

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

/*
 * Tham chiếu tới tấm ảnh đang xem. Cần cho việc phóng to: mọi
 * phép tính gốc transform và giới hạn kéo đều dựa trên kích
 * thước thật của ảnh, không phải của khung chứa.
 *
 * Ảnh nằm trong <Transition> nên lúc chuyển cảnh có hai tấm cùng
 * tồn tại; gán qua hàm để chỉ giữ tấm mới nhất, tránh việc Vue
 * ghi đè lẫn nhau khi tấm cũ gỡ ra.
 */
const photoRef = ref(null);

function setPhotoRef(el) {
  if (el) {
    photoRef.value = el;
  }
}

const drag = ref({ mode: null, x: 0, y: 0, dx: 0, dy: 0 });

/*
 * Danh sách ngón đang chạm. Cần cả map chứ không chỉ một toạ độ
 * vì thao tác chụm cần biết hai ngón cùng lúc.
 */
const pointers = new Map();

/* Trạng thái chụm hai ngón: khoảng cách và mức phóng to lúc bắt đầu. */
let pinchStart = 0;
let pinchZoom = 1;

/* Vận tốc ngón tay, dùng để quyết định có đi thêm một ảnh không. */
let lastX = 0;
let lastT = 0;
let velocity = 0;

const SWIPE_MIN = 42;
const FLICK_VELOCITY = 0.45;
const CLOSE_MIN = 90;

/*
 * Kéo xuống để đóng: cả khung trôi theo ngón tay và mờ dần, nên
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

  lastX = event.clientX;
  lastT = Date.now();
  velocity = 0;

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

  /*
   * Đo vận tốc trên mọi lần di chuyển, không chỉ lần đầu — lúc
   * thả tay mới là lúc cần biết ngón tay đang đi nhanh hay chậm,
   * mà lấy mẫu ở giữa chừng thì đã cũ.
   */
  const now = Date.now();
  const dt = now - lastT;

  if (dt > 0) {
    velocity = (event.clientX - lastX) / dt;

    lastX = event.clientX;
    lastT = now;
  }

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

  if (mode !== "nav") {
    return;
  }

  /*
   * Quyết định điểm dừng: vuốt nhanh (flick) thì đi thêm một ảnh
   * theo hướng vuốt, vuốt chậm thì về ảnh gần nhất. Đây là cách
   * carousel trên điện thoại vẫn xử lý, và nó khớp với phản xạ
   * của người dùng hơn là chỉ so khoảng cách.
   */
  const flicked = Math.abs(velocity) > FLICK_VELOCITY;
  const far = Math.abs(dx) > SWIPE_MIN;

  if (flicked || far) {
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
</script>

<style scoped>
/* =========================================================
   KHUNG
========================================================= */

.gm {
  position: fixed;
  inset: 0;

  z-index: 99999;

  outline: none;

  opacity: 0;

  transition: opacity 0.3s ease;
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

.gm__backdrop {
  position: absolute;
  inset: 0;

  background: rgba(0, 0, 0, 0.88);

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.gm__inner {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100dvh;

  padding: 40px 8px 16px;

  box-sizing: border-box;
}

/* =========================================================
   SỐ THỨ TỰ · NÚT ĐÓNG
========================================================= */

.gm__counter {
  position: absolute;

  top: 8px;
  left: 8px;

  z-index: 10;

  margin: 0;

  padding: 4px 10px;

  border-radius: 999px;

  background: rgba(0, 0, 0, 0.45);

  color: #fff;

  font-size: 13px;
  font-weight: 500;

  font-variant-numeric: tabular-nums;

  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}

.gm__close {
  position: absolute;

  top: 8px;
  right: 8px;

  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;

  padding: 0;

  border: 0;
  border-radius: 50%;

  background: transparent;
  color: #fff;

  cursor: pointer;

  transition: background-color 0.2s ease;
}

.gm__close svg {
  width: 20px;
  height: 20px;
}

.gm__close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* =========================================================
   ẢNH LỚN
========================================================= */

.gm__stage {
  position: relative;

  display: flex;
  flex: 1;

  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 1024px;

  min-height: 0;

  padding: 0 32px;

  box-sizing: border-box;

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

  border-radius: 12px;

  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);

  user-select: none;
  -webkit-user-drag: none;

  cursor: default;

  /*
   * Transition này dành cho lúc phóng to / kéo ảnh. Khi chuyển
   * ảnh, lớp gm-swap-* của Vue khai báo sau nên đè lại — nhờ
   * vậy hai hiệu ứng không giành nhau thuộc tính transform.
   */
  transition: transform 0.2s ease-out;

  will-change: transform;
}

.gm.is-panning .gm__photo {
  transition: none;
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
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.32s ease;
}

.gm-swap-next-enter-from {
  transform: translate3d(6%, 0, 0) scale(1.02);

  opacity: 0;
}

.gm-swap-next-leave-to {
  transform: translate3d(-6%, 0, 0) scale(0.98);

  opacity: 0;
}

.gm-swap-prev-enter-from {
  transform: translate3d(-6%, 0, 0) scale(1.02);

  opacity: 0;
}

.gm-swap-prev-leave-to {
  transform: translate3d(6%, 0, 0) scale(0.98);

  opacity: 0;
}

/* =========================================================
   VÒNG XOAY CHỜ ẢNH
========================================================= */

.gm__spinner {
  position: absolute;

  width: 26px;
  height: 26px;

  border: 2px solid rgba(255, 255, 255, 0.22);
  border-top-color: #fff;
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

  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;

  padding: 0;

  transform: translateY(-50%);

  border: 0;
  border-radius: 50%;

  background: transparent;
  color: #fff;

  cursor: pointer;

  transition:
    background-color 0.2s ease,
    opacity 0.3s ease;
}

.gm__arrow svg {
  width: 26px;
  height: 26px;
}

.gm__arrow:hover {
  background: rgba(255, 255, 255, 0.2);
}

.gm__arrow--prev {
  left: 0;
}

.gm__arrow--next {
  right: 0;
}

/* Đang phóng to thì nút chuyển ảnh chỉ vướng mắt. */
.gm.is-zoomed .gm__arrow {
  opacity: 0;

  pointer-events: none;
}

/* =========================================================
   DẢI ẢNH NHỎ
========================================================= */

.gm__strip {
  display: flex;
  flex-shrink: 0;

  gap: 8px;

  max-width: 90vw;

  margin-top: 12px;
  padding: 8px;

  overflow-x: auto;

  border-radius: 10px;

  background: rgba(0, 0, 0, 0.35);

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  overscroll-behavior-x: contain;

  scrollbar-width: none;
  -ms-overflow-style: none;

  cursor: default;
}

.gm__strip::-webkit-scrollbar {
  display: none;
}

.gm__thumb {
  flex-shrink: 0;

  width: 48px;
  height: 48px;

  padding: 0;

  overflow: hidden;

  border: 0;
  border-radius: 6px;

  background: rgba(255, 255, 255, 0.06);

  cursor: pointer;

  opacity: 0.6;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.gm__thumb img {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
}

.gm__thumb:hover {
  opacity: 1;
}

/*
 * Ảnh đang xem: sáng hơn, nhích lên một chút và có viền màu
 * nhấn của theme. Viền vẽ bằng outline để không làm ảnh bên
 * cạnh xê dịch khi trạng thái đổi.
 *
 * Màu viền đặt qua inline style chứ không qua `v-bind()` trong
 * <style>: theme có thể truyền `var(--bq-accent)`, mà cách đó
 * chỉ nhận giá trị màu cụ thể. Màu ở đây chỉ là phương án dự
 * phòng nếu theme không truyền gì.
 */
.gm__thumb.is-active {
  opacity: 1;

  transform: scale(1.05);

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);

  outline: 2px solid #a63a2e;
  outline-offset: 2px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 640px) {
  .gm__inner {
    padding: 48px 16px 24px;
  }

  .gm__counter {
    top: 16px;
    left: 16px;

    padding: 4px 12px;

    font-size: 16px;
  }

  .gm__close {
    top: 16px;
    right: 16px;

    width: 40px;
    height: 40px;
  }

  .gm__close svg {
    width: 24px;
    height: 24px;
  }

  .gm__stage {
    padding: 0 48px;
  }

  .gm__photo {
    border-radius: 16px;
  }

  .gm__arrow {
    width: 44px;
    height: 44px;
  }

  .gm__arrow svg {
    width: 34px;
    height: 34px;
  }

  .gm__arrow--prev {
    left: 8px;
  }

  .gm__arrow--next {
    right: 8px;
  }

  .gm__strip {
    gap: 12px;

    max-width: 80vw;

    margin-top: 16px;
    padding: 12px 16px;
  }

  .gm__thumb {
    width: 64px;
    height: 64px;

    border-radius: 8px;
  }
}

/* =========================================================
   GIẢM CHUYỂN ĐỘNG
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .gm,
  .gm__photo,
  .gm__thumb,
  .gm__arrow,
  .gm__close,
  .gm-swap-next-enter-active,
  .gm-swap-next-leave-active,
  .gm-swap-prev-enter-active,
  .gm-swap-prev-leave-active {
    transition: none;
  }

  .gm__spinner {
    animation-duration: 1.6s;
  }
}
</style>
