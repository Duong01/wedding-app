<template>
  <main class="auth-page">
    <div class="page-glow page-glow-1"></div>
    <div class="page-glow page-glow-2"></div>

    <div class="auth-card">
      <!-- =========================================
           BACK
      ========================================== -->
      <button
        v-if="!isEmbedded"
        type="button"
        class="back-btn"
        @click="goBack"
      >
        <v-icon size="16"> mdi-arrow-left </v-icon>

        {{ $t('login.back') }}
      </button>

      <!-- =========================================
           BRAND
      ========================================== -->
      <router-link to="/" class="auth-brand">
        <span class="brand-mark">Thiệp</span>
        <span class="brand-text">Duyên</span>
      </router-link>

      <!-- =========================================
           TABS
      ========================================== -->
      <div class="auth-tabs">
        <button
          type="button"
          class="auth-tab"
          :class="{ active: mode === 'login' }"
          @click="mode = 'login'"
        >
          {{ $t('auth.login') }}
        </button>

        <button
          type="button"
          class="auth-tab"
          :class="{ active: mode === 'register' }"
          @click="mode = 'register'"
        >
          {{ $t('auth.register') }}
        </button>
      </div>

      <!-- =========================================
           LOGIN FORM
      ========================================== -->
      <form
        v-if="mode === 'login'"
        class="auth-form"
        @submit.prevent="submitLogin"
      >
        <h1>{{ $t('login.welcome') }}</h1>

        <p class="auth-sub">
          {{ $t('login.sub') }}
        </p>

        <div class="field">
          <label for="login-email">{{ $t('login.identifier') }}</label>

          <input
            id="login-email"
            v-model.trim="loginForm.email"
            type="text"
            autocomplete="username"
            :placeholder="$t('login.identifierPlaceholder')"
            required
          />
        </div>

        <div class="field">
          <label for="login-password">{{ $t('login.password') }}</label>

          <div class="password-wrap">
            <input
              id="login-password"
              v-model="loginForm.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              required
            />

            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <v-icon size="18">
                {{ showPassword ? "mdi-eye-off-outline" : "mdi-eye-outline" }}
              </v-icon>
            </button>
          </div>
        </div>

        <p v-if="errorMessage" class="auth-error">
          <v-icon size="15"> mdi-alert-circle-outline </v-icon>
          {{ errorMessage }}
        </p>

        <!-- Vừa đăng ký xong → nhắc đăng nhập -->
        <p v-if="successMessage" class="auth-success">
          <v-icon size="15"> mdi-check-circle-outline </v-icon>
          {{ successMessage }}
        </p>

        <button
          type="submit"
          class="auth-submit"
          :disabled="submitting"
        >
          <v-progress-circular
            v-if="submitting"
            indeterminate
            size="16"
            width="2"
          />

          <span>
            {{ submitting ? $t('login.loggingIn') : $t('auth.login') }}
          </span>
        </button>

        <!-- Đăng nhập bằng Google -->
        <div class="auth-divider">
          <span>{{ $t('login.googleOr') }}</span>
        </div>

        <!--
          Nút Google CHÍNH THỨC (renderButton) — GIS tự vẽ,
          bấm luôn mở được hộp chọn tài khoản (không phụ thuộc
          One Tap / FedCM như prompt()).

          GIS chỉ vẽ khi origin hiện tại đã đăng ký trong
          Google Console — chưa đăng ký thì im lặng không vẽ
          gì, nên giữ nút dự phòng bên dưới.
        -->
        <div
          v-show="googleButtonReady"
          id="google-btn"
          class="google-btn-host"
        ></div>

        <!--
          Nút dự phòng — hiện khi nút chính thức chưa vẽ xong
          hoặc bị GIS từ chối (origin chưa đăng ký / mất mạng).
          Bấm thử vẽ lại; vẫn không được thì báo lỗi rõ ràng.
        -->
        <button
          v-if="!googleButtonReady"
          type="button"
          class="google-btn"
          :disabled="googleSubmitting"
          @click="retryGoogleButton"
        >
          <v-progress-circular
            v-if="googleSubmitting"
            indeterminate
            size="16"
            width="2"
          />

          <svg
            v-else
            class="google-logo"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.861-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>

          <span>{{ $t('login.google') }}</span>
        </button>

        <p class="auth-switch">
          {{ $t('login.noAccount') }}

          <button
            type="button"
            class="link-btn"
            @click="mode = 'register'"
          >
            {{ $t('login.registerNow') }}
          </button>
        </p>

        <p class="auth-switch">
          <button
            type="button"
            class="link-btn link-btn-muted"
            @click="mode = 'forgot'"
          >
            {{ $t('login.forgot') }}
          </button>
        </p>
      </form>

      <!-- =========================================
           FORGOT PASSWORD FORM
      ========================================== -->
      <form
        v-else-if="mode === 'forgot'"
        class="auth-form"
        @submit.prevent="submitForgot"
      >
        <h1>{{ $t('login.resetTitle') }}</h1>

        <p class="auth-sub">
          {{ $t('login.resetSub') }}
        </p>

        <div class="field">
          <label for="forgot-email">Email</label>

          <input
            id="forgot-email"
            v-model.trim="forgotForm.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div class="field">
          <label for="forgot-password">{{ $t('login.newPassword') }}</label>

          <div class="password-wrap">
            <input
              id="forgot-password"
              v-model="forgotForm.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              :placeholder="$t('login.minChars')"
              minlength="6"
              required
            />

            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <v-icon size="18">
                {{ showPassword ? "mdi-eye-off-outline" : "mdi-eye-outline" }}
              </v-icon>
            </button>
          </div>
        </div>

        <p
          v-if="errorMessage"
          class="auth-error"
        >
          <v-icon size="15"> mdi-alert-circle-outline </v-icon>
          {{ errorMessage }}
        </p>

        <p
          v-if="successMessage"
          class="auth-success"
        >
          <v-icon size="15"> mdi-check-circle-outline </v-icon>
          {{ successMessage }}
        </p>

        <button
          type="submit"
          class="auth-submit"
          :disabled="submitting"
        >
          <v-progress-circular
            v-if="submitting"
            indeterminate
            size="16"
            width="2"
          />

          <span>
            {{ submitting ? $t('login.resetting') : $t('login.resetTitle') }}
          </span>
        </button>

        <p class="auth-switch">
          <button
            type="button"
            class="link-btn"
            @click="mode = 'login'"
          >
            {{ $t('login.backToLogin') }}
          </button>
        </p>
      </form>

      <!-- =========================================
           REGISTER FORM
      ========================================== -->
      <form
        v-else
        class="auth-form"
        @submit.prevent="submitRegister"
      >
        <h1>{{ $t('login.createTitle') }}</h1>

        <p class="auth-sub">
          {{ $t('login.createSub') }}
        </p>

        <div class="field">
          <label for="reg-username">{{ $t('login.username') }}</label>

          <input
            id="reg-username"
            v-model.trim="registerForm.username"
            type="text"
            autocomplete="username"
            placeholder="ten_dang_nhap"
            required
          />
        </div>

        <div class="field">
          <!-- <label for="reg-email">Email <span class="optional">{{ $t('login.optional') }}</span></label> -->
          <label for="reg-email">Email</label>

          <input
            id="reg-email"
            v-model.trim="registerForm.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div class="field">
          <!-- <label for="reg-fullname">{{ $t('login.fullName') }} <span class="optional">{{ $t('login.optional') }}</span></label> -->
          <label for="reg-fullname">{{ $t('login.fullName') }}</label>

          <input
            id="reg-fullname"
            v-model.trim="registerForm.fullName"
            type="text"
            :placeholder="$t('login.namePlaceholder')"
            required
          />
        </div>

        <div class="field">
          <!-- <label for="reg-phone">{{ $t('login.phone') }} <span class="optional">{{ $t('login.optional') }}</span></label> -->
          <label for="reg-phone">{{ $t('login.phone') }}</label>

          <input
            id="reg-phone"
            v-model.trim="registerForm.phone"
            type="tel"
            placeholder="0912 345 678"
            required
          />
        </div>

        <div class="field">
          <label for="reg-password">{{ $t('login.password') }}</label>

          <div class="password-wrap">
            <input
              id="reg-password"
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              :placeholder="$t('login.minChars')"
              minlength="6"
              required
            />

            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <v-icon size="18">
                {{ showPassword ? "mdi-eye-off-outline" : "mdi-eye-outline" }}
              </v-icon>
            </button>
          </div>
        </div>

        <p v-if="errorMessage" class="auth-error">
          <v-icon size="15"> mdi-alert-circle-outline </v-icon>
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="auth-submit"
          :disabled="submitting"
        >
          <v-progress-circular
            v-if="submitting"
            indeterminate
            size="16"
            width="2"
          />

          <span>
            {{ submitting ? $t('login.registering') : $t('login.registerSubmit') }}
          </span>
        </button>

        <p class="auth-switch">
          {{ $t('login.haveAccount') }}

          <button
            type="button"
            class="link-btn"
            @click="mode = 'login'"
          >
            {{ $t('auth.login') }}
          </button>
        </p>
      </form>

      <!-- =========================================
           ROLE HINT
      ========================================== -->
    </div>
  </main>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { useWeddingEditorStore } from "@/stores/weddingEditor";
