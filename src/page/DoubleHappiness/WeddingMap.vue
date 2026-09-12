<template>
  <section class="dh-map">
    <div class="dh-map__ornament">
      <span></span>
      <i>囍</i>
      <span></span>
    </div>

    <p class="dh-eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</p>

    <h2>Bản đồ địa điểm</h2>

    <div class="dh-map__card">
      <div class="dh-map__address">
        <div class="dh-map__address-icon">
          <v-icon size="22">mdi-map-marker-radius-outline</v-icon>
        </div>

        <div class="dh-map__address-content">
          <span class="dh-map__address-label">ĐỊA CHỈ</span>

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

      <div class="dh-map__frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <div class="dh-map__top-decoration">
          <span class="dh-map__line"></span>

          <div class="dh-map__pin">
            <v-icon size="19">mdi-map-marker</v-icon>
          </div>

          <span class="dh-map__line"></span>
        </div>

        <div class="dh-map__label">
          <v-icon size="15">mdi-map-marker-heart</v-icon>

          <span>HẸN GẶP BẠN TẠI ĐÂY</span>
        </div>
      </div>

      <div class="dh-map__bottom">
        <a
          v-if="mapSrcLink"
          :href="mapSrcLink"
          target="_blank"
          rel="noopener noreferrer"
          class="dh-map__direction"
        >
          <span>CHỈ ĐƯỜNG</span>

          <v-icon size="17">mdi-navigation-variant-outline</v-icon>
        </a>
      </div>
    </div>

    <div class="dh-map__footer-ornament">
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
.dh-map {
  --dh-red: #7a1216;
  --dh-red-bright: #a32a2a;
  --dh-gold: #d9a441;
  --dh-gold-light: #f3d9a4;
  --dh-cream: #fdf6ec;
  --dh-ink: #5a3d2e;

  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 36px;
  padding: 38px 18px 32px;

  text-align: center;

  color: var(--dh-ink);

  border: 1px solid rgba(217, 164, 65, 0.55);
  border-radius: 14px;

  background: linear-gradient(170deg, rgba(253, 246, 236, 0.8), rgba(243, 217, 164, 0.45));

  box-shadow: 0 12px 35px rgba(60, 10, 12, 0.11);

  overflow: hidden;
}

/* Inner gold line — double border frame */
.dh-map::before {
  content: "";
  position: absolute;
  inset: 8px;

  border: 1px solid rgba(217, 164, 65, 0.3);
  border-radius: 9px;

  pointer-events: none;
}

/* =========================================================
   ORNAMENT
========================================================= */

.dh-map__ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  margin-bottom: 12px;

  color: var(--dh-gold);
}

.dh-map__ornament span {
  display: block;

  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.75));
}

.dh-map__ornament span:last-child {
  transform: rotate(180deg);
}

.dh-map__ornament i {
  font-size: 14px;
  font-style: normal;
}

.dh-eyebrow {
  position: relative;

  margin: 0;

  color: var(--dh-red-bright);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.dh-map h2 {
  position: relative;

  margin: 6px 0 20px;

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: clamp(27px, 7vw, 34px);
  font-weight: 600;

  color: var(--dh-red);
}

/* =========================================================
   MAP CARD
========================================================= */

.dh-map__card {
  position: relative;

  border: 1px solid rgba(217, 164, 65, 0.5);
  border-radius: 12px;

  background: var(--dh-cream);

  overflow: hidden;

  box-shadow: 0 9px 28px rgba(60, 10, 12, 0.12);
}

.dh-map__frame {
  position: relative;

  width: 100%;
  height: 300px;

  overflow: hidden;

  background: #e8d9c4;
}

.dh-map__frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 1px solid #e0cdb0;

  filter: saturate(0.78) sepia(0.12) contrast(0.95);
}

.dh-map__top-decoration {
  position: absolute;

  top: 17px;
  left: 50%;

  display: flex;
  align-items: center;
  gap: 8px;

  transform: translateX(-50%);

  pointer-events: none;
}

.dh-map__line {
  width: 38px;
  height: 1px;

  background: rgba(255, 255, 255, 0.8);
}

.dh-map__pin {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--dh-gold-light);

  border: 1px solid rgba(243, 217, 164, 0.65);
  border-radius: 50%;

  background: rgba(122, 18, 22, 0.88);

  box-shadow: 0 4px 12px rgba(40, 6, 8, 0.3);
}

.dh-map__label {
  position: absolute;

  left: 50%;
  bottom: 14px;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 8px 13px;

  transform: translateX(-50%);

  color: var(--dh-gold-light);

  border: 1px solid rgba(243, 217, 164, 0.45);
  border-radius: 999px;

  background: rgba(92, 14, 16, 0.82);

  backdrop-filter: blur(5px);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.16em;

  white-space: nowrap;
}

/* =========================================================
   ADDRESS
========================================================= */

.dh-map__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;

  padding: 17px 16px 18px;

  background: linear-gradient(180deg, rgba(253, 246, 236, 0.98), rgba(247, 230, 196, 0.85));
}

.dh-map__address {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  min-width: 0;
  gap: 10px;

  text-align: left;
}

.dh-map__address-icon {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--dh-red);

  border: 1px solid rgba(217, 164, 65, 0.45);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.75);
}

.dh-map__address-content {
  min-width: 0;
}

.dh-map__address-label {
  display: block;

  margin-bottom: 2px;

  color: var(--dh-red-bright);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.dh-map__address-content p {
  margin: 0;

  color: var(--dh-red);

  font-size: 13px;

  line-height: 1.45;
}

/* =========================================================
   DIRECTION BUTTON
========================================================= */

.dh-map__direction {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  min-height: 38px;

  padding: 0 13px;

  color: var(--dh-red-dark);

  border: 1px solid rgba(243, 217, 164, 0.7);
  border-radius: 999px;

  background: linear-gradient(135deg, var(--dh-gold-light), var(--dh-gold) 60%, #c08f34);

  box-shadow: 0 5px 13px rgba(60, 10, 12, 0.22);

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.1em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.dh-map__direction:hover {
  color: var(--dh-red-dark);

  transform: translateY(-2px);

  box-shadow: 0 8px 18px rgba(60, 10, 12, 0.3);
}

/* =========================================================
   BOTTOM ORNAMENT
========================================================= */

.dh-map__footer-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  margin-top: 24px;

  color: var(--dh-gold);
}

.dh-map__footer-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(217, 164, 65, 0.6));
}

.dh-map__footer-ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 620px) {
  .dh-map {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 12px;
  }

  .dh-map::before {
    inset: 6px;
    border-radius: 8px;
  }

  .dh-map__frame {
    height: 260px;
  }

  .dh-map__bottom {
    align-items: flex-start;
    flex-direction: column;

    padding: 15px 13px 16px;
  }

  .dh-map__direction {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .dh-map__frame {
    height: 230px;
  }
}
</style>
