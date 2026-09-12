<template>
  <section class="lc-map">
    <div class="lc-map__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p class="lc-eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</p>

    <h2>Bản đồ địa điểm</h2>

    <div class="lc-map__card">
      <div class="lc-map__address">
        <div class="lc-map__address-icon">
          <v-icon size="22">mdi-map-marker-radius-outline</v-icon>
        </div>

        <div class="lc-map__address-content">
          <span class="lc-map__address-label">ĐỊA CHỈ</span>

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

      <div class="lc-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div class="lc-map__top-decoration">
          <span class="lc-map__line"></span>

          <div class="lc-map__pin">
            <v-icon size="19">mdi-map-marker</v-icon>
          </div>

          <span class="lc-map__line"></span>
        </div>

        <div class="lc-map__label">
          <v-icon size="15">mdi-map-marker-heart</v-icon>

          <span>HẸN GẶP BẠN TẠI ĐÂY</span>
        </div>
      </div>

      <div class="lc-map__bottom">
        <a
          v-if="mapSrcLink"
          :href="mapSrcLink"
          target="_blank"
          rel="noopener noreferrer"
          class="lc-map__direction"
        >
          <span>CHỈ ĐƯỜNG</span>

          <v-icon size="17">mdi-navigation-variant-outline</v-icon>
        </a>
      </div>
    </div>

    <div class="lc-map__footer-ornament">
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
.lc-map {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 36px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #584a5b;

  border: 1px solid rgba(160, 134, 180, 0.35);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.75), rgba(246, 240, 250, 0.55));

  box-shadow: 0 12px 35px rgba(88, 74, 91, 0.09);

  overflow: hidden;
}

.lc-map::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(185, 160, 208, 0.25);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   ORNAMENT
========================================================= */

.lc-map__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #b9a0d0;
}

.lc-map__ornament span {
  display: block;

  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.7));
}

.lc-map__ornament span:last-child {
  transform: rotate(180deg);
}

.lc-eyebrow {
  position: relative;

  margin: 0;

  color: #a086b4;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.lc-map h2 {
  position: relative;

  margin: 6px 0 20px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #584a5b;
}

/* =========================================================
   MAP CARD
========================================================= */

.lc-map__card {
  position: relative;

  border: 1px solid rgba(160, 134, 180, 0.4);
  border-radius: 21px;

  background: #faf8fc;

  overflow: hidden;

  box-shadow: 0 9px 28px rgba(88, 74, 91, 0.1);
}

.lc-map__frame {
  position: relative;

  width: 100%;
  height: 300px;

  overflow: hidden;

  background: #e9e0ef;
}

.lc-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 1px solid #ddd0e6;

  filter: saturate(0.72) sepia(0.1) contrast(0.94);
}

.lc-map__top-decoration {
  position: absolute;

  top: 17px;
  left: 50%;

  display: flex;
  align-items: center;
  gap: 8px;

  transform: translateX(-50%);

  pointer-events: none;
}

.lc-map__line {
  width: 38px;
  height: 1px;

  background: rgba(255, 255, 255, 0.8);
}

.lc-map__pin {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 50%;

  background: rgba(125, 99, 144, 0.86);

  box-shadow: 0 4px 12px rgba(67, 56, 70, 0.22);
}

.lc-map__label {
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

  background: rgba(88, 74, 91, 0.8);

  backdrop-filter: blur(5px);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.16em;

  white-space: nowrap;
}

/* =========================================================
   ADDRESS
========================================================= */

.lc-map__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 17px 16px 18px;

  background: linear-gradient(180deg, rgba(250, 248, 252, 0.98), rgba(241, 235, 244, 0.85));
}

.lc-map__address {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  min-width: 0;
  gap: 10px;

  text-align: left;
}

.lc-map__address-icon {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #7d6390;

  border: 1px solid rgba(160, 134, 180, 0.4);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);
}

.lc-map__address-content {
  min-width: 0;
}

.lc-map__address-label {
  display: block;

  margin-bottom: 2px;

  color: #a086b4;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.lc-map__address-content p {
  margin: 0;

  color: #584a5b;

  font-size: 13px;

  line-height: 1.45;
}

/* =========================================================
   DIRECTION BUTTON
========================================================= */

.lc-map__direction {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 38px;

  padding: 0 13px;

  color: white;

  border: 1px solid #7d6390;
  border-radius: 999px;

  background: linear-gradient(135deg, #a086b4, #7d6390);

  box-shadow: 0 5px 13px rgba(88, 74, 91, 0.2);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.lc-map__direction:hover {
  color: white;

  transform: translateY(-2px);

  box-shadow: 0 8px 18px rgba(88, 74, 91, 0.28);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.lc-map__footer-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #b9a0d0;
}

.lc-map__footer-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(185, 160, 208, 0.55));
}

.lc-map__footer-ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .lc-map {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .lc-map::before {
    inset: 6px;
    border-radius: 18px;
  }

  .lc-map__frame {
    height: 260px;
  }

  .lc-map__bottom {
    align-items: flex-start;
    flex-direction: column;

    padding: 15px 13px 16px;
  }

  .lc-map__direction {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .lc-map__frame {
    height: 230px;
  }
}
</style>