import { ForgotPassword } from "@/model/api";

const { t } = useI18n();

defineOptions({
  name: "AuthLogin",
});

const router = useRouter();
const route = useRoute();

const auth = useAuthStore();

const editorStore = useWeddingEditorStore();

/* =========================================================
   STATE
========================================================= */

const mode = ref("login");

/*
 * Đến từ nút "Lưu thiệp" trong Editor (có redirect)
 * → không hiện nút quay lại để tránh vòng lặp
 * Editor → Login → Editor.
 */
const isEmbedded = computed(() => {
  return Boolean(route.query.redirect);
});

function goBack() {
  if (window.history.length > 1) {
    router.back();

    return;
  }

  router.push({ name: "Home" });
}

const showPassword = ref(false);
const submitting = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

/* =========================================================
   GOOGLE LOGIN (Google Identity Services)
   - Nạp script https://accounts.google.com/gsi/client
   - Render nút Google CHÍNH THỨC bằng renderButton() ngay
     khi vào trang (theo mẫu đăng nhập WebPhim) — bấm nút
     mở hộp chọn tài khoản Google → nhận id_token
     (credential) → gửi lên backend /AccountApi/GoogleLogin.
   - KHÔNG dùng google.accounts.id.prompt() (One Tap): hay
     bị chặn (cooldown sau khi người dùng đóng, FedCM tắt,
     /gsi/status 403...) khiến bấm nút mà không có gì xảy ra.
========================================================= */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const googleSubmitting = ref(false);

