<template>
  <section class="ob-map">
    <div class="ob-map__ornament">
      <span></span>
      <i>〜</i>
      <span class="ob-map__ornament-flip"></span>
    </div>

    <p class="ob-eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</p>

    <h2>Bản đồ địa điểm</h2>

    <div class="ob-map__card">
      <div class="ob-map__address">
        <div class="ob-map__address-icon">
          <v-icon size="22">mdi-map-marker-radius-outline</v-icon>
        </div>

        <div class="ob-map__address-content">
          <span class="ob-map__address-label">ĐỊA CHỈ</span>

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

      <div class="ob-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div class="ob-map__top-decoration">
          <span class="ob-map__line"></span>

          <div class="ob-map__pin">
            <v-icon size="19">mdi-map-marker</v-icon>
          </div>

          <span class="ob-map__line"></span>
        </div>

        <div class="ob-map__label">
          <v-icon size="15">mdi-map-marker-heart</v-icon>

          <span>HẸN GẶP BẠN TẠI ĐÂY</span>
        </div>
      </div>

      <div class="ob-map__bottom">
        <a
          v-if="mapSrcLink"
          :href="mapSrcLink"
          target="_blank"
          rel="noopener noreferrer"
          class="ob-map__direction"
        >
          <span>CHỈ ĐƯỜNG</span>

          <v-icon size="17">mdi-navigation-variant-outline</v-icon>
        </a>
      </div>
    </div>

    <div class="ob-map__footer-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span class="ob-map__footer-flip"></span>
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
.ob-map {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 36px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #274b5c;

  border: 1px solid rgba(74, 154, 184, 0.35);
  border-radius: 24px;

  background: linear-gradient(170deg, rgba(255, 255, 255, 0.8), rgba(244, 250, 252, 0.6));

  box-shadow: 0 12px 35px rgba(29, 106, 142, 0.09);

  overflow: hidden;
}

.ob-map::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;

  background:
    radial-gradient(circle at 12px 8px, transparent 9px, rgba(168, 208, 220, 0.55) 10px, transparent 11px) repeat-x;
  background-size: 24px 10px;
  background-position: 0 0;

  pointer-events: none;
}

/* =========================================================
   ORNAMENT
========================================================= */

.ob-map__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #4a9ab8;
}

.ob-map__ornament span {
  display: block;

  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.7));
}

.ob-map__ornament-flip {
  transform: rotate(180deg);
}

.ob-map__ornament i {
  font-size: 14px;
  font-style: normal;

  color: #e8927c;
}

.ob-eyebrow {
  position: relative;

  margin: 0;

  color: #4a9ab8;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ob-map h2 {
  position: relative;

  margin: 6px 0 20px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #1d6a8e;
}

/* =========================================================
   MAP CARD
========================================================= */

.ob-map__card {
  position: relative;

  border: 1px solid rgba(74, 154, 184, 0.4);
  border-radius: 20px;

  background: #f4fafc;

  overflow: hidden;

  box-shadow: 0 9px 28px rgba(29, 106, 142, 0.1);
}

.ob-map__frame {
  position: relative;

  width: 100%;
  height: 300px;

  overflow: hidden;

  background: #d8eaf0;
}

.ob-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 1px solid rgba(74, 154, 184, 0.25);

  filter: saturate(0.85) hue-rotate(-6deg) contrast(0.96);
}

.ob-map__top-decoration {
  position: absolute;

  top: 17px;
  left: 50%;

  display: flex;
  align-items: center;
  gap: 8px;

  transform: translateX(-50%);

  pointer-events: none;
}

.ob-map__line {
  width: 38px;
  height: 1px;

  background: rgba(255, 255, 255, 0.8);
}

.ob-map__pin {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 50%;

  background: rgba(29, 106, 142, 0.88);

  box-shadow: 0 4px 12px rgba(23, 74, 96, 0.25);
}

.ob-map__label {
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

  background: rgba(29, 106, 142, 0.82);

  backdrop-filter: blur(5px);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.16em;

  white-space: nowrap;
}

/* =========================================================
   ADDRESS
========================================================= */

.ob-map__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 17px 16px 18px;

  background: linear-gradient(180deg, rgba(244, 250, 252, 0.98), rgba(226, 241, 245, 0.85));
}

.ob-map__address {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  min-width: 0;
  gap: 10px;

  text-align: left;
}

.ob-map__address-icon {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #1d6a8e;

  border: 1px solid rgba(74, 154, 184, 0.4);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.8);
}

.ob-map__address-content {
  min-width: 0;
}

.ob-map__address-label {
  display: block;

  margin-bottom: 2px;

  color: #e8927c;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.ob-map__address-content p {
  margin: 0;

  color: #274b5c;

  font-size: 13px;

  line-height: 1.45;
}

/* =========================================================
   DIRECTION BUTTON
========================================================= */

.ob-map__direction {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 38px;

  padding: 0 13px;

  color: white;

  border: 1px solid #1d6a8e;
  border-radius: 999px;

  background: linear-gradient(135deg, #4a9ab8, #1d6a8e);

  box-shadow: 0 5px 13px rgba(29, 106, 142, 0.22);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.ob-map__direction:hover {
  color: white;

  transform: translateY(-2px);

  box-shadow: 0 8px 18px rgba(29, 106, 142, 0.3);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.ob-map__footer-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #4a9ab8;
}

.ob-map__footer-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(74, 154, 184, 0.55));
}

.ob-map__footer-flip {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .ob-map {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 20px;
  }

  .ob-map__frame {
    height: 260px;
  }

  .ob-map__bottom {
    align-items: flex-start;
    flex-direction: column;

    padding: 15px 13px 16px;
  }

  .ob-map__direction {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .ob-map__frame {
    height: 230px;
  }
}
</style>
