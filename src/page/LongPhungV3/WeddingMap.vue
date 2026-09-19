<template>
  <section class="lp-map">
    <div class="lp-section-title">
      <h2>ĐỊA ĐIỂM TỔ CHỨC</h2>
    </div>

    <p class="lp-map__address">
      {{
        firstEvent?.Address ||
        firstEvent?.Location ||
        firstEvent?.Place ||
        "Địa chỉ tổ chức tiệc cưới"
      }}
    </p>

    <div class="lp-map__frame">
      <iframe
        v-if="mapSrc"
        :src="mapSrc"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      ></iframe>

      <div v-else class="lp-map__fallback">
        <v-icon size="30">mdi-map-outline</v-icon>
        <p>Chưa có bản đồ</p>
      </div>
    </div>

    <a
      v-if="mapSrcLink"
      :href="mapSrcLink"
      target="_blank"
      rel="noopener noreferrer"
      class="lp-map__direction"
    >
      <v-icon size="16">mdi-navigation-variant-outline</v-icon>

      <span>XEM CHỈ ĐƯỜNG</span>
    </a>
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
.lp-map {
  position: relative;

  width: min(600px, calc(100% - 24px));

  margin: 24px auto 30px;
  padding: 30px 16px 28px;

  text-align: center;

  color: #ffbe89;
}

/* Tiêu đề có khung frame-title */
.lp-section-title {
  width: fit-content;
  max-width: 100%;

  margin: 0 auto 14px;

  border-style: solid;
  border-color: transparent;
  border-width: 18px;

  border-image-source: url("@/assets/decor/longphung-v3/frame-title.svg");
  border-image-slice: 31;
  border-image-repeat: stretch;

  text-align: center;
}

.lp-section-title h2 {
  margin: 0;

  font-family: "Times New Roman", Times, serif;

  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.05em;

  color: #ffbe89;
}

.lp-map__address {
  max-width: 440px;

  margin: 0 auto 18px;

  font-size: 14px;

  line-height: 1.7;

  white-space: pre-line;

  opacity: 0.8;
}

/* =========================================================
   BẢN ĐỒ
========================================================= */

.lp-map__frame {
  position: relative;

  width: min(100%, 600px);
  height: 280px;

  margin: 0 auto;

  overflow: hidden;

  border: 1px solid rgba(255, 190, 137, 0.3);
  border-radius: 16px;

  background: rgba(255, 190, 137, 0.05);
}

@media (min-width: 768px) {
  .lp-map__frame {
    height: 360px;
  }
}

.lp-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 0;
}

.lp-map__fallback {
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: rgba(255, 190, 137, 0.5);
}

.lp-map__fallback p {
  margin: 0;

  font-size: 12px;
}

/* =========================================================
   NÚT CHỈ ĐƯỜNG
========================================================= */

.lp-map__direction {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  margin-top: 18px;

  padding: 10px 22px;

  border: 1.5px solid #ffbe89;
  border-radius: 10px;

  color: #ffbe89;

  background: transparent;

  font-family: "Baskerville", "Times New Roman", serif;

  font-size: 12px;
  font-weight: 600;

  letter-spacing: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, background 0.25s ease;
}

.lp-map__direction:hover {
  transform: scale(1.03);

  background: rgba(255, 190, 137, 0.12);

  color: #ffbe89;
}
</style>
