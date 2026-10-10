<template>
  <v-app class="app-root">
    <header ref="headerRef" v-if="showTopNav" class="site-header">
      <div class="site-header-inner">
        <router-link :to="{ name: 'Home' }" class="brand">
          <!--
               LOGO / BRAND — có logo (public/images/logo.png, xem
               BRAND trong siteContent.js) thì hiện logo; chưa có
               thì hiện brand chữ: pill "Thiệp" + "Nhà Mình".
          -->
          <img
            v-if="brandLogo"
            :src="brandLogo"
            alt="Thiệp Nhà Mình"
            class="brand-logo-img"
          />

          <template v-else>
            <span class="brand-mark">Thiệp</span>
            <span>Nhà Mình</span>
          </template>
        </router-link>

        <!-- =========================================
             2 MỤC CHÍNH NỔI BẬT — Mẫu thiệp cưới +
             Thiệp của tôi.
             Màn lớn: pill trên thanh header, ngay sau brand.
             Màn nhỏ: Teleport ra body thành thanh cố định
             đáy màn hình (header có backdrop-filter tạo
             containing block nên phần tử fixed phải thoát
             khỏi header mới cố định theo viewport được).
        ========================================== -->
        <Teleport to="body" :disabled="!isSmallScreen">
          <nav
            v-if="showTopNav"
            class="quick-nav"
            :class="{ 'quick-nav--bottom': isSmallScreen }"
            :aria-label="$t('nav.quick')"
          >
            <router-link :to="{ name: 'Templates' }" class="quick-link">
              <v-icon size="16"> mdi-card-multiple-outline </v-icon>

              <span>{{ $t('nav.templates') }}</span>
            </router-link>

            <button
              type="button"
              class="quick-link"
              :class="{ 'router-link-active': isMyWeddingsActive }"
              :title="
                auth.isLoggedIn
                  ? $t('nav.myWeddingsTitle')
                  : $t('nav.draftHint')
              "
              @click="goMyWeddings"
            >
              <v-icon size="16"> mdi-heart-multiple-outline </v-icon>

              <span>{{ $t('nav.myWeddings') }}</span>

              <span v-if="myWeddingCount > 0" class="quick-count">
                {{ myWeddingCount }}
              </span>
            </button>
          </nav>
        </Teleport>

        <!-- =========================================
             TOP NAV — CHỈ LINK QUẢN TRỊ (Admin)
             Người dùng thường trên desktop cũng chỉ
             thấy 2 mục chính (quick-nav) như mobile;
             các link còn lại vào menu ☰.
        ========================================== -->
        <nav v-if="auth.isAdmin" class="top-nav" aria-label="Main navigation">
          <router-link to="/admin" class="nav-link admin-link">
            <v-icon size="15"> mdi-shield-account-outline </v-icon>
            {{ $t('nav.roles') }}
          </router-link>

          <router-link
            v-if="auth.isAdmin"
            to="/admin/weddings"
            class="nav-link admin-link"
          >
            <v-icon size="15"> mdi-card-multiple-outline </v-icon>
            {{ $t('nav.adminWeddings') }}
          </router-link>

          <router-link
            v-if="auth.isAdmin"
            to="/admin/payments"
            class="nav-link admin-link"
          >
            <v-icon size="15"> mdi-cash-check </v-icon>
            {{ $t('nav.adminPayments') }}

            <span v-if="pendingPayments > 0" class="nav-badge">
              {{ pendingPayments }}
            </span>
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
                    {{ $t('nav.profile') }}
                  </button>

                  <button
                    v-if="auth.isAdmin"
                    type="button"
                    class="dropdown-item"
                    @click="goAdmin"
                  >
                    <v-icon size="16"> mdi-shield-account-outline </v-icon>
                    {{ $t('nav.adminRoles') }}
                  </button>

                  <button
                    v-if="auth.isAdmin"
                    type="button"
                    class="dropdown-item"
                    @click="goAdminWeddings"
                  >
                    <v-icon size="16"> mdi-card-multiple-outline </v-icon>
                    {{ $t('nav.adminWeddings') }}
                  </button>

                  <button
                    v-if="auth.isAdmin"
                    type="button"
                    class="dropdown-item"
                    @click="goAdminPayments"
                  >
                    <v-icon size="16"> mdi-cash-check </v-icon>
                    {{ $t('nav.adminPayments') }}

                    <span v-if="pendingPayments > 0" class="nav-badge">
                      {{ pendingPayments }}
                    </span>
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
                    {{ $t('auth.logout') }}
                  </button>
                </div>
              </Transition>
            </div>
          </template>

          <template v-else>
            <router-link to="/login" class="login-button">
              <v-icon size="16"> mdi-login-variant </v-icon>
              {{ $t('auth.login') }}
            </router-link>
          </template>
        </div>

        <!-- =========================================
             MOBILE NAV TOGGLE
             Nút đổi theme nằm cùng nhóm, cạnh nút menu
             — hiển thị cả desktop lẫn mobile.
        ========================================== -->
        <div class="header-actions">
          <!-- Đổi ngôn ngữ giao diện (vi · en · zh · ko · ja) -->
          <LanguageSwitcher />

          <button
            type="button"
            class="theme-toggle"
            :title="$t('header.themeToggle', { mode: theme.preferenceLabel.toLowerCase() })"
            :aria-label="$t('header.themeToggle', { mode: theme.preferenceLabel.toLowerCase() })"
            @click="theme.toggle()"
          >
            <v-icon size="18">{{ theme.preferenceIcon }}</v-icon>
          </button>

          <button
            type="button"
            class="nav-toggle"
            :aria-label="$t('nav.openMenu')"
            @click="mobileNavOpen = !mobileNavOpen"
          >
            <v-icon size="22">
              {{ mobileNavOpen ? "mdi-close" : "mdi-menu" }}
            </v-icon>
          </button>
        </div>
      </div>

      <!-- =========================================
           MOBILE NAV PANEL
      ========================================== -->
      <Transition name="menu-pop">
        <nav
          v-if="mobileNavOpen"
          class="mobile-nav"
          :aria-label="$t('nav.mobileMenu')"
        >
          <router-link
            v-for="link in publicNavLinks"
            :key="`m-${link.routeName}`"
            :to="{ name: link.routeName }"
            class="mobile-nav-link"
          >
            {{ link.label }}
          </router-link>

          <router-link to="/manage" class="mobile-nav-link">
            {{ $t('nav.myWeddings') }}
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
            {{ $t('nav.roles') }}
          </router-link>

          <router-link
            v-if="auth.isAdmin"
            to="/admin/weddings"
            class="mobile-nav-link"
          >
            {{ $t('nav.adminWeddings') }}
          </router-link>

          <router-link
            v-if="auth.isAdmin"
            to="/admin/payments"
            class="mobile-nav-link"
          >
            {{ $t('nav.adminPayments') }}

            <span v-if="pendingPayments > 0" class="nav-badge">
              {{ pendingPayments }}
            </span>
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
              {{ $t('nav.profile') }}
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
              {{ $t('auth.logout') }}
            </button>
          </template>

          <router-link v-else to="/login" class="mobile-nav-login">
            <v-icon size="17"> mdi-login-variant </v-icon>
            {{ $t('auth.login') }}
          </router-link>
        </nav>
      </Transition>
    </header>

    <!-- =========================================
         APPLICATION
    ========================================== -->
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
           Đã bỏ: bản này không nhận prop music nên
           musicEnabled luôn false — vô dụng nhưng vẫn
           kéo FloatingMusic + useMusic + music store
           vào bundle chính. Nhạc thiệp do TỪNG THEME
           render FloatingMusic riêng có prop đúng.
      ======================================== -->

      <!-- =======================================
           SITE FOOTER — CHỈ TRANG BÊN NGOÀI
           (trang chủ, thư viện mẫu, trang đích SEO,
           giới thiệu, bảng giá, hướng dẫn, liên hệ).
           Trong app (quản lý thiệp, editor, admin,
           profile, thanh toán...) ẩn để tập trung
           vào nội dung chính.
      ======================================== -->
      <SiteFooter v-if="showFooter" />

      <!-- =======================================
           NÚT LÊN ĐẦU TRANG
           Hiện cùng nhóm trang với header — trang dài
           bên trong app (danh sách thiệp...) vẫn cần
           cuộn lên đầu.
      ======================================== -->
      <ScrollTop v-if="showTopNav" />

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
  </v-app>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";

