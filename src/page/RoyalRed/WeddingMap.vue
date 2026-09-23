<template>
  <section class="rr-map">

    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="rr-title">
      {{ heading }}
    </h2>


    <!-- =====================================================
         TỪNG ĐỊA ĐIỂM
    ====================================================== -->

    <article
      v-for="(event, index) in eventsWithLocation"
      :key="index"
      class="rr-map__item"
    >

      <p class="rr-map__address">
        {{ event.Address || event.Location }}
      </p>

      <iframe
        v-if="embedUrl(event)"
        class="rr-map__frame"
        :src="embedUrl(event)"
        loading="lazy"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>

      <a
        v-if="directionUrl(event)"
        :href="directionUrl(event)"
        target="_blank"
        rel="noopener noreferrer"
        class="rr-map__link"
      >
        <svg
          class="rr-map__icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z"
          />
        </svg>

        <span>{{ directionLabel }}</span>
      </a>

    </article>

  </section>
</template>


<script setup>
import { computed } from "vue";

import { sectionText } from "@/data/sectionTitles";


/* =====================================================
   PROPS
===================================================== */

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
  sectionText(props.sections, "map", "Heading", "Tiệc cưới sẽ tổ chức tại")
);

const directionLabel = "Chỉ đường";


/* =====================================================
   ĐỊA ĐIỂM
===================================================== */

const eventsWithLocation = computed(() =>
  props.events.filter(
    (event) =>
      event?.Location ||
      event?.Address ||
      event?.Map ||
      event?.MapEmbed ||
      event?.EmbedUrl
  )
);


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
    return `https://www.google.com/maps?q=${encodeURIComponent(
      address
    )}&output=embed`;
  }

  return "";
}

function directionUrl(event) {
  return event?.Map || event?.MapUrl || "";
}
</script>


<style scoped>
/* =====================================================
   SECTION
===================================================== */

.rr-map {
  position: relative;

  z-index: 10;

  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 24px;

  width: 100%;

  padding: 0 24px;

  color: var(--rr-red);

  text-align: center;
}

.rr-map__item {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 16px;

  width: 100%;
}


/* =====================================================
   ĐỊA CHỈ
===================================================== */

.rr-map__address {
  width: 100%;
  max-width: 600px;

  margin: 0;
  padding-bottom: 12px;

  border-bottom: 1px solid var(--rr-hairline-soft);

  font-size: 14px;

  line-height: 1.6;

  white-space: pre-line;
}


/* =====================================================
   BẢN ĐỒ
===================================================== */

.rr-map__frame {
  width: 100%;
  max-width: 340px;
  height: 260px;

  overflow: hidden;

  border: 1px solid var(--rr-hairline);
  border-radius: 16px;
}


/* =====================================================
   CHỈ ĐƯỜNG
===================================================== */

.rr-map__link {
  display: inline-flex;
  align-items: center;

  gap: 8px;

  padding: 8px 20px;

  border-radius: 999px;

  color: var(--rr-red);

  font-size: 14px;
  font-weight: 600;

  text-decoration: none;

  transition: transform 0.25s ease;
}

.rr-map__link:hover {
  transform: scale(1.03);
}

.rr-map__icon {
  width: 16px;
  height: 16px;
}


/* =====================================================
   TABLET / DESKTOP
===================================================== */

@media (min-width: 768px) {
  .rr-map {
    gap: 32px;

    padding: 0 40px;
  }

  .rr-map__address {
    font-size: 16px;
  }

  .rr-map__frame {
    max-width: 600px;
    height: 360px;
  }

  .rr-map__link {
    font-size: 16px;
  }
}
</style>