/*
 * Nút chính thức (renderButton) chỉ được GIS vẽ khi origin
 * hiện tại đã đăng ký trong Google Console. Chưa đăng ký /
 * mất mạng → GIS im lặng không vẽ gì → phải có nút dự phòng.
 */
const googleButtonReady = ref(false);
const googleButtonFailed = ref(false);
let googleScriptPromise = null;

function loadGoogleScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");

    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = resolve;
    script.onerror = () => {
      googleScriptPromise = null;
      reject(new Error(t("login.googleFailed")));
    };

    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

/*
 * initialize() chỉ được gọi 1 lần — GIS ném lỗi
 * "IdpFrameInitialized" nếu gọi lại.
 */
function initGoogleClient() {
  /*
   * Callback bọc qua window: initialize() chỉ được gọi 1 lần
   * nhưng component có thể bị dựng lại (HMR, quay lại trang) —
   * wrapper luôn trỏ tới handler mới nhất.
   */
  window.__googleCredentialHandler = onGoogleCredential;

  if (window.__googleIdInitialized) {
    return;
  }

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (response) => window.__googleCredentialHandler?.(response),
  });

  window.__googleIdInitialized = true;
}

/*
 * Render nút Google chính thức vào div #google-btn.
 * renderButton luôn mở được account picker khi bấm —
 * không phụ thuộc FedCM / prompt().
 */
