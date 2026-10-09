import { onBeforeUnmount } from "vue";

/*
 * =========================================================
 * TỰ CUỘN ẢNH XEM TRƯỚC KHI HOVER
 * =========================================================
 * Ảnh mẫu trong template-preview là ảnh chụp NGUYÊN TRANG
 * thiệp (tỉ lệ ~1:12) — khung thẻ bình thường chỉ thấy
 * được trang bìa. Hover vào thẻ, ảnh tự cuộn xuống chậm
 * rãi rồi cuộn ngược lên, cho xem trọn bộ thiết kế; rời
 * chuột thì ảnh về lại đầu.
 *
 * Dùng cho thẻ mẫu ở gallery (/mau-thiep-cuoi) và mục
 * "Mẫu thiệp liên quan" của trang giới thiệu mẫu.
 *
 * Cách dùng — gắn lên PHẦN TỬ CHỨA ảnh (khung có
 * overflow:hidden, tỉ lệ khung đặt bằng aspect-ratio):
 *
 *   <div class="thumb"
 *        @mouseenter="scroll.start"
 *        @mouseleave="scroll.stop">
 *     <img ... />
 *   </div>
 *
 * Ảnh bên trong để height:auto (không object-fit:cover)
 * để phần tràn nằm dưới khung, cuộn bằng translateY.
 */

/* px/giây — ảnh ~3000px cao hết trong ~25 giây */
const SCROLL_SPEED = 130;

const MIN_DURATION = 5000;
const MAX_DURATION = 60000;

export function useHoverAutoScroll() {
  let anim = null;

  function stop() {
    if (anim) {
      /* cancel() đồng thời đưa ảnh về lại đầu */
      anim.cancel();

      anim = null;
    }
  }

  function start(event) {
    stop();

    const frame = event.currentTarget;

    const img = frame.querySelector("img");

    if (
      !img ||
      (typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return;
    }

    const run = () => {
      /* chuột đã rời thẻ trong lúc chờ ảnh tải xong */
      if (!frame.isConnected || !frame.matches(":hover")) {
        return;
      }

      const distance = img.offsetHeight - frame.clientHeight;

      /* ảnh ngắn hơn khung — không có gì để cuộn */
      if (distance <= 40) {
        return;
      }

      const duration = Math.min(
        MAX_DURATION,
        Math.max(MIN_DURATION, (distance / SCROLL_SPEED) * 1000)
      );

      anim = img.animate(
        [
          { transform: "translateY(0)" },
          { transform: `translateY(-${distance}px)` },
        ],
        {
          duration,

          iterations: Infinity,
          direction: "alternate",
          easing: "ease-in-out",
        }
      );
    };

    /* ảnh lazy-load — chưa tải xong thì đợi xong mới cuộn */
    if (img.complete) {
      run();
    } else {
      img.addEventListener("load", run, { once: true });
    }
  }

  onBeforeUnmount(stop);

  return { start, stop };
}
