<template>
  <section class="wedding-map">
    <!-- Decorative top -->
    <div class="map-ornament">
      <span></span>
      <v-icon size="15">mdi-flower-outline</v-icon>
      <span></span>
    </div>

    <div class="eyebrow">ĐƯỜNG ĐẾN NGÀY VUI</div>

    <h2>Bản đồ địa điểm</h2>


    <!-- MAP -->
    <div class="map-card">
      <div class="address">
          <div class="address-icon">
            <v-icon size="22"> mdi-map-marker-radius-outline </v-icon>
          </div>

          <div class="address-content">
            <span class="address-label"> ĐỊA CHỈ </span>

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

      <div class="map-frame">
        <iframe
          v-if="mapSrc"
          :src="mapSrc"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>

        <!-- Map decoration -->
        <div class="map-top-decoration">
          <span class="map-line"></span>

          <div class="map-pin">
            <v-icon size="19"> mdi-map-marker </v-icon>
          </div>

          <span class="map-line"></span>
        </div>

        <div class="map-label">
          <v-icon size="15"> mdi-map-marker-heart </v-icon>

          <span> HẸN GẶP BẠN TẠI ĐÂY </span>
        </div>
      </div>

      <!-- Address -->
      <div class="location-bottom">
        

        <a
          v-if="mapSrcLink"
          :href="mapSrcLink"
          target="_blank"
          rel="noopener noreferrer"
          class="direction-button"
        >
          <span>CHỈ ĐƯỜNG</span>

          <v-icon size="17"> mdi-navigation-variant-outline </v-icon>
        </a>
      </div>
    </div>

    <!-- Bottom decoration -->
    <div class="map-bottom-ornament">
      <span></span>
      <v-icon size="13">mdi-heart</v-icon>
      <span></span>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import dayjs from "dayjs";

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

const firstEvent = computed(() => {
  return props.events?.[0] || {};
});

/*
 * Link Google Maps:
 * - Ưu tiên Map / MapUrl có sẵn trong data.
 * - Nếu không có thì tự tạo link tìm kiếm bằng địa chỉ.
 */
const mapSrcLink = computed(() => {
  const event = firstEvent.value;

  if (event.Map || event.MapUrl) {
    return event.Map || event.MapUrl;
  }

  const address = event.Address || event.Location || event.Place || "";

  if (!address) return "";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;
});

/*
 * Google Maps iframe.
 *
 * Dùng query để iframe vẫn hoạt động ngay cả khi
 * dữ liệu chỉ có Address mà chưa có MapUrl.
 */
const mapSrc = computed(() => {
  const event = firstEvent.value;

  /*
   * Nếu MapEmbed có sẵn thì dùng trực tiếp.
   */
  if (event.MapEmbed) {
    return event.MapEmbed;
  }

  const address = event.Address || event.Location || event.Place || "";

  if (!address) return "";

  return `https://www.google.com/maps?q=${encodeURIComponent(
    address
  )}&output=embed`;
});

function formatDate(dateString) {
  const date = dayjs(dateString);

  return date.isValid() ? date.format("DD/MM/YYYY") : dateString;
}
</script>

<style scoped>
/* =========================================================
   MAP SECTION
   ========================================================= */

.wedding-map {
  position: relative;

  width: min(590px, calc(100% - 24px));

  margin: 24px auto 36px;
  padding: 38px 18px 32px;

  text-align: center;

  color: #805363;
  border-radius: 28px;
  box-shadow: 0 12px 35px rgba(137, 67, 84, 0.09),
    inset 0 0 0 1px rgba(255, 255, 255, 0.65);

  overflow: hidden;
}

/* Inner frame */
.wedding-map::before {
  content: "";

  position: absolute;
  inset: 8px;

  border: 1px solid rgba(198, 160, 106, 0.25);
  border-radius: 22px;

  pointer-events: none;
}

/* =========================================================
   ORNAMENT
   ========================================================= */

.map-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  margin-bottom: 12px;

  color: #c6a06a;
}

.map-ornament span {
  display: block;

  width: 45px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(198, 160, 106, 0.7));
}

.map-ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MAP CARD
   ========================================================= */

