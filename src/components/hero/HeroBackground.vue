<template>
  <div class="hero-background">

<!-- Video -->
<video
  v-if="videoUrl"
  class="bg-video"
  autoplay
  muted
  loop
  playsinline
  preload="auto"
  :poster="coverImage"
>
  <source
    :src="videoUrl"
    type="video/mp4"
  />
</video>

<!-- Image -->
<div
  v-else
  class="bg-image"
  :style="backgroundStyle"
></div>

<!-- Overlay -->
<div class="overlay"></div>

<!-- Light -->
<div class="light light-1"></div>

<div class="light light-2"></div>
  </div>
</template>

<script setup>
import { computed } from "vue";

import { useWeddingStore } from "@/stores/wedding";

const store = useWeddingStore();

const wedding = computed(() => store.wedding);

const videoUrl = computed(() => {

    return wedding.value.video || "";

});

const coverImage = computed(() => {

    return wedding.value.coverImage;

});

const backgroundStyle = computed(() => ({

    backgroundImage: `url(${coverImage.value})`

}));
</script>

<style scoped lang="scss">

.hero-background{

    position:absolute;

    inset:0;

    overflow:hidden;

}

/* ---------------- Image ---------------- */

.bg-image{

    position:absolute;

    inset:0;

    background-position:center;

    background-size:cover;

    animation:kenburns 25s linear infinite alternate;

}

/* ---------------- Video ---------------- */

.bg-video{

    position:absolute;

    width:100%;

    height:100%;

    object-fit:cover;

    transform:scale(1.1);

}

/* ---------------- Overlay ---------------- */

.overlay{

    position:absolute;

    inset:0;

    background:
    linear-gradient(
        to bottom,
        rgba(0,0,0,.25),
        rgba(0,0,0,.45),
        rgba(0,0,0,.65)
    );

}

/* ---------------- Lights ---------------- */

.light{

    position:absolute;

    border-radius:50%;

    filter:blur(120px);

    opacity:.35;

}

.light-1{

    width:300px;

    height:300px;

    background:#ffb6d5;

    top:-80px;

    left:-80px;

}

.light-2{

    width:350px;

    height:350px;

    background:#ffe4a8;

    bottom:-120px;

    right:-120px;

}

/* ---------------- Animation ---------------- */

@keyframes kenburns{

0%{

transform:scale(1);

}

100%{

transform:scale(1.18);

}

}

@media(max-width:600px){

.light-1{

width:180px;

height:180px;

}

.light-2{

width:220px;

height:220px;

}

}

</style>
