<template>
  <section class="la-map">
    <h2 class="la-title">Tiệc cưới sẽ tổ chức tại</h2>

    <p class="la-map__address">{{ address }}</p>

    <div class="la-map__frame">
      <iframe
        v-if="mapSrc"
        :src="mapSrc"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      ></iframe>
    </div>

    <a
      v-if="mapSrcLink"
      :href="mapSrcLink"
      target="_blank"
      rel="noopener noreferrer"
      class="la-map__direction"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
      </svg>

      <span>Chỉ đường</span>
    </a>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  events: { type: Array, default: () => [] },
});

const firstEvent = computed(() => props.events?.[0] || {});

const address = computed(
  () =>
    firstEvent.value.Address ||
    firstEvent.value.Location ||
    firstEvent.value.Place ||
    "Địa chỉ tổ chức tiệc cưới"
);

const mapSrcLink = computed(() => {
  const event = firstEvent.value;

  if (event.Map || event.MapUrl) {
    return event.Map || event.MapUrl;
  }

  const raw = event.Address || event.Location || event.Place || "";

  if (!raw) return "";

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(raw)}`;
});

const mapSrc = computed(() => {
  const event = firstEvent.value;

  if (event.MapEmbed) {
    return event.MapEmbed;
  }

  /*
   * URL Google Maps thường không nhúng được vào iframe
   * (X-Frame-Options: sameorigin) → tự tạo link embed
   * từ tọa độ trong URL hoặc từ địa chỉ.
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

  const fallback = event.Address || event.Location || event.Place || "";

  if (!fallback) return "";

  return `https://www.google.com/maps?q=${encodeURIComponent(fallback)}&output=embed`;
});
</script>

<style scoped>
.la-map {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  text-align: center;
}

.la-map__address {
  max-width: 280px;
  margin: 8px auto 0;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 12px;
  font-weight: 300;

  line-height: 1.4;
  white-space: pre-line;
}

.la-map__frame {
  width: 100%;
  max-width: 338px;
  height: 240px;

  margin-top: 16px;

  border: 1px solid var(--la-red);
  border-radius: 15px;

  overflow: hidden;

  background-color: var(--la-blush);
}

.la-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 0;
}

.la-map__direction {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  margin-top: 16px;
  padding: 8px 20px;

  border-radius: 999px;

  color: var(--la-ink);

  font-family: var(--la-font-hand);
  font-size: 14px;
  font-weight: 600;

  text-decoration: none;

  transition: transform 0.25s ease;
}

.la-map__direction svg {
  flex: 0 0 auto;

  width: 16px;
  height: 16px;
}

.la-map__direction:hover {
  transform: scale(1.03);
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .la-map__address {
    max-width: 480px;

    font-size: 14px;
  }

  .la-map__frame {
    max-width: 600px;
    height: 320px;
  }

  .la-map__direction {
    font-size: 16px;
  }
}
</style>
