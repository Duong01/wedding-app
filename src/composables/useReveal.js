import { onBeforeUnmount, onMounted, ref } from "vue";

/*
 * =========================================================
 * REVEAL-ON-SCROLL — hiệu ứng hiện dần khi cuộn tới
 * =========================================================
 * Trang chủ dài; cho từng khối trượt nhẹ từ dưới lên + mờ
 * dần vào khi lọt vào khung nhìn, tạo cảm giác mượt mà thay
 * vì mọi thứ hiện dồn một lúc.
 *
 * Cách dùng trong component:
 *
 *   const root = useReveal();          // trong <script setup>
 *   <section ref="root">               // gắn ref vào section
 *     <div class="rv">…</div>          // thêm class .rv
 *     <div class="rv" data-rv-delay="2">…</div>  // lệch nhịp
 *
 * - .rv ẩn ban đầu (opacity 0 — xem marketing.css); khi
 *   observer thấy nó thì thêm .is-in và chạy animation
 *   trượt lên + mờ vào bằng Web Animations API.
 * - Dùng WAAPI thay vì CSS transition vì nhiều thẻ (.perk,
 *   .mk-card, .quote…) đã có transition riêng cho hover —
 *   CSS transition của .rv sẽ bị chúng override (cùng
 *   specificity, nạp sau thắng). Animation chạy độc lập với
 *   property transition nên hover vẫn mượt sau khi reveal.
 * - data-rv-delay="n" nhân thêm n × 70ms độ trễ — dùng cho
 *   các phần tử cạnh nhau để hiện so le thay vì đồng loạt.
 * - Người dùng bật "giảm chuyển động" (prefers-reduced-
 *   motion) hoặc trình duyệt không có IntersectionObserver
 *   thì bỏ qua hoàn toàn: mọi .rv hiện ngay từ đầu.
 * =========================================================
 */

export function useReveal() {
  const root = ref(null);

  let observer = null;

  onMounted(() => {
    const el = root.value;

    if (!el) return;

    const reduced = window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .matches;

    const showAll = () =>
      el.querySelectorAll(".rv").forEach((node) => {
        node.classList.add("is-in");
      });

    if (reduced || typeof IntersectionObserver === "undefined") {
      showAll();

      return;
    }

    const targets = el.querySelectorAll(".rv");

    if (!targets.length) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const node = entry.target;

          observer.unobserve(node);

          /* hiện trạng thái cuối ngay phòng khi API cũ */
          node.classList.add("is-in");

          if (typeof node.animate !== "function") return;

          const delay = Number(node.dataset.rvDelay || 0) * 70;

          /*
           * Về đúng transform tự nhiên của phần tử (một số thẻ
           * có sẵn transform như .plan.is-highlight dịch lên
           * -10px trên desktop) — lấy computed style làm điểm
           * đến để không nhảy khung sau animation.
           */
          const natural = getComputedStyle(node).transform;

          node.animate(
            [
              { opacity: 0, transform: "translateY(18px)" },
              {
                opacity: 1,
                transform: natural === "none" ? "none" : natural,
              },
            ],
            {
              duration: 600,
              delay,
              easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",

              /* giữ trạng thái ẩn trong suốt thời gian trễ */
              fill: "backwards",
            }
          );
        });
      },
      {
        /* hiện khi phần tử lọt ~12% vào khung — đủ sớm để khách
           thấy chuyển động, không trễ tới mức bất ngờ */
        threshold: 0.12,

        /* bắt đầu hơi sớm trước khi lọt hẳn khung nhìn */
        rootMargin: "0px 0px -8% 0px",
      }
    );

    targets.forEach((node) => observer.observe(node));
  });

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect();

      observer = null;
    }
  });

  return root;
}
