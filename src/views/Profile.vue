<template>
  <main class="profile-page">
    <div class="page-glow page-glow-1"></div>
    <div class="page-glow page-glow-2"></div>

    <section class="container profile-content">
      <!-- =====================================================
           BACK TO MANAGE
      ====================================================== -->
      <div class="back-row">
        <button type="button" class="back-btn" @click="goBack">
          <v-icon size="16"> mdi-arrow-left </v-icon>

          Quay lại
        </button>
      </div>

      <!-- =====================================================
           CARD: AVATAR + INFO
      ====================================================== -->
      <div class="profile-card">
        <div class="profile-head">
          <div class="avatar-wrap">
            <img
              v-if="form.Avatar && !avatarBroken"
              :src="form.Avatar"
              :alt="auth.displayName"
              @error="avatarBroken = true"
            />

            <span v-else class="avatar-fallback">
              {{ userInitial }}
            </span>
          </div>

          <div class="head-info">
            <h1>{{ auth.displayName }}</h1>

            <span
              class="role-badge"
              :class="`role-${auth.currentRole.toLowerCase()}`"
            >
              {{ auth.roleLabel }}
            </span>

            <p class="head-email">{{ auth.user?.Email || auth.user?.Username }}</p>
          </div>
        </div>

        <!-- =====================================================
             FORM
        ====================================================== -->
        <form class="profile-form" @submit.prevent="submitProfile">
          <h2>Thông tin cá nhân</h2>

          <div class="field-row">
            <div class="field">
              <label for="pf-fullname">Họ và tên</label>

              <input
                id="pf-fullname"
                v-model.trim="form.FullName"
                type="text"
              />
            </div>

            <div class="field">
              <label for="pf-username">Tên đăng nhập</label>

              <input
                id="pf-username"
                :value="auth.user?.Username || ''"
                type="text"
                disabled
              />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="pf-email">Email</label>

              <input
                id="pf-email"
                v-model.trim="form.Email"
                type="email"
              />
            </div>

            <div class="field">
              <label for="pf-phone">Số điện thoại</label>

              <input
                id="pf-phone"
                v-model.trim="form.Phone"
                type="tel"
              />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="pf-avatar">Link ảnh đại diện</label>

              <input
                id="pf-avatar"
                v-model.trim="form.Avatar"
                type="url"
                placeholder="https://..."
              />
            </div>
          </div>

          <h2>Đổi mật khẩu</h2>

          <p class="hint">
            Để trống mật khẩu mới nếu không muốn đổi. Chỉ cần nhập mật khẩu
            hiện tại khi muốn đổi mật khẩu.
          </p>

          <div class="field-row">
            <div class="field">
              <label for="pf-oldpass">Mật khẩu hiện tại</label>

              <input
                id="pf-oldpass"
                v-model="form.PasswordOld"
                type="password"
                autocomplete="current-password"
              />
            </div>

            <div class="field">
              <label for="pf-newpass">Mật khẩu mới</label>

              <input
                id="pf-newpass"
                v-model="form.Password"
                type="password"
                autocomplete="new-password"
                placeholder="Để trống nếu giữ nguyên"
              />
            </div>
          </div>

          <p v-if="message" class="form-message" :class="{ error: messageError }">
            {{ message }}
          </p>

          <button
            type="submit"
            class="save-btn"
            :disabled="saving"
          >
            <v-progress-circular
              v-if="saving"
              indeterminate
              size="15"
              width="2"
            />

            <v-icon v-else size="17"> mdi-content-save-outline </v-icon>

            {{ saving ? "Đang lưu..." : "Lưu thay đổi" }}
          </button>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import { UpdateProfile } from "@/model/api";

defineOptions({
  name: "Profile",
});

const router = useRouter();

const auth = useAuthStore();

function goBack() {
  if (window.history.length > 1) {
    router.back();

    return;
  }

  router.push({ name: "Home" });
}

/* =========================================================
   STATE
========================================================= */

const avatarBroken = ref(false);
const saving = ref(false);
const message = ref("");
const messageError = ref(false);

const form = reactive({
  FullName: auth.user?.FullName || "",
  Email: auth.user?.Email || "",
  Phone: auth.user?.Phone || "",
  Avatar: auth.user?.Avatar || "",
  Password: "",
  PasswordOld: "",
});

