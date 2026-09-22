<template>
  <section class="wedding-map">
    <div class="gg-eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</div>

    <h2 class="gg-title">Tiệc cưới sẽ tổ chức tại</h2>

    <p v-if="address" class="map-address">
      {{ address }}
    </p>

    <!-- MAP -->
    <div class="map-frame">
      <iframe
        v-if="mapSrc"
        :src="mapSrc"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      ></iframe>

      <div v-else class="map-empty">
        <v-icon size="26">mdi-map-marker-outline</v-icon>
        <span>Chưa có thông tin địa điểm</span>
      </div>
    </div>

    <!-- DIRECTION -->
    <a
      v-if="mapSrcLink"
      :href="mapSrcLink"
      target="_blank"
      rel="noopener noreferrer"
      class="direction-button"
    >
      <span>Chỉ đường</span>

      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M2 21l21-9L2 3v7l15 2-15 2z"
          fill="currentColor"
        />
      </svg>
    </a>
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

const firstEvent = computed(() => props.events?.[0] || {});

const address = computed(
  () =>
    firstEvent.value.Address ||
    firstEvent.value.Location ||
    firstEvent.value.Place ||
    ""
);

/*
 * Link Google Maps:
 * - Ưu tiên Map / MapUrl có sẵn trong data.
 * - Nếu không có thì tự tạo link tìm kiếm bằng địa chỉ.
 */
const mapSrcLink = computed(() => {
  const event = firstEvent.value;

  if (event.Map || event.MapUrl) {
    return event.Map || event.MapUrl;
  }

  if (!address.value) return "";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address.value
  )}`;
});

/*
 * Google Maps iframe.
 *
 * Dùng query để iframe vẫn hoạt động ngay cả khi
 * dữ liệu chỉ có Address mà chưa có MapUrl.
 */
const mapSrc = computed(() => {
  const event = firstEvent.value;

  if (event.MapEmbed) {
    return event.MapEmbed;
  }

  if (!address.value) return "";

  return `https://www.google.com/maps?q=${encodeURIComponent(
    address.value
  )}&output=embed`;
});
</script>

<style scoped>
.wedding-map {
  text-align: center;
}

.map-address {
  max-width: 340px;
  margin: 12px auto 0;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;
  line-height: 1.6;
}

/* =====================================================
   MAP FRAME
===================================================== */

.map-frame {
  position: relative;

  max-width: 340px;
  height: 240px;

  margin: 20px auto 0;

  overflow: hidden;

  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.35);

  box-shadow: inset 1.5px 1.5px 2px rgba(255, 255, 255, 0.45),
    0 18px 50px -6px rgba(147, 56, 69, 0.3),
    0 6px 20px 2px rgba(147, 56, 69, 0.14);
}

.map-frame iframe {
  width: 100%;
  height: 100%;

  border: 0;
  display: block;
}

.map-empty {
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: var(--gg-deep, #933845);
  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 12px;

  opacity: 0.6;
}

/* =====================================================
   DIRECTION
===================================================== */

.direction-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  margin-top: 20px;
  padding: 9px 22px;

  border-radius: 999px;

  background-color: var(--gg-deep, #933845);
  color: #ffffff;

  font-family: "Baskerville", "Libre Baskerville", "Times New Roman", serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-decoration: none;

  transition: transform 0.25s ease, background-color 0.25s ease;
}

.direction-button:hover {
  transform: translateY(-2px);
  background-color: var(--gg-rose, #cb5d6c);
}

.direction-button svg {
  width: 15px;
  height: 15px;
}

/* =====================================================
   DESKTOP
===================================================== */

@media (min-width: 900px) {
  .map-address {
    max-width: 420px;
    font-size: 14px;
  }

  .map-frame {
    max-width: 480px;
    height: 300px;
  }
}
</style>
