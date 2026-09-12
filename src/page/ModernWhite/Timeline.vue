<template>
  <section class="wedding-timeline">

    <!-- HEADER -->
    <div class="timeline-heading">

      <span class="heading-kicker">
        NGÀY TRỌNG ĐẠI
      </span>

      <h2>
        LỊCH TRÌNH NGÀY CƯỚI
      </h2>

      <div class="heading-decoration">
        <span></span>
        <b>囍</b>
        <span></span>
      </div>

      <p>
        Những khoảnh khắc đặc biệt trong ngày vui của chúng mình
      </p>

    </div>


    <!-- TIMELINE -->
    <div
      v-if="items.length"
      class="timeline-list"
    >

      <div
        v-for="(item, index) in items"
        :key="item.Id || index"
        class="timeline-item"
      >

        <!-- TIME -->
        <div class="timeline-time">
          {{ item.Time }}
        </div>


        <!-- CENTER -->
        <div class="timeline-center">

          <span class="timeline-dot">
            <span>{{ item.Icon }}</span>
          </span>

          <span
            v-if="index < items.length - 1"
            class="timeline-line"
          ></span>

        </div>


        <!-- CONTENT -->
        <div class="timeline-content">

          <div class="timeline-title">
            {{ item.Title }}
          </div>

          <p
            v-if="item.Description"
            class="timeline-description"
          >
            {{ item.Description }}
          </p>

          <div
            v-if="item.Location"
            class="timeline-location"
          >
            <span>⌖</span>
            {{ item.Location }}
          </div>

        </div>

      </div>

    </div>


    <!-- EMPTY -->
    <div
      v-else
      class="timeline-empty"
    >
      Chưa có lịch trình.
    </div>


    <!-- BOTTOM -->
    <div
      v-if="items.length"
      class="timeline-bottom"
    >
      <span></span>
      <b>囍</b>
      <span></span>
    </div>

  </section>
</template>


<script setup>
import { computed } from "vue";

const props = defineProps({
  timeline: {
    type: Array,
    default: () => [],
  },

  events: {
    type: Array,
    default: () => [],
  },
});


/*
 * Có thể truyền:
 *
 * timeline: [...]
 *
 * hoặc dùng events nếu API hiện tại
 * đang lưu lịch trình trong events.
 */
const items = computed(() => {

  const source =
    props.timeline?.length
      ? props.timeline
      : props.events;
  
  return (source || [])
    .map((item, index) => {

      const data = item || {};

      return {
        Id: data.Id || index,

        Time:
          data.Time ||
          data.StartTime ||
          data.EventTime ||
          "",

        Title:
          data.Title ||
          data.Name ||
          data.TypeLabel ||
          "Lịch trình",

        Description:
          data.Description ||
          data.Content ||
          data.Text ||
          "",

        Location:
          data.Location ||
          data.Address ||
          data.Venue ||
          "",

        Icon:
          data.Icon ||
          getDefaultIcon(data.ype),
      };

    })
    .filter(item => {
      return (
        item.Time ||
        item.Title ||
        item.Description
      );
    });

});

function getDefaultIcon(type) {

  const icons = {
    makeup: "♡",
    preparation: "✦",
    reception: "♡",
    ceremony: "囍",
    party: "❖",
    dinner: "♢",
    photo: "✧",
  };

  return icons[type] || "♡";
}
</script>


<style scoped>

/* =====================================================
   ROOT
===================================================== */

.wedding-timeline {
  width: 100%;

  padding: 8px 4px 15px;

  color: #681317;

  text-align: center;

  font-family:
    Arial,
    "Helvetica Neue",
    sans-serif;
}


/* =====================================================
   HEADER
===================================================== */

.timeline-heading {
  margin-bottom: 34px;
}


.heading-kicker {
  display: block;

  margin-bottom: 7px;

  color: #a57a3d;

  font-size: 9px;
  font-weight: 700;

  letter-spacing: 2.5px;
}


.timeline-heading h2 {
  margin: 0;

  color: #781419;

  font-family:
    Georgia,
    "Times New Roman",
    serif;

  font-size: 23px;
  font-weight: 700;

  line-height: 1.25;

  letter-spacing: 1px;
}


.heading-decoration {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 10px;
}


.heading-decoration span {
  width: 42px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      #b68a46
    );
}


.heading-decoration span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      #b68a46
    );
}


.heading-decoration b {
  color: #99171b;

  font-family:
    "Times New Roman",
    serif;

  font-size: 18px;
}


