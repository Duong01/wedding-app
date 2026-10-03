<template>
  <section class="mk-section">
    <div class="mk-container">
      <header class="mk-head mk-head--center">
        <h2>
          Làm thiệp cưới điện tử miễn phí
          <em>&amp; quản lý khách mời</em>
        </h2>

        <p>Giữ nét đẹp truyền thống · Tiện lợi thời hiện đại</p>
      </header>

      <div class="how-grid">
        <!-- =====================================================
             TIMELINE 3 BƯỚC
             Desktop: cột dọc, chấm tròn đỏ nối đường kẻ.
             Điện thoại: hàng ngang 3 ô — chấm tròn trên, chữ
             dưới, nối bằng gạch ngang mờ (như bản gốc).
        ====================================================== -->
        <ol class="flow">
          <li v-for="(step, index) in STEPS" :key="step.title" class="flow-step">
            <span class="flow-dot" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path v-if="index === 0" stroke-linecap="round" stroke-linejoin="round" d="M18 22H4a2 2 0 0 1-2-2V6m18 9-1.3-1.3a2.4 2.4 0 0 0-3.4 0L11 18M12 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 4a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM6 12a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
                <path v-else-if="index === 1" stroke-linecap="round" stroke-linejoin="round" d="M12 20h9M16.4 3.6a1 1 0 0 1 3 3L7.4 18.6a2 2 0 0 1-.9.5l-2.9.9a.5.5 0 0 1-.6-.6l.8-2.9a2 2 0 0 1 .5-.9L16.4 3.6Z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" d="M18 8a3 3 0 0 0-6 0c0 4-3 5-3 5m9-5v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
              </svg>
            </span>

            <div class="flow-body">
              <p class="flow-kicker">Bước {{ index + 1 }}</p>

              <h3>{{ step.title }}</h3>

              <p class="flow-text">{{ step.text }}</p>

              <p class="flow-short">{{ step.short }}</p>
            </div>
          </li>
        </ol>

        <!-- =====================================================
             VIDEO HƯỚNG DẪN
        ====================================================== -->
        <div class="video-box">
          <div class="video-frame">
            <iframe
              v-if="playing"
              :src="embedUrl"
              title="Video hướng dẫn tạo thiệp cưới"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              loading="lazy"
            ></iframe>

            <button
              v-else
              type="button"
              class="video-poster"
              @click="playing = true"
            >
              <span class="video-play" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>

              <span class="video-label">
                Xem video hướng dẫn — 2 phút
              </span>
            </button>
          </div>

          <p class="video-note">
            Hoặc đọc
            <router-link :to="{ name: 'Guide' }">hướng dẫn chi tiết</router-link>
            nếu bạn muốn xem từng bước bằng hình ảnh.
          </p>
        </div>
      </div>

      <div class="mk-cta">
        <router-link :to="{ name: 'Editor' }" class="mk-btn mk-btn--solid">
          Bắt đầu tạo thiệp
        </router-link>

        <p class="mk-note">
          Tạo miễn phí · Dùng thử 3 ngày · Ưng mới thanh toán
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";

import { STEPS } from "@/data/siteContent";

/*
 * Video hướng dẫn — chỉ nạp iframe sau khi người dùng bấm
 * để không kéo theo script của YouTube ngay từ đầu.
 */
const VIDEO_ID = "PggDHkV0nGU";

const playing = ref(false);

const embedUrl = computed(
  () => `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`
);
</script>

<style scoped>
/*
 * Bố cục mobile-first:
 * - Điện thoại: 3 bước xếp HÀNG NGANG (chấm tròn trên, chữ
 *   dưới) — khách thấy trọn luồng trong một màn, không phải
 *   cuộn. Video nằm dưới, thu gọn đúng khung máy.
 * - Desktop: timeline dọc bên trái + video bên phải.
 */

.how-grid {
  display: grid;
  grid-template-columns: 1fr;

  gap: 36px;
}

/* --- 3 bước: hàng ngang trên điện thoại --- */

.flow {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 8px;

  margin: 0;
  padding: 0;

  list-style: none;
}

.flow-step {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
}

/*
 * Gạch nối ngang giữa các chấm tròn — chỉ vẽ từ mép phải
 * chấm này sang mép trái chấm kế tiếp (bắt đầu từ bước 2).
 */
.flow-step:not(:first-child)::before {
  content: "";

  position: absolute;
  top: 20px;
  left: calc(-50% + 20px);

  width: calc(100% - 40px);
  height: 1px;

  background: rgba(166, 58, 46, 0.25);

  z-index: 0;
}

