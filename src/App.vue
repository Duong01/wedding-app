<template>
  <v-app class="app-root">
    <header ref="headerRef" v-if="showTopNav" class="site-header">
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

          <router-link
            v-if="auth.isAdmin"
            to="/admin/weddings"
            class="nav-link admin-link"
          >
            <v-icon size="15"> mdi-card-multiple-outline </v-icon>
            Quản lý thiệp
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
                    v-if="auth.isAdmin"
                    type="button"
                    class="dropdown-item"
                    @click="goAdminWeddings"
                  >
                    <v-icon size="16"> mdi-card-multiple-outline </v-icon>
                    Quản lý thiệp
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

        <!-- =========================================
             MOBILE NAV TOGGLE
        ========================================== -->
        <button
          type="button"
          class="nav-toggle"
          aria-label="Mở menu điều hướng"
          @click="mobileNavOpen = !mobileNavOpen"
        >
          <v-icon size="22">
            {{ mobileNavOpen ? "mdi-close" : "mdi-menu" }}
          </v-icon>
        </button>
      </div>

      <!-- =========================================
           MOBILE NAV PANEL
      ========================================== -->
      <Transition name="menu-pop">
        <nav
          v-if="mobileNavOpen"
          class="mobile-nav"
          aria-label="Menu di động"
        >
          <router-link to="/" class="mobile-nav-link"> Home </router-link>

          <router-link to="/templates" class="mobile-nav-link">
            Mẫu thiệp
          </router-link>

          <router-link
            v-if="auth.isLoggedIn && auth.can('manage')"
            to="/manage"
            class="mobile-nav-link"
          >
            Thiệp của tôi
          </router-link>

          <router-link
            v-if="auth.can('editor')"
            to="/editor"
            class="mobile-nav-link"
          >
            Editor
          </router-link>

          <router-link
            v-if="auth.isAdmin"
            to="/admin"
            class="mobile-nav-link"
          >
            Phân quyền
          </router-link>

          <router-link
            v-if="auth.isAdmin"
            to="/admin/weddings"
            class="mobile-nav-link"
          >
            Quản lý thiệp
          </router-link>

          <div class="mobile-nav-divider"></div>

          <template v-if="auth.isLoggedIn">
            <div class="mobile-nav-user">
              <strong>{{ auth.displayName }}</strong>

              <span>{{ auth.roleLabel }}</span>
            </div>

            <button
              type="button"
              class="mobile-nav-link"
              @click="goProfile"
            >
              <v-icon size="17"> mdi-account-circle-outline </v-icon>
              Thông tin cá nhân
            </button>

            <button
              v-if="auth.isAdmin"
              type="button"
              class="mobile-nav-link"
              @click="goAdmin"
            >
              <v-icon size="17"> mdi-shield-account-outline </v-icon>
              Quản lý phân quyền
            </button>

            <button
              type="button"
              class="mobile-nav-link logout"
              :disabled="loggingOut"
              @click="handleLogout"
            >
              <v-progress-circular
                v-if="loggingOut"
                indeterminate
                size="14"
                width="2"
              />

              <v-icon v-else size="17"> mdi-logout </v-icon>
              Đăng xuất
            </button>
          </template>

          <router-link v-else to="/login" class="mobile-nav-login">
            <v-icon size="17"> mdi-login-variant </v-icon>
            Đăng nhập
          </router-link>
        </nav>
      </Transition>
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
           SITE FOOTER (contact admin → Facebook)
           ẩn trên trang thiệp khách mời + editor/admin
      ======================================== -->
      <SiteFooter v-if="showFooter" />

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
  defineAsyncComponent,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";

import { useRoute, useRouter } from "vue-router";

// Global components
// AppLoading chỉ dùng khi loading === true (hiện tại luôn false)
// → tải lazy để gsap + vue3-lottie không rơi vào bundle chính
const AppLoading = defineAsyncComponent(() =>
  import("@/components/common/Loading.vue")
);

import FloatingMusic from "@/components/common/FloatingMusic.vue";
import SiteFooter from "@/components/common/SiteFooter.vue";
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
const headerRef = ref(null);
const avatarBroken = ref(false);