const userInitial = computed(() => {
  const name = auth.displayName || "";

  return name.charAt(0).toUpperCase();
});

/* =========================================================
   SUBMIT
========================================================= */

function showMessage(text, isError = false) {
  message.value = text;
  messageError.value = isError;

  window.clearTimeout(showMessage.timer);

  showMessage.timer = window.setTimeout(() => {
    message.value = "";
    messageError.value = false;
  }, 3200);
}

async function submitProfile() {
  if (saving.value) {
    return;
  }

  if (form.Password && !form.PasswordOld) {
    showMessage("Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu.", true);

    return;
  }

  saving.value = true;

  try {
    const response = await UpdateProfile({
      FullName: form.FullName,
      Email: form.Email,
      Phone: form.Phone,
      Avatar: form.Avatar,
      Password: form.Password,
      PasswordOld: form.PasswordOld,
    });

    const result = response?.data;

    if (!result || result.status !== "success") {
      throw new Error(result?.message || "Không thể lưu thông tin.");
    }

    /*
     * Cập nhật lại store + localStorage.
     */
    auth.user = {
      ...auth.user,
      FullName: form.FullName,
      Email: form.Email,
      Phone: form.Phone,
      Avatar: form.Avatar,
    };

    auth.persist();

    form.Password = "";
    form.PasswordOld = "";

    showMessage("Đã lưu thông tin cá nhân.");
  } catch (e) {
    console.error("[Profile] update error:", e);

    showMessage(
      e?.response?.data?.message ||
        e?.message ||
        "Không thể lưu thông tin.",
      true
    );
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
/* ==================================================
   PAGE — chrome chung (page-glow, back-btn, role-badge)
   đã gom vào app.css.
================================================== */

.profile-page {
  position: relative;

  min-height: 100vh;

  background: var(--studio-paper, #f7f1e6);

  overflow: hidden;

  padding: 48px 0 80px;
}

.container {
  width: min(760px, calc(100% - 32px));

  margin: 0 auto;
}

/* ==================================================
   BACK ROW
================================================== */

.back-row {
  padding-top: 20px;

  margin-bottom: 14px;
}

/* ==================================================
   CARD
================================================== */

.profile-card {
  padding: 34px 34px 30px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));

  border-radius: 24px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 24px 60px rgba(43, 33, 24, 0.1);
}

.profile-head {
  display: flex;

  align-items: center;

  gap: 18px;

  padding-bottom: 24px;

  margin-bottom: 26px;

  border-bottom: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
}

.avatar-wrap {
  width: 76px;

  height: 76px;

  flex-shrink: 0;

  border-radius: 50%;

  overflow: hidden;

  background: var(--studio-foil-soft, rgba(185, 151, 91, 0.16));

  display: flex;

  align-items: center;

  justify-content: center;
}

.avatar-wrap img {
  width: 100%;

  height: 100%;

  object-fit: cover;
}

.avatar-fallback {
  color: var(--app-gold-text, #8a6a2f);

  font-family: var(--font-heading);

  font-size: 30px;

  font-weight: 700;
}

.head-info h1 {
  margin: 0 0 6px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);

  font-size: 24px;
}

.head-email {
  margin: 6px 0 0;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13.5px;
}

/* ==================================================
   FORM
================================================== */

.profile-form h2 {
  margin: 0 0 14px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);

  font-size: 18px;
}

.hint {
  margin: -6px 0 14px;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12.5px;

  line-height: 1.6;
}

.field-row {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 14px;
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

.field input:disabled {
  background: var(--studio-paper-deep, #efe6d4);

  color: var(--studio-ink-faint, #8a7a68);

  cursor: not-allowed;
}

.form-message {
  margin: 4px 0 14px;

  padding: 10px 13px;

  border-radius: 10px;

  background: var(--app-ok-soft, rgba(46, 107, 63, 0.1));

  color: var(--app-ok, #2e6b3f);

  font-size: 13px;
}

.form-message.error {
  background: var(--app-danger-soft, rgba(160, 48, 48, 0.1));

  color: var(--app-danger, #a03030);
}

.save-btn {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 12px 24px;

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

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 12px 28px rgba(166, 58, 46, 0.28);
}

.save-btn:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 600px) {
  .profile-card {
    padding: 26px 20px;
  }

  .field-row {
    grid-template-columns: 1fr;

    gap: 0;
  }
}
</style>
