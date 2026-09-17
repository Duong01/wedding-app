<template>
  <section class="el-map">
    <div class="el-map__ornament">
      <span></span>
      <i>❦</i>
      <span></span>
    </div>

    <p class="el-eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</p>

    <h2>Bản đồ địa điểm</h2>

    <div class="el-map__card">
      <div class="el-map__address">
        <div class="el-map__address-icon">
          <v-icon size="22">mdi-map-marker-radius-outline</v-icon>
        </div>

        <div class="el-map__address-content">
          <span class="el-map__address-label">ĐỊA CHỈ</span>

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

      <div class="el-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div class="el-map__top-decoration">
          <span class="el-map__line"></span>

          <div class="el-map__pin">
            <v-icon size="19">mdi-map-marker</v-icon>
          </div>

          <span class="el-map__line"></span>
        </div>

        <div class="el-map__label">
          <i>✦</i>

          <span>HẸN GẶP BẠN TẠI ĐÂY</span>
        </div>
      </div>

      <div class="el-map__bottom">
        <a
          v-if="mapSrcLink"
          :href="mapSrcLink"
          target="_blank"
          rel="noopener noreferrer"
          class="el-map__direction"
        >
          <span>CHỈ ĐƯỜNG</span>

          <v-icon size="17">mdi-navigation-variant-outline</v-icon>
        </a>
      </div>
    </div>

    <div class="el-map__footer-ornament">
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
.el-map {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 36px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #2e3d36;

  border: 1px solid rgba(201, 164, 92, 0.55);
  border-radius: 60% 60% 28px 28px / 12% 12% 28px 28px;

  background: linear-gradient(172deg, rgba(255, 255, 255, 0.8), rgba(240, 234, 216, 0.6));

  box-shadow: 0 12px 35px rgba(12, 43, 33, 0.1);

  overflow: hidden;
}

/* Fine gold lattice texture */
.el-map::before {
  content: "";
  position: absolute;
  inset: 0;

  opacity: 0.05;

  background-image:
    repeating-linear-gradient(45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 18px),
    repeating-linear-gradient(-45deg, rgba(201, 164, 92, 0.7) 0 1px, transparent 1px 18px);

  pointer-events: none;
}

/* =========================================================
   ORNAMENT
========================================================= */

.el-map__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: #c9a45c;
}

.el-map__ornament span {
  display: block;

  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.85));
}

.el-map__ornament span:last-child {
  transform: rotate(180deg);
}

.el-map__ornament i {
  font-size: 14px;
  font-style: normal;
}

.el-eyebrow {
  position: relative;

  margin: 0;

  color: #8a7a52;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.el-map h2 {
  position: relative;

  margin: 6px 0 20px;

  font-family: "Playfair Display", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: #123b2e;
}

/* =========================================================
   MAP CARD
========================================================= */

.el-map__card {
  position: relative;

  border: 1px solid rgba(201, 164, 92, 0.6);
  border-radius: 999px 999px 21px 21px;

  background: #fdfaf2;

  overflow: hidden;

  box-shadow: 0 9px 28px rgba(12, 43, 33, 0.1);
}

.el-map__frame {
  position: relative;

  width: 100%;
  height: 300px;

  overflow: hidden;

  background: #dfe4d8;
}

.el-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 1px solid rgba(201, 164, 92, 0.35);

  filter: saturate(0.75) contrast(0.96);
}

.el-map__top-decoration {
  position: absolute;

  top: 17px;
  left: 50%;

  display: flex;
  align-items: center;
  gap: 8px;

  transform: translateX(-50%);

  pointer-events: none;
}

.el-map__line {
  width: 38px;
  height: 1px;

  background: rgba(255, 255, 255, 0.8);
}

.el-map__pin {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #10281f;

  border: 1px solid rgba(201, 164, 92, 0.8);
  border-radius: 50%;

  background: linear-gradient(145deg, #e8d3a2, #c9a45c);

  box-shadow: 0 4px 12px rgba(12, 43, 33, 0.25);
}

.el-map__label {
  position: absolute;

  left: 50%;
  bottom: 14px;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 8px 13px;

  transform: translateX(-50%);

  color: white;

  border: 1px solid rgba(201, 164, 92, 0.6);
  border-radius: 999px;

  background: rgba(12, 43, 33, 0.85);

  backdrop-filter: blur(5px);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.16em;

  white-space: nowrap;
}

.el-map__label i {
  font-size: 11px;
  font-style: normal;
}

/* =========================================================
   ADDRESS
========================================================= */

.el-map__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 17px 16px 18px;

  background: linear-gradient(180deg, rgba(253, 250, 242, 0.98), rgba(240, 234, 216, 0.9));
}

.el-map__address {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  min-width: 0;
  gap: 10px;

  text-align: left;
}

.el-map__address-icon {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #123b2e;

  border: 1px solid rgba(201, 164, 92, 0.55);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.8);
}

.el-map__address-content {
  min-width: 0;
}

.el-map__address-label {
  display: block;

  margin-bottom: 2px;

  color: #8a7a52;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.el-map__address-content p {
  margin: 0;

  color: #2e3d36;

  font-size: 13px;

  line-height: 1.45;
}

/* =========================================================
   DIRECTION BUTTON
========================================================= */

.el-map__direction {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 38px;

  padding: 0 13px;

  color: #10281f;

  border: 1px solid rgba(201, 164, 92, 0.85);
  border-radius: 999px;

  background: linear-gradient(135deg, #e8d3a2, #c9a45c);

  box-shadow: 0 5px 13px rgba(201, 164, 92, 0.28);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.el-map__direction:hover {
  color: #10281f;

  transform: translateY(-2px);

  box-shadow: 0 8px 18px rgba(201, 164, 92, 0.38);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.el-map__footer-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: #c9a45c;
}

.el-map__footer-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(201, 164, 92, 0.7));
}

.el-map__footer-ornament span:last-child {
  transform: rotate(180deg);
}

.el-map__footer-ornament i {
  font-size: 12px;
  font-style: normal;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .el-map {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;
  }

  .el-map__frame {
    height: 260px;
  }

  .el-map__bottom {
    align-items: flex-start;
    flex-direction: column;

    padding: 15px 13px 16px;
  }

  .el-map__direction {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .el-map__frame {
    height: 230px;
  }
}
</style>
