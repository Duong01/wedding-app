<template>
  <section class="tdx-map">
    <!-- =====================================================
         HOẠ TIẾT NỀN
    ====================================================== -->

    <div class="tdx-map__decor" aria-hidden="true">
      <img
        :src="lineDecoration"
        alt=""
        class="tdx-decor tdx-decor--line-right"
        draggable="false"
      />

      <img
        :src="flowerDecoration"
        alt=""
        class="tdx-decor tdx-decor--flower-right"
        draggable="false"
      />
    </div>

    <!-- =====================================================
         NỘI DUNG
    ====================================================== -->

    <div class="tdx-map__inner">
      <h2 class="tdx-heading">Tiệc cưới sẽ tổ chức tại</h2>

      <p class="tdx-map__address">
        {{
          firstEvent?.Address ||
          firstEvent?.Location ||
          firstEvent?.Place ||
          "Địa chỉ tổ chức tiệc cưới"
        }}
      </p>

      <div class="tdx-map__frame">
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
        class="tdx-map__direction"
      >
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke-linejoin="round" />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
        </span>

        CHỈ ĐƯỜNG
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import { flowerDecoration, lineDecoration } from "./toDuyenXanhAssets";

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

  const address = event.Address || event.Location || event.Place || "";

  if (!address) return "";

  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
});
</script>

<style scoped>
.tdx-map {
  --tdx-bg: var(--background, #fefbf4);
  --tdx-ink: var(--text, #1a3500);
  --tdx-green: var(--primary, #5e813c);
  --tdx-line: var(--accent, #d1db9c);

  position: relative;
  isolation: isolate;

  overflow: hidden;

  color: var(--tdx-ink);

  background-color: var(--tdx-bg);
}

/* =========================================================
   HOẠ TIẾT NỀN
========================================================= */

.tdx-map__decor {
  position: absolute;
  inset: 0;
  z-index: -1;

  pointer-events: none;
}

.tdx-decor {
  position: absolute;

  max-width: none;

  object-fit: cover;

  pointer-events: none;
}

.tdx-decor--line-right {
  top: 60px;
  right: -70px;

  width: 198px;
  height: 420px;

  transform: rotate(-177.25deg);
}

.tdx-decor--flower-right {
  top: 30px;
  right: -80px;

  width: 190px;
  height: 190px;

  object-fit: contain;

  transform: scaleX(-1) rotate(50deg);
}

/* =========================================================
   NỘI DUNG
========================================================= */

.tdx-map__inner {
  position: relative;
  z-index: 2;

  width: min(100%, 441px);

  margin: 0 auto;

  padding: 2.5% 10% 20%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  text-align: start;
}

.tdx-heading {
  margin: 0;

  color: var(--tdx-green);

  font-family: "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;

  letter-spacing: 0.02em;

  text-transform: uppercase;
}

.tdx-map__address {
  margin: 0;

  color: var(--tdx-ink);

  font-family: Baskerville, "Times New Roman", serif;
  font-size: 13px;

  line-height: 1.5;

  white-space: pre-line;
}

/* =========================================================
   BẢN ĐỒ
========================================================= */

.tdx-map__frame {
  width: 100%;
  height: 260px;

  margin-top: 4px;

  border: 1px solid var(--tdx-line);
  border-radius: 4px;

  background: #f7f3e6;

  overflow: hidden;
}

.tdx-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 0;

  filter: saturate(0.9) contrast(0.98);
}

/* =========================================================
   NÚT CHỈ ĐƯỜNG
========================================================= */

.tdx-map__direction {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 4px;
  padding: 12px 26px;

  border-radius: 7px;

  color: #fefbf4;

  background: var(--tdx-green);

  box-shadow: 0 12px 26px rgba(94, 129, 60, 0.3);

  font-family: "Times New Roman", serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.2em;
  text-indent: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.tdx-map__direction:hover {
  color: #fefbf4;

  transform: translateY(-2px);

  box-shadow: 0 16px 32px rgba(94, 129, 60, 0.4);
}

.tdx-map__direction span {
  display: flex;
  align-items: center;
}

.tdx-map__direction svg {
  width: 15px;
  height: 15px;
}

/* =========================================================
   TABLET / DESKTOP
========================================================= */

@media (min-width: 768px) {
  .tdx-map__inner {
    width: min(100%, 600px);

    padding: 2.5% 5px 20%;

    gap: 16px;
  }

  .tdx-decor--line-right {
    top: 80px;
    left: -150px;
    right: auto;

    width: 158px;
    height: 560px;
  }

  .tdx-decor--flower-right {
    top: 20px;
    left: -300px;
    right: auto;

    width: 420px;
    height: 420px;
  }

  .tdx-heading {
    font-size: 27px;
  }

  .tdx-map__address {
    font-size: 17px;
  }

  .tdx-map__frame {
    height: 340px;
  }

  .tdx-map__direction {
    font-size: 13px;
  }
}
</style>