async function renderGoogleButton() {
  const host = document.getElementById("google-btn");

  if (!host || !window.google?.accounts?.id) {
    googleButtonFailed.value = true;
    return;
  }

  googleButtonFailed.value = false;

  window.google.accounts.id.renderButton(host, {
    type: "standard",
    theme: "outline",
    size: "large",
    shape: "pill",
    text: "signin_with",
    logo_alignment: "center",
    width: 320,
  });

  /*
   * GIS không có callback lỗi cho renderButton — origin chưa
   * đăng ký thì nó im lặng không vẽ. Đợi rồi kiểm tra iframe
   * bên trong: có iframe = nút đã hiện; không = bật nút dự phòng.
   */
  await new Promise((resolve) => setTimeout(resolve, 1200));

  googleButtonReady.value = !!host.querySelector("iframe");

  if (!googleButtonReady.value) {
    googleButtonFailed.value = true;
  }
}

onMounted(async () => {
  if (!GOOGLE_CLIENT_ID) {
    console.warn("[Login] Thiếu VITE_GOOGLE_CLIENT_ID — bỏ qua nút Google.");
    googleButtonFailed.value = true;
    return;
  }

  try {
    await loadGoogleScript();

    initGoogleClient();

    await renderGoogleButton();
  } catch (e) {
    console.warn("[Login] Không tải được Google GIS:", e?.message);
    googleButtonFailed.value = true;
  }
});

/*
 * Nút dự phòng: thử vẽ lại nút chính thức (có thể mạng vừa
 * hồi). Vẫn không được thì báo lỗi rõ ràng thay vì im lặng.
 */
async function retryGoogleButton() {
  if (googleSubmitting.value) {
    return;
  }

  googleSubmitting.value = true;
  errorMessage.value = "";

  try {
    await loadGoogleScript();
    initGoogleClient();
    await renderGoogleButton();
  } catch (e) {
    console.warn("[Login] retryGoogleButton:", e?.message);
  } finally {
    googleSubmitting.value = false;
  }

  if (!googleButtonReady.value) {
    errorMessage.value = t("login.googleUnavailable");
  }
}

function onGoogleCredential(response) {
  /*
   * response.credential = id_token (JWT) — backend
   * xác thực qua oauth2.googleapis.com/tokeninfo.
   */
  if (!response?.credential) {
    errorMessage.value = t("login.googleFailed");
    return;
  }

  googleSubmitting.value = true;

  auth
    .loginWithGoogle(response.credential)
    .then(() => {
      /* Thông báo đăng nhập thành công trước khi rời trang */
      successMessage.value = t("login.success");

      redirectAfterAuth();
    })
    .catch((e) => {
      errorMessage.value = e?.message || t("login.googleFailed");
    })
    .finally(() => {
      googleSubmitting.value = false;
    });
}

const loginForm = reactive({
  email: "",
  password: "",
});

const registerForm = reactive({
  username: "",
  email: "",
  fullName: "",
  phone: "",
  password: "",
});

const forgotForm = reactive({
  email: "",
  password: "",
});

watch(mode, async (value) => {
  errorMessage.value = "";
  successMessage.value = "";

  /* Quay lại tab Đăng nhập → render lại nút Google (div bị dựng lại) */
  if (value === "login") {
    await nextTick();

    renderGoogleButton();
  }
});

/* =========================================================
   SUBMIT
========================================================= */

function redirectAfterAuth() {
  const redirect = route.query.redirect;

  if (typeof redirect === "string" && redirect.startsWith("/")) {
    router.push(redirect);

    return;
  }

  /*
   * Đang có bản nháp thiệp trong Editor Store
   * (vào /login từ nút "Lưu thiệp") → quay lại
   * Editor để tiếp tục, dữ liệu không mất.
   */
  if (editorStore.wedding) {
    router.push({
      name: "Editor",
      query: {
        theme: editorStore.wedding.theme?.Name || undefined,
        slug: editorStore.wedding.slug || undefined,
      },
    });

    return;
  }

  router.push({ name: "Manage" });
}

async function submitLogin() {
  if (submitting.value) {
    return;
  }

  errorMessage.value = "";
  successMessage.value = "";
  submitting.value = true;

  try {
    await auth.login(loginForm.email, loginForm.password);

    /* Thông báo đăng nhập thành công trước khi rời trang */
    successMessage.value = t("login.success");

    redirectAfterAuth();
  } catch (e) {
    errorMessage.value =
      e?.message || t("login.loginFailed");
  } finally {
    submitting.value = false;
  }
}

