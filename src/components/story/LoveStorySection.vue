<template>
  <section
    id="story"
    class="story-section"
  >

    <v-container>

      <!-- Title -->

      <div class="section-title">

        <div class="sub-title">

          Our Journey

        </div>

        <h2>

          Chuyện Tình Yêu

        </h2>

        <p>

          Những cột mốc đáng nhớ trên hành trình yêu thương của chúng mình.

        </p>

      </div>

      <StoryTimeline />

    </v-container>

  </section>
</template>

<script setup>

import StoryTimeline from "./StoryTimeline.vue";

</script>

<style scoped lang="scss">

.story-section{

    padding:120px 0;

    background:

    linear-gradient(

    180deg,

    #fff,

    #fff9f7,

    #fff

    );

}

.section-title{

    text-align:center;

    margin-bottom:80px;

}

.sub-title{

    letter-spacing:4px;

    text-transform:uppercase;

    color:#d79ba8;

    // font-size:13px;

    margin-bottom:10px;

}

.section-title h2{

    // font-size:46px;

    color:#444;

    margin-bottom:15px;

}

.section-title p{

    color:#888;

    max-width:650px;

    margin:auto;

    line-height:1.8;

}

@media(max-width:600px){

.story-section{

padding:70px 0;

}

.section-title h2{

// font-size:32px;

}

}

</style>