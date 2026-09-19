<template>
  <section class="eg-map">
    <div class="eg-map__ornament">
      <span></span>
      <i>❦</i>
      <span></span>
    </div>

    <p class="eg-eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</p>

    <h2>Bản đồ địa điểm</h2>

    <div class="eg-map__card">
      <div class="eg-map__address">
        <div class="eg-map__address-icon">
          <v-icon size="22">mdi-map-marker-radius-outline</v-icon>
        </div>

        <div class="eg-map__address-content">
          <span class="eg-map__address-label">ĐỊA CHỈ</span>

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

      <div class="eg-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div class="eg-map__top-decoration">
          <span class="eg-map__line"></span>

          <div class="eg-map__pin">
            <v-icon size="19">mdi-map-marker</v-icon>
          </div>

          <span class="eg-map__line"></span>
        </div>

        <div class="eg-map__label">
          <i>✦</i>

          <span>HẸN GẶP BẠN TẠI ĐÂY</span>
        </div>
      </div>

      <div class="eg-map__bottom">
        <a
          v-if="mapSrcLink"
          :href="mapSrcLink"
          target="_blank"
          rel="noopener noreferrer"
          class="eg-map__direction"
        >
          <span>CHỈ ĐƯỜNG</span>

          <v-icon size="17">mdi-navigation-variant-outline</v-icon>
        </a>
      </div>
    </div>

    <div class="eg-map__footer-ornament">
      <span></span>
      <i>✦</i>
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
.eg-map {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 36px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #5f4f38;

  border: 1px solid rgba(181, 138, 69, 0.55);
  border-radius: 60% 60% 28px 28px / 12% 12% 28px 28px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.8), rgba(246, 236, 217, 0.6));

  box-shadow: 0 12px 35px rgba(93, 69, 42, 0.1);

  overflow: hidden;
}

/* Fine gold lattice texture */
.eg-map::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(181, 138, 69, 0.7) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(181, 138, 69, 0.7) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

/* =========================================================
   ORNAMENT
========================================================= */

.eg-map__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #b58a45;
}

.eg-map__ornament span {
  display: block;

  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 138, 69, 0.85));
}

.eg-map__ornament span:last-child {
  transform: rotate(180deg);
}

.eg-map__ornament i {
  font-size: 14px;
  font-style: normal;
}

.eg-eyebrow {
  position: relative;

  margin: 0;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.eg-map h2 {
  position: relative;

  margin: 6px 0 20px;

  font-family: "Playfair Display", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #5d452a;
}

/* =========================================================
   MAP CARD
========================================================= */

.eg-map__card {
  position: relative;

  border: 1px solid rgba(181, 138, 69, 0.6);
  border-radius: 999px 999px 21px 21px;

  background: #fdfaf2;

  overflow: hidden;

  box-shadow: 0 9px 28px rgba(93, 69, 42, 0.1);
}

.eg-map__frame {
  position: relative;

  width: 100%;
  height: 300px;

  overflow: hidden;

  background: #e8dfc9;
}

.eg-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 1px solid rgba(181, 138, 69, 0.35);

  filter: saturate(0.75) contrast(0.96);
}

.eg-map__top-decoration {
  position: absolute;

  top: 17px;
  left: 50%;

  display: flex;
  align-items: center;
  gap: 8px;

  transform: translateX(-50%);

  pointer-events: none;
}

.eg-map__line {
  width: 38px;
  height: 1px;

  background: rgba(255, 255, 255, 0.8);
}

.eg-map__pin {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #4a3620;

  border: 1px solid rgba(181, 138, 69, 0.8);
  border-radius: 50%;

  background: linear-gradient(145deg, #efe3c8, #b58a45);

  box-shadow: 0 4px 12px rgba(93, 69, 42, 0.25);
}

.eg-map__label {
  position: absolute;

  left: 50%;
  bottom: 14px;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 8px 13px;

  transform: translateX(-50%);

  color: white;

  border: 1px solid rgba(181, 138, 69, 0.6);
  border-radius: 999px;

  background: rgba(74, 54, 32, 0.85);

  backdrop-filter: blur(5px);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.16em;

  white-space: nowrap;
}

.eg-map__label i {
  font-size: 11px;
  font-style: normal;
}

/* =========================================================
   ADDRESS
========================================================= */

.eg-map__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 17px 16px 18px;

  background: linear-gradient(180deg, rgba(253, 250, 242, 0.98), rgba(246, 236, 217, 0.9));
}

.eg-map__address {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  min-width: 0;
  gap: 10px;

  text-align: left;
}

.eg-map__address-icon {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #5d452a;

  border: 1px solid rgba(181, 138, 69, 0.55);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.8);
}

.eg-map__address-content {
  min-width: 0;
}

.eg-map__address-label {
  display: block;

  margin-bottom: 2px;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.eg-map__address-content p {
  margin: 0;

  color: #5f4f38;

  font-size: 13px;

  line-height: 1.45;
}

/* =========================================================
   DIRECTION BUTTON
========================================================= */

.eg-map__direction {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 38px;

  padding: 0 13px;

  color: #4a3620;

  border: 1px solid rgba(181, 138, 69, 0.85);
  border-radius: 999px;

  background: linear-gradient(135deg, #efe3c8, #b58a45);

  box-shadow: 0 5px 13px rgba(181, 138, 69, 0.28);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.eg-map__direction:hover {
  color: #4a3620;

  transform: translateY(-2px);

  box-shadow: 0 8px 18px rgba(181, 138, 69, 0.38);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.eg-map__footer-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #b58a45;
}

.eg-map__footer-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(181, 138, 69, 0.7));
}

.eg-map__footer-ornament span:last-child {
  transform: rotate(180deg);
}

.eg-map__footer-ornament i {
  font-size: 12px;
  font-style: normal;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .eg-map {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;
  }

  .eg-map__frame {
    height: 260px;
  }

  .eg-map__bottom {
    align-items: flex-start;
    flex-direction: column;

    padding: 15px 13px 16px;
  }

  .eg-map__direction {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .eg-map__frame {
    height: 230px;
  }
}
</style>
