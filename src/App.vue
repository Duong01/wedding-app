<template>
  <v-app>
    <!-- Loading -->
    <Transition name="fade">
      <AppLoading
        v-if="loading"
        @finish="loading = false"
      />
    </Transition>

    <!-- Main -->
    <template v-if="!loading">
      <RouterView v-slot="{ Component }">
        <Transition
          name="page"
          appear
          mode="out-in"
        >
          <component :is="Component" />
        </Transition>
      </RouterView>

      <!-- Global Components -->
      <FloatingMusic />

      <ScrollTop />
    </template>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";

const loading = ref(false);

// onMounted(() => {

//     setTimeout(() => {

//         loading.value = false;

//     }, 1000);

// });
</script>

<style lang="scss">

html{

    scroll-behavior:smooth;

}

body{

    margin:0;

    overflow-x:hidden;

    background:#FFF8F6;

    font-family:
    "Be Vietnam Pro",
    sans-serif;

}

#app{

    min-height:100vh;

}

.page-enter-active{

    transition:
    all .8s ease;

}

.page-leave-active{

    transition:
    all .5s ease;

}

.page-enter-from{

    opacity:0;

    transform:
    translateY(50px);

}

.page-leave-to{

    opacity:0;

    transform:
    translateY(-30px);

}

.fade-enter-active,
.fade-leave-active{

    transition:.6s;

}

.fade-enter-from,
.fade-leave-to{

    opacity:0;

}

</style>