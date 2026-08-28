<template>
  <section v-if="timelineItems.length" class="timeline-section">
      <!-- ================= HEADER ================= -->
      <div class="section-header">
        <div class="sub-title">LỊCH TRÌNH TIỆC CƯỚI</div>

        <p>
          Chi tiết các mốc thời gian để khách mời có thể sẵn sàng tham dự và
          đồng hành cùng chúng mình.
        </p>
      </div>

      <!-- ================= CONTENT ================= -->
      <div class="timeline-layout">
        <!-- ================= TIMELINE ================= -->
        <div class="timeline-card">
          <div class="timeline-card-header">
            <h3>Tiệc cưới sẽ diễn ra vào lúc</h3>

            <div v-if="weddingEvent" class="timeline-date">
              {{ weddingEvent.EventTime }}
              ·
              {{ formatDate(weddingEvent.EventDate) }}
            </div>
          </div>

          <div class="timeline-items">
            <div
              v-for="(item, index) in timelineItems"
              :key="item.Id ?? index"
              class="timeline-item"
            >
              <!-- TIME -->
              <div class="timeline-time">
                {{ item.Time }}
              </div>

              <!-- CONTENT -->
              <div class="timeline-content">
                <div class="timeline-icon">
                  {{ item.Icon || "♡" }}
                </div>

                <div class="timeline-info">
                  <h4>
                    {{ item.Title }}
                  </h4>

                  <p v-if="item.Description">
                    {{ item.Description }}
                  </p>

                  <span v-if="item.Location" class="timeline-location">
                    {{ item.Location }}
                  </span>
                </div>
              </div>
            </div>
          </div>

        
        </div>

        <!-- ================= COUNTDOWN ================= -->
        <div v-if="showCountdown" class="countdown-card">
          <h3>Cùng đếm ngược</h3>

          <HeroCountdown v-if="countdownTarget" :target="countdownTarget" />
        </div>
      </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import HeroCountdown from "@/components/hero/HeroCountdown.vue";

const props = defineProps({
  timeline: {
    type: Array,
    default: () => [],
  },

  events: {
    type: Array,
    default: () => [],
  },

  countdown: {
    type: Object,
    default: () => ({}),
  },

  settings: {
    type: Object,
    default: () => ({}),
  },
});

/**
 * =========================================================
 * TIMELINE
 * =========================================================
 *
 * Chỉ lấy những item hợp lệ.
 */
const timelineItems = computed(() => {
  return props.timeline.filter((item) => {
    return item?.Time || item?.Title || item?.Description;
  });
});

/**
 * =========================================================
 * EVENT
 * =========================================================
 *
 * Lấy event đầu tiên để hiển thị
 * ngày + giờ cưới.
 */
const weddingEvent = computed(() => {
  return props.events?.[0] || null;
});

/**
 * =========================================================
 * COUNTDOWN
 * =========================================================
 */
const showCountdown = computed(() => {
  console.log(props.settings?.ShowCountdown)
  return (
    props.settings?.ShowCountdown ??
    props.settings?.ShowCountdown ??
    props.countdown?.Enabled ??
    props.countdown?.Enabled ??
    false
  );
});

const countdownTarget = computed(() => {
  console.log(props.countdown?.Target)
  return (
    props.countdown?.Target ||
    props.countdown?.Target ||
    weddingEvent.value?.EventDate ||
    null
  );
});

/**
 * =========================================================
 * DATE
 * =========================================================
 */
const formatDate = (date) => {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};



</script>

<style scoped>
/* =========================================================
   TIMELINE SECTION
========================================================= */

.timeline-section {
  position: relative;
  overflow: hidden;
}

/* =========================================================
   HEADER
========================================================= */

.section-header {
  position: relative;
  text-align: center;
}

