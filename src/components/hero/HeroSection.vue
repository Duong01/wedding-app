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

    background: linear-gradient(135deg, #fef5f1 0%, #fff8f5 100%);

}

.hero-overlay{

    position:absolute;

    inset:0;

    background:

    linear-gradient(

        to bottom,

        rgba(255,245,241,.1),

        rgba(255,235,220,.2),

        rgba(255,222,200,.3)

    );

    z-index:2;

}

</style>