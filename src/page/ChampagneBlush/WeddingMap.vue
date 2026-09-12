<template>
  <section class="cb-map">
    <div class="cb-map__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p class="cb-eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</p>

    <h2>Bản đồ địa điểm</h2>

    <div class="cb-map__card">
      <div class="cb-map__address">
        <div class="cb-map__address-icon">
          <v-icon size="22">mdi-map-marker-radius-outline</v-icon>
        </div>

        <div class="cb-map__address-content">
          <span class="cb-map__address-label">ĐỊA CHỈ</span>

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

      <div class="cb-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div class="cb-map__top-decoration">
          <span class="cb-map__line"></span>

          <div class="cb-map__pin">
            <v-icon size="19">mdi-map-marker</v-icon>
          </div>

          <span class="cb-map__line"></span>
        </div>

        <div class="cb-map__label">
          <v-icon size="15">mdi-map-marker-heart</v-icon>

          <span>HẸN GẶP BẠN TẠI ĐÂY</span>
        </div>
      </div>

      <div class="cb-map__bottom">
        <a
          v-if="mapSrcLink"
          :href="mapSrcLink"
          target="_blank"
          rel="noopener noreferrer"
          class="cb-map__direction"
        >
          <span>CHỈ ĐƯỜNG</span>

          <v-icon size="17">mdi-navigation-variant-outline</v-icon>
        </a>
      </div>
    </div>

    <div class="cb-map__footer-ornament">
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

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
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
.cb-map {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 36px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #6c4b4a;

  border: 1px solid rgba(201, 160, 106, 0.4);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 253, 250, 0.75), rgba(250, 240, 230, 0.55));

  box-shadow: 0 12px 35px rgba(108, 75, 74, 0.09);

  overflow: hidden;
}

.cb-map::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(201, 160, 106, 0.25);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   ORNAMENT
========================================================= */

.cb-map__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #c9a06a;
}

.cb-map__ornament span {
  display: block;

  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.7));
}

.cb-map__ornament span:last-child {
  transform: rotate(180deg);
}

.cb-eyebrow {
  position: relative;

  margin: 0;

  color: #b67f7d;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.cb-map h2 {
  position: relative;

  margin: 6px 0 20px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #6c4b4a;
}

/* =========================================================
   MAP CARD
========================================================= */

.cb-map__card {
  position: relative;

  border: 1px solid rgba(201, 160, 106, 0.45);
  border-radius: 21px;

  background: #fffaf7;

  overflow: hidden;

  box-shadow: 0 9px 28px rgba(108, 75, 74, 0.1);
}

.cb-map__frame {
  position: relative;

  width: 100%;
  height: 300px;

  overflow: hidden;

  background: #ece2d8;
}

.cb-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 1px solid #e5d8ca;

  filter: saturate(0.72) sepia(0.1) contrast(0.94);
}

.cb-map__top-decoration {
  position: absolute;

  top: 17px;
  left: 50%;

  display: flex;
  align-items: center;
  gap: 8px;

  transform: translateX(-50%);

  pointer-events: none;
}

.cb-map__line {
  width: 38px;
  height: 1px;

  background: rgba(255, 255, 255, 0.8);
}

.cb-map__pin {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 50%;

  background: rgba(143, 90, 86, 0.86);

  box-shadow: 0 4px 12px rgba(80, 45, 40, 0.22);
}

.cb-map__label {
  position: absolute;

  left: 50%;
  bottom: 14px;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 8px 13px;

  transform: translateX(-50%);

  color: white;

  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 999px;

  background: rgba(108, 75, 74, 0.8);

  backdrop-filter: blur(5px);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.16em;

  white-space: nowrap;
}

/* =========================================================
   ADDRESS
========================================================= */

.cb-map__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 17px 16px 18px;

  background: linear-gradient(180deg, rgba(255, 250, 247, 0.98), rgba(248, 237, 226, 0.85));
}

.cb-map__address {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  min-width: 0;
  gap: 10px;

  text-align: left;
}

.cb-map__address-icon {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #8f5a56;

  border: 1px solid rgba(201, 160, 106, 0.4);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);
}

.cb-map__address-content {
  min-width: 0;
}

.cb-map__address-label {
  display: block;

  margin-bottom: 2px;

  color: #b67f7d;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.cb-map__address-content p {
  margin: 0;

  color: #6c4b4a;

  font-size: 13px;

  line-height: 1.45;
}

/* =========================================================
   DIRECTION BUTTON
========================================================= */

.cb-map__direction {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 38px;

  padding: 0 13px;

  color: white;

  border: 1px solid #8f5a56;
  border-radius: 999px;

  background: linear-gradient(135deg, #b67f7d, #8f5a56);

  box-shadow: 0 5px 13px rgba(108, 75, 74, 0.2);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.cb-map__direction:hover {
  color: white;

  transform: translateY(-2px);

  box-shadow: 0 8px 18px rgba(108, 75, 74, 0.28);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.cb-map__footer-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #c9a06a;
}

.cb-map__footer-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 160, 106, 0.55));
}

.cb-map__footer-ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .cb-map {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .cb-map::before {
    inset: 6px;
    border-radius: 18px;
  }

  .cb-map__frame {
    height: 260px;
  }

  .cb-map__bottom {
    align-items: flex-start;
    flex-direction: column;

    padding: 15px 13px 16px;
  }

  .cb-map__direction {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .cb-map__frame {
    height: 230px;
  }
}
</style>
