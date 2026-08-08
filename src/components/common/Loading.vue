<template>
  <div class="loading-screen">

    <!-- Background -->
    <div class="loading-bg"></div>

    <!-- Blur -->
    <div class="overlay"></div>

    <div class="loading-content">

      <!-- Heart -->
      <div ref="heart" class="heart">
        ❤
      </div>

      <!-- Couple -->
      <div ref="title" class="title">
        {{ groomName }}
        <span>&</span>
        {{ brideName }}
      </div>

      <div class="subtitle">
        Ngày chung đôi
      </div>

      <!-- Lottie -->
      <Vue3Lottie
        animationLink="/lottie/loading.json"
        :height="180"
        :width="180"
      />

      <!-- Progress -->

      <v-progress-linear
        :model-value="progress"
        color="pink"
        rounded
        height="8"
      />

      <div class="percent">

        {{ progress }}%

      </div>

    </div>

  </div>
</template>

<script setup>

import { ref,onMounted,nextTick } from "vue";

import { gsap } from "gsap";

import { Vue3Lottie } from "vue3-lottie";

const emit=defineEmits(["finish"]);

const groomName=ref("Nguyễn Văn A");

const brideName=ref("Trần Thị B");

const progress=ref(0);

const heart=ref();

const title=ref();

async function loadWedding(){

    /*
      Sau này

      const res=await weddingApi.getWedding()

      groomName.value=res.data.groomName || "Nguyễn Văn A"

      brideName.value=res.data.brideName || "Trần Thị B"

    */

}

onMounted(async()=>{

    await loadWedding();

    await nextTick();

    gsap.from(title.value,{

        y:60,

        opacity:0,

        duration:1.2

    });

    gsap.to(heart.value,{

        scale:1.25,

        repeat:-1,

        yoyo:true,

        duration:.8,

        ease:"power1.inOut"

    });

    const timer=setInterval(()=>{

        progress.value++;

        if(progress.value>=100){

            clearInterval(timer);

            setTimeout(()=>{

                emit("finish");

            },500);

        }

    },20);

});

</script>

<style scoped lang="scss">

.loading-screen{

    position:fixed;

    inset:0;

    z-index:99999;

    display:flex;

    justify-content:center;

    align-items:center;

    overflow:hidden;

}

.loading-bg{

    position:absolute;

    inset:0;

    background:url("/images/default-cover.jpg") center/cover;

    transform:scale(1.15);

    filter:blur(12px);

}

.overlay{

    position:absolute;

    inset:0;

    background:rgba(255,255,255,.45);

    backdrop-filter:blur(10px);

}

.loading-content{

    width:min(90%,420px);

    position:relative;

    z-index:2;

    text-align:center;

    padding:40px;

    border-radius:30px;

    background:rgba(255,255,255,.35);

    backdrop-filter:blur(25px);

    box-shadow:0 20px 60px rgba(0,0,0,.15);

}

.heart{

    // font-size:70px;

    color:#ff4b7d;

    margin-bottom:20px;

}

.title{

    // font-size:34px;

    font-weight:700;

    color:#444;

    line-height:1.5;

}

.title span{

    color:#e91e63;

    margin:0 10px;

}

.subtitle{

    margin:18px 0 30px;

    letter-spacing:4px;

    color:#888;

    // font-size:14px;

    text-transform:uppercase;

}

.percent{

    margin-top:15px;

    font-weight:700;

    color:#666;

}

@media(max-width:600px){

.loading-content{

padding:30px 20px;

}

.title{

// font-size:24px;

}

.heart{

// font-size:55px;

}

}

</style>