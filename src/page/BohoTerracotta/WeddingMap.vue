<template>
  <section class="bt-map">
    <div class="bt-map__ornament">
      <span></span>
      <i>❋</i>
      <span></span>
    </div>

    <p class="bt-eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</p>

    <h2>Bản đồ địa điểm</h2>

    <div class="bt-map__card">
      <div class="bt-map__address">
        <div class="bt-map__address-icon">
          <v-icon size="22">mdi-map-marker-radius-outline</v-icon>
        </div>

        <div class="bt-map__address-content">
          <span class="bt-map__address-label">ĐỊA CHỈ</span>

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

      <div class="bt-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div class="bt-map__top-decoration">
          <span class="bt-map__line"></span>

          <div class="bt-map__pin">
            <v-icon size="19">mdi-map-marker</v-icon>
          </div>

          <span class="bt-map__line"></span>
        </div>

        <div class="bt-map__label">
          <i>☼</i>

          <span>HẸN GẶP BẠN TẠI ĐÂY</span>
        </div>
      </div>

      <div class="bt-map__bottom">
        <a
          v-if="mapSrcLink"
          :href="mapSrcLink"
          target="_blank"
          rel="noopener noreferrer"
          class="bt-map__direction"
        >
          <span>CHỈ ĐƯỜNG</span>

          <v-icon size="17">mdi-navigation-variant-outline</v-icon>
        </a>
      </div>
    </div>

    <div class="bt-map__footer-ornament">
      <span></span>
      <i>✽</i>
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

  if (event.Map || event.MapUrl) {
    return event.Map || event.MapUrl;
  }

  const address = event.Address || event.Location || event.Place || "";

  if (!address) return "";

  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
});
</script>

<style scoped>
.bt-map {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 36px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #5c4636;

  border: 2px dashed rgba(156, 91, 63, 0.4);
  border-radius: 60% 60% 28px 28px / 12% 12% 28px 28px;

  background: linear-gradient(172deg, rgba(255, 251, 245, 0.78), rgba(242, 226, 208, 0.55));

  box-shadow: 0 12px 35px rgba(92, 70, 54, 0.1);

  overflow: hidden;
}

/* Macramé lattice texture */
.bt-map::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(156, 91, 63, 0.6) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

/* =========================================================
   ORNAMENT
========================================================= */

.bt-map__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #c97b5d;
}

.bt-map__ornament span {
  display: block;

  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.7));
}

.bt-map__ornament span:last-child {
  transform: rotate(180deg);
}

.bt-map__ornament i {
  font-size: 14px;
  font-style: normal;
}

.bt-eyebrow {
  position: relative;

  margin: 0;

  color: #8a9b7c;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.bt-map h2 {
  position: relative;

  margin: 6px 0 20px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #9c5b3f;
}

/* =========================================================
   MAP CARD
========================================================= */

.bt-map__card {
  position: relative;

  border: 1px solid rgba(156, 91, 63, 0.45);
  border-radius: 999px 999px 21px 21px;

  background: #fffbf5;

  overflow: hidden;

  box-shadow: 0 9px 28px rgba(92, 70, 54, 0.1);
}

.bt-map__frame {
  position: relative;

  width: 100%;
  height: 300px;

  overflow: hidden;

  background: #e9dccd;
}

.bt-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 1px solid #e0d0bd;

  filter: saturate(0.72) sepia(0.14) contrast(0.94);
}

.bt-map__top-decoration {
  position: absolute;

  top: 17px;
  left: 50%;

  display: flex;
  align-items: center;
  gap: 8px;

  transform: translateX(-50%);

  pointer-events: none;
}

.bt-map__line {
  width: 38px;
  height: 1px;

  background: rgba(255, 255, 255, 0.8);
}

.bt-map__pin {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 50% 50% 50% 20%;

  background: rgba(156, 91, 63, 0.9);

  box-shadow: 0 4px 12px rgba(92, 70, 54, 0.25);

  transform: rotate(-6deg);
}

.bt-map__label {
  position: absolute;

  left: 50%;
  bottom: 14px;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 8px 13px;

  transform: translateX(-50%);

  color: white;

  border: 1px dashed rgba(255, 255, 255, 0.5);
  border-radius: 999px;

  background: rgba(92, 70, 54, 0.82);

  backdrop-filter: blur(5px);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.16em;

  white-space: nowrap;
}

.bt-map__label i {
  font-size: 11px;
  font-style: normal;
}

/* =========================================================
   ADDRESS
========================================================= */

.bt-map__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 17px 16px 18px;

  background: linear-gradient(180deg, rgba(255, 251, 245, 0.98), rgba(242, 226, 208, 0.85));
}

.bt-map__address {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  min-width: 0;
  gap: 10px;

  text-align: left;
}

.bt-map__address-icon {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #9c5b3f;

  border: 1px dashed rgba(156, 91, 63, 0.45);
  border-radius: 50% 50% 50% 20%;

  background: rgba(255, 255, 255, 0.75);
}

.bt-map__address-content {
  min-width: 0;
}

.bt-map__address-label {
  display: block;

  margin-bottom: 2px;

  color: #8a9b7c;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.bt-map__address-content p {
  margin: 0;

  color: #5c4636;

  font-size: 13px;

  line-height: 1.45;
}

/* =========================================================
   DIRECTION BUTTON
========================================================= */

.bt-map__direction {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 38px;

  padding: 0 13px;

  color: #fff6ec;

  border: 1px solid #9c5b3f;
  border-radius: 999px;

  background: linear-gradient(135deg, #c97b5d, #9c5b3f);

  box-shadow: 0 5px 13px rgba(156, 91, 63, 0.24);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.bt-map__direction:hover {
  color: #fff6ec;

  transform: translateY(-2px) rotate(-1deg);

  box-shadow: 0 8px 18px rgba(156, 91, 63, 0.32);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.bt-map__footer-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #c97b5d;
}

.bt-map__footer-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(156, 91, 63, 0.55));
}

.bt-map__footer-ornament span:last-child {
  transform: rotate(180deg);
}

.bt-map__footer-ornament i {
  font-size: 12px;
  font-style: normal;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .bt-map {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;
  }

  .bt-map__frame {
    height: 260px;
  }

  .bt-map__bottom {
    align-items: flex-start;
    flex-direction: column;

    padding: 15px 13px 16px;
  }

  .bt-map__direction {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .bt-map__frame {
    height: 230px;
  }
}
</style>
