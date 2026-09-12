<template>
  <section class="map-section">

    <!-- =========================================
         HEADER
    ========================================== -->

    <div class="map-heading">

      <span class="heading-kicker">
        ĐỊA ĐIỂM TỔ CHỨC
      </span>

      <h2>
        NƠI DIỄN RA NGÀY TRỌNG ĐẠI
      </h2>

      <div class="heading-decoration">
        <span></span>

        <b>囍</b>

        <span></span>
      </div>

    </div>


    <!-- =========================================
         EVENTS
    ========================================== -->

    <div
      v-for="(event, index) in normalizedEvents"
      :key="event.Id || index"
      class="map-event"
    >

      <!-- =====================================
           CARD
      ====================================== -->

      <div class="map-card">

        <!-- CORNERS -->

        <span class="corner corner-tl"></span>
        <span class="corner corner-tr"></span>
        <span class="corner corner-bl"></span>
        <span class="corner corner-br"></span>


        <div class="map-content">

          <!-- =================================
               LOCATION ICON
          ================================== -->

          <div class="location-icon">
            <span>⌖</span>
          </div>


          <!-- =================================
               TITLE
          ================================== -->

          <div class="map-title">
            {{ event.Title }}
          </div>


          <!-- =================================
               ADDRESS
          ================================== -->

          <div
            v-if="event.address"
            class="map-address"
          >
            {{ event.address }}
          </div>


          <!-- =================================
               MAP
          ================================== -->

            <div class="map-frame">
      <iframe
        :src="event.mapUrl"
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


          <!-- =================================
               DIRECTION
          ================================== -->

          <a
            v-if="event.directionUrl"
            :href="event.directionUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="direction-button"
          >

            <span class="direction-icon">
              ↗
            </span>

            <span>
              CHỈ ĐƯỜNG
            </span>

          </a>


          <!-- =================================
               BOTTOM DECORATION
          ================================== -->

          <div class="map-bottom-decoration">

            <span></span>

            <b>囍</b>

            <span></span>

          </div>

        </div>

      </div>

    </div>


    <!-- =========================================
         EMPTY
    ========================================== -->

    <div
      v-if="!normalizedEvents.length"
      class="map-empty"
    >
      Chưa có thông tin địa điểm
    </div>

  </section>
</template>


<script setup>
import { computed } from "vue";


const props = defineProps({

  events: {
    type: Array,
    default: () => [],
  },

});


/* =====================================================
   NORMALIZE EVENTS
===================================================== */

const normalizedEvents = computed(() => {

  return (props.events || [])

    .map((event, index) => {

      const item = event || {};

      /*
       * API có thể trả:
       *
       * map: "https://maps.google.com/..."
       *
       * hoặc:
       *
       * map: {
       *   url: "...",
       *   directionUrl: "..."
       * }
       */

      const mapValue = item.Map;


      let mapUrl = "";

      let directionUrl = "";


      if (typeof mapValue === "string") {

        /*
         * Nếu API chỉ có một URL Google Maps,
         * dùng nó cho nút chỉ đường.
         *
         * Không dùng trực tiếp URL maps.google.com
         * làm iframe vì Google Maps thường yêu cầu
         * URL embed riêng.
         */

        directionUrl = mapValue;

      }


      if (
        mapValue &&
        typeof mapValue === "object"
      ) {

        mapUrl =
          mapValue.url ||
          mapValue.embedUrl ||
          mapValue.embed ||
          "";

        directionUrl =
          mapValue.directionUrl ||
          mapValue.googleMapsUrl ||
          mapValue.url ||
          "";

      }


      return {

        id:
          item.Id ||
          index,

        title:
          item.Title ||
          item.name ||
          item.Location ||
          "Địa điểm tổ chức",

        address:
          item.Address ||
          item.location ||
          item.venue ||
          "",

        mapUrl:
          item.Map ||
          item.embedUrl ||
          item.map_embed ||
          mapUrl,

        directionUrl:
          item.directionUrl ||
          item.googleMapsUrl ||
          directionUrl,

      };

    })

    .filter((event) => {

      return (
        event.address ||
        event.mapUrl ||
        event.directionUrl
      );

    });

});
</script>


<style scoped>

/* =====================================================
   ROOT
===================================================== */

.map-section {

  position: relative;

  width: 100%;

  padding:
    8px
    4px;

  color: #5f1619;

  text-align: center;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;

}


/* =====================================================
   HEADER
===================================================== */

.map-heading {

  display: flex;

  flex-direction: column;

  align-items: center;

  margin-bottom: 27px;

}


.heading-kicker {

  margin-bottom: 6px;

  color: #a47b3f;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 2.8px;

}


.map-heading h2 {

  margin: 0;

  color: #7b1519;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 21px;

  font-weight: 900;

  letter-spacing: .8px;

  line-height: 1.25;

}


.heading-decoration {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  margin-top: 10px;

}


.heading-decoration span {

  width: 38px;

  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      #b99051
    );

}


.heading-decoration span:last-child {

  background:
    linear-gradient(
      to left,
      transparent,
      #b99051
    );

}


.heading-decoration b {

  color: #991519;

  font-family:
    "Times New Roman",
    serif;

  font-size: 16px;

  line-height: 1;

}


/* =====================================================
   EVENT
===================================================== */

.map-event {

  width: 100%;

  margin-bottom: 24px;

}


/* ================================
   MAP
================================ */

