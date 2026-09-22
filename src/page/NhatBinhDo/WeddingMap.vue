<template>
  <section class="cfr-map">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h3 class="cfr-title">
      {{ heading }}
    </h3>


    <!-- =====================================================
         TỪNG ĐỊA ĐIỂM
    ====================================================== -->

    <div
      v-for="event in normalizedEvents"
      :key="event.id"
      class="cfr-map__event"
    >
      <p v-if="event.address" class="cfr-map__address">
        {{ event.address }}
      </p>

      <div class="cfr-map__body">

        <iframe
          v-if="event.mapUrl"
          :src="event.mapUrl"
          class="cfr-map__frame"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>

        <a
          v-if="event.directionUrl"
          :href="event.directionUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="cfr-link cfr-map__direction"
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

  </section>
</template>


<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";


const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },

  sections: {
    type: Object,
    default: () => ({}),
  },
});


/* =====================================================
   TIÊU ĐỀ MỤC
===================================================== */

const heading = computed(() =>
  sectionText(props.sections, "map", "Heading")
);


/* =====================================================
   CHUẨN HÓA ĐỊA ĐIỂM
===================================================== */

const normalizedEvents = computed(() =>
  (props.events || [])
    .map((event, index) => {
      const item = event || {};

      const raw = item.Map || "";

      const address = item.Address || item.Location || "";

      return {
        id: item.Id || index,

        address,

        mapUrl: embedUrl(raw, address),

        directionUrl: directionUrl(raw, address),
      };
    })
    .filter((event) => event.address || event.mapUrl || event.directionUrl)
);


/*
 * URL Google Maps thường không nhúng được vào iframe
 * (X-Frame-Options: sameorigin) → tự tạo link embed
 * từ tọa độ trong URL hoặc từ địa chỉ.
 */
function embedUrl(raw, address) {
  if (!raw) {
    return address
      ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
      : "";
  }

  if (raw.includes("output=embed")) {
    return raw;
  }

  const coords = raw.match(/q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

  if (coords) {
    return `https://www.google.com/maps?q=${coords[1]},${coords[2]}&output=embed`;
  }

  return address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : "";
}


/*
 * Link dạng ?q=lat,lng là link xem bản đồ, không phải link
 * chỉ đường. Chuyển sang /maps/dir/ để mở đúng chế độ dẫn đường.
 */
function directionUrl(raw, address) {
  if (raw) {
    const coords = raw.match(/q=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);

    if (coords) {
      return `https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[2]}`;
    }
  }

  if (address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      address
    )}`;
  }

  return raw || "";
}
</script>


<style scoped>
/* =====================================================
   SECTION
===================================================== */

.cfr-map {
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 16px;

  width: 100%;

  color: var(--cfr-red-deep);

  text-align: center;
}

.cfr-map__event {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 8px;

  width: 100%;
}

.cfr-map__address {
  max-width: 384px;

  margin: 12px auto 0;
  padding-bottom: 12px;

  border-bottom: 1px solid var(--cfr-hairline-soft);

  font-size: 14px;

  letter-spacing: 0.025em;
  line-height: 1.5;
  white-space: pre-line;
}

.cfr-map__body {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 16px;

  width: 100%;
}

.cfr-map__frame {
  position: relative;
  z-index: 10;

  width: 100%;
  max-width: 340px;
  height: 280px;

  margin-top: 8px;

  border: 0;
  border-radius: 16px;

  overflow: hidden;
}

.cfr-map__direction {
  padding: 8px 20px;

  text-decoration: none;
}

.cfr-map__direction svg {
  width: 16px;
  height: 16px;

  flex-shrink: 0;
}


/* =====================================================
   DESKTOP
===================================================== */

@media (min-width: 900px) {
  .cfr-map {
    gap: 20px;
  }

  .cfr-map__address {
    max-width: 500px;

    font-size: 16px;
  }

  .cfr-map__frame {
    max-width: 560px;
    height: 380px;
  }

  .cfr-map__direction {
    font-size: 16px;
  }
}
</style>
