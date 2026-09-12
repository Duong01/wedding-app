<template>
  <section class="sp-map">
    <div class="sp-map__ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <p class="sp-eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</p>

    <h2>Bản đồ địa điểm</h2>

    <div class="sp-map__card">
      <div class="sp-map__address">
        <div class="sp-map__address-icon">
          <v-icon size="22">mdi-map-marker-radius-outline</v-icon>
        </div>

        <div class="sp-map__address-content">
          <span class="sp-map__address-label">ĐỊA CHỈ</span>

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

      <div class="sp-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div class="sp-map__top-decoration">
          <span class="sp-map__line"></span>

          <div class="sp-map__pin">
            <v-icon size="19">mdi-map-marker</v-icon>
          </div>

          <span class="sp-map__line"></span>
        </div>

        <div class="sp-map__label">
          <v-icon size="15">mdi-map-marker-heart</v-icon>

          <span>HẸN GẶP BẠN TẠI ĐÂY</span>
        </div>
      </div>

      <div class="sp-map__bottom">
        <a
          v-if="mapSrcLink"
          :href="mapSrcLink"
          target="_blank"
          rel="noopener noreferrer"
          class="sp-map__direction"
        >
          <span>CHỈ ĐƯỜNG</span>

          <v-icon size="17">mdi-navigation-variant-outline</v-icon>
        </a>
      </div>
    </div>

    <div class="sp-map__footer-ornament">
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
.sp-map {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 36px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #7a4a3d;

  border: 1px solid rgba(224, 163, 126, 0.45);
  border-radius: 28px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.75), rgba(255, 242, 232, 0.55));

  box-shadow: 0 12px 35px rgba(122, 74, 61, 0.09);

  overflow: hidden;
}

.sp-map::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(224, 163, 126, 0.28);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   ORNAMENT
========================================================= */

.sp-map__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #e0a37e;
}

.sp-map__ornament span {
  display: block;

  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.7));
}

.sp-map__ornament span:last-child {
  transform: rotate(180deg);
}

.sp-eyebrow {
  position: relative;

  margin: 0;

  color: #d67a63;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.sp-map h2 {
  position: relative;

  margin: 6px 0 20px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #7a4a3d;
}

/* =========================================================
   MAP CARD
========================================================= */

.sp-map__card {
  position: relative;

  border: 1px solid rgba(224, 163, 126, 0.5);
  border-radius: 21px;

  background: #fffaf5;

  overflow: hidden;

  box-shadow: 0 9px 28px rgba(122, 74, 61, 0.1);
}

.sp-map__frame {
  position: relative;

  width: 100%;
  height: 300px;

  overflow: hidden;

  background: #f3e3d3;
}

.sp-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 1px solid #f0d9c2;

  filter: saturate(0.72) sepia(0.1) contrast(0.94);
}

.sp-map__top-decoration {
  position: absolute;

  top: 17px;
  left: 50%;

  display: flex;
  align-items: center;
  gap: 8px;

  transform: translateX(-50%);

  pointer-events: none;
}

.sp-map__line {
  width: 38px;
  height: 1px;

  background: rgba(255, 255, 255, 0.8);
}

.sp-map__pin {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 50%;

  background: rgba(184, 92, 72, 0.88);

  box-shadow: 0 4px 12px rgba(122, 74, 61, 0.24);
}

.sp-map__label {
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

  background: rgba(122, 74, 61, 0.82);

  backdrop-filter: blur(5px);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.16em;

  white-space: nowrap;
}

/* =========================================================
   ADDRESS
========================================================= */

.sp-map__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 17px 16px 18px;

  background: linear-gradient(180deg, rgba(255, 250, 245, 0.98), rgba(253, 238, 228, 0.85));
}

.sp-map__address {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  min-width: 0;
  gap: 10px;

  text-align: left;
}

.sp-map__address-icon {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #b85c48;

  border: 1px solid rgba(224, 163, 126, 0.45);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);
}

.sp-map__address-content {
  min-width: 0;
}

.sp-map__address-label {
  display: block;

  margin-bottom: 2px;

  color: #d67a63;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.sp-map__address-content p {
  margin: 0;

  color: #7a4a3d;

  font-size: 13px;

  line-height: 1.45;
}

/* =========================================================
   DIRECTION BUTTON
========================================================= */

.sp-map__direction {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 38px;

  padding: 0 13px;

  color: white;

  border: 1px solid #b85c48;
  border-radius: 999px;

  background: linear-gradient(135deg, #d67a63, #b85c48);

  box-shadow: 0 5px 13px rgba(122, 74, 61, 0.2);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.sp-map__direction:hover {
  color: white;

  transform: translateY(-2px);

  box-shadow: 0 8px 18px rgba(122, 74, 61, 0.28);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.sp-map__footer-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #e0a37e;
}

.sp-map__footer-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(224, 163, 126, 0.55));
}

.sp-map__footer-ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .sp-map {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .sp-map::before {
    inset: 6px;
    border-radius: 18px;
  }

  .sp-map__frame {
    height: 260px;
  }

  .sp-map__bottom {
    align-items: flex-start;
    flex-direction: column;

    padding: 15px 13px 16px;
  }

  .sp-map__direction {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .sp-map__frame {
    height: 230px;
  }
}
</style>
