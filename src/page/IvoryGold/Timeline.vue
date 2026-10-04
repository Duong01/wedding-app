<template>
  <section class="wedding-timeline">

    <!-- HEADER -->
    <div class="timeline-heading">

      <span class="heading-kicker">
        {{ sectionText(sections, "timeline", "Eyebrow", "NGÀY TRỌNG ĐẠI") }}
      </span>

      <h2>
        {{ sectionText(sections, "timeline", "Heading", "LỊCH TRÌNH NGÀY CƯỚI") }}
      </h2>
      <!-- Tiêu đề mục: mẫu gốc không có — chỉ hiện khi người dùng nhập ở panel "Tiêu đề mục" -->
      <header v-if="sectionOverride(sections, 'timeline', 'Intro')" class="ig-sub-custom-head">
        <p v-if="sectionOverride(sections, 'timeline', 'Intro')" class="ig-sub-custom-head__intro">{{ sectionOverride(sections, "timeline", "Intro") }}</p>
      </header>


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
import { sectionOverride, sectionText } from "@/data/sectionTitles";
import { computed } from "vue";

const props = defineProps({
  sections: { type: Object, default: () => ({}) },
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

  color: var(--tc-681317, #681317);

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

  color: var(--tc-8c6834, #8c6834);

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 2.5px;
}


.timeline-heading h2 {
  margin: 0;

  color: var(--tc-781419, #781419);

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
      var(--tc-b68a46, #b68a46)
    );
}


.heading-decoration span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      var(--tc-b68a46, #b68a46)
    );
}


.heading-decoration b {
  color: var(--tc-99171b, #99171b);

  font-family:
    "Times New Roman",
    serif;

  font-size: 18px;
}


.timeline-heading p {
  max-width: 280px;

  margin: 12px auto 0;

  color: var(--tc-80684f, #80684f);

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

  color: var(--tc-8c171b, #8c171b);

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
    rgba(var(--tc-af833c-rgb, 175, 131, 60), .65);

  border-radius: 50%;

  background: var(--tc-fffaf0, #fffaf0);

  box-shadow:
    0 2px 7px
    rgba(var(--tc-641e14-rgb, 100, 30, 20), .08);
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
      var(--tc-a51b20, #a51b20),
      var(--tc-7c1116, #7c1116)
    );
}


.timeline-dot span {
  position: relative;

  z-index: 2;

  color: var(--tc-fffaf0, #fffaf0);

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
      rgba(var(--tc-b58b43-rgb, 181, 139, 67), .65),
      rgba(var(--tc-b58b43-rgb, 181, 139, 67), .18)
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
  color: var(--tc-741317, #741317);

  font-size: 14px;

  font-weight: 700;

  line-height: 1.4;
}


.timeline-description {
  margin: 5px 0 0;

  color: var(--tc-76604c, #76604c);

  font-size: 10px;

  line-height: 1.7;
}


.timeline-location {
  display: flex;

  align-items: center;

  gap: 4px;

  margin-top: 7px;

  color: var(--tc-8d6c43, #8d6c43);

  font-size: 11px;

  line-height: 1.5;
}


.timeline-location span {
  color: var(--tc-8d6935, #8d6935);

  font-size: 11px;
}


/* =====================================================
   EMPTY
===================================================== */

.timeline-empty {
  padding: 30px 10px;

  color: var(--tc-836b52, #836b52);

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
      var(--tc-b68a47, #b68a47)
    );
}


.timeline-bottom span:last-child {
  background:
    linear-gradient(
      to left,
      transparent,
      var(--tc-b68a47, #b68a47)
    );
}


.timeline-bottom b {
  color: var(--tc-99171b, #99171b);

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
    font-size: 10px;

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

    font-size: 14px;
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

/* Tiêu đề mục do người dùng nhập (mẫu gốc không có) */
.ig-sub-custom-head {
  margin: 0 0 28px;
  text-align: center;
}

.ig-sub-custom-head__eyebrow {
  margin: 0 0 6px;
  color: inherit;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-indent: 0.3em;
}

.ig-sub-custom-head__heading {
  margin: 0;
  color: inherit;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(26px, 7vw, 34px);
  font-weight: 600;
  line-height: 1.15;
}

.ig-sub-custom-head__intro {
  margin: 10px auto 0;
  max-width: 440px;
  color: inherit;
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
}
</style>