async function submitRegister() {
  if (submitting.value) {
    return;
  }

  errorMessage.value = "";
  submitting.value = true;

  try {
    await auth.register({
      Username: registerForm.username,
      Email: registerForm.email || null,
      FullName: registerForm.fullName || null,
      Phone: registerForm.phone || null,
      Password: registerForm.password,
    });

    /*
     * Đăng ký thành công → chuyển sang form đăng nhập để
     * người dùng tự đăng nhập (không đăng nhập hộ). Điền
     * sẵn Email (hoặc Username nếu không nhập Email —
     * backend nhận cả hai), mật khẩu để trống.
     *
     * ?redirect giữ nguyên trên URL nên đăng nhập xong vẫn
     * quay về đúng chỗ (vd. Editor khi bấm "Lưu thiệp").
     */
    const loginName = registerForm.email || registerForm.username;

    mode.value = "login";

    /* watch(mode) xoá thông báo khi đổi tab — đặt sau lượt đó */
    await nextTick();

    loginForm.email = loginName;
    loginForm.password = "";

    registerForm.password = "";

    successMessage.value = t("login.registered");
  } catch (e) {
    errorMessage.value =
      e?.message || t("login.registerFailed");
  } finally {
    submitting.value = false;
  }
}

/*
 * Quên mật khẩu: backend cập nhật theo Email
 * (ForgotPassword — [AllowAnonymous], không cần token).
 */
