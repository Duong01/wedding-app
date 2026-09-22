<template>
  <section class="shy-map">
    <!-- =====================================================
         TIÊU ĐỀ
    ====================================================== -->

    <h2 class="shy-bar">Tiệc cưới sẽ tổ chức tại</h2>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="shy-map__inner">
      <p class="shy-map__address">
        {{
          firstEvent?.Address ||
          firstEvent?.Location ||
          firstEvent?.Place ||
          "Địa chỉ tổ chức tiệc cưới"
        }}
      </p>

      <div class="shy-map__frame">
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
        class="shy-map__direction"
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
.shy-map {
  --shy-bg: var(--background, #fff7eb);
  --shy-ink: var(--text, #666666);
  --shy-red: var(--primary, #800000);
  --shy-cream: var(--accent-light, #ffeed2);

  position: relative;

  overflow: hidden;

  color: var(--shy-ink);

  background-color: var(--shy-bg);

  font-family: Baskerville, "Times New Roman", serif;
}

/* =========================================================
   THANH TIÊU ĐỀ ĐỎ
========================================================= */

.shy-bar {
  margin: 0;

  padding: 12px 16px;

  color: var(--shy-cream);

  background: var(--shy-red);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-align: center;
  text-transform: uppercase;
}

/* =========================================================
   NỘI DUNG
========================================================= */

.shy-map__inner {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 24px 8px 32px;

  text-align: center;
}

.shy-map__address {
  width: 92%;

  margin: 0;

  padding: 16px;

  border-radius: 8px;

  color: var(--shy-ink);

  font-size: 14px;
  font-weight: 500;

  line-height: 1.5;

  white-space: pre-line;
}

/* =========================================================
   BẢN ĐỒ
========================================================= */

.shy-map__frame {
  width: 92%;
  height: 350px;

  margin-top: 16px;

  border-radius: 12px;

  overflow: hidden;
}

.shy-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 0;
}

/* =========================================================
   NÚT CHỈ ĐƯỜNG
========================================================= */

.shy-map__direction {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  margin-top: 16px;
  padding: 8px 20px;

  border-radius: 999px;

  color: var(--shy-ink);

  background: var(--shy-bg);

  font-size: 14px;
  font-weight: 600;

  text-decoration: none;

  transition: transform 0.25s ease;
}

.shy-map__direction:hover {
  color: var(--shy-ink);

  transform: scale(1.03);
}

.shy-map__direction span {
  display: flex;
  align-items: center;
}

.shy-map__direction svg {
  width: 16px;
  height: 16px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .shy-bar {
    padding: 16px;

    font-size: 24px;
  }

  .shy-map__inner {
    width: min(100%, 600px);

    padding: 32px 5px 40px;
  }

  .shy-map__address {
    font-size: 16px;
  }

  .shy-map__frame {
    height: 450px;
  }

  .shy-map__direction {
    font-size: 16px;
  }
}
</style>