import { useRoute, useRouter } from "vue-router";

import SiteFooter from "@/components/common/SiteFooter.vue";
import LanguageSwitcher from "@/components/common/LanguageSwitcher.vue";
import ScrollTop from "@/components/common/ScrollTop.vue";
import "@/assets/styles/chungdoi.css";

import { BRAND, NAV_LINKS } from "@/data/siteContent";

import { getPaymentRequests, getMyWeddings } from "@/model/api";

// Tự đồng bộ lại khi quay lại tab sau thời gian dài
import { useTabResume } from "@/composables/useTabResume";

// Tự cắt giảm bộ nhớ khi trình duyệt bị nặng (heap phình to)
import { useMemoryGuard } from "@/composables/useMemoryGuard";

// Auth store
import { useAuthStore } from "@/stores/auth";

// Theme sáng/tối — khởi tạo + đồng bộ Vuetify
import { useThemeStore } from "@/stores/theme";
import { useTheme as useVuetifyTheme } from "vuetify";

// --------------------------------------------------
// Router
// --------------------------------------------------

const route = useRoute();
const router = useRouter();

// --------------------------------------------------
// Auth
// --------------------------------------------------

const auth = useAuthStore();

const theme = useThemeStore();

/* Theme Vuetify (v-dialog, v-select...) đổi theo store theme */
const vuetifyTheme = useVuetifyTheme();