async function submitForgot() {
  if (submitting.value) {
    return;
  }

  errorMessage.value = "";
  successMessage.value = "";
  submitting.value = true;

  try {
    const response = await ForgotPassword({
      Email: forgotForm.email,
      Password: forgotForm.password,
    });

    const result = response?.data;

    if (!result || result.status !== "success") {
      throw new Error(
        result?.message || t("login.resetFailed")
      );
    }

    successMessage.value =
      t("login.resetDone");

    forgotForm.password = "";
  } catch (e) {
    errorMessage.value =
      e?.message || t("login.resetFailed");
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
/* ==================================================
   PAGE — chrome chung (page-glow, back-btn) đã gom vào
   app.css; form giữ style cục bộ.
================================================== */

.auth-page {
  position: relative;

  min-height: 100vh;
  min-height: 100dvh;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 40px 16px;

  background:
    radial-gradient(circle at 12% 8%, rgba(185, 151, 91, 0.16), transparent 34%),
    radial-gradient(circle at 88% 92%, rgba(166, 58, 46, 0.08), transparent 36%),
    var(--studio-paper, #f7f1e6);

  overflow: hidden;
}

/* ==================================================
   CARD
================================================== */

.auth-card {
  position: relative;

  width: min(440px, 100%);

  padding: 36px 32px 28px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 24px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 30px 80px rgba(43, 33, 24, 0.12);
}

.back-btn {
  margin-bottom: 18px;

  padding: 8px 15px;

  font-size: 12.5px;
}

.auth-brand {
  display: inline-flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 22px;

  text-decoration: none;
}

.brand-mark {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-width: 56px;

  height: 32px;

  border-radius: 999px;

  background: linear-gradient(135deg, var(--studio-foil, #b9975b), var(--studio-seal, #a63a2e));

  color: #fdf6ec;

  font-size: 12px;

  letter-spacing: 0.08em;

  text-transform: uppercase;
}

.brand-text {
  font-family: var(--font-heading);

  font-size: 22px;

  font-weight: 700;

  color: var(--studio-ink, #2b2118);
}

/* ==================================================
   TABS
================================================== */

.auth-tabs {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 6px;

  padding: 5px;

  margin-bottom: 24px;

  border-radius: 14px;

  background: var(--studio-paper-deep, #efe6d4);
}

.auth-tab {
  padding: 10px 0;

  border: 0;

  border-radius: 10px;

  background: transparent;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13.5px;

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.auth-tab.active {
  background: var(--studio-card, #fffdf8);

  color: var(--studio-seal, #a63a2e);

  box-shadow: 0 4px 14px rgba(43, 33, 24, 0.12);
}

/* ==================================================
   FORM
================================================== */

.auth-form h1 {
  margin: 0 0 6px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);

  font-size: 24px;
}

.auth-sub {
  margin: 0 0 22px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13.5px;

  line-height: 1.6;
}

.field {
  margin-bottom: 15px;
}

.field label {
  display: block;

  margin-bottom: 6px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 12.5px;

  font-weight: 600;
}

.field input {
  width: 100%;

  padding: 11px 14px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 12px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink, #2b2118);

  font-size: 14px;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field input:focus {
  border-color: var(--studio-foil, #b9975b);

  box-shadow: 0 0 0 3px var(--studio-foil-soft, rgba(185, 151, 91, 0.16));
}

.field-row {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 12px;
}

.password-wrap {
  position: relative;
}

.password-wrap input {
  padding-right: 44px;
}

.toggle-password {
  position: absolute;

  top: 50%;

  right: 6px;

  transform: translateY(-50%);

  display: flex;

  align-items: center;

  justify-content: center;

  width: 34px;

  height: 34px;

  border: 0;

  border-radius: 9px;

  background: transparent;

  color: var(--studio-ink-faint, #8a7a68);

  cursor: pointer;
}

.toggle-password:hover {
  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  color: var(--studio-ink, #2b2118);
}

/* ==================================================
   ERROR / SUBMIT
================================================== */

.optional {
  color: var(--studio-ink-faint, #8a7a68);

  font-weight: 400;
}

.auth-error {
  display: flex;

  align-items: center;

  gap: 7px;

  margin: 0 0 14px;

  padding: 10px 13px;

  border-radius: 10px;

  background: var(--app-danger-soft, rgba(160, 48, 48, 0.1));

  color: var(--app-danger, #a03030);

  font-size: 13px;
}

.auth-submit {
  width: 100%;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  padding: 13px 0;

  border: 0;

  border-radius: 999px;

  background: linear-gradient(135deg, var(--studio-seal, #a63a2e), #7c2a20);

  color: #fdf6ec;

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.auth-submit:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 12px 28px rgba(166, 58, 46, 0.28);
}

.auth-submit:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}

/* ==================================================
   GOOGLE LOGIN
================================================== */

.auth-divider {
  display: flex;

  align-items: center;

  gap: 12px;

  margin: 18px 0 14px;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12.5px;
}

.auth-divider::before,
.auth-divider::after {
  content: "";

  flex: 1;

  height: 1px;

  background: var(--studio-line, rgba(43, 33, 24, 0.14));
}

/*
 * Nút Google chính thức (renderButton) — GIS tự vẽ iframe
 * bên trong. Chỉ cần căn giữa + đủ chỗ cho nút pill 320px.
 */
.google-btn-host {
  display: flex;

  justify-content: center;

  width: 100%;

  min-height: 44px;
}

/* Nút dự phòng khi GIS chưa vẽ được nút chính thức */
.google-btn {
  width: 100%;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  padding: 12px 0;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 999px;

  background: var(--studio-card, #fffdf8);

  color: var(--studio-ink, #2b2118);

  font-size: 14px;

  font-weight: 600;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.google-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 10px 24px rgba(43, 33, 24, 0.12);
}

.google-btn:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}

.google-logo {
  width: 18px;

  height: 18px;

  flex-shrink: 0;
}

.auth-switch {
  margin: 18px 0 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13px;

  text-align: center;
}

.link-btn {
  border: 0;

  padding: 0;

  background: transparent;

  color: var(--studio-seal, #a63a2e);

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;
}

.link-btn:hover {
  text-decoration: underline;
}

.link-btn-muted {
  font-weight: 500;

  color: var(--studio-ink-faint, #8a7a68);
}

.auth-success {
  display: flex;

  align-items: center;

  gap: 7px;

  margin: 0 0 14px;

  padding: 10px 13px;

  border-radius: 10px;

  background: var(--app-ok-soft, rgba(46, 107, 63, 0.1));

  color: var(--app-ok, #2e6b3f);

  font-size: 13px;
}

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 480px) {
  .auth-card {
    padding: 28px 20px 22px;
  }

  .field-row {
    grid-template-columns: 1fr;

    gap: 0;
  }
}
</style>
