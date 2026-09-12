<template>
  <section class="vs-map">
    <div class="vs-map__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p class="vs-eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</p>

    <h2>Bản đồ địa điểm</h2>

    <div class="vs-map__card">
      <div class="vs-map__address">
        <div class="vs-map__address-icon">
          <v-icon size="22">mdi-map-marker-radius-outline</v-icon>
        </div>

        <div class="vs-map__address-content">
          <span class="vs-map__address-label">ĐỊA CHỈ</span>

          <p>
            {{
              firstEvent?.Address ||
              firstEvent?.Location ||
              firstEvent?.Place ||
              "Địa chỉ tổ chức tiệc cưới"
            }}
          </p>
        </div>
      </div>

      <div class="vs-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div class="vs-map__top-decoration">
          <span class="vs-map__line"></span>

          <div class="vs-map__pin">
            <v-icon size="19">mdi-map-marker</v-icon>
          </div>

          <span class="vs-map__line"></span>
        </div>

        <div class="vs-map__label">
          <v-icon size="15">mdi-map-marker-heart</v-icon>

          <span>HẸN GẶP BẠN TẠI ĐÂY</span>
        </div>
      </div>

      <div class="vs-map__bottom">
        <a
          v-if="mapSrcLink"
          :href="mapSrcLink"
          target="_blank"
          rel="noopener noreferrer"
          class="vs-map__direction"
        >
          <span>CHỈ ĐƯỜNG</span>

          <v-icon size="17">mdi-navigation-variant-outline</v-icon>
        </a>
      </div>
    </div>

    <div class="vs-map__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
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

  const address = event.Address || event.Location || event.Place || "";

  if (!address) return "";

  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
});
</script>

<style scoped>
.vs-map {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 36px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #6b4f3a;

  border: 1px solid rgba(107, 79, 58, 0.4);
  border-radius: 10px;

  background: #fbf5e6;

  box-shadow: 0 12px 35px rgba(61, 47, 36, 0.1);

  overflow: hidden;
}

.vs-map::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px dashed rgba(107, 79, 58, 0.28);
  border-radius: 6px;

  pointer-events: none;
}

/* =========================================================
   ORNAMENT
========================================================= */

.vs-map__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #c2a878;
}

.vs-map__ornament span {
  display: block;

  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.55));
}

.vs-map__ornament span:last-child {
  transform: rotate(180deg);
}

.vs-eyebrow {
  position: relative;

  margin: 0;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.28em;
  text-indent: 0.28em;
}

.vs-map h2 {
  position: relative;

  margin: 6px 0 20px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #4a3a2c;
}

/* =========================================================
   MAP CARD
========================================================= */

.vs-map__card {
  position: relative;

  border: 1px solid rgba(107, 79, 58, 0.45);
  border-radius: 8px;

  background: #fffdf6;

  overflow: hidden;

  box-shadow: 0 9px 28px rgba(61, 47, 36, 0.12);
}

.vs-map__frame {
  position: relative;

  width: 100%;
  height: 300px;

  overflow: hidden;

  background: #e5d7bd;
}

.vs-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 1px solid #d8c7a6;

  filter: sepia(0.22) saturate(0.85) contrast(0.95);
}

.vs-map__top-decoration {
  position: absolute;

  top: 17px;
  left: 50%;

  display: flex;
  align-items: center;
  gap: 8px;

  transform: translateX(-50%);

  pointer-events: none;
}

.vs-map__line {
  width: 38px;
  height: 1px;

  background: rgba(255, 253, 246, 0.8);
}

.vs-map__pin {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ead9bd;

  border: 1px solid rgba(234, 217, 189, 0.65);
  border-radius: 46% 54% 50% 50% / 53% 47% 55% 45%;

  background: rgba(74, 58, 44, 0.88);

  box-shadow: 0 4px 12px rgba(45, 33, 26, 0.28);
}

.vs-map__label {
  position: absolute;

  left: 50%;
  bottom: 14px;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 8px 13px;

  transform: translateX(-50%);

  color: #ead9bd;

  border: 1px solid rgba(234, 217, 189, 0.45);
  border-radius: 6px;

  background: rgba(61, 47, 36, 0.82);

  backdrop-filter: blur(5px);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.16em;

  white-space: nowrap;
}

/* =========================================================
   ADDRESS
========================================================= */

.vs-map__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 17px 16px 18px;

  background: linear-gradient(180deg, rgba(255, 253, 246, 0.98), rgba(240, 229, 205, 0.85));
}

.vs-map__address {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  min-width: 0;
  gap: 10px;

  text-align: left;
}

.vs-map__address-icon {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #6b4f3a;

  border: 1px solid rgba(107, 79, 58, 0.4);
  border-radius: 50%;

  background: rgba(255, 253, 246, 0.75);
}

.vs-map__address-content {
  min-width: 0;
}

.vs-map__address-label {
  display: block;

  margin-bottom: 2px;

  color: #97745a;

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.vs-map__address-content p {
  margin: 0;

  color: #4a3a2c;

  font-size: 13px;

  line-height: 1.45;
}

/* =========================================================
   DIRECTION BUTTON
========================================================= */

.vs-map__direction {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 38px;

  padding: 0 13px;

  color: #ead9bd;

  border: 1px solid #2c211a;
  border-radius: 8px;

  background: linear-gradient(160deg, #4a3a2c, #3d2f24 60%, #2c211a);

  box-shadow: 0 5px 13px rgba(61, 47, 36, 0.25);

  font-family: "Courier New", ui-monospace, monospace;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.vs-map__direction:hover {
  color: #ead9bd;

  transform: translateY(-2px);

  box-shadow: 0 8px 18px rgba(61, 47, 36, 0.32);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.vs-map__footer-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #c2a878;
}

.vs-map__footer-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(107, 79, 58, 0.5));
}

.vs-map__footer-ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .vs-map {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;
  }

  .vs-map::before {
    inset: 6px;
  }

  .vs-map__frame {
    height: 260px;
  }

  .vs-map__bottom {
    align-items: flex-start;
    flex-direction: column;

    padding: 15px 13px 16px;
  }

  .vs-map__direction {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .vs-map__frame {
    height: 230px;
  }
}
</style>
