<template>
  <div
    ref="card"
    class="story-item"
    :class="{ reverse }"
  >
    <!-- Dot -->
    <div class="timeline-dot">
      <v-icon size="18">
        mdi-heart
      </v-icon>
    </div>

    <!-- Card -->
    <v-card
      class="story-card"
      elevation="0"
    >
      <!-- Image -->
      <v-img
        :src="story.image"
        height="260"
        cover
        class="story-image"
        :lazy-src="story.image"
      />

      <!-- Content -->
      <div class="content">

        <div class="date">
          {{ formatDate(story.date) }}
        </div>

        <h3>
          {{ story.title }}
        </h3>

        <p>
          {{ story.description }}
        </p>

      </div>

    </v-card>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import dayjs from "dayjs";

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({

  story: {
    type: Object,
    required: true
  },

  reverse: {
    type: Boolean,
    default: false
  }

});

const card = ref();

function formatDate(date) {

  if (!date) return "";

  return dayjs(date).format("DD/MM/YYYY");

}

onMounted(() => {

  gsap.from(card.value, {

    opacity: 0,

    x: props.reverse ? 120 : -120,

    duration: 1,

    ease: "power3.out",

    scrollTrigger: {

      trigger: card.value,

      start: "top 80%"

    }

  });

});
</script>

<style scoped lang="scss">

.story-item{

    position:relative;

    display:flex;

    justify-content:flex-start;

    margin-bottom:80px;

    width:50%;

    padding-right:60px;

}

.story-item.reverse{

    margin-left:auto;

    justify-content:flex-end;

    padding-right:0;

    padding-left:60px;

}

.timeline-dot{

    position:absolute;

    right:-16px;

    top:120px;

    width:34px;

    height:34px;

    border-radius:50%;

    background:#f7b5c0;

    display:flex;

    align-items:center;

    justify-content:center;

    color:white;

    z-index:10;

    box-shadow:0 8px 20px rgba(247,181,192,.45);

}

.story-item.reverse .timeline-dot{

    left:-16px;

    right:auto;

}

.story-card{

    width:100%;

    overflow:hidden;

    border-radius:24px;

    backdrop-filter:blur(18px);

    background:rgba(255,255,255,.75);

    border:1px solid rgba(255,255,255,.35);

    transition:.35s;

}

.story-card:hover{

    transform:translateY(-8px);

    box-shadow:0 20px 40px rgba(0,0,0,.12);

}

.story-image{

    transition:transform .5s;

}

.story-card:hover .story-image{

    transform:scale(1.05);

}

.content{

    padding:28px;

}

.date{

    color:#d48b98;

    // font-size:14px;

    font-weight:600;

    margin-bottom:12px;

}

.content h3{

    // font-size:26px;

    color:#444;

    margin-bottom:14px;

}

.content p{

    color:#666;

    line-height:1.8;

}

@media(max-width:960px){

.story-item,

.story-item.reverse{

width:100%;

padding-left:70px;

padding-right:0;

}

.timeline-dot,

.story-item.reverse .timeline-dot{

left:14px;

right:auto;

}

}

@media(max-width:600px){

.story-card{

border-radius:18px;

}

.content{

padding:20px;

}

.content h3{

// font-size:22px;

}

}

</style>