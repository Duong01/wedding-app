<template>
  <v-app class="app-root">
    <header v-if="showTopNav" class="site-header">
      <div class="site-header-inner">
        <router-link to="/" class="brand">
          <span class="brand-mark">Ngày</span>
          <span>Chung Đôi</span>
        </router-link>

        <nav class="top-nav" aria-label="Main navigation">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/templates" class="nav-link">Mẫu thiệp</router-link>
          <router-link to="/editor" class="nav-link">Editor</router-link>
        </nav>
      </div>
    </header>

    <!-- =========================================
         GLOBAL LOADING
    ========================================== -->
    <Transition name="fade" v-if="loading">
      <AppLoading
        v-if="loading"
        @finish="handleLoadingFinish"
      />
    </Transition>

    <!-- =========================================
         APPLICATION
    ========================================== -->
    <template v-else>
      <!-- Page content -->
      <RouterView v-slot="{ Component, route }">
        <Transition
          name="page"
          appear
          mode="out-in"
        >
          <KeepAlive :include="['WeddingEditor']">
            <component
              :is="Component"
              :key="route.name"
            />
          </KeepAlive>
        </Transition>
      </RouterView>

      <!-- =======================================
           GLOBAL WEDDING MUSIC
      ======================================== -->
      <FloatingMusic />

      <!-- =======================================
           GLOBAL DECORATION
           Chỉ hiển thị trên desktop
      ======================================== -->
      <div
        v-if="showGlobalDecoration"
        class="global-decoration global-decoration-left"
        aria-hidden="true"
      />

      <div
        v-if="showGlobalDecoration"
        class="global-decoration global-decoration-right"
        aria-hidden="true"
      />
    </template>
  </v-app>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted
} from "vue";

import { useRoute } from "vue-router";

// Global components
import AppLoading from "@/components/common/Loading.vue";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import "@/assets/styles/chungdoi.css";

// --------------------------------------------------
// Router
// --------------------------------------------------

const route = useRoute();

// --------------------------------------------------
// Loading
// --------------------------------------------------

const loading = ref(false);

const handleLoadingFinish = () => {
  loading.value = false;
};

// --------------------------------------------------
// Global decoration
// Không hiển thị trên trang editor/dashboard
// --------------------------------------------------

const hiddenRoutes = ["editor", "dashboard", "admin"];

const showGlobalDecoration = computed(() => {
  return !hiddenRoutes.some((name) =>
    route.path.includes(name)
  );
});

const showTopNav = computed(() => {
  return !hiddenRoutes.some((name) => route.path.includes(name));
});

// --------------------------------------------------
// App initialization
// --------------------------------------------------

onMounted(() => {
  document.documentElement.classList.add("app-ready");

  if (showGlobalDecoration.value) {
    document.documentElement.classList.add("theme-chungdoi");
  } else {
    document.documentElement.classList.remove("theme-chungdoi");
  }
});
</script>

<style>
/* ==================================================
   APP ROOT
================================================== */

html,
body,
#app {
  width: 100%;
  min-height: 100%;
  margin: 0;
  padding: 0;
}

body {
  overflow-x: hidden;
}

.app-root {
  width: 100%;
  min-height: 100dvh;
  overflow-x: clip;
  background: #faf7f2;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(12px);
  background: rgba(255, 250, 247, 0.72);
  border-bottom: 1px solid rgba(78, 53, 53, 0.08);
}

.site-header-inner {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-heading);
  font-size: clamp(22px, 2vw, 30px);
  font-weight: 700;
  color: #2a1d1d;
  text-decoration: none;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(135deg, #d7b779, #8d4e4d);
  color: #fff;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 18px;
}

.nav-link {
  color: #4e3636;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #8f4d43;
}

/* ==================================================
   PAGE TRANSITION
================================================== */

.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease,
    filter 0.35s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
  filter: blur(3px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  filter: blur(2px);
}

/* ==================================================
   LOADING TRANSITION
================================================== */

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.45s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ==================================================
   GLOBAL DECORATION
================================================== */

.global-decoration {
  position: fixed;
  z-index: 0;
  width: 260px;
  height: 520px;
  pointer-events: none;
  opacity: 0.18;
  filter: blur(0.2px);
}

.global-decoration-left {
  left: -180px;
  top: 18%;
  border-radius: 50%;
  background:
    radial-gradient(
      circle,
      rgba(180, 80, 100, 0.18),
      transparent 68%
    );
}

.global-decoration-right {
  right: -180px;
  bottom: 10%;
  border-radius: 50%;
  background:
    radial-gradient(
      circle,
      rgba(201, 166, 107, 0.18),
      transparent 68%
    );
}

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 768px) {
  .site-header-inner {
    min-height: 64px;
  }

  .top-nav {
    gap: 10px;
    font-size: 14px;
  }

  .brand {
    gap: 8px;
  }

  .global-decoration {
    display: none;
  }

  .page-enter-active,
  .page-leave-active {
    transition:
      opacity 0.28s ease,
      transform 0.28s ease;
  }

  .page-enter-from {
    transform: translateY(8px);
    filter: none;
  }

  .page-leave-to {
    transform: translateY(-5px);
    filter: none;
  }
}

/* ==================================================
   REDUCE MOTION
================================================== */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>