.sub-title {
  color:var(--p-gold-light, #f8dfad);
  letter-spacing: 4px;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
}


.section-header p {
  max-width: 680px;
  margin: 0 auto;
  color:var(--p-gold-light, #f8dfad);
  line-height: 1.8;
}

/* =========================================================
   LAYOUT
========================================================= */

.timeline-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
  align-items: stretch;
}

/* =========================================================
   CARD
========================================================= */

.timeline-card,
.countdown-card {
  position: relative;

  padding: 36px;

  border-radius: 28px;

  background: linear-gradient(
    145deg,
    rgba(255, 250, 244, 0.96),
    rgba(248, 245, 237, 0.92)
  );

  border: 1px solid rgba(199, 157, 92, 0.3);

  box-shadow:
    0 18px 50px rgba(70, 20, 10, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.55);

  overflow: hidden;
}

/* =========================================================
   DECORATIVE CORNER
========================================================= */

.timeline-card::before,
.countdown-card::before {
  content: "";

  position: absolute;

  width: 100px;
  height: 100px;

  top: -45px;
  right: -45px;

  border-radius: 50%;

  border: 1px solid rgba(199, 157, 92, 0.35);

  box-shadow:
    0 0 0 12px rgba(199, 157, 92, 0.04),
    0 0 0 24px rgba(199, 157, 92, 0.025);

  pointer-events: none;
}

/* =========================================================
   CARD HEADER
========================================================= */

.timeline-card-header {
  position: relative;
  margin-bottom: 28px;
}

.timeline-card-header h3 {
  margin: 0 0 10px;

  color: var(--p-primary);

  font-family: var(--font-heading);
  font-variant-numeric: lining-nums;
  font-size: 25px;
  font-weight: 600;
}

.timeline-date {
  display: inline-flex;

  align-items: center;

  padding: 8px 14px;

  border-radius: 999px;

  color: var(--p-primary);

  background: rgba(199, 157, 92, 0.12);

  border: 1px solid rgba(199, 157, 92, 0.25);

  font-weight: 700;

  letter-spacing: 0.5px;
}

/* =========================================================
   TIMELINE ITEMS
========================================================= */

.timeline-items {
  position: relative;

  display: grid;

  gap: 14px;

  margin-bottom: 28px;
}

/*
 * Đường timeline
 */
.timeline-items::before {
  content: "";

  position: absolute;

  left: 69px;

  top: 18px;

  bottom: 18px;

  width: 1px;

  background: linear-gradient(
    180deg,
    transparent,
    rgba(199, 157, 92, 0.55),
    transparent
  );
}

/* =========================================================
   ITEM
========================================================= */

.timeline-item {
  position: relative;

  display: grid;

  grid-template-columns: 70px 1fr;

  gap: 18px;

  align-items: center;

  padding: 14px 16px;

  border-radius: 18px;

  transition:
    transform 0.3s ease,
    background 0.3s ease;
}

.timeline-item:hover {
  transform: translateX(4px);

  background: rgba(123, 13, 13, 0.035);
}

/* =========================================================
   TIME
========================================================= */

.timeline-time {
  position: relative;

  z-index: 2;

  color: var(--p-primary);

  font-family: var(--font-heading);
  font-variant-numeric: lining-nums;
  font-size: 21px;

  font-weight: 700;

  text-align: center;
}

/* =========================================================
   CONTENT
========================================================= */

.timeline-content {
  display: flex;

  align-items: flex-start;

  gap: 13px;
}

.timeline-icon {
  flex: 0 0 34px;

  width: 34px;
  height: 34px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  color: var(--p-primary);

  background: linear-gradient(135deg, #fffaf4, #f7e8cf);

  border: 1px solid rgba(199, 157, 92, 0.45);

  box-shadow: 0 5px 14px rgba(100, 20, 10, 0.08);

  font-size: 15px;
}

.timeline-info {
  min-width: 0;
}

.timeline-item h4 {
  margin: 0 0 5px;

  color: var(--p-primary);

  font-family: var(--font-heading);
  font-variant-numeric: lining-nums;
  font-size: 21px;

  font-weight: 600;
}

.timeline-item p {
  margin: 0;

  color: var(--p-muted);

  line-height: 1.65;

  font-size: 14px;
}

.timeline-location {
  display: inline-block;

  margin-top: 7px;

  color: var(--p-gold);

  font-size: 13px;

  font-weight: 600;
}


/* =========================================================
   COUNTDOWN
========================================================= */

.countdown-card {
  display: flex;

  flex-direction: column;

  justify-content: center;

  text-align: center;

  background: linear-gradient(
    145deg,
    rgba(123, 13, 13, 0.96),
    rgba(101, 9, 12, 0.98)
  );

  color: #fffaf4;

  border-color: rgba(199, 157, 92, 0.4);

  box-shadow: 0 20px 60px rgba(80, 5, 8, 0.25);
}

.countdown-card h3 {
  position: relative;

  margin: 0 0 24px;

  color: var(--p-gold-light);

  font-family: var(--font-heading);
  font-variant-numeric: lining-nums;
  font-size: 28px;

  font-weight: 600;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 980px) {
  .timeline-layout {
    grid-template-columns: 1fr;
  }

  .countdown-card {
    min-height: 260px;
  }
}

@media (max-width: 600px) {


  .section-header {
    margin-bottom: 35px;
  }

  .timeline-card,
  .countdown-card {
    padding: 24px 18px;

    border-radius: 24px;
  }

  .timeline-card-header h3 {
    font-size: 22px;
  }

  .timeline-item {
    grid-template-columns: 58px 1fr;

    gap: 10px;

    padding: 12px 8px;
  }

  .timeline-items::before {
    left: 57px;
  }

  .timeline-time {
    font-size: 18px;
  }

  .timeline-content {
    gap: 9px;
  }

  .timeline-icon {
    flex-basis: 30px;

    width: 30px;
    height: 30px;

    font-size: 13px;
  }

  .timeline-item h4 {
    font-size: 19px;
  }

  .timeline-item p {
    font-size: 13px;
  }
}
</style>
