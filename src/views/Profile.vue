<template>
  <main class="profile-page">
    <div class="page-glow page-glow-1"></div>
    <div class="page-glow page-glow-2"></div>

    <section class="container profile-content">
      <!-- =====================================================
           CARD: AVATAR + INFO
      ====================================================== -->
      <div class="profile-card">
        <div class="profile-head">
          <div class="avatar-wrap">
            <img
              v-if="form.Avartar && !avatarBroken"
              :src="form.Avartar"
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

            <p class="head-email">{{ auth.user?.Email }}</p>
          </div>
        </div>

        <!-- =====================================================
             FORM
        ====================================================== -->
        <form class="profile-form" @submit.prevent="submitProfile">
          <h2>Thông tin cá nhân</h2>

          <div class="field-row">
            <div class="field">
              <label for="pf-first">Họ</label>

              <input
                id="pf-first"
                v-model.trim="form.FirstName"
                type="text"
              />
            </div>

            <div class="field">
              <label for="pf-last">Tên</label>

              <input
                id="pf-last"
                v-model.trim="form.LastName"
                type="text"
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
                required
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
              <label for="pf-birthday">Ngày sinh</label>

              <input
                id="pf-birthday"
                v-model="form.BirthDay"
                type="date"
              />
            </div>

            <div class="field">
              <label for="pf-avatar">Link ảnh đại diện</label>

              <input
                id="pf-avatar"
                v-model.trim="form.Avartar"
                type="url"
                placeholder="https://..."
              />
            </div>
          </div>

          <h2>Đổi mật khẩu</h2>

          <p class="hint">
            Để trống mật khẩu mới nếu không muốn đổi. Cần nhập mật khẩu
            hiện tại để lưu thay đổi.
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

import { useAuthStore } from "@/stores/auth";
import { UpdateProfile } from "@/model/api";

defineOptions({
  name: "Profile",
});

const auth = useAuthStore();

/* =========================================================
   STATE
========================================================= */

const avatarBroken = ref(false);
const saving = ref(false);
const message = ref("");
const messageError = ref(false);

const form = reactive({
  FirstName: auth.user?.FirstName || "",
  LastName: auth.user?.LastName || "",
  Email: auth.user?.Email || "",
  Phone: auth.user?.Phone || "",
  BirthDay: (auth.user?.BirthDay || "").slice(0, 10),
  Avartar: auth.user?.Avartar || "",
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

  if (!form.PasswordOld) {
    showMessage("Vui lòng nhập mật khẩu hiện tại để lưu.", true);

    return;
  }

  saving.value = true;

  try {
    const response = await UpdateProfile({
      ID: auth.user?.ID,
      FirstName: form.FirstName,
      LastName: form.LastName,
      EmpName: `${form.FirstName} ${form.LastName}`.trim(),
      Email: form.Email,
      Phone: form.Phone,
      BirthDay: form.BirthDay || null,
      Avartar: form.Avartar,
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
      FirstName: form.FirstName,
      LastName: form.LastName,
      EmpName: `${form.FirstName} ${form.LastName}`.trim(),
      Email: form.Email,
      Phone: form.Phone,
      BirthDay: form.BirthDay,
      Avartar: form.Avartar,
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
   PAGE
================================================== */

.profile-page {
  position: relative;

  min-height: 100vh;

  background: #faf7f2;

  overflow: hidden;

  padding: 48px 0 80px;
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

.container {
  width: min(760px, calc(100% - 32px));

  margin: 0 auto;
}

/* ==================================================
   CARD
================================================== */

.profile-card {
  padding: 34px 34px 30px;

  border: 1px solid rgba(78, 53, 53, 0.08);

  border-radius: 24px;

  background: #fff;

  box-shadow: 0 24px 60px rgba(80, 50, 50, 0.1);
}

.profile-head {
  display: flex;

  align-items: center;

  gap: 18px;

  padding-bottom: 24px;

  margin-bottom: 26px;

  border-bottom: 1px solid rgba(78, 53, 53, 0.08);
}

.avatar-wrap {
  width: 76px;

  height: 76px;

  flex-shrink: 0;

  border-radius: 50%;

  overflow: hidden;

  background: #f7e9e4;

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
  color: #8f4d43;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 30px;

  font-weight: 700;
}

.head-info h1 {
  margin: 0 0 6px;

  color: #2a1d1d;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 24px;
}

.role-badge {
  display: inline-block;

  padding: 3px 10px;

  border-radius: 999px;

  font-size: 11px;

  font-weight: 700;
}

.role-badge.role-admin {
  background: rgba(143, 77, 67, 0.12);

  color: #8f4d43;
}

.role-badge.role-user {
  background: rgba(46, 125, 50, 0.12);

  color: #2e7d32;
}

.role-badge.role-guest {
  background: rgba(120, 120, 140, 0.12);

  color: #5c5c70;
}

.head-email {
  margin: 6px 0 0;

  color: #6d5a5a;

  font-size: 13.5px;
}

/* ==================================================
   FORM
================================================== */

.profile-form h2 {
  margin: 0 0 14px;

  color: #2a1d1d;

  font-family: "Playfair Display", Georgia, serif;

  font-size: 18px;
}

.hint {
  margin: -6px 0 14px;

  color: #9a8484;

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

.form-message {
  margin: 4px 0 14px;

  padding: 10px 13px;

  border-radius: 10px;

  background: rgba(46, 125, 50, 0.08);

  color: #2e7d32;

  font-size: 13px;
}

.form-message.error {
  background: rgba(198, 40, 40, 0.08);

  color: #c62828;
}

.save-btn {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 12px 24px;

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

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);

  box-shadow: 0 12px 28px rgba(109, 58, 52, 0.28);
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
