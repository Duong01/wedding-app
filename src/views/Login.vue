<template>
  <main class="auth-page">
    <div class="page-glow page-glow-1"></div>
    <div class="page-glow page-glow-2"></div>

    <div class="auth-card">
      <!-- =========================================
           BRAND
      ========================================== -->
      <router-link to="/" class="auth-brand">
        <span class="brand-mark">Ngày</span>
        <span class="brand-text">Chung Đôi</span>
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
      <div class="role-hint">
        <span class="role-hint-title">Quyền tài khoản</span>

        <ul>
          <li>
            <strong>Admin</strong> — quản lý tài khoản, phân quyền
          </li>

          <li>
            <strong>User</strong> — tạo và chỉnh sửa thiệp cưới
          </li>

          <li>
            <strong>Guest</strong> — xem thiệp
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, watch } from "vue";
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
   PAGE
================================================== */

.auth-page {
  position: relative;

  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 40px 16px;

  background: #faf7f2;

  overflow: hidden;
}

.page-glow {
  position: absolute;

  width: 420px;

  height: 420px;

  border-radius: 50%;

  filter: blur(90px);

  opacity: 0.35;

  pointer-events: none;
}

.page-glow-1 {
  top: -160px;

  left: -120px;

  background: rgba(201, 166, 107, 0.35);
}

.page-glow-2 {
  bottom: -180px;

  right: -140px;

  background: rgba(180, 80, 100, 0.22);
}

/* ==================================================
   CARD
================================================== */

.auth-card {
  position: relative;

  width: min(440px, 100%);

  padding: 36px 32px 28px;

  border: 1px solid rgba(78, 53, 53, 0.08);

  border-radius: 24px;

  background: #fff;

  box-shadow: 0 30px 80px rgba(80, 50, 50, 0.12);
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

  background: linear-gradient(135deg, #d7b779, #8d4e4d);

  color: #fff;

  font-size: 12px;

  letter-spacing: 0.08em;

  text-transform: uppercase;
}

.brand-text {
  font-family: "Playfair Display", Georgia, serif;

  font-size: 22px;

  font-weight: 700;

  color: #2a1d1d;
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

  background: #f5eee9;
}

.auth-tab {
  padding: 10px 0;

  border: 0;

  border-radius: 10px;

  background: transparent;

  color: #6d5a5a;

  font-size: 13.5px;

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.auth-tab.active {
  background: #fff;

  color: #8f4d43;

  box-shadow: 0 4px 14px rgba(80, 50, 50, 0.1);
}

/* ==================================================
   FORM
================================================== */

.auth-form h1 {
  margin: 0 0 6px;

  color: #2a1d1d;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 24px;
}

.auth-sub {
  margin: 0 0 22px;

  color: #6d5a5a;

  font-size: 13.5px;

  line-height: 1.6;
}

.field {
  margin-bottom: 15px;
}

.field label {
  display: block;

  margin-bottom: 6px;

  color: #4e3636;

  font-size: 12.5px;

  font-weight: 600;
}

.field input {
  width: 100%;

  padding: 11px 14px;

  border: 1px solid rgba(78, 53, 53, 0.16);

  border-radius: 12px;

  background: #fffdfb;

  color: #2a1d1d;

  font-size: 14px;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field input:focus {
  border-color: #8f4d43;

  box-shadow: 0 0 0 3px rgba(143, 77, 67, 0.12);
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

  color: #9a8484;

  cursor: pointer;
}

.toggle-password:hover {
  background: #f7f0ec;

  color: #8f4d43;
}

/* ==================================================
   ERROR / SUBMIT
================================================== */

.optional {
  color: #9a8484;

  font-weight: 400;
}

.auth-error {
  display: flex;

  align-items: center;

  gap: 7px;

  margin: 0 0 14px;

  padding: 10px 13px;

  border-radius: 10px;

  background: rgba(198, 40, 40, 0.08);

  color: #c62828;

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

  background: linear-gradient(135deg, #8f4d43, #6d3a34);

  color: #fff;

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

  box-shadow: 0 12px 28px rgba(109, 58, 52, 0.28);
}

.auth-submit:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}

.auth-switch {
  margin: 18px 0 0;

  color: #6d5a5a;

  font-size: 13px;

  text-align: center;
}

.link-btn {
  border: 0;

  padding: 0;

  background: transparent;

  color: #8f4d43;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;
}

.link-btn:hover {
  text-decoration: underline;
}

.link-btn-muted {
  font-weight: 500;

  color: #9a8484;
}

.auth-success {
  display: flex;

  align-items: center;

  gap: 7px;

  margin: 0 0 14px;

  padding: 10px 13px;

  border-radius: 10px;

  background: rgba(46, 125, 50, 0.08);

  color: #2e7d32;

  font-size: 13px;
}

/* ==================================================
   ROLE HINT
================================================== */

.role-hint {
  margin-top: 26px;

  padding: 14px 16px;

  border: 1px dashed rgba(143, 77, 67, 0.3);

  border-radius: 14px;

  background: rgba(143, 77, 67, 0.04);
}

.role-hint-title {
  display: block;

  margin-bottom: 8px;

  color: #8f4d43;

  font-size: 11px;

  font-weight: 700;

  letter-spacing: 0.12em;

  text-transform: uppercase;
}

.role-hint ul {
  margin: 0;

  padding: 0;

  list-style: none;
}

.role-hint li {
  color: #6d5a5a;

  font-size: 12.5px;

  line-height: 1.8;
}

.role-hint strong {
  color: #4e3636;
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