.map-card {
  position: relative;

  border: 1px solid rgba(198, 160, 106, 0.38);
  border-radius: 21px;

  background: #fffaf9;

  overflow: hidden;

  box-shadow: 0 9px 28px rgba(127, 61, 78, 0.1);
}

/* =========================================================
   MAP FRAME
   ========================================================= */

.map-frame {
  position: relative;

  width: 100%;
  height: 300px;

  overflow: hidden;

  background: #eadfe0;
}

.map-frame iframe {
  display: block;

  width: 100%;
  height: 100%;

  border: 0;

  filter: saturate(0.72) sepia(0.08) contrast(0.94);
}

/* Top decorative line */
.map-top-decoration {
  position: absolute;

  top: 17px;
  left: 50%;

  display: flex;
  align-items: center;

  gap: 8px;

  transform: translateX(-50%);

  pointer-events: none;
}

.map-line {
  width: 38px;
  height: 1px;

  background: rgba(255, 255, 255, 0.8);
}

.map-pin {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: white;

  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 50%;

  background: rgba(158, 74, 96, 0.86);

  box-shadow: 0 4px 12px rgba(80, 35, 48, 0.22);
}

/* Bottom label */
.map-label {
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

  background: rgba(120, 54, 72, 0.78);

  backdrop-filter: blur(5px);

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.15em;

  white-space: nowrap;
}

/* =========================================================
   ADDRESS
   ========================================================= */

.location-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 14px;

  padding: 17px 16px 18px;

  background: linear-gradient(
    180deg,
    rgba(255, 250, 249, 0.98),
    rgba(252, 239, 242, 0.85)
  );
}

.address {
  display: flex;
  align-items: flex-start;
  padding: 10px;
  min-width: 0;

  gap: 10px;

  text-align: left;
}

.address-icon {
  flex: 0 0 38px;

  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ae6075;

  border: 1px solid rgba(198, 160, 106, 0.32);
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.7);
}

.address-content {
  min-width: 0;
}

.address-label {
  display: block;

  margin-bottom: 2px;

  color: #b17486;

  font-size: 8px;
  font-weight: 700;

  letter-spacing: 0.2em;
}

.address-content p {
  margin: 0;

  color: #70495a;

  font-size: 13px;
  line-height: 1.45;
}

/* =========================================================
   DIRECTION BUTTON
   ========================================================= */

.direction-button {
  flex: 0 0 auto;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  min-height: 38px;

  padding: 0 13px;

  color: white;

  border: 1px solid #a9576e;
  border-radius: 999px;

  background: linear-gradient(135deg, #b9647c, #9d4c64);

  box-shadow: 0 5px 13px rgba(157, 76, 100, 0.18);

  font-family: "Cormorant Garamond", Georgia, serif;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.08em;

  text-decoration: none;

  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.direction-button:hover {
  color: white;

  transform: translateY(-2px);

  box-shadow: 0 8px 18px rgba(157, 76, 100, 0.25);
}

/* =========================================================
   BOTTOM ORNAMENT
   ========================================================= */

.map-bottom-ornament {
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 24px;

  color: #c6a06a;
}

.map-bottom-ornament span {
  width: 48px;
  height: 1px;

  background: linear-gradient(90deg, transparent, rgba(198, 160, 106, 0.55));
}

.map-bottom-ornament span:last-child {
  transform: rotate(180deg);
}

/* =========================================================
   MOBILE
   ========================================================= */

@media (max-width: 620px) {
  .wedding-map {
    width: calc(100% - 16px);

    margin: 18px auto 28px;

    padding: 32px 12px 26px;

    border-radius: 23px;
  }

  .wedding-map::before {
    inset: 6px;
    border-radius: 18px;
  }

  .event-card {
    padding: 14px 12px;
  }

  .event-number {
    flex-basis: 32px;

    width: 32px;
    height: 32px;
  }

  .event-card h3 {
    font-size: 18px;
  }

  .info-row {
    font-size: 12px;
  }

  .map-frame {
    height: 260px;
  }

  .location-bottom {
    align-items: flex-start;
    flex-direction: column;

    padding: 15px 13px 16px;
  }

  .direction-button {
    width: 100%;
  }
}

@media (max-width: 380px) {
  .map-frame {
    height: 230px;
  }

  .event-meta {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
