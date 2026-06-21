<template>
  <Transition name="scroll-top">
    <div
      v-if="visible"
      class="scroll-top"
    >
      <v-btn
        icon
        size="56"
        color="white"
        elevation="0"
        class="scroll-btn"
        @click="scrollToTop"
      >
        <v-icon size="28">
          mdi-chevron-up
        </v-icon>
      </v-btn>

      <div class="ring"></div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const visible = ref(false);

const showOffset = 300;

function handleScroll() {
  visible.value = window.scrollY > showOffset;
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

onMounted(() => {
  handleScroll();

  window.addEventListener("scroll", handleScroll, {
    passive: true
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped lang="scss">

.scroll-top{

    position:fixed;

    right:28px;

    bottom:28px;

    z-index:9999;

}

.scroll-btn{

    width:60px !important;

    height:60px !important;

    border-radius:50% !important;

    backdrop-filter:blur(18px);

    background:rgba(255,255,255,.25) !important;

    border:1px solid rgba(255,255,255,.45);

    color:#ff5d8f !important;

    box-shadow:

        0 15px 35px rgba(0,0,0,.18);

    transition:all .35s ease;

}

.scroll-btn:hover{

    transform:translateY(-6px) scale(1.08);

    box-shadow:

        0 20px 45px rgba(0,0,0,.25);

}

.scroll-btn:active{

    transform:scale(.96);

}

.ring{

    position:absolute;

    inset:-6px;

    border-radius:50%;

    border:2px solid rgba(255,93,143,.25);

    animation:pulse 2.5s infinite;

    pointer-events:none;

}

@keyframes pulse{

    0%{

        transform:scale(.9);

        opacity:.7;

    }

    70%{

        transform:scale(1.25);

        opacity:0;

    }

    100%{

        transform:scale(1.25);

        opacity:0;

    }

}

.scroll-top-enter-active,

.scroll-top-leave-active{

    transition:all .35s ease;

}

.scroll-top-enter-from,

.scroll-top-leave-to{

    opacity:0;

    transform:translateY(30px) scale(.7);

}

@media(max-width:600px){

.scroll-top{

right:18px;

bottom:18px;

}

.scroll-btn{

width:52px !important;

height:52px !important;

}

}

</style>