.timeline-heading p {
  max-width: 280px;

  margin: 12px auto 0;

  color: #80684f;

  font-size: 10px;

  line-height: 1.7;
}


/* =====================================================
   TIMELINE
===================================================== */

.timeline-list {
  position: relative;

  width: 100%;

  max-width: 390px;

  margin: 0 auto;
}


/* =====================================================
   ITEM
===================================================== */

.timeline-item {
  position: relative;

  display: grid;

  grid-template-columns:
    72px
    42px
    1fr;

  min-height: 90px;

  text-align: left;
}


/* =====================================================
   TIME
===================================================== */

.timeline-time {
  padding-top: 4px;

  padding-right: 12px;

  color: #8c171b;

  font-size: 16px;

  font-weight: 700;

  line-height: 1.2;

  text-align: right;

  white-space: nowrap;
}


/* =====================================================
   CENTER
===================================================== */

.timeline-center {
  position: relative;

  display: flex;

  align-items: flex-start;
  justify-content: center;
}


.timeline-dot {
  position: relative;

  z-index: 2;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 34px;
  height: 34px;

  border:
    1px solid
    rgba(175, 131, 60, .65);

  border-radius: 50%;

  background: #fffaf0;

  box-shadow:
    0 2px 7px
    rgba(100, 30, 20, .08);
}


.timeline-dot::before {
  content: "";

  position: absolute;

  width: 25px;
  height: 25px;

  border-radius: 50%;

  background:
    linear-gradient(
      135deg,
      #a51b20,
      #7c1116
    );
}


.timeline-dot span {
  position: relative;

  z-index: 2;

  color: #fffaf0;

  font-family:
    "Times New Roman",
    serif;

  font-size: 12px;

  line-height: 1;
}


/* =====================================================
   LINE
===================================================== */

.timeline-line {
  position: absolute;

  top: 34px;

  bottom: 0;

  left: 50%;

  width: 1px;

  background:
    linear-gradient(
      to bottom,
      rgba(181, 139, 67, .65),
      rgba(181, 139, 67, .18)
    );

  transform: translateX(-50%);
}


/* =====================================================
   CONTENT
===================================================== */

.timeline-content {
  padding:
    1px
    0
    27px
    8px;
}


.timeline-title {
  color: #741317;

  font-size: 14px;

  font-weight: 700;

  line-height: 1.4;
}


.timeline-description {
  margin: 5px 0 0;

  color: #76604c;

  font-size: 10px;

  line-height: 1.7;
}


.timeline-location {
  display: flex;

  align-items: center;

  gap: 4px;

  margin-top: 7px;

  color: #947247;

  font-size: 9px;

  line-height: 1.5;
}


.timeline-location span {
  color: #a67b3e;

  font-size: 11px;
}


/* =====================================================
   EMPTY
===================================================== */

.timeline-empty {
  padding: 30px 10px;

  color: #92775b;

  font-size: 11px;
}


/* =====================================================
   BOTTOM
===================================================== */

.timeline-bottom {
  display: flex;

  align-items: center;
  justify-content: center;

  gap: 8px;

  margin-top: 5px;
}


.timeline-bottom span {
  width: 40px;
  height: 1px;

  background:
    linear-gradient(
      to right,
      transparent,
      #b68a47
    );
}


.timeline-bottom span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      #b68a47
    );
}


.timeline-bottom b {
  color: #99171b;

  font-family:
    "Times New Roman",
    serif;

  font-size: 17px;
}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 420px) {

  .wedding-timeline {
    padding-left: 2px;
    padding-right: 2px;
  }


  .timeline-heading h2 {
    font-size: 20px;
  }


  .heading-kicker {
    font-size: 8px;

    letter-spacing: 2px;
  }


  .heading-decoration span {
    width: 32px;
  }


  .timeline-item {
    grid-template-columns:
      63px
      38px
      1fr;

    min-height: 85px;
  }


  .timeline-time {
    padding-right: 9px;

    font-size: 13px;

    white-space: normal;
  }


  .timeline-dot {
    width: 31px;
    height: 31px;
  }


  .timeline-dot::before {
    width: 23px;
    height: 23px;
  }


  .timeline-content {
    padding-left: 5px;

    padding-bottom: 23px;
  }


  .timeline-title {
    font-size: 13px;
  }


  .timeline-description {
    font-size: 10px;
  }

}
</style>
