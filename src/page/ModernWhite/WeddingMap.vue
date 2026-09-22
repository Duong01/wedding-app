<template>
  <section class="mw-map">
    <h2 class="mw-title">Tiệc cưới sẽ tổ chức tại</h2>

    <div
      v-for="(event, index) in normalizedEvents"
      :key="event.id || index"
      class="mw-map__event"
    >
      <p v-if="event.address" class="mw-map__address">{{ event.address }}</p>

      <div class="mw-map__frame">
        <iframe
          v-if="event.mapUrl"
          :src="event.mapUrl"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div v-else class="mw-map__fallback">
          <span>Chưa có bản đồ — dùng nút Chỉ đường bên dưới</span>
        </div>
      </div>

      <a
        v-if="event.directionUrl"
        :href="event.directionUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="mw-map__direction"
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
          <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
        </svg>

        <span>Chỉ đường</span>
      </a>
    </div>

    <p v-if="!normalizedEvents.length" class="mw-map__empty">
      Chưa có thông tin địa điểm
    </p>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

const normalizedEvents = computed(() =>
  (props.events || [])
    .map((event, index) => {
      const item = event || {};

      const mapValue = item.Map;

      let mapUrl = "";

      let directionUrl = "";

      if (typeof mapValue === "string") {
        directionUrl = mapValue;

        if (mapValue.includes("output=embed")) {
          mapUrl = mapValue;
        }
      }

      if (mapValue && typeof mapValue === "object") {
        mapUrl = mapValue.url || mapValue.embedUrl || mapValue.embed || "";

        directionUrl =
          mapValue.directionUrl || mapValue.googleMapsUrl || mapValue.url || "";
      }

      if (!mapUrl && directionUrl) {
        const coords = directionUrl.match(/q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

        if (coords) {
          mapUrl = `https://www.google.com/maps?q=${coords[1]},${coords[2]}&output=embed`;
        }
      }

      if (!mapUrl && item.Address) {
        mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
          item.Address
        )}&output=embed`;
      }

      return {
        id: item.Id || index,

        address: item.Address || item.Location || "",

        mapUrl: item.MapEmbed || item.embedUrl || item.map_embed || mapUrl,

        directionUrl:
          item.directionUrl || item.googleMapsUrl || directionUrl || item.Map,
      };
    })
    .filter((event) => event.address || event.mapUrl || event.directionUrl)
);
</script>

<style scoped>
.mw-map {
  text-align: center;
}

.mw-map__event {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  margin-top: 20px;
}

.mw-map__event + .mw-map__event {
  margin-top: 40px;
  padding-top: 32px;

  border-top: 1px solid var(--mw-hairline-soft);
}

.mw-map__address {
  max-width: 280px;

  margin: 0;
  padding-bottom: 12px;

  border-bottom: 1px solid var(--mw-hairline-soft);

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;

  letter-spacing: 0.05em;
  line-height: 1.6;
  white-space: pre-line;
}

.mw-map__frame {
  width: 100%;
  max-width: 340px;
  height: 280px;

  overflow: hidden;

  border: 1px solid var(--mw-blue-soft);
  border-radius: 16px;
}

.mw-map__frame iframe {
  width: 100%;
  height: 100%;

  border: none;
}

.mw-map__fallback {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  padding: 20px;

  background-color: var(--mw-blue-mist);
  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 13px;

  text-align: center;
}

.mw-map__direction {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  padding: 8px 20px;

  border-radius: 999px;

  color: var(--mw-ink);

  font-family: var(--mw-font-serif);
  font-size: 14px;
  font-weight: 600;

  text-decoration: none;

  transition: transform 0.25s ease;
}

.mw-map__direction:hover {
  transform: scale(1.03);
}

.mw-map__direction svg {
  width: 16px;
  height: 16px;

  flex-shrink: 0;
}

.mw-map__empty {
  margin: 24px 0 0;

  color: var(--mw-ink-soft);

  font-family: var(--mw-font-serif);
  font-size: 14px;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .mw-map__address {
    max-width: 500px;

    font-size: 16px;
  }

  .mw-map__frame {
    max-width: 560px;
    height: 380px;
  }

  .mw-map__direction {
    font-size: 16px;
  }
}
</style>
