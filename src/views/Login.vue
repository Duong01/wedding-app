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

        Quay lại
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
          Đăng nhập
        </button>

        <button
          type="button"
          class="auth-tab"
          :class="{ active: mode === 'register' }"
          @click="mode = 'register'"
        >
          Đăng ký
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
        <h1>Chào mừng trở lại</h1>

        <p class="auth-sub">
          Đăng nhập bằng tên đăng nhập hoặc email để quản lý thiệp cưới
          của bạn.
        </p>

        <div class="field">
          <label for="login-email">Tên đăng nhập hoặc Email</label>

          <input
            id="login-email"
            v-model.trim="loginForm.email"
            type="text"
            autocomplete="username"
            placeholder="username hoặc you@example.com"
            required
          />
        </div>

        <div class="field">
          <label for="login-password">Mật khẩu</label>

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
            {{ submitting ? "Đang đăng nhập..." : "Đăng nhập" }}
          </span>
        </button>

        <p class="auth-switch">
          Chưa có tài khoản?

          <button
            type="button"
            class="link-btn"
            @click="mode = 'register'"
          >
            Đăng ký ngay
          </button>
        </p>

        <p class="auth-switch">
          <button
            type="button"
            class="link-btn link-btn-muted"
            @click="mode = 'forgot'"
          >
            Quên mật khẩu?
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
        <h1>Đặt lại mật khẩu</h1>

        <p class="auth-sub">
          Nhập email tài khoản và mật khẩu mới để đặt lại.
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
          <label for="forgot-password">Mật khẩu mới</label>

          <div class="password-wrap">
            <input
              id="forgot-password"
              v-model="forgotForm.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Tối thiểu 6 ký tự"
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
            {{ submitting ? "Đang đặt lại..." : "Đặt lại mật khẩu" }}
          </span>
        </button>

        <p class="auth-switch">
          <button
            type="button"
            class="link-btn"
            @click="mode = 'login'"
          >
            ← Quay lại đăng nhập
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
        <h1>Tạo tài khoản mới</h1>

        <p class="auth-sub">
          Chỉ cần tên đăng nhập và mật khẩu — các thông tin khác tùy chọn.
        </p>

        <div class="field">
          <label for="reg-username">Tên đăng nhập</label>

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
          <label for="reg-email">Email <span class="optional">(không bắt buộc)</span></label>

          <input
            id="reg-email"
            v-model.trim="registerForm.email"
            type="email"
            autocomplete="email"
            placeholder="you@example.com"
          />
        </div>

        <div class="field">
          <label for="reg-fullname">Họ và tên <span class="optional">(không bắt buộc)</span></label>

          <input
            id="reg-fullname"
            v-model.trim="registerForm.fullName"
            type="text"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div class="field">
          <label for="reg-phone">Số điện thoại <span class="optional">(không bắt buộc)</span></label>

          <input
            id="reg-phone"
            v-model.trim="registerForm.phone"
            type="tel"
            placeholder="0912 345 678"
          />
        </div>

        <div class="field">
          <label for="reg-password">Mật khẩu</label>

          <div class="password-wrap">
            <input
              id="reg-password"
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Tối thiểu 6 ký tự"
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
            {{ submitting ? "Đang đăng ký..." : "Đăng ký tài khoản" }}
          </span>
        </button>

        <p class="auth-switch">
          Đã có tài khoản?

          <button
            type="button"
            class="link-btn"
            @click="mode = 'login'"
          >
            Đăng nhập
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
import { computed, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { useWeddingEditorStore } from "@/stores/weddingEditor";
import { ForgotPassword } from "@/model/api";

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

watch(mode, () => {
  errorMessage.value = "";
  successMessage.value = "";
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
  submitting.value = true;

  try {
    await auth.login(loginForm.email, loginForm.password);

    redirectAfterAuth();
  } catch (e) {
    errorMessage.value =
      e?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
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
     * Đăng ký thành công → đăng nhập luôn cho tiện.
     * Lưu ý: backend cho phép đăng nhập bằng Username
     * hoặc Email — nếu không nhập Email thì đăng nhập
     * bằng Username.
     */
    await auth.login(
      registerForm.email || registerForm.username,
      registerForm.password
    );

    redirectAfterAuth();
  } catch (e) {
    errorMessage.value =
      e?.message || "Đăng ký thất bại. Vui lòng thử lại.";
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
        result?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại."
      );
    }

    successMessage.value =
      "Đã đặt lại mật khẩu. Bạn có thể đăng nhập bằng mật khẩu mới.";

    forgotForm.password = "";
  } catch (e) {
    errorMessage.value =
      e?.message || "Đặt lại mật khẩu thất bại. Vui lòng thử lại.";
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
