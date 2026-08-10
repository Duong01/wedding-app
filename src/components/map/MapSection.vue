<template>
  <v-container class="location-section">
  <div class="location-card">

    <!-- Header -->
    <div class="location-header">
      

      <div class="location-heading">
        <div class="location-eyebrow">
          TIỆC CƯỚI SẼ TỔ CHỨC TẠI
        </div>

        <p>
          {{ firstEvent?.address }}
        </p>
      </div>
    </div>

    <!-- Map -->
    <div class="map-frame">
      <iframe
        :src="mapSrc"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allowfullscreen
      ></iframe>

      <div class="map-overlay">
        <div class="map-badge">
          <v-icon size="18">
            mdi-map-marker
          </v-icon>

          <span>
            Địa điểm tổ chức
          </span>
        </div>
      </div>
    </div>

    <!-- Address -->
    <div class="location-bottom">

      <div class="address-box">
        <div class="address-icon">
          <v-icon size="22">
            mdi-map-marker-radius
          </v-icon>
        </div>

        <div class="address-content">
          <span class="address-label">
            Địa chỉ
          </span>

          <p>
            {{ firstEvent?.address || "Địa chỉ tổ chức tiệc cưới" }}
          </p>
        </div>
      </div>

      <v-btn
        :href="mapSrcLink"
        target="_blank"
        rel="noopener"
        class="map-button"
        rounded="pill"
        elevation="0"
      >
        <v-icon start>
          mdi-navigation-variant-outline
        </v-icon>

        Chỉ đường
      </v-btn>

    </div>

  </div>
</v-container>
</template>

<script setup>
import { computed } from "vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();

const wedding = computed(() => store.wedding);
const firstEvent = computed(() => store.wedding.events?.[0] ?? {});
console.log(firstEvent.value);
const mapSrcLink = computed(() => {
  const query = wedding.value.events?.[0];
  return `${query.map}`;
});
const mapSrc = computed(() => {
  const query = wedding.value.events?.[0];
  return `${query.map}&output=embed`;
});
</script>

<style scoped>
/* ================================
   LOCATION
================================ */

.location-section {
  padding-top: 60px;
  padding-bottom: 70px;
}

/* Card */

.location-card {
  position: relative;

  max-width: 1100px;
  margin: 0 auto;

  padding: 14px;

  border-radius: 32px;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.96),
      rgba(255, 248, 246, 0.92)
    );

  border: 1px solid rgba(190, 145, 130, 0.16);

  box-shadow:
    0 30px 80px rgba(91, 48, 53, 0.12),
    0 8px 25px rgba(91, 48, 53, 0.06);

  overflow: hidden;

  backdrop-filter: blur(16px);
}


/* ================================
   HEADER
================================ */


.location-icon {
  flex: 0 0 58px;

  width: 58px;
  height: 58px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 18px;

  color: #b85c72;

  background:
    linear-gradient(
      135deg,
      #fff0f3,
      #fbe0e6
    );

  box-shadow:
    0 8px 20px rgba(184, 92, 114, 0.12);
}

.location-heading {
  min-width: 0;
}

.location-eyebrow {
  display: block;
  text-align: center;
  margin-bottom: 4px;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.22em;

  color: #b88968;
}

.location-heading h2 {
  margin: 0;
  font-size: clamp(24px, 3vw, 34px);
text-align: center;
  font-weight: 500;

  line-height: 1.2;

  color: #542f35;
}

.location-heading p {
  margin: 7px 0 0;
  text-align: center;
  font-size: 14px;

  line-height: 1.6;

  color: #8b6f73;
}


/* ================================
   MAP
================================ */

.map-frame {
  position: relative;

  width: 100%;

  height: 480px;

  overflow: hidden;

  border-radius: 24px;

  background: #eee;
}

.map-frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 0;
}


/* Map overlay */

.map-overlay {
  position: absolute;

  top: 18px;
  left: 18px;

  pointer-events: none;
}

.map-badge {
  display: inline-flex;

  align-items: center;
  gap: 8px;

  padding: 9px 14px;

  border-radius: 999px;

  color: #5c3a40;

  background: rgba(255, 255, 255, 0.92);

  border: 1px solid rgba(255, 255, 255, 0.8);

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.12);

  backdrop-filter: blur(12px);

  font-size: 13px;
  font-weight: 600;
}


/* ================================
   BOTTOM
================================ */

.location-bottom {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding: 22px 14px 10px;
}

.address-box {
  display: flex;

  align-items: center;

  gap: 14px;

  min-width: 0;
}

.address-icon {
  flex: 0 0 48px;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 15px;

  color: #b85c72;

  background: #fff0f3;
}

.address-content {
  min-width: 0;
}

.address-label {
  display: block;

  margin-bottom: 3px;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.14em;

  text-transform: uppercase;

  color: #b88968;
}

.address-content p {
  margin: 0;

  color: #5d474b;

  font-size: 14px;

  line-height: 1.5;
}


/* ================================
   BUTTON
================================ */

.map-button {
  flex: 0 0 auto;

  min-height: 48px !important;

  padding: 0 22px !important;

  color: white !important;

  font-size: 14px !important;

  font-weight: 600 !important;

  background:
    linear-gradient(
      135deg,
      #d8758d,
      #b95770
    ) !important;

  box-shadow:
    0 10px 24px rgba(185, 87, 112, 0.25) !important;

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease !important;
}

.map-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 14px 30px rgba(185, 87, 112, 0.34) !important;
}


/* ================================
   TABLET
================================ */

@media (max-width: 768px) {

  .location-section {
    padding-top: 40px;
    padding-bottom: 50px;
  }

  .location-card {
    padding: 10px;

    border-radius: 26px;
  }

  .location-header {
    padding: 22px 18px 20px;
  }

  .map-frame {
    height: 400px;

    border-radius: 20px;
  }

  .location-bottom {
    padding: 18px 8px 8px;
  }
}


/* ================================
   MOBILE
================================ */

@media (max-width: 600px) {

  .location-section {
    padding: 30px 12px 45px;
  }

  .location-card {
    padding: 8px;

    border-radius: 22px;
  }

  .location-icon {
    flex-basis: 46px;

    width: 46px;
    height: 46px;

    border-radius: 14px;
  }

  .location-heading h2 {
    font-size: 25px;
  }

  .location-heading p {
    margin-top: 5px;
    text-align: center;
    font-size: 12px;

    line-height: 1.5;
  }

  .map-frame {
    height: 300px;

    border-radius: 17px;
  }

  .map-overlay {
    top: 12px;
    left: 12px;
  }

  .map-badge {
    padding: 7px 11px;

    font-size: 11px;
  }

  .location-bottom {
    flex-direction: column;

    align-items: stretch;

    gap: 14px;

    padding: 16px 8px 8px;
  }

  .address-box {
    align-items: flex-start;
  }

  .address-icon {
    flex-basis: 42px;

    width: 42px;
    height: 42px;
  }

  .address-content p {
    font-size: 13px;
  }

  .map-button {
    width: 100%;

    min-height: 50px !important;
  }
}


/* ================================
   SMALL PHONE
================================ */

@media (max-width: 380px) {

  .location-section {
    padding-left: 8px;
    padding-right: 8px;
  }

  .location-header {
    padding-left: 8px;
    padding-right: 8px;
  }

  .location-heading h2 {
    font-size: 22px;
  }

  .map-frame {
    height: 270px;
  }
}
</style>
