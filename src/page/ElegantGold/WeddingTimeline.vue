<template>
  <section class="eg-timeline">

    <div class="timeline-inner">

      <!-- HEADER -->

      <header class="timeline-header">

        <div class="timeline-label">
          OUR JOURNEY
        </div>

        <div class="timeline-script">
          Hành trình yêu thương
        </div>

        <h2>
          Những dấu mốc
          <br />
          <em>của chúng mình</em>
        </h2>

        <div class="timeline-symbol">
          ◆
        </div>

      </header>

      <!-- TIMELINE -->

      <div class="timeline-list">

        <article
          v-for="(item, index) in timeline"
          :key="item.Id || index"
          class="timeline-item"
          :class="{
            'is-last':
              index === timeline.length - 1
          }"
        >

          <!-- DATE -->

          <div class="timeline-date">
            {{ item.date || item.year }}
          </div>

          <!-- LINE / DOT -->

          <div class="timeline-marker">

            <div class="marker-ring">
              <span>✦</span>
            </div>

          </div>

          <!-- CONTENT -->

          <div class="timeline-content">

            <div class="timeline-number">
              {{ String(index + 1).padStart(2, "0") }}
            </div>

            <h3>
              {{ item.Title }}
            </h3>

            <p
              v-if="item.description"
            >
              {{ item.description }}
            </p>

          </div>

        </article>

      </div>

    </div>
  </section>
</template>

<script setup>
defineProps({
  timeline: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.eg-timeline {
  position: relative;

  padding:
    100px 35px;

  background:
    #fffdf8;

  overflow: hidden;
}

.eg-timeline::before {
  content: "";

  position: absolute;

  inset: 20px;

  border:
    1px solid
    rgba(180,142,40,0.1);

  pointer-events: none;
}

.timeline-inner {
  position: relative;

  width: min(
    100%,
    700px
  );

  margin: auto;
}

/* HEADER */

.timeline-header {
  text-align: center;

  margin-bottom: 75px;
}

.timeline-label {
  color: #a98a47;

  font-family: Arial, sans-serif;

  font-size: 9px;

  letter-spacing: 4px;
}

.timeline-script {
  margin-top: 20px;

  color: #c39c42;

  font-family:
    "Allura",
    cursive;

  font-size: 35px;
}

.timeline-header h2 {
  margin:
    5px 0 18px;

  color: #2e281f;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size:
    clamp(35px, 6vw, 49px);

  font-weight: 400;

  line-height: 0.95;
}

.timeline-header h2 em {
  color: #8e7a59;

  font-style: italic;
}

.timeline-symbol {
  color: #d4af37;

  font-size: 7px;
}

/* TIMELINE */

.timeline-list {
  position: relative;
}

.timeline-list::before {
  content: "";

  position: absolute;

  top: 10px;
  bottom: 10px;

  left: 150px;

  width: 1px;

  background:
    linear-gradient(
      180deg,
      transparent,
      rgba(212,175,55,0.6) 10%,
      rgba(212,175,55,0.6) 90%,
      transparent
    );
}

.timeline-item {
  position: relative;

  display: grid;

  grid-template-columns:
    125px
    50px
    1fr;

  min-height: 145px;

  margin-bottom: 5px;
}

/* DATE */

.timeline-date {
  padding-top: 8px;

  padding-right: 25px;

  color: #b18f43;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 22px;

  text-align: right;
}

/* MARKER */

.timeline-marker {
  position: relative;

  display: flex;

  justify-content: center;

  z-index: 2;
}

.marker-ring {
  width: 32px;
  height: 32px;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    #d4af37;

  border-radius: 50%;

  background:
    #fffdf8;

  color:
    #d4af37;

  font-size: 7px;
}

/* CONTENT */

.timeline-content {
  position: relative;

  padding:
    0 0 35px 25px;
}

.timeline-number {
  color:
    rgba(180,142,40,0.28);

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 13px;

  letter-spacing: 2px;
}

.timeline-content h3 {
  margin:
    4px 0 7px;

  color: #322c23;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 29px;

  font-weight: 400;
}

.timeline-content p {
  max-width: 420px;

  margin: 0;

  color: #807362;

  font-family:
    "Cormorant Garamond",
    Georgia,
    serif;

  font-size: 15px;

  line-height: 1.6;
}

/* LAST */

.timeline-item.is-last {
  margin-bottom: 0;
}

.timeline-item.is-last
.timeline-content {
  padding-bottom: 0;
}

/* MOBILE */

@media (max-width: 600px) {
  .eg-timeline {
    padding:
      75px 20px;
  }

  .eg-timeline::before {
    inset: 10px;
  }

  .timeline-header {
    margin-bottom: 55px;
  }

  .timeline-list::before {
    left: 78px;
  }

  .timeline-item {
    grid-template-columns:
      60px
      37px
      1fr;

    min-height: 130px;
  }

  .timeline-date {
    padding-right: 12px;

    font-size: 17px;
  }

  .marker-ring {
    width: 27px;
    height: 27px;
  }

  .timeline-content {
    padding:
      0 0 30px 15px;
  }

  .timeline-content h3 {
    font-size: 25px;
  }

  .timeline-content p {
    font-size: 14px;
  }
}
</style>