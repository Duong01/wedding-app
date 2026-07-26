<template>
  <section class="hero-section">

    <!-- Background -->
    <HeroBackground />

    <!-- Hiệu ứng -->
    <HeroParticles />

    <!-- Overlay -->
    <div class="hero-overlay"></div>

    <!-- Nội dung -->
    <HeroContent />

  </section>
</template>

<script setup>
import HeroBackground from "./HeroBackground.vue";
import HeroParticles from "./HeroParticles.vue";
import HeroContent from "./HeroContent.vue";
</script>

<style scoped lang="scss">

.hero-section{

    position:relative;

    width:100%;

    height:100vh;

    overflow:hidden;

}

.hero-overlay{

    position:absolute;

    inset:0;

    background:

    linear-gradient(

        rgba(0,0,0,.25),

        rgba(0,0,0,.45),

        rgba(0,0,0,.7)

    );

    z-index:2;

}

</style>