const mobileNavOpen = ref(false);

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

function goAdminWeddings() {
  userMenuOpen.value = false;

  router.push({ name: "AdminWeddings" });
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

  /*
   * Click ra ngoài header (kể cả chọn link trong
   * menu mobile) → đóng menu điều hướng di động.
   */
  if (
    mobileNavOpen.value &&
    headerRef.value &&
    !headerRef.value.contains(event.target)
  ) {
    mobileNavOpen.value = false;
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
// và trang thiệp dành cho khách mời
// --------------------------------------------------

const hiddenRoutes = ["editor", "dashboard", "admin", "preview-bare"];

// Trang thiệp theo link (/{slug}/{token}) — ẩn toàn bộ khung trang
const guestInvitationRoutes = ["WeddingByApi", "WeddingBySlug"];

const showGlobalDecoration = computed(() => {
  if (guestInvitationRoutes.includes(route.name)) {
    return false;
  }

  return !hiddenRoutes.some((name) =>
    route.path.includes(name)
  );
});

const showTopNav = computed(() => {
  if (guestInvitationRoutes.includes(route.name)) {
    return false;
  }

  return !hiddenRoutes.some((name) => route.path.includes(name));
});

/*
 * Footer liên hệ (nút "Liên hệ Admin" → Facebook)
 * ẩn cùng nhóm trang với header: thiệp khách mời,
 * editor, admin, preview.
 */
const showFooter = computed(() => {
  return showTopNav.value;
});

/*
 * Đổi trang (bấm link trong menu mobile) →
 * đóng menu để nội dung trang hiển thị trọn vẹn.
 */
watch(
  () => route.fullPath,
  () => {
    mobileNavOpen.value = false;
  }
);

/*
 * Đồng bộ class theme-chungdoi theo route hiện tại
 * (trang thiệp khách mời không dùng theme chung đôi).
 */
watch(
  showGlobalDecoration,
  () => {
    syncThemeClass();
  }
);

function syncThemeClass() {
  if (showGlobalDecoration.value) {
    document.documentElement.classList.add("theme-chungdoi");
  } else {
    document.documentElement.classList.remove("theme-chungdoi");
  }
}

// --------------------------------------------------
// App initialization
// --------------------------------------------------

onMounted(() => {
  document.documentElement.classList.add("app-ready");

  syncThemeClass();

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
  background: var(--studio-paper, #f7f1e6);
  font-family: var(--font-ui);
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(14px);
  background: rgba(255, 253, 248, 0.82);
  border-bottom: 1px solid var(--studio-line, rgba(43, 33, 24, 0.1));
}

.site-header-inner {
  width: min(1200px, calc(100% - 32px));
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
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
  padding: 9px 18px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--studio-seal, #a63a2e), #7c2a20);
  color: #fdf6ec;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(43, 33, 24, 0.25);
}

.user-menu-wrap {
  position: relative;
}

.user-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 6px;
  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 999px;
  background: var(--studio-card, #fffdf8);
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.user-button:hover {
  border-color: rgba(185, 151, 91, 0.55);
  box-shadow: 0 6px 18px rgba(43, 33, 24, 0.08);
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
  background: linear-gradient(
    135deg,
    var(--studio-foil, #b9975b),
    var(--studio-seal, #a63a2e)
  );
  color: #fdf6ec;
  font-size: 13px;
  font-weight: 700;
}

.user-name {
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--studio-ink, #2b2118);
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
  background: rgba(166, 58, 46, 0.12);
  color: var(--studio-seal, #a63a2e);
}

.user-role.role-user {
  background: rgba(185, 151, 91, 0.18);
  color: var(--app-gold-text, #8a6a2f);
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
  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.12));
  border-radius: 16px;
  background: var(--studio-card, #fffdf8);
  box-shadow: 0 24px 60px rgba(43, 33, 24, 0.16);
}

.dropdown-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px 12px;
  border-bottom: 1px solid var(--studio-line, rgba(43, 33, 24, 0.1));
  margin-bottom: 6px;
}

.dropdown-header strong {
  color: var(--studio-ink, #2b2118);
  font-size: 14px;
}

.dropdown-header span {
  color: var(--studio-ink-faint, #8a7a68);
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
  color: var(--studio-ink-soft, #5c4f43);
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;
}

.dropdown-item:hover {
  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
}

.dropdown-item.logout {
  color: var(--app-danger, #a03030);
}

.dropdown-item.logout:hover {
  background: var(--app-danger-soft, rgba(160, 48, 48, 0.1));
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
  font-size: clamp(22px, 2vw, 28px);
  font-weight: 700;
  color: var(--studio-ink, #2b2118);
  text-decoration: none;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(
    135deg,
    var(--studio-foil, #b9975b),
    var(--studio-seal, #a63a2e)
  );
  color: #fdf6ec;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.top-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  position: relative;
  color: var(--studio-ink-soft, #5c4f43);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  padding: 6px 0;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 100%;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(
    90deg,
    var(--studio-foil, #b9975b),
    var(--studio-seal, #a63a2e)
  );
  transition: right 0.25s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--studio-seal, #a63a2e);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  right: 0;
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
      rgba(185, 151, 91, 0.2),
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
      rgba(166, 58, 46, 0.12),
      transparent 68%
    );
}

/* ==================================================
   MOBILE NAV TOGGLE + PANEL
================================================== */

.nav-toggle {
  display: none;

  width: 40px;

  height: 40px;

  flex: 0 0 40px;

  align-items: center;

  justify-content: center;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 10px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink-soft, #5c4f43);

  cursor: pointer;
}

.mobile-nav {
  display: none;
}

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 768px) {
  .site-header-inner {
    min-height: 60px;
  }

  /*
   * Trên mobile: ẩn dải link ngang + khu user,
   * thay bằng nút ☰ mở menu dọc gọn gàng.
   */
  .top-nav,
  .auth-area {
    display: none;
  }

  .nav-toggle {
    display: inline-flex;

    margin-left: auto;
  }

  .mobile-nav {
    display: flex;

    flex-direction: column;

    gap: 2px;

    padding: 10px 16px calc(14px + env(safe-area-inset-bottom));

    border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.1));

    background: rgba(255, 253, 248, 0.98);
  }

  .mobile-nav-link {
    display: flex;

    align-items: center;

    gap: 9px;

    padding: 12px 10px;

    border: 0;

    border-radius: 10px;

    background: transparent;

    color: var(--studio-ink-soft, #5c4f43);

    font-size: 14px;

    font-weight: 600;

    text-align: left;

    text-decoration: none;

    cursor: pointer;

    transition: background 0.15s ease;
  }

  .mobile-nav-link:hover,
  .mobile-nav-link.router-link-active {
    background: rgba(185, 151, 91, 0.12);

    color: var(--studio-seal, #a63a2e);
  }

  .mobile-nav-link.logout {
    color: var(--app-danger, #a03030);
  }

  .mobile-nav-link.logout:hover {
    background: var(--app-danger-soft, rgba(160, 48, 48, 0.1));

    color: var(--app-danger, #a03030);
  }

  .mobile-nav-link:disabled {
    opacity: 0.6;

    cursor: not-allowed;
  }

  .mobile-nav-divider {
    height: 1px;

    margin: 8px 4px;

    background: var(--studio-line, rgba(43, 33, 24, 0.12));
  }

  .mobile-nav-user {
    display: flex;

    flex-direction: column;

    gap: 2px;

    padding: 10px 10px 6px;
  }

  .mobile-nav-user strong {
    color: var(--studio-ink, #2b2118);

    font-size: 14px;
  }

  .mobile-nav-user span {
    color: var(--studio-ink-faint, #8a7a68);

    font-size: 11px;
  }

  .mobile-nav-login {
    display: flex;

    align-items: center;

    justify-content: center;

    gap: 7px;

    margin-top: 8px;

    padding: 12px;

    border-radius: 999px;

    background: linear-gradient(
      135deg,
      var(--studio-seal, #a63a2e),
      #7c2a20
    );

    color: #fdf6ec;

    font-size: 13.5px;

    font-weight: 600;

    text-decoration: none;
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