watch(
  () => theme.isDark,
  (isDark) => {
    vuetifyTheme.global.name.value = isDark ? "dark" : "light";
  },
  { immediate: true }
);

const userMenuOpen = ref(false);
const loggingOut = ref(false);
const userMenuRef = ref(null);
const headerRef = ref(null);
const avatarBroken = ref(false);

/*
 * Logo thương hiệu — có logo (điền đường dẫn vào BRAND.logo
 * trong siteContent.js) thì hiện logo, theme tối dùng bản
 * logoDark nếu có. Chưa có → brand chữ.
 */
const brandLogo = computed(() => {
  if (theme.isDark) {
    return BRAND.logoDark || BRAND.logo || "";
  }

  return BRAND.logo || "";
});

const mobileNavOpen = ref(false);

/*
 * Màn hình nhỏ (≤768px)? Quyết định 2 mục chính nằm trên
 * header (màn lớn) hay Teleport thành thanh cố định đáy
 * màn hình (màn nhỏ). Theo dõi resize để chuyển mượt.
 */
const isSmallScreen = ref(
  typeof window !== "undefined" && window.innerWidth <= 768
);

function handleResize() {
  isSmallScreen.value = window.innerWidth <= 768;
}

/* Số yêu cầu thanh toán chờ duyệt — badge cho Admin. */
const pendingPayments = ref(0);

/*
 * Số thiệp của user — badge trên mục "Thiệp của tôi".
 *
 * Đã đăng nhập: đếm từ API getMyWeddings (cache số ở
 * localStorage để lần sau hiện ngay khi API đang tải).
 *
 * Chưa đăng nhập: đếm từ bản nháp editor trong localStorage
 * (khóa "wedding-editor-draft") — có nháp = 1, không = 0.
 * Người dùng chưa đăng nhập vẫn tạo được thiệp (Editor cho
 * phép), bản nháp nằm trên máy cho tới khi lưu lên server.
 */
const myWeddingCount = ref(0);

function readCachedWeddingCount() {
  try {
    const cached = localStorage.getItem("thiepnhaminh:myWeddingCount");

    return cached ? Number(cached) || 0 : 0;
  } catch {
    return 0;
  }
}

/* Có bản nháp editor trên máy này? */
function hasLocalDraft() {
  try {
    const raw = localStorage.getItem("wedding-editor-draft");

    if (!raw) {
      return false;
    }

    return Boolean(JSON.parse(raw)?.wedding);
  } catch {
    return false;
  }
}