.flow-dot {
  position: relative;
  z-index: 1;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;
  margin-bottom: 8px;

  border-radius: 50%;

  background: linear-gradient(135deg, var(--studio-seal, #a63a2e), #7c2a20);
  color: #fdf6ec;

  box-shadow: 0 8px 20px rgba(166, 58, 46, 0.28);
}

.flow-dot svg {
  width: 18px;
  height: 18px;
}

.flow-kicker {
  margin: 0 0 3px;

  color: var(--studio-foil, #b9975b);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.flow-body h3 {
  margin: 0 0 3px;

  color: var(--studio-ink, #2b2118);

  font-size: 13.5px;
  font-weight: 700;

  line-height: 1.25;
}

/* mô tả dài — chỉ dùng ở desktop */
.flow-text {
  display: none;
}

/* mô tả ngắn gọn — chỉ dùng trên điện thoại */
.flow-short {
  margin: 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 11px;

  line-height: 1.45;
}

/* =====================================================
   VIDEO
===================================================== */

.video-box {
  text-align: center;
}

.video-frame {
  position: relative;

  width: min(420px, 100%);

  margin: 0 auto;

  aspect-ratio: 16 / 9;

  overflow: hidden;

  border: 1px solid rgba(185, 151, 91, 0.4);
  border-radius: 22px;

  background:
    radial-gradient(circle at 70% 20%, rgba(233, 189, 118, 0.3), transparent 60%),
    linear-gradient(135deg, #a63a2e, #7c2a20);

  box-shadow: 0 24px 56px rgba(166, 58, 46, 0.24);
}

.video-frame iframe {
  width: 100%;
  height: 100%;

  border: 0;
}

.video-poster {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 16px;

  width: 100%;
  height: 100%;

  border: 0;

  background: transparent;

  cursor: pointer;
}

.video-play {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 68px;
  height: 68px;

  border-radius: 50%;

  background: var(--studio-contrast-bg, rgba(247, 241, 230, 0.94));
  color: var(--studio-seal, #a63a2e);

  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.3);

  transition: transform 0.25s ease;
}

.video-play svg {
  width: 28px;
  height: 28px;

  margin-left: 3px;
}

.video-poster:hover .video-play {
  transform: scale(1.08);
}

.video-label {
  color: rgba(247, 241, 230, 0.9);

  font-size: 14px;
  font-weight: 600;
}

.video-note {
  margin: 16px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 13px;
}

.video-note a {
  color: var(--studio-seal, #a63a2e);

  font-weight: 600;
  text-decoration: none;
}

.video-note a:hover {
  text-decoration: underline;
}

/* =====================================================
   TABLET / DESKTOP — timeline dọc + video cạnh nhau
===================================================== */

@media (min-width: 768px) {
  .how-grid {
    grid-template-columns: 1.05fr 0.95fr;

    gap: 56px;
  }

  .flow {
    position: relative;

    grid-template-columns: 1fr;

    gap: 30px;
  }

  /* đường kẻ dọc nối các chấm, chạy từ chấm đầu tới chấm cuối */
  .flow::before {
    content: "";

    position: absolute;
    top: 24px;
    bottom: 24px;
    left: 23px;

    width: 1px;

    background: linear-gradient(
      to bottom,
      rgba(166, 58, 46, 0.35),
      rgba(185, 151, 91, 0.35)
    );
  }

  /* bỏ gạch nối ngang của mobile */
  .flow-step:not(:first-child)::before {
    display: none;
  }

  .flow-step {
    flex-direction: row;
    align-items: flex-start;

    gap: 18px;

    text-align: left;
  }

  .flow-dot {
    width: 48px;
    height: 48px;
    margin-bottom: 0;

    flex-shrink: 0;
  }

  .flow-dot svg {
    width: 22px;
    height: 22px;
  }

  .flow-body {
    padding-top: 2px;
  }

  .flow-kicker {
    margin: 0 0 4px;

    font-size: 11px;

    letter-spacing: 0.16em;
  }

  .flow-body h3 {
    margin: 0 0 6px;

    font-family: var(--font-heading);
    font-size: 20px;
    font-weight: 600;

    line-height: 1.3;
  }

  .flow-text {
    display: block;

    margin: 0;

    color: var(--studio-ink-soft, #5c4f43);

    font-size: 14px;

    line-height: 1.7;
  }

  .flow-short {
    display: none;
  }
}

/* =====================================================
   ĐIỆN THOẠI NHỎ
===================================================== */

@media (max-width: 380px) {
  .flow {
    gap: 4px;
  }

  .flow-dot {
    width: 36px;
    height: 36px;
    margin-bottom: 7px;
  }

  .flow-dot svg {
    width: 16px;
    height: 16px;
  }

  /* gạch nối bám theo chấm đã thu nhỏ */
  .flow-step:not(:first-child)::before {
    top: 18px;

    left: calc(-50% + 18px);

    width: calc(100% - 36px);
  }

  .flow-body h3 {
    font-size: 12.5px;
  }

  .flow-short {
    font-size: 10.5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .video-play {
    transition: none;
  }
}
</style>
