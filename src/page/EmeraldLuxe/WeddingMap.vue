<template>
  <section class="cr-map">
    <img
      :src="decorativeDiamond"
      alt=""
      aria-hidden="true"
      class="cr-map__diamond"
      draggable="false"
    />

    <header class="cr-heading">
      <h2 class="cr-heading__vi">Bản đồ địa điểm</h2>

      <p class="cr-heading__zh">婚宴地點</p>

      <div class="cr-heading__ornament" aria-hidden="true">
        <span></span>
        <i>❀</i>
        <span></span>
      </div>
    </header>

    <div class="cr-map__card">
      <div class="cr-map__address">
        <span class="cr-map__address-label">ĐỊA CHỈ</span>

        <p class="cr-map__address-name">
          {{ firstEvent?.Location || firstEvent?.Place || "Địa điểm tổ chức" }}
        </p>

        <p v-if="firstEvent?.Address" class="cr-map__address-detail">
          {{ firstEvent.Address }}
        </p>
      </div>

      <div class="cr-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div v-else class="cr-map__frame-empty">Chưa có toạ độ bản đồ</div>
      </div>

      <a
        v-if="mapSrcLink"
        :href="mapSrcLink"
        target="_blank"
        rel="noopener noreferrer"
        class="cr-map__direction"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
          <polygon points="3 11 22 2 13 21 11 13 3 11" stroke-linejoin="round" />
        </svg>

        <span>CHỈ ĐƯỜNG</span>
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { decorativeDiamond } from "./emeraldLuxeAssets";

const props = defineProps({
  events: { type: Array, default: () => [] },
});

const firstEvent = computed(() => props.events?.[0] || {});

const mapSrcLink = computed(() => {
  const event = firstEvent.value;

  if (event.Map || event.MapUrl) {
    return event.Map || event.MapUrl;
  }

  const address = event.Address || event.Location || event.Place || "";

  if (!address) return "";

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    address
  )}`;
});

const mapSrc = computed(() => {
  const event = firstEvent.value;

  if (event.MapEmbed) {
    return event.MapEmbed;
  }

  /*
   * URL Google Maps thường không nhúng được vào iframe
   * (X-Frame-Options: sameorigin) → tự tạo link embed
   * từ toạ độ trong URL hoặc từ địa chỉ.
   */
  const raw = event.Map || event.MapUrl || "";

  if (raw) {
    if (raw.includes("output=embed")) {
      return raw;
    }

    const coords = raw.match(/q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

    if (coords) {
      return `https://www.google.com/maps?q=${coords[1]},${coords[2]}&output=embed`;
    }
  }

  const address = event.Address || event.Location || event.Place || "";

  if (!address) return "";

  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
});
</script>

<style scoped>
.cr-map {
  position: relative;

  width: 100%;

  color: var(--cr-ink);
}

.cr-map__diamond {
  position: absolute;

  top: 10px;
  right: -16px;

  width: 76px;
  height: 76px;

  object-fit: contain;

  opacity: 0.5;

  pointer-events: none;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.cr-heading {
  position: relative;

  text-align: center;

  margin-bottom: 22px;
}

.cr-heading__vi {
  margin: 0;

  font-family: "Viaoda Libre", "Playfair Display", serif;

  font-size: clamp(22px, 6vw, 30px);
  font-weight: 400;

  letter-spacing: 0.06em;

  text-transform: uppercase;

  color: var(--cr-ink);
}

.cr-heading__zh {
  margin: 4px 0 0;

  font-family: "Noto Serif SC", serif;

  font-size: 0.85em;

  letter-spacing: 0.3em;
  text-indent: 0.3em;

  opacity: 0.7;

  color: var(--cr-soft);
}

.cr-heading__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  margin-top: 12px;

  color: var(--cr-accent);
}

.cr-heading__ornament span {
  width: 52px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(var(--cr-accent-rgb), 1));
}

.cr-heading__ornament span:last-child {
  transform: rotate(180deg);
}

.cr-heading__ornament i {
  font-size: 13px;
  font-style: normal;
}

/* =========================================================
   THẺ BẢN ĐỒ
========================================================= */

.cr-map__card {
  padding: 20px 16px 18px;

  text-align: center;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.18);
  border-radius: 18px;

  background: rgba(var(--cr-surface-rgb), 0.88);

  box-shadow: 0 14px 34px rgba(var(--cr-ink-rgb), 0.08);
}

.cr-map__address-label {
  color: var(--cr-muted);

  font-size: 10px;

  letter-spacing: 0.22em;
}

.cr-map__address-name {
  margin: 5px 0 0;

  color: var(--cr-ink);

  font-size: 15px;
  font-weight: 600;

  line-height: 1.45;
}

.cr-map__address-detail {
  margin: 4px 0 0;

  color: var(--cr-soft);

  font-size: 12px;

  line-height: 1.55;
}

.cr-map__frame {
  position: relative;

  margin-top: 16px;

  border: 1px solid rgba(var(--cr-accent-rgb), 0.9);
  border-radius: 14px;

  overflow: hidden;
}

.cr-map__frame iframe {
  display: block;

  width: 100%;
  height: 260px;

  border: 0;
}

.cr-map__frame-empty {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 180px;

  color: var(--cr-muted);

  font-size: 12px;
}

.cr-map__direction {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 16px;
  padding: 11px 26px;

  border: 1px solid rgba(var(--cr-ink-rgb), 0.2);
  border-radius: 999px;

  color: var(--cr-ink);

  background: linear-gradient(135deg, var(--cr-accent-light), var(--cr-accent));

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.18em;

  text-decoration: none;

  transition: transform 0.2s ease;
}

.cr-map__direction:hover {
  transform: translateY(-2px);
}

.cr-map__direction svg {
  width: 15px;
  height: 15px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .cr-map__frame iframe {
    height: 360px;
  }
}
</style>
