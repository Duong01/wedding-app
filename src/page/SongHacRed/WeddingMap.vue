<template>
  <section class="shc-map">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="shc-map__title">Tiệc cưới sẽ tổ chức tại</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shc-map__inner">
      <p class="shc-map__address">
        <template v-if="venueName">{{ venueName }},</template>

        {{ venueAddress }}
      </p>

      <div class="shc-map__frame">
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
        class="shc-map__direction"
      >
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11" stroke-linejoin="round" />
          </svg>
        </span>

        Chỉ đường
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  events: { type: Array, default: () => [] },
});

/*
 * Mục này nói về ĐỊA ĐIỂM TIỆC — ưu tiên sự kiện tanthanh
 * (đêm tiệc), fallback về sự kiện đầu tiên.
 */
const firstEvent = computed(() => {
  const events = props.events || [];

  return (
    events.find((event) => event?.EventType === "tanthanh") ||
    events[0] ||
    {}
  );
});

const venueName = computed(
  () => firstEvent.value?.Location || firstEvent.value?.Place || ""
);

const venueAddress = computed(
  () =>
    firstEvent.value?.Address ||
    firstEvent.value?.Location ||
    firstEvent.value?.Place ||
    "Địa chỉ tổ chức tiệc cưới"
);

const mapSrcLink = computed(() => {
  const event = firstEvent.value;

  if (event.Map || event.MapUrl) {
    return event.Map || event.MapUrl;
  }

  const address = event.Address || event.Location || event.Place || "";

  if (!address) return "";

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
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

  const address = event.Address || event.Location || event.Place || "";

  if (!address) return "";

  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
});
</script>

<style scoped>
.shc-map {
  --shc-red: var(--primary, #920002);
  --shc-cream: var(--accent, #ffe8a4);

  position: relative;

  overflow: hidden;

  margin-top: 23px;
  padding: 35px 37px 40px;

  color: var(--shc-cream);

  background-color: var(--shc-red);

  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

/* =========================================================
   TIÊU ĐỀ
========================================================= */

.shc-map__title {
  margin: 0;

  color: var(--shc-cream);

  font-family: "Times New Roman", Times, serif;
  font-size: 18px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shc-map__inner {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 16px;

  margin-top: 12px;

  text-align: center;
}

.shc-map__address {
  max-width: 247px;
  margin: 0;

  color: var(--shc-cream);

  font-size: 12px;

  line-height: 1.5;

  white-space: pre-line;
}

/* =========================================================
   BẢN ĐỒ
========================================================= */

.shc-map__frame {
  width: 100%;
  max-width: 338px;
  height: 267px;

  border: 1px solid rgba(255, 232, 164, 0.27);
  border-radius: 15px;

  overflow: hidden;
}

.shc-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 0;
}

/* =========================================================
   NÚT CHỈ ĐƯỜNG
========================================================= */

.shc-map__direction {
  display: inline-flex;
  align-items: center;

  gap: 8px;

  padding: 8px 20px;

  border-radius: 999px;

  color: var(--shc-cream);

  font-size: 14px;
  font-weight: 600;

  text-decoration: none;

  transition: transform 0.25s ease;
}

.shc-map__direction:hover {
  color: var(--shc-cream);

  transform: scale(1.03);
}

.shc-map__direction span {
  display: flex;
  align-items: center;
}

.shc-map__direction svg {
  width: 16px;
  height: 16px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shc-map {
    margin-top: 31px;
    padding: 48px 50px 56px;
  }

  .shc-map__title {
    font-size: 24px;
  }

  .shc-map__address {
    max-width: 336px;

    font-size: 16px;
  }

  .shc-map__frame {
    max-width: 460px;
    height: 364px;
  }

  .shc-map__direction {
    font-size: 16px;
  }
}
</style>
