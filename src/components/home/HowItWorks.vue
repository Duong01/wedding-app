<template>
  <section class="mk-section">
    <div class="mk-container">
      <header class="mk-head mk-head--center">
        <p class="mk-eyebrow">Cách sử dụng</p>

        <h2>
          Ba bước, một tấm thiệp
          <em>hoàn chỉnh.</em>
        </h2>
      </header>

      <RailHint text="Vuốt ngang để xem đủ ba bước" />

      <ol class="flow mk-rail">
        <li v-for="(step, index) in STEPS" :key="step.title" class="flow-step">
          <span class="flow-seal" aria-hidden="true">{{ step.seal }}</span>

          <div class="flow-body">
            <p class="flow-kicker">Bước {{ index + 1 }}</p>

            <h3>{{ step.title }}</h3>

            <p>{{ step.text }}</p>
          </div>
        </li>
      </ol>

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

import RailHint from "@/components/marketing/RailHint.vue";

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
.flow {
  display: grid;
  grid-template-columns: 1fr;

  gap: 16px;

  margin: 0;
  padding: 0;

  list-style: none;
}

.flow-step {
  display: flex;

  gap: 16px;

  padding: 22px 20px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 22px;

  background: var(--studio-glass, rgba(255, 253, 248, 0.75));
}

.flow-seal {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  width: 46px;
  height: 46px;

  border: 1px solid rgba(185, 151, 91, 0.4);
  border-radius: 50%;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-symbol);
  font-size: 19px;
}

.flow-kicker {
  margin: 0 0 4px;

  color: var(--studio-foil, #b9975b);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.flow-body h3 {
  margin: 0 0 6px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 600;
}

.flow-body p {
  margin: 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14px;

  line-height: 1.7;
}

/* =====================================================
   VIDEO
===================================================== */

.video-box {
  margin-top: 40px;

  text-align: center;
}

.video-frame {
  position: relative;

  width: min(760px, 100%);

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

@media (min-width: 768px) {
  .flow {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 20px;
  }

  .flow-step {
    flex-direction: column;

    gap: 14px;

    padding: 28px 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .video-play {
    transition: none;
  }
}
</style>
