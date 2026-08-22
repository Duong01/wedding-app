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

<style>

@import url('https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:wght@400;500;600&family=Montserrat:wght@300;400;500;600&display=swap');


:root {
    --aa: radial-gradient(circle at 0px 0px, rgb(104, 14, 14) 35px, transparent 35px) left top / 70px 70px, radial-gradient(circle at 100% 0px, rgb(104, 14, 14) 35px, transparent 35px) right top / 70px 70px, radial-gradient(circle at 0px 100%, rgb(104, 14, 14) 35px, transparent 35px) left bottom / 70px 70px, radial-gradient(circle at 100% 100%, rgb(104, 14, 14) 35px, transparent 35px) right bottom / 70px 70px, url("/images/themes/longphung-v2-red/bg-frame.jpg") center center / cover;
    --font-script: "Allura", cursive;
    --font-wedding: "Cormorant Garamond", serif;
    --font-main: "Montserrat", sans-serif;

    --primary: #7b0d0d;
    --gold: #d8b46d;
    --paper: #f8f3ea;
    --text: #4d3a32;
    --sub-text: #8b6a5d;

    /* Cỡ chữ nhỏ hơn */
    --text-xs: clamp(10px, 2.2vw, 12px);
    --text-sm: clamp(12px, 2.7vw, 14px);
    --text-md: clamp(13px, 3vw, 15px);
    --text-lg: clamp(15px, 3.5vw, 18px);
    --text-xl: clamp(18px, 4.5vw, 24px);
    --text-2xl: clamp(22px, 6vw, 32px);
    --text-3xl: clamp(28px, 8vw, 40px);
    --text-4xl: clamp(34px, 10vw, 58px);
}


/* ===========================
   RESET
   =========================== */

*,
*::before,
*::after {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

html,
body,
#app {
    width: 100%;
    min-height: 100%;
}

body {
    margin: 0;

    font-family: var(--font-main);
    font-size: 13px;
    font-weight: 400;
    line-height: 1.7;

    color: var(--text);
    background: var(--paper);

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

button,
input,
textarea,
select {
    font-family: var(--font-main);
}

p {
    font-family: var(--font-main);
    font-size: clamp(12px, 3vw, 15px);
    line-height: 1.75;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: var(--font-wedding);
    font-weight: 500;
    line-height: 1.1;
    color: var(--primary);
}


/* ===========================
   VUE APP
   =========================== */

#app {
    font-family: var(--font-main);
    font-size: var(--text-md);
}


/* ===========================
   TEXT
   =========================== */


span,
a,
li,
label {
    font-family: inherit;
}

small {
    font-size: var(--text-xs);
}



h1 {
    font-size: var(--text-4xl);
}

h2 {
    font-size: var(--text-3xl);
}

h3 {
    font-size: var(--text-2xl);
}

h4 {
    font-size: var(--text-xl);
}

h5 {
    font-size: var(--text-lg);
}

h6 {
    font-size: var(--text-md);
}


/* ===========================
   WEDDING TITLE
   =========================== */

.section-title {
    margin-bottom: 12px;

    text-align: center;

    font-family: var(--font-wedding);
    font-size: var(--text-3xl);
    font-weight: 600;

    line-height: 1.1;

    color: var(--primary);
}


/* ===========================
   SUBTITLE
   =========================== */

.section-subtitle {
    margin-bottom: 6px;

    text-align: center;

    font-family: var(--font-main);
    font-size: var(--text-xs);
    font-weight: 500;

    line-height: 1.4;

    letter-spacing: 2px;
    text-transform: uppercase;

    color: var(--sub-text);
}


/* ===========================
   BRIDE / GROOM
   =========================== */

.bride-name,
.groom-name {
    font-family: var(--font-wedding);

    /* Nhỏ hơn trước */
    font-size: var(--text-4xl);

    font-weight: 500;

    line-height: .95;

    letter-spacing: .2px;

    color: var(--primary);
}


.role {
    font-family: var(--font-main);

    font-size: var(--text-xs);
    font-weight: 500;

    line-height: 1.4;

    letter-spacing: 2px;
    text-transform: uppercase;

    color: #777;
}


/* ===========================
   DATE
   =========================== */

.event-date {
    display: flex;

    justify-content: center;
    align-items: flex-end;

    gap: 10px;

    flex-wrap: wrap;
}


.day {
    font-family: var(--font-wedding);

    font-size: clamp(44px, 13vw, 72px);
    font-weight: 500;

    line-height: .8;

    color: var(--primary);
}


.month {
    font-family: var(--font-wedding);

    font-size: clamp(17px, 5vw, 25px);
    font-weight: 600;

    line-height: 1;

    color: var(--primary);
}


.year {
    font-family: var(--font-wedding);

    font-size: clamp(21px, 6vw, 30px);
    font-weight: 500;

    line-height: 1;

    color: var(--primary);
}


/* ===========================
   BUTTON
   =========================== */

button,
input,
textarea,
select {
    font-family: inherit;
}

.primary-btn,
.outline-btn {
    min-height: 42px;

    padding: 0 20px;

    font-family: var(--font-main);
    font-size: var(--text-sm);
    font-weight: 600;

    line-height: 1;
}


/* ===========================
   MOBILE
   =========================== */

@media (max-width: 768px) {

    body,
    #app {
        font-size: 14px;
    }

    p {
        font-size: 13px;
        line-height: 1.7;
    }

    h1 {
        font-size: clamp(30px, 9vw, 42px);
    }

    h2 {
        font-size: clamp(26px, 8vw, 36px);
    }

    h3 {
        font-size: clamp(22px, 6.5vw, 30px);
    }

    .section-title {
        font-size: clamp(26px, 8vw, 36px);
    }

    .bride-name,
    .groom-name {
        font-size: clamp(34px, 12vw, 52px);
    }

    .section-subtitle {
        font-size: 10px;
        letter-spacing: 2px;
    }

    .role {
        font-size: 10px;
        letter-spacing: 2px;
    }
}


/* ===========================
   SMALL MOBILE
   =========================== */

@media (max-width: 480px) {

    body,
    #app {
        font-size: 13px;
    }

    p {
        font-size: 13px;
        line-height: 1.65;
    }

    .section-title {
        font-size: clamp(25px, 8vw, 34px);
    }

    .bride-name,
    .groom-name {
        font-size: clamp(32px, 11vw, 46px);
    }

    .day {
        font-size: clamp(42px, 14vw, 62px);
    }

    .month {
        font-size: clamp(16px, 4.5vw, 22px);
    }

    .year {
        font-size: clamp(20px, 5.5vw, 27px);
    }
}

</style>
