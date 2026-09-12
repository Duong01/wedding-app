<template>
  <section class="mg-map">
    <div class="mg-map__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p class="mg-eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</p>

    <h2>Bản đồ địa điểm</h2>

    <div class="mg-map__card">
      <div class="mg-map__address">
        <div class="mg-map__address-icon">
          <v-icon size="22">mdi-map-marker-radius-outline</v-icon>
        </div>

        <div class="mg-map__address-content">
          <span class="mg-map__address-label">ĐỊA CHỈ</span>

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

      <div class="mg-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div class="mg-map__top-decoration">
          <span class="mg-map__line"></span>

          <div class="mg-map__pin">
            <v-icon size="19">mdi-map-marker</v-icon>
          </div>

          <span class="mg-map__line"></span>
        </div>

        <div class="mg-map__label">
          <v-icon size="15">mdi-map-marker-heart</v-icon>

          <span>HẸN GẶP BẠN TẠI ĐÂY</span>
        </div>
      </div>

      <div class="mg-map__bottom">
        <a
          v-if="mapSrcLink"
          :href="mapSrcLink"
          target="_blank"
          rel="noopener noreferrer"
          class="mg-map__direction"
        >
          <span>CHỈ ĐƯỜNG</span>

          <v-icon size="17">mdi-navigation-variant-outline</v-icon>
        </a>
      </div>
    </div>

    <div class="mg-map__footer-ornament">
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
.mg-map {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 36px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #f0e6d2;

  border: 1px solid rgba(216, 182, 118, 0.28);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.02));

  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45);

  overflow: hidden;
}

.mg-map::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(216, 182, 118, 0.18);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   ORNAMENT
========================================================= */

.mg-map__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #d8b676;
}

.mg-map__ornament span {
  display: block;

  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.7));
}

.mg-map__ornament span:last-child {
  transform: rotate(180deg);
}

.mg-eyebrow {
  position: relative;

  margin: 0;

  color: #d8b676;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.mg-map h2 {
  position: relative;

  margin: 6px 0 20px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #f0e6d2;
}

/* =========================================================
   MAP CARD
========================================================= */

.mg-map__card {
  position: relative;

  border: 1px solid rgba(216, 182, 118, 0.35);
  border-radius: 21px;

  background: #201a24;

  overflow: hidden;

  box-shadow: 0 9px 28px rgba(0, 0, 0, 0.45);
}

.mg-map__frame {
  position: relative;

  width: 100%;
  height: 300px;

  overflow: hidden;

  background: #17121b;
}

.mg-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 1px solid rgba(216, 182, 118, 0.2);

  filter: invert(0.9) hue-rotate(180deg) saturate(0.5) brightness(0.9);
}

.mg-map__top-decoration {
  position: absolute;

  top: 17px;
  left: 50%;

  display: flex;
  align-items: center;
  gap: 8px;

  transform: translateX(-50%);

  pointer-events: none;
}

.mg-map__line {
  width: 38px;
  height: 1px;

  background: rgba(216, 182, 118, 0.55);
}

.mg-map__pin {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #261d23;

  border: 1px solid rgba(216, 182, 118, 0.65);
  border-radius: 50%;

  background: linear-gradient(135deg, #d8b676, #9b7d4d);

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.45), 0 0 16px rgba(216, 182, 118, 0.25);
}

.mg-map__label {
  position: absolute;

  left: 50%;
  bottom: 14px;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 8px 13px;

  transform: translateX(-50%);

  color: #eed9a8;

  border: 1px solid rgba(216, 182, 118, 0.45);
  border-radius: 999px;

  background: rgba(29, 22, 34, 0.85);

  backdrop-filter: blur(5px);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.16em;

  white-space: nowrap;
}

/* =========================================================
   ADDRESS
========================================================= */

.mg-map__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 17px 16px 18px;

  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(216, 182, 118, 0.04));
}

.mg-map__address {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  min-width: 0;
  gap: 10px;

  text-align: left;
}

.mg-map__address-icon {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #d8b676;

  border: 1px solid rgba(216, 182, 118, 0.35);
  border-radius: 50%;

  background: rgba(216, 182, 118, 0.1);
}

.mg-map__address-content {
  min-width: 0;
}

.mg-map__address-label {
  display: block;

  margin-bottom: 2px;

  color: #b9a88f;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.mg-map__address-content p {
  margin: 0;

  color: #f0e6d2;

  font-size: 13px;

  line-height: 1.45;
}

/* =========================================================
   DIRECTION BUTTON
========================================================= */

.mg-map__direction {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 38px;

  padding: 0 13px;

  color: #261d23;

  border: 1px solid #9b7d4d;
  border-radius: 999px;

  background: linear-gradient(135deg, #d8b676, #9b7d4d);

  box-shadow: 0 5px 13px rgba(0, 0, 0, 0.4), 0 0 14px rgba(216, 182, 118, 0.15);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.mg-map__direction:hover {
  color: #261d23;

  transform: translateY(-2px);

  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.5), 0 0 22px rgba(216, 182, 118, 0.25);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.mg-map__footer-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #d8b676;
}

.mg-map__footer-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(216, 182, 118, 0.55));
}

.mg-map__footer-ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .mg-map {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .mg-map::before {
    inset: 6px;
    border-radius: 18px;
  }

  .mg-map__frame {
    height: 260px;
  }

  .mg-map__bottom {
    align-items: flex-start;
    flex-direction: column;

    padding: 15px 13px 16px;
  }

  .mg-map__direction {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .mg-map__frame {
    height: 230px;
  }
}
</style>
