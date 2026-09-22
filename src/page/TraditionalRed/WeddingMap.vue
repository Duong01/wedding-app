<template>
  <section class="tr-map">
    <img
      :src="cloud"
      alt=""
      aria-hidden="true"
      class="tr-map__cloud"
    />

    <div class="tr-map__inner">
      <h3 class="tr-map__title">Tiệc cưới sẽ tổ chức tại</h3>

      <div v-for="(event, index) in eventsWithLocation" :key="index">
        <p v-if="event.Address || event.Location" class="tr-map__address">
          {{ event.Address || event.Location }}
        </p>

        <div class="tr-map__body">
          <iframe
            v-if="embedUrl(event)"
            :src="embedUrl(event)"
            class="tr-map__frame"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>

          <a
            v-if="directionUrl(event)"
            :href="directionUrl(event)"
            target="_blank"
            rel="noopener noreferrer"
            class="tr-map__direction"
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
      </div>
    </div>
  </section>
</template>
<script setup>
import { computed } from "vue";

import { cloud } from "./traditionalRedAssets";

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

const eventsWithLocation = computed(() => {
  const list = (props.events || []).filter(
    (event) =>
      event?.Location || event?.Address || event?.Map || event?.MapEmbed || event?.EmbedUrl
  );

  return list.length ? list : props.events || [];
});

/*
 * URL Google Maps thường không nhúng được vào iframe
 * (X-Frame-Options: sameorigin) → tự tạo link embed
 * từ tọa độ trong URL hoặc từ địa chỉ.
 */
function embedUrl(event) {
  if (event?.MapEmbed || event?.EmbedUrl) {
    return event.MapEmbed || event.EmbedUrl;
  }

  const raw = event?.Map || "";

  if (!raw) return "";

  if (raw.includes("output=embed")) {
    return raw;
  }

  const coords = raw.match(/q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

  if (coords) {
    return `https://www.google.com/maps?q=${coords[1]},${coords[2]}&output=embed`;
  }

  const address = event?.Address || event?.Location || "";

  if (address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }

  return "";
}

function directionUrl(event) {
  const raw = event?.Map || event?.MapUrl || "";

  if (!raw) return "";

  /*
   * Link dạng ?q=lat,lng là link xem bản đồ, không phải link chỉ
   * đường. Chuyển sang /maps/dir/ để mở đúng chế độ dẫn đường.
   */
  const coords = raw.match(/q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

  if (coords) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[2]}`;
  }

  const address = event?.Address || event?.Location || "";

  if (address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      address
    )}`;
  }

  return raw;
}
</script>

<style scoped>
/* =========================================================
   SECTION
========================================================= */

.tr-map {
  position: relative;

  z-index: 10;

  padding: 40px 24px 48px;
}

.tr-map__cloud {
  position: absolute;

  top: 45%;
  right: -16px;

  width: 150px;
  height: 70px;

  object-fit: contain;

  pointer-events: none;
}

.tr-map__inner {
  position: relative;

  z-index: 10;

  display: flex;

  flex-direction: column;

  gap: 24px;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.tr-map__title {
  margin: 0;

  text-align: center;

  text-transform: uppercase;

  color: #ffe3b1;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;

  font-weight: 700;

  letter-spacing: 0.05em;
}

/* =========================================================
   ĐỊA CHỈ
========================================================= */

.tr-map__address {
  margin: 12px auto 0;

  max-width: 500px;

  padding-bottom: 12px;

  text-align: center;

  white-space: pre-line;

  color: #ffe3b1;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 14px;

  letter-spacing: 0.02em;

  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* =========================================================
   BẢN ĐỒ
========================================================= */

.tr-map__body {
  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 16px;

  margin-top: 16px;
}

.tr-map__frame {
  width: 100%;
  max-width: 340px;

  height: 280px;

  border: 0;

  border-radius: 16px;

  overflow: hidden;
}

.tr-map__direction {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 8px 20px;

  border-radius: 999px;

  color: #ffe3b1;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 14px;

  font-weight: 600;

  text-decoration: none;

  transition: transform 0.2s ease;
}

.tr-map__direction:hover {
  transform: scale(1.03);
}

.tr-map__direction svg {
  width: 16px;
  height: 16px;

  flex-shrink: 0;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tr-map {
    padding: 48px 40px 64px;
  }

  .tr-map__cloud {
    right: -32px;

    width: 210px;
    height: 100px;
  }

  .tr-map__inner {
    gap: 32px;
  }

  .tr-map__title {
    font-size: 24px;
  }

  .tr-map__address {
    font-size: 16px;
  }

  .tr-map__body {
    gap: 20px;
  }

  .tr-map__frame {
    max-width: 560px;

    height: 380px;
  }

  .tr-map__direction {
    font-size: 16px;
  }
}
</style>
