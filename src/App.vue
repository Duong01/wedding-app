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

          <router-link
            v-if="auth.isLoggedIn && auth.can('manage')"
            to="/manage"
            class="nav-link"
          >
            Thiệp của tôi
          </router-link>

          <router-link
            v-if="auth.can('editor')"
            to="/editor"
            class="nav-link"
          >
            Editor
          </router-link>

          <router-link
            v-if="auth.isAdmin"
            to="/admin"
            class="nav-link admin-link"
          >
            <v-icon size="15"> mdi-shield-account-outline </v-icon>
            Phân quyền
          </router-link>
        </nav>

        <!-- =========================================
             AUTH AREA
        ========================================== -->
        <div class="auth-area">
          <template v-if="auth.isLoggedIn">
            <div ref="userMenuRef" class="user-menu-wrap">
              <button
                type="button"
                class="user-button"
                @click="userMenuOpen = !userMenuOpen"
              >
                <img
                  v-if="auth.avatar"
                  :src="auth.avatar"
                  :alt="auth.displayName"
                  class="user-avatar"
                  @error="hideAvatar"
                />

                <span v-else class="user-avatar user-avatar-fallback">
                  {{ userInitial }}
                </span>

                <span class="user-name">{{ auth.displayName }}</span>

                <span class="user-role" :class="`role-${auth.currentRole.toLowerCase()}`">
                  {{ auth.roleLabel }}
                </span>

                <v-icon size="16"> mdi-chevron-down </v-icon>
              </button>

              <Transition name="menu-pop">
                <div v-if="userMenuOpen" class="user-dropdown">
                  <div class="dropdown-header">
                    <strong>{{ auth.displayName }}</strong>

                    <span>{{ auth.user?.Email }}</span>
                  </div>

                  <button
                    type="button"
                    class="dropdown-item"
                    @click="goProfile"
                  >
                    <v-icon size="16"> mdi-account-circle-outline </v-icon>
                    Thông tin cá nhân
                  </button>

                  <button
                    v-if="auth.isAdmin"
                    type="button"
                    class="dropdown-item"
                    @click="goAdmin"
                  >
                    <v-icon size="16"> mdi-shield-account-outline </v-icon>
                    Quản lý phân quyền
                  </button>

                  <button
                    type="button"
                    class="dropdown-item logout"
                    :disabled="loggingOut"
                    @click="handleLogout"
                  >
                    <v-progress-circular
                      v-if="loggingOut"
                      indeterminate
                      size="13"
                      width="2"
                    />

                    <v-icon v-else size="16"> mdi-logout </v-icon>
                    Đăng xuất
                  </button>
                </div>
              </Transition>
            </div>
          </template>

          <template v-else>
            <router-link to="/login" class="login-button">
              <v-icon size="16"> mdi-login-variant </v-icon>
              Đăng nhập
            </router-link>
          </template>
        </div>
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
  onMounted,
  onBeforeUnmount,
} from "vue";

import { useRoute, useRouter } from "vue-router";

// Global components
import AppLoading from "@/components/common/Loading.vue";
import FloatingMusic from "@/components/common/FloatingMusic.vue";
import "@/assets/styles/chungdoi.css";

// Auth store
import { useAuthStore } from "@/stores/auth";

// --------------------------------------------------
// Router
// --------------------------------------------------

const route = useRoute();
const router = useRouter();

// --------------------------------------------------
// Auth
// --------------------------------------------------

const auth = useAuthStore();

const userMenuOpen = ref(false);
const loggingOut = ref(false);
const userMenuRef = ref(null);
const avatarBroken = ref(false);

const userInitial = computed(() => {
  const name = auth.displayName || "";

  return name.charAt(0).toUpperCase();
});

function hideAvatar() {
  avatarBroken.value = true;
}

function goProfile() {
  userMenuOpen.value = false;

  router.push({ name: "Profile" });
}

function goAdmin() {
  userMenuOpen.value = false;

  router.push({ name: "Admin" });
}

async function handleLogout() {
  if (loggingOut.value) {
    return;
  }

  loggingOut.value = true;

  try {
    await auth.logout();

    userMenuOpen.value = false;

    router.push({ name: "Home" });
  } finally {
    loggingOut.value = false;
  }
}

function onDocumentClick(event) {
  if (
    userMenuOpen.value &&
    userMenuRef.value &&
    !userMenuRef.value.contains(event.target)
  ) {
    userMenuOpen.value = false;
  }
}

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

const hiddenRoutes = ["editor", "dashboard", "admin", "preview-bare"];

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

  document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);
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
  gap: 14px;
}

/* ==================================================
   AUTH AREA (header)
================================================== */

.auth-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.login-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 999px;
  background: linear-gradient(135deg, #8f4d43, #6d3a34);
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(109, 58, 52, 0.28);
}

.user-menu-wrap {
  position: relative;
}

.user-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 6px;
  border: 1px solid rgba(78, 53, 53, 0.12);
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.user-button:hover {
  border-color: rgba(143, 77, 67, 0.4);
  box-shadow: 0 6px 18px rgba(80, 50, 50, 0.1);
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.user-avatar-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #d7b779, #8d4e4d);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.user-name {
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #2a1d1d;
  font-size: 13px;
  font-weight: 600;
}

.user-role {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.user-role.role-admin {
  background: rgba(143, 77, 67, 0.12);
  color: #8f4d43;
}

.user-role.role-user {
  background: rgba(46, 125, 50, 0.12);
  color: #2e7d32;
}

.user-role.role-guest {
  background: rgba(120, 120, 140, 0.12);
  color: #5c5c70;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 100;
  width: 240px;
  padding: 8px;
  border: 1px solid rgba(78, 53, 53, 0.1);
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 24px 60px rgba(30, 15, 15, 0.18);
}

.dropdown-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px 12px;
  border-bottom: 1px solid rgba(78, 53, 53, 0.08);
  margin-bottom: 6px;
}

.dropdown-header strong {
  color: #2a1d1d;
  font-size: 14px;
}

.dropdown-header span {
  color: #9a8484;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 12px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #4e3636;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;
}

.dropdown-item:hover {
  background: #f7f0ec;
}

.dropdown-item.logout {
  color: #a92828;
}

.dropdown-item.logout:hover {
  background: #fdf1f1;
}

.dropdown-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.menu-pop-enter-active,
.menu-pop-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.menu-pop-enter-from,
.menu-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.admin-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
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

  .user-name {
    display: none;
  }

  .user-role {
    display: none;
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

