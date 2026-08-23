<template>
  <v-app>
    <!-- Loading -->
    <Transition name="fade">
      <AppLoading v-if="loading" @finish="loading = false" />
    </Transition>

    <!-- Main -->
    <template v-if="!loading">
      <RouterView v-slot="{ Component }">
        <Transition name="page" appear mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>

      <!-- Global Components -->
      <FloatingMusic />

      <!-- <ScrollTop /> -->
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

<!--
  Toàn bộ style global (font, cỡ chữ, reset) đã được
  gom về src/assets/styles/theme.css để đồng nhất typography.
-->