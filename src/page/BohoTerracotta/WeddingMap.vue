<template>
  <section class="bq-map">
    <div class="bq-map__head">
      <h3 class="bq-map__title">Tiệc cưới sẽ tổ chức tại</h3>

      <p class="bq-map__address">
        {{ firstEvent?.Address || firstEvent?.Location || "Địa điểm tổ chức" }}
      </p>
    </div>

    <div class="bq-map__body">
      <div class="bq-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div v-else class="bq-map__frame-empty">Chưa có toạ độ bản đồ</div>
      </div>

      <a
        v-if="mapSrcLink"
        :href="mapSrcLink"
        target="_blank"
        rel="noopener noreferrer"
        class="bq-map__direction"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>

        <span>Chỉ đường</span>
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

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
.bq-map {
  position: relative;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  padding: 0 24px;

  text-align: center;

  color: var(--bq-ink);
}

.bq-map__title {
  margin: 0;

  color: var(--bq-accent);

  font-family: "Times New Roman", serif;
  font-size: 17px;
  font-weight: 700;

  letter-spacing: 0.04em;

  text-transform: uppercase;
}

.bq-map__address {
  max-width: 250px;
  margin: 12px auto 0;

  color: var(--bq-ink);

  font-family: "Roboto", "Helvetica Neue", sans-serif;
  font-size: 12px;

  line-height: 1.7;

  white-space: pre-line;
}

.bq-map__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  width: 100%;

  margin-top: 12px;
}

.bq-map__frame {
  width: 100%;
  max-width: 338px;
  height: 268px;

  overflow: hidden;

  border: 1px solid var(--bq-accent);
  border-radius: 15px;
}

.bq-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 0;
}

.bq-map__frame-empty {
  display: flex;
  align-items: center;
  justify-content: center;

  height: 100%;

  color: var(--bq-muted);

  font-size: 12px;
}

.bq-map__direction {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 20px;

  border-radius: 999px;

  color: var(--bq-ink);

  font-family: "Roboto", "Helvetica Neue", sans-serif;
  font-size: 14px;
  font-weight: 600;

  text-decoration: none;

  transition: transform 0.2s ease;
}

.bq-map__direction:hover {
  transform: scale(1.03);
}

.bq-map__direction svg {
  width: 16px;
  height: 16px;

  flex-shrink: 0;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .bq-map__address {
    max-width: 440px;

    font-size: 14px;
  }

  .bq-map__frame {
    max-width: 560px;
    height: 380px;
  }

  .bq-map__direction {
    font-size: 16px;
  }
}
</style>
