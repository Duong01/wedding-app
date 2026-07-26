<template>
  <div ref="container" class="hero-content">

    <!-- Save The Date -->
    <div class="save-date">
      SAVE THE DATE
    </div>

    <div class="hero-badge">
      Một ngày cưới đẹp như lời mơ
    </div>

    <!-- Couple -->
    <div class="couple">

      <h1 class="name groom">
        {{ wedding.groomName }}
      </h1>

      <div class="heart">
        <v-icon
          color="pink-lighten-2"
          size="46"
        >
          mdi-heart
        </v-icon>
      </div>

      <h1 class="name bride">
        {{ wedding.brideName }}
      </h1>

    </div>

    <!-- Date -->
    <div class="date">
      {{ formatDate(wedding.weddingDate) }}
    </div>

    <!-- Quote -->
    <div class="quote">
      “Two souls, one heart,
      together forever.”
    </div>

    <!-- Countdown -->
    <HeroCountdown />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { gsap } from "gsap";
import dayjs from "dayjs";

import HeroCountdown from "./HeroCountdown.vue";
import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();

const wedding = computed(() => store.wedding);

const container = ref();

function formatDate(date){

    if(!date) return "";

    return dayjs(date).format("DD.MM.YYYY");

}

onMounted(()=>{

    const tl = gsap.timeline();

    tl.from(".save-date",{
        y:40,
        opacity:0,
        duration:.8
    })

    .from(".groom",{
        x:-80,
        opacity:0,
        duration:1
    },"-=.4")

    .from(".heart",{
        scale:0,
        duration:.6
    },"-=.6")

    .from(".bride",{
        x:80,
        opacity:0,
        duration:1
    },"-=.7")

    .from(".hero-badge",{
        y:20,
        opacity:0,
        duration:.8
    },"-=.5")

    .from(".date",{
        y:20,
        opacity:0,
        duration:.8
    },"-=.5")

    .from(".quote",{
        opacity:0,
        duration:.8
    },"-=.3");

});
</script>

<style scoped lang="scss">

.hero-content{

    position:absolute;

    inset:0;

    z-index:5;

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;

    text-align:center;

    padding:20px;

    color:white;

}

.save-date{

    font-size:14px;

    letter-spacing:8px;

    text-transform:uppercase;

    opacity:.85;

    margin-bottom:12px;

}

.hero-badge{
    margin-bottom:24px;
    padding:8px 18px;
    border-radius:999px;
    background:rgba(255,255,255,.16);
    backdrop-filter:blur(10px);
    border:1px solid rgba(255,255,255,.25);
    font-size:0.95rem;
    letter-spacing:0.12em;
    text-transform:uppercase;
}

.couple{

    display:flex;

    align-items:center;

    justify-content:center;

    flex-wrap:wrap;

    gap:18px;

}

.name{

    font-size:68px;

    font-family:"Great Vibes", cursive;

    font-weight:400;

    line-height:1.2;

    text-shadow:0 6px 18px rgba(0,0,0,.25);

}

.heart{

    animation:pulse 1.2s infinite;

}

.date{

    margin-top:28px;

    font-size:28px;

    font-weight:600;

    letter-spacing:3px;

}

.quote{

    margin-top:18px;

    max-width:650px;

    font-size:18px;

    line-height:1.8;

    opacity:.92;

    font-style:italic;

    padding:0 16px;

}

@keyframes pulse{

0%,100%{

transform:scale(1);

}

50%{

transform:scale(1.2);

}

}

@media(max-width:960px){

.name{

font-size:52px;

}

}

@media(max-width:600px){

.save-date{

font-size:12px;

letter-spacing:5px;

}

.name{

font-size:38px;

}

.date{

font-size:20px;

}

.quote{

font-size:15px;

line-height:1.6;

}

}

</style>