async function loadMyWeddingCount() {
  if (!auth.isLoggedIn) {
    /* Chưa đăng nhập — đếm bản nháp trên máy */
    myWeddingCount.value = hasLocalDraft() ? 1 : 0;

    return;
  }

  if (!auth.can("manage")) {
    myWeddingCount.value = 0;

    return;
  }

  /*
   * Chống gọi đè: onMounted + watch isLoggedIn + useTabResume
   * + watch route.name đều có thể kích hoạt gần nhau. Request
   * đang bay thì bỏ — badge chỉ là số hiển thị, không critical.
   */
  if (loadMyWeddingCount.inflight) {
    return;
  }

  loadMyWeddingCount.inflight = true;

  try {
    const response = await getMyWeddings();

    const result = response?.data;

    if (result && result.status === "success" && Array.isArray(result.data)) {
      myWeddingCount.value = result.data.length;

      try {
        localStorage.setItem(
          "thiepnhaminh:myWeddingCount",
          String(result.data.length)
        );
      } catch {
        /* localStorage bị chặn — bỏ qua, chỉ mất cache */
      }
    }
  } catch (error) {
    /* Lỗi mạng — giữ số cache ở localStorage */
    console.warn("[App] getMyWeddings error:", error);
  } finally {
    loadMyWeddingCount.inflight = false;
  }
}

/*
 * Link công khai trên header / menu di động — khai báo
 * một lần ở siteContent để footer dùng chung.
 */
const publicNavLinks = NAV_LINKS;

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

function goAdminPayments() {
  userMenuOpen.value = false;

  mobileNavOpen.value = false;

  router.push({ name: "AdminPayments" });
}

/*
 * Bấm "Thiệp của tôi" → trang quản lý thiệp (/manage).
 * Trang này mở cho cả khách chưa đăng nhập: chưa đăng
 * nhập thì hiển thị bản nháp trên máy (localStorage),
 * đăng nhập rồi thì lấy danh sách thiệp từ API.
 */
function goMyWeddings() {
  router.push({ name: "Manage" });
}

/* Nút "Thiệp của tôi" sáng khi đang ở Manage hoặc Editor */
const isMyWeddingsActive = computed(() =>
  ["Manage", "Editor"].includes(route.name)
);

/*
 * Số yêu cầu thanh toán đang chờ duyệt — hiện thành badge trên
 * link "Duyệt thanh toán".
 *
 * Chỉ gọi MỘT lần khi App mount và chỉ khi là Admin: dự án chưa có
 * hạ tầng polling/websocket, thêm vào là quá tay. Admin vào trang
 * /admin/payments là thấy số mới nhất ở hero stats.
 *
 * Lỗi thì bỏ qua im lặng — badge không quan trọng bằng việc trang
 * vẫn chạy bình thường cho khách.
 */
async function loadPendingPayments() {
  if (!auth.isAdmin) {
    return;
  }

  try {
    const response = await getPaymentRequests({ status: "Pending" });

    const result = response?.data;

    if (result && result.status === "success" && Array.isArray(result.data)) {
      pendingPayments.value = result.data.length;
    }
  } catch (error) {
    console.warn("[App] getPaymentRequests error:", error);
  }
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
// Global decoration
// Không hiển thị trên trang editor/dashboard
// và trang thiệp dành cho khách mời
// --------------------------------------------------

const hiddenRoutes = ["editor", "dashboard", "admin", "preview-bare"];

// Trang thiệp theo link (/{slug}/{token}) — ẩn toàn bộ khung trang
const guestInvitationRoutes = [
  "WeddingByApi",
  "WeddingIntro",
  "WeddingOpen",
  "WeddingBySlug",
];

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
 * Nhóm trang marketing (trang chủ, thư viện mẫu, trang đích
 * SEO, trang giới thiệu mẫu thiệp) — nay dùng chung khung
 * sáng studio với các trang ứng dụng; danh sách này giữ lại
 * làm tham chiếu nhóm trang công khai.
 */
const marketingFrameRoutes = [
  "Home",
  "Templates",
  "TemplatesFeatured",
  "TemplatesModern",
  "TemplatesTraditional",
  "WeddingOnline",
  "CreateInvitation",
  "About",
  "Pricing",
  "Guide",
  "Contact",
  "WeddingIntro",
  "NotFound",
];

const isMarketingFrame = computed(() => {
  return marketingFrameRoutes.includes(route.name);
});

/*
 * Footer liên hệ chỉ hiện trên TRANG BÊN NGOÀI (marketing):
 * trang chủ, thư viện mẫu, trang đích SEO, giới thiệu, bảng
 * giá, hướng dẫn, liên hệ. Vào trong app (quản lý thiệp,
 * editor, admin, profile, thanh toán, thiệp khách mời) thì
 * ẩn — người dùng đang tập trung vào nội dung chính.
 *
 * WeddingIntro tuy là trang công khai nhưng ẩn header theo
 * thiết kế riêng → footer cũng ẩn cho đồng bộ (&& showTopNav).
 */
const showFooter = computed(() => {
  return isMarketingFrame.value && showTopNav.value;
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
 * Rời trang Editor → bản nháp có thể vừa được lưu / xoá,
 * đếm lại số "Thiệp của tôi" cho khớp.
 */
watch(
  () => route.name,
  (name, oldName) => {
    if (oldName === "Editor" && name !== "Editor") {
      loadMyWeddingCount();
    }
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

  // Theme sáng/tối — đọc lựa chọn đã lưu + theo dõi trình duyệt
  theme.init();

  document.addEventListener("click", onDocumentClick);

  window.addEventListener("resize", handleResize);

  loadPendingPayments();

  loadMyWeddingCount();

  /*
   * Xác thực session ở NỀN ngay khi app mở — thay cho việc
   * từng làm trong router guard (guard chờ API xong mới cho
   * chuyển trang → bấm nút nào cũng đứng im chờ server).
   *
   * Không chặn render: trang hiện lên ngay, CheckSession
   * chạy song song. Token chết thì restoreSession tự
   * forceLogout, API của trang đang mở sẽ 401 và interceptor
   * https.js đá về /login.
   *
   * Không cần tải lại badge sau khi xác thực — các loader
   * phía trên đã chạy với token hiện có; token chết thì
   * watch isLoggedIn tự đếm lại bản nháp local.
   */
  if (auth.isLoggedIn && !auth.sessionVerified) {
    auth.restoreSession().then(() => {
      auth.sessionVerified = true;
    });
  }
});

/* Đăng nhập / đăng xuất → tải lại số thiệp cho badge */
watch(
  () => auth.isLoggedIn,
  () => {
    loadMyWeddingCount();
  }
);

/*
 * QUAY LẠI TAB SAU THỜI GIAN DÀI
 *
 * Tab để lâu ở background → trình duyệt freeze timer /
 * discard tab / khôi phục từ bfcache. Dữ liệu trên trang
 * đã stale, token có thể hết hạn giữa chừng. Khi người
 * dùng quay lại:
 *
 *  - Có token → xác thực lại session (CheckSession) —
 *    nếu token đã chết thì forceLogout ngay tại đây,
 *    thay vì để API đầu tiên văng alert 401.
 *  - Tải lại badge số thiệp + thanh toán chờ (Admin).
 *
 * Trang thiệp khách mời (/wedding/..., /:slug) KHÔNG
 * reload cứng — nhạc đang phát, animation đang chạy,
 * reload làm khách mất trải nghiệm. Chỉ các trang app
 * (Manage/Admin/Editor...) mới cần dữ liệu tươi.
 */
useTabResume(() => {
  if (auth.isLoggedIn) {
    /*
     * Xác thực lại session — token có thể đã chết trong
     * lúc tab bị discard. restoreSession tự forceLogout
     * nếu token không còn hợp lệ (guard sẽ đá về login
     * ở lần điều hướng kế tiếp).
     */
    auth.restoreSession().then((valid) => {
      if (!valid) {
        return;
      }

      auth.sessionVerified = true;

      loadMyWeddingCount();
      loadPendingPayments();
    });
  } else {
    loadMyWeddingCount();
  }
});

/*
 * Tự giải phóng bộ nhớ khi trình duyệt bị nặng — theo dõi
 * heap mỗi 30s, vượt ngưỡng thì cắt giảm theo tầng (cache
 * wedding → lịch sử hoàn tác → nháp treo). Xem composable
 * useMemoryGuard để chi tiết từng tầng.
 */
useMemoryGuard();

onBeforeUnmount(() => {
  document.removeEventListener("click", onDocumentClick);

  window.removeEventListener("resize", handleResize);
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
  background: var(--studio-glass-strong, rgba(255, 253, 248, 0.82));
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
   2 MỤC CHÍNH NỔI BẬT — Mẫu thiệp cưới + Thiệp của tôi
   Desktop: pill nổi trên thanh header.
   Mobile: cố định bên dưới header (xem media query).
================================================== */

.quick-nav {
  display: flex;
  align-items: center;

  gap: 8px;

  /*
   * Dồn mọi thứ phía sau (user, nút) sang phải —
   * 2 mục chính luôn nằm sát brand như mobile.
   */
  margin-right: auto;
}

.quick-link {
  display: inline-flex;
  align-items: center;

  gap: 7px;

  min-height: 38px;
  padding: 0 16px;

  border: 1px solid rgba(185, 151, 91, 0.4);
  border-radius: 999px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink, #2b2118);

  font-size: 13px;
  font-weight: 700;

  text-decoration: none;
  white-space: nowrap;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease;
}

.quick-link:hover {
  transform: translateY(-1px);

  border-color: var(--studio-seal, #a63a2e);

  box-shadow: 0 8px 20px rgba(43, 33, 24, 0.1);
}

.quick-link.router-link-active {
  background: linear-gradient(
    135deg,
    var(--studio-seal, #a63a2e),
    #7c2a20
  );

  border-color: transparent;

  color: #fdf6ec;

  box-shadow: 0 10px 24px rgba(166, 58, 46, 0.32);
}

.quick-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 20px;
  height: 20px;
  padding: 0 6px;

  border-radius: 999px;

  background: rgba(255, 255, 255, 0.22);

  color: inherit;

  font-size: 11px;
  font-weight: 700;

  line-height: 1;
}

.quick-link:not(.router-link-active) .quick-count {
  background: var(--studio-seal, #a63a2e);

  color: #fff;
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

/* ==================================================
   HEADER ACTIONS — nhóm nút theme + menu (☰)
   Luôn hiển thị cả desktop lẫn mobile.
================================================== */

.header-actions {
  display: flex;
  align-items: center;

  gap: 8px;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 38px;
  height: 38px;
  flex: 0 0 38px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 10px;

  background: var(--studio-card, #fffdf8);
  color: var(--studio-seal, #a63a2e);

  cursor: pointer;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease;
}

.theme-toggle:hover {
  transform: rotate(20deg) scale(1.06);

  border-color: rgba(185, 151, 91, 0.55);
}

.theme-toggle:active {
  transform: scale(0.92);
}

.nav-toggle {
  display: inline-flex;

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
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.3);
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
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
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
  color: var(--studio-ink-faint, #5c5c70);
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
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
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

/*
 * Badge số yêu cầu thanh toán chờ duyệt.
 * Dùng chung cho header, dropdown và menu di động nên để
 * margin-left tự động đẩy sang phải trong dropdown.
 */
.nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  margin-left: 4px;
  border-radius: 999px;
  background: #a63a2e;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

/* Trong dropdown / menu di động thì đẩy badge sang sát phải */
.dropdown-item .nav-badge,
.mobile-nav-link .nav-badge {
  margin-left: auto;
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

/* Logo thương hiệu (khi BRAND.logo đã điền) — logo ngang 2:1
   nên cần cao hơn chữ đơn thuần mới đọc rõ được */
.brand-logo-img {
  display: block;
  height: 70px;
  width: auto;
  object-fit: contain;
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
  gap: 18px;
}

.nav-link {
  position: relative;
  color: var(--studio-ink-soft, #5c4f43);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
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
   Trang cũ mờ dần + nhích nhẹ lên rồi trang mới trượt
   vào từ dưới — chuyển động một chiều, tự nhiên như
   lật trang. Dùng cubic-bezier khởi động nhanh, hạ
   mềm để cảm giác "mượt" chứ không lề mề.
================================================== */

.page-enter-active {
  transition:
    opacity 0.32s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.page-leave-active {
  transition:
    opacity 0.18s cubic-bezier(0.4, 0, 1, 1),
    transform 0.18s cubic-bezier(0.4, 0, 1, 1);
}

.page-enter-from {
  opacity: 0;

  transform: translateY(18px);
}

.page-leave-to {
  opacity: 0;

  transform: translateY(-10px) scale(0.995);
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
   MENU ☰ — DROPDOWN (desktop) / PANEL TRỞI (mobile)
   Desktop: các link công khai đã rời thanh header,
   chỉ còn 2 mục chính — mọi link khác vào menu này.
================================================== */

.mobile-nav {
  position: absolute;

  top: calc(100% - 1px);

  /* Căn phải theo mép khung nội dung header (1200px) */
  right: max(16px, calc((100% - 1200px) / 2));

  z-index: 30;

  display: flex;

  flex-direction: column;

  gap: 2px;

  min-width: 250px;

  max-height: calc(100dvh - 90px);

  overflow-y: auto;

  padding: 10px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.12));

  border-radius: 14px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 18px 44px rgba(43, 33, 24, 0.18);

  /* Cuộn mượt trên iOS + không ăn thanh cuộn hẹp */
  -webkit-overflow-scrolling: touch;

  overscroll-behavior: contain;
}

.mobile-nav-link {
  display: flex;

  align-items: center;

  gap: 9px;

  padding: 11px 10px;

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

  font-size: 12px;
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

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 768px) {
  .site-header-inner {
    min-height: 60px;
  }

  .brand-logo-img {
    height: 70px;
  }

  /*
   * 2 mục chính trên mobile: thanh cố định ĐÁY màn hình
   * (đã Teleport ra body). Dạng tab bar dọc: icon trên,
   * chữ dưới — bấm dễ bằng ngón tay.
   */
  .quick-nav--bottom {
    position: fixed;

    left: 0;
    right: 0;
    bottom: 0;

    z-index: 45;

    display: flex;

    gap: 8px;

    padding: 8px 12px calc(8px + env(safe-area-inset-bottom));

    background: var(--studio-glass-strong, rgba(255, 253, 248, 0.94));

    backdrop-filter: blur(14px);

    border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.1));
  }

  .quick-nav--bottom .quick-link {
    position: relative;

    flex: 1;
    flex-direction: column;

    justify-content: center;

    gap: 3px;

    min-height: 54px;
    padding: 6px 8px;

    border-radius: 14px;

    font-size: 11px;
    font-weight: 650;

    line-height: 1.2;
  }

  .quick-nav--bottom .quick-link .v-icon {
    font-size: 20px;
  }

  .quick-nav--bottom .quick-count {
    position: absolute;

    top: 4px;
    right: 12px;
  }

  /* Chừa chỗ cho thanh 2 mục chính cố định đáy màn hình */
  .app-root > main,
  .app-root > .mk-page,
  .app-root > .templates-page,
  .app-root > .intro-page,
  .app-root > .manage-page,
  .app-root > .admin-page,
  .app-root > .profile-page,
  .app-root > .auth-page,
  .app-root > .payment-page {
    padding-bottom: calc(78px + env(safe-area-inset-bottom));
  }

  /*
   * Nút lên đầu trang nằm trên thanh 2 mục chính cố định
   * đáy màn hình (cao ~70px) — nâng lên không bị che.
   * Đặt qua biến CSS vì style của nút là scoped: rule
   * :deep() ở đây không có scoped nên bị bỏ qua.
   */
  :root {
    --scroll-top-bottom: calc(88px + env(safe-area-inset-bottom));
  }

  /*
   * Trên mobile: ẩn dải link ngang + khu user,
   * thay bằng nút ☰ mở menu dọc. Nút theme nằm
   * cùng nhóm với nút ☰ nên luôn bấm được.
   */
  .top-nav,
  .auth-area {
    display: none;
  }

  /* Khu user đã ẩn — nhóm nút tự dồn sang phải */
  .header-actions {
    margin-left: auto;
  }

  /* Menu ☰ trên mobile: panel trởi chiếm hết chiều ngang */
  .mobile-nav {
    top: 100%;

    right: 0;

    left: 0;

    min-width: 0;

    /*
     * Menu dài (đăng nhập + Admin có ~12 dòng ≈ 550px) không
     * vừa màn điện thoại (~640px viewport) và còn bị thanh
     * "Mẫu thiệp / Thiệp của tôi" cố định đáy màn che mất nút
     * Đăng xuất. Giới hạn chiều cao = viewport − header −
     * thanh đáy, phần tràn cuộn bên trong panel.
     */
    max-height: calc(100dvh - 60px - 78px - env(safe-area-inset-bottom));

    overflow-y: auto;

    border: 0;

    border-radius: 0 0 14px 14px;

    padding: 10px 16px calc(14px + env(safe-area-inset-bottom));

    background: var(--studio-glass-strong, rgba(255, 253, 248, 0.98));

    backdrop-filter: blur(14px);

    box-shadow: none;
  }

  .global-decoration {
    display: none;
  }

  /* Mobile: nhích ngắn hơn, bỏ scale cho nhẹ GPU */
  .page-enter-active {
    transition:
      opacity 0.26s cubic-bezier(0.22, 1, 0.36, 1),
      transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .page-enter-from {
    transform: translateY(12px);
  }

  .page-leave-to {
    transform: translateY(-6px);
  }
}

/* ==================================================
   ĐIỆN THOẠI NHỎ (≤ 380px)
   --------------------------------------------------
   Brand + hai nút header vừa khít ở 360px; máy 320px thì
   tràn. Thu brand và nút lại một bậc, đồng thời siết đệm
   khung để nội dung không bị bó.
================================================== */

@media (max-width: 380px) {
  .site-header-inner {
    width: calc(100% - 24px);

    gap: 8px;
  }

  .brand {
    gap: 7px;

    font-size: 20px;
  }

  .brand-logo-img {
    height: 60px;
  }

  .brand-mark {
    min-width: 46px;
    height: 28px;

    font-size: 11px;
  }

  .header-actions {
    gap: 6px;
  }

  .theme-toggle {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
  }

  .nav-toggle {
    width: 36px;
    height: 36px;
    flex-basis: 36px;
  }

  .quick-nav--bottom {
    gap: 6px;

    padding-left: 8px;
    padding-right: 8px;
  }

  .quick-nav--bottom .quick-link {
    padding: 6px 4px;

    font-size: 10.5px;
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

/* ==================================================
   CHỐT MÀU CHỮ NÚT — chống reset Vuetify
   --------------------------------------------------
   Bundle CSS đưa style block này vào TRƯỚC vuetify/styles
   (main.js import App.vue trước) nên reset
   [type=button]{color:inherit} của Vuetify đứng SAU với
   CÙNG specificity (0,1,0) → đè mất màu chữ của mọi nút
   button phía trên. Chữ khi đó kế thừa từ body (--text bị
   theme-chungdoi đổi thành mực đen) → dark mode thành chữ
   đen trên nền tối: nút "Thiệp của tôi" ở thanh đáy mobile,
   nút ☰, menu trượt, dropdown tài khoản... Tiền tố button
   nâng specificity lên (0,1,1) — luôn thắng reset, cả hai
   chế độ sáng/tối. Link (<a>) không bị reset nên không cần.
================================================== */
button.quick-link {
  color: var(--studio-ink, #2b2118);
}

button.theme-toggle {
  color: var(--studio-seal, #a63a2e);
}

button.nav-toggle,
button.user-button,
button.dropdown-item,
button.mobile-nav-link {
  color: var(--studio-ink-soft, #5c4f43);
}
</style>