.map-frame {
  position: relative;

  width: 100%;

  height: 380px;

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

  font-family: var(--font-main);
  font-size: var(--text-sm);
  font-weight: 600;
}

/* =====================================================
   MAP CARD
===================================================== */

.map-card {

  position: relative;

  width: 100%;

  overflow: hidden;

  background:
    linear-gradient(
      145deg,
      #fffdf8,
      #fbf4e7
    );

  border:
    1px solid
    rgba(174, 132, 66, .45);

  box-shadow:
    0 10px 28px
    rgba(89, 35, 20, .07);

}


/* =====================================================
   INNER BORDER
===================================================== */

.map-card::before {

  content: "";

  position: absolute;

  inset: 7px;

  z-index: 1;

  border:
    1px solid
    rgba(174, 132, 66, .2);

  pointer-events: none;

}


/* =====================================================
   CORNERS
===================================================== */

.corner {

  position: absolute;

  z-index: 5;

  width: 17px;

  height: 17px;

  pointer-events: none;

}


.corner::before,
.corner::after {

  content: "";

  position: absolute;

  background: #b28a4c;

}


.corner::before {

  width: 100%;

  height: 1px;

}


.corner::after {

  width: 1px;

  height: 100%;

}


.corner-tl {

  top: 10px;

  left: 10px;

}


.corner-tr {

  top: 10px;

  right: 10px;

  transform: rotate(90deg);

}


.corner-bl {

  bottom: 10px;

  left: 10px;

  transform: rotate(-90deg);

}


.corner-br {

  right: 10px;

  bottom: 10px;

  transform: rotate(180deg);

}


/* =====================================================
   CONTENT
===================================================== */

.map-content {

  position: relative;

  z-index: 2;

  display: flex;

  flex-direction: column;

  align-items: center;

  padding:
    25px
    17px
    22px;

}


/* =====================================================
   LOCATION ICON
===================================================== */

.location-icon {

  display: flex;

  align-items: center;

  justify-content: center;

  width: 34px;

  height: 34px;

  margin-bottom: 8px;

  color: #9c171b;

  border:
    1px solid
    rgba(167, 124, 59, .45);

  border-radius: 50%;

  background:
    rgba(255, 250, 239, .8);

  box-shadow:
    0 3px 10px
    rgba(120, 50, 20, .06);

}


.location-icon span {

  font-size: 19px;

  line-height: 1;

  transform:
    translateY(-1px);

}


/* =====================================================
   TITLE
===================================================== */

.map-title {

  max-width: 330px;

  color: #781419;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 17px;

  font-weight: 900;

  letter-spacing: .4px;

  line-height: 1.35;

}


/* =====================================================
   ADDRESS
===================================================== */

.map-address {

  max-width: 320px;

  margin:
    6px
    auto
    17px;

  color: #716052;

  font-size: 11px;

  font-weight: 500;

  line-height: 1.65;

}


/* =====================================================
   MAP FRAME
===================================================== */




/* =====================================================
   DIRECTION BUTTON
===================================================== */

.direction-button {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  min-width: 145px;

  min-height: 40px;

  margin-top: 17px;

  padding:
    9px
    19px;

  color: #fffaf1;

  background:
    linear-gradient(
      135deg,
      #9b171c,
      #761116
    );

  border:
    1px solid
    #a7282b;

  box-shadow:
    0 5px 14px
    rgba(117, 17, 22, .16);

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.7px;

  text-decoration: none;

  transition:
    transform .2s ease,
    box-shadow .2s ease,
    background .2s ease;

}


.direction-button:hover {

  background:
    linear-gradient(
      135deg,
      #a51a1f,
      #811318
    );

  box-shadow:
    0 8px 18px
    rgba(117, 17, 22, .23);

  transform:
    translateY(-2px);

}


.direction-icon {

  display: inline-flex;

  align-items: center;

  justify-content: center;

  width: 17px;

  height: 17px;

  border:
    1px solid
    rgba(255,255,255,.45);

  border-radius: 50%;

  font-size: 10px;

  line-height: 1;

}


/* =====================================================
   BOTTOM DECORATION
===================================================== */

.map-bottom-decoration {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  width: 100%;

  margin-top: 21px;

}


.map-bottom-decoration span {

  width: 35px;

  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      #b99153
    );

}


.map-bottom-decoration span:last-child {

  background:
    linear-gradient(
      to left,
      transparent,
      #b99153
    );

}


.map-bottom-decoration b {

  color: #981519;

  font-family:
    "Times New Roman",
    serif;

  font-size: 15px;

}


/* =====================================================
   EMPTY
===================================================== */

.map-empty {

  padding: 30px 15px;

  color: #927b62;

  font-size: 11px;

  line-height: 1.6;

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {

  .map-section {

    padding-left: 2px;

    padding-right: 2px;

  }


  .map-heading {

    margin-bottom: 22px;

  }


  .heading-kicker {

    font-size: 7px;

    letter-spacing: 2.2px;

  }


  .map-heading h2 {

    font-size: 18px;

  }


  .heading-decoration {

    margin-top: 8px;

  }


  .map-content {

    padding:
      23px
      14px
      20px;

  }


  .map-title {

    font-size: 16px;

  }


  .map-address {

    font-size: 10px;

    margin-bottom: 15px;

  }



  .direction-button {

    min-width: 135px;

    min-height: 39px;

    font-size: 8px;

    letter-spacing: 1.5px;

  }


  .map-frame {

    height: 280px;

  }

}
</style>
