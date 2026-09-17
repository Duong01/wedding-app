<template>
  <footer class="site-footer">
    <div class="footer-glow" aria-hidden="true"></div>

    <div class="footer-inner">
      <!-- =========================================
           BRAND + GIỚI THIỆU
      ========================================== -->
      <div class="footer-brand">
        <div class="footer-logo">
          <span class="footer-mark">Ngày</span>
          <span class="footer-name">Chung Đôi</span>
        </div>

        <p class="footer-desc">
          Nơi lưu giữ và chia sẻ niềm hạnh phúc trọn vẹn của ngày chung đôi.
          Tạo thiệp cưới online đẹp mắt, gửi tặng khách mời chỉ trong vài phút.
        </p>

        <div class="footer-socials">
          <!--
            CONTACT ADMIN → FACEBOOK
            Bấm "Liên hệ Admin" sẽ mở trang Facebook.
            Đổi CONTACT_FACEBOOK_URL ở phần script sang
            link Facebook thật của bạn.
          -->
          <a
            :href="contactFacebookUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn social-facebook"
            aria-label="Liên hệ Admin qua Facebook"
          >
            <v-icon size="18"> mdi-facebook </v-icon>

            <span> Liên hệ Admin </span>
          </a>

          <a
            v-if="contactZaloUrl"
            :href="contactZaloUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn"
            aria-label="Chat Zalo với Admin"
          >
            <v-icon size="18"> mdi-chat-processing-outline </v-icon>

            <span> Zalo </span>
          </a>
        </div>
      </div>

      <!-- =========================================
           LIÊN KẾT NHANH
      ========================================== -->
      <div class="footer-col">
        <h4>Khám phá</h4>

        <nav class="footer-links">
          <router-link to="/" class="footer-link"> Trang chủ </router-link>

          <router-link to="/templates" class="footer-link">
            Mẫu thiệp cưới
          </router-link>

          <router-link to="/editor" class="footer-link">
            Tạo thiệp ngay
          </router-link>

          <router-link
            v-if="auth.isLoggedIn && auth.can('manage')"
            to="/manage"
            class="footer-link"
          >
            Thiệp của tôi
          </router-link>
        </nav>
      </div>

      <!-- =========================================
           HỖ TRỢ / LIÊN HỆ
      ========================================== -->
      <div class="footer-col">
        <h4>Hỗ trợ</h4>

        <ul class="footer-contact">
          <li>
            <v-icon size="16"> mdi-clock-outline </v-icon>

            <span> Hỗ trợ 8:00 - 21:00 hằng ngày </span>
          </li>

          <li>
            <v-icon size="16"> mdi-email-outline </v-icon>

            <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>
          </li>

          <li>
            <v-icon size="16"> mdi-phone-outline </v-icon>

            <a :href="`tel:${contactPhoneHref}`">{{ contactPhone }}</a>
          </li>
        </ul>

        <p class="footer-note">
          Cần hỗ trợ kích hoạt thiệp, thanh toán hay chỉnh sửa nội dung?
          Nhắn tin trực tiếp qua Facebook — Admin phản hồi trong vài phút.
        </p>
      </div>
    </div>

    <!-- =========================================
         COPYRIGHT
    ========================================== -->
    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <span>
          © {{ currentYear }} Ngày Chung Đôi — Thiệp cưới online.
        </span>

        <span class="footer-heart">
          Made with <i>♥</i> for your big day
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from "vue";

import { useAuthStore } from "@/stores/auth";

/*
 * =========================================================
 * THÔNG TIN LIÊN HỆ ADMIN
 *
 * ⚠ ĐỔI CÁC GIÁ TRỊ DƯỚI ĐÂY THÀNH THÔNG TIN THẬT CỦA BẠN:
 * - contactFacebookUrl: link trang/nhóm Facebook — nút
 *   "Liên hệ Admin" sẽ mở link này khi khách bấm.
 * - contactZaloUrl: để rỗng ("") nếu không dùng Zalo.
 * - contactEmail / contactPhone: hiển thị ở cột Hỗ trợ.
 * =========================================================
 */

const contactFacebookUrl = "https://www.facebook.com/your-page";

const contactZaloUrl = "";

const contactEmail = "hotro@ngaychungdoi.vn";

const contactPhone = "0900 000 000";

const contactPhoneHref = computed(() => {
  return contactPhone.replace(/[^0-9+]/g, "");
});

const currentYear = new Date().getFullYear();

const auth = useAuthStore();
</script>

<style scoped>
/* ==================================================
   FOOTER
================================================== */

.site-footer {
  position: relative;

  overflow: hidden;

  margin-top: 70px;

  border-top: 1px solid rgba(78, 53, 53, 0.1);

  background:
    linear-gradient(180deg, #fdf9f4 0%, #f6ede4 100%);
}

.footer-glow {
  position: absolute;

  top: -160px;

  left: 50%;

  width: 520px;

  height: 320px;

  transform: translateX(-50%);

  pointer-events: none;

  background:
    radial-gradient(
      ellipse,
      rgba(201, 166, 89, 0.14),
      transparent 70%
    );
}

.footer-inner {
  position: relative;

  width: min(1200px, calc(100% - 32px));

  margin: 0 auto;

  display: grid;

  grid-template-columns: 1.4fr 0.8fr 1fr;

  gap: 44px;

  padding: 54px 0 40px;
}

/* ==================================================
   BRAND
================================================== */

.footer-logo {
  display: flex;

  align-items: center;

  gap: 10px;

  font-family: var(--font-heading);

  font-size: 24px;

  font-weight: 700;

  color: #2a1d1d;
}

.footer-mark {
  display: inline-flex;

  align-items: center;

  justify-content: center;

  min-width: 56px;

  height: 32px;

  border-radius: 999px;

  background: linear-gradient(135deg, #c9a659, #8f4d43);

  color: #fff;

  font-size: 12px;

  letter-spacing: 0.08em;

  text-transform: uppercase;
}

.footer-desc {
  max-width: 380px;

  margin: 14px 0 20px;

  color: #6d5a5a;

  font-size: 13.5px;

  line-height: 1.75;
}

/* ==================================================
   SOCIAL / CONTACT BUTTONS
================================================== */

.footer-socials {
  display: flex;

  flex-wrap: wrap;

  gap: 10px;
}

.social-btn {
  display: inline-flex;

  align-items: center;

  gap: 8px;

  padding: 10px 18px;

  border-radius: 999px;

  font-size: 13px;

  font-weight: 650;

  text-decoration: none;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.social-facebook {
  color: #fff;

  background: linear-gradient(135deg, #1877f2, #0e5fc7);

  box-shadow: 0 8px 20px rgba(24, 119, 242, 0.28);
}

.social-facebook:hover {
  transform: translateY(-2px);

  box-shadow: 0 12px 28px rgba(24, 119, 242, 0.38);
}

.social-btn:not(.social-facebook) {
  color: #4e3636;

  background: #fff;

  border: 1px solid rgba(78, 53, 53, 0.14);
}

.social-btn:not(.social-facebook):hover {
  transform: translateY(-2px);

  border-color: rgba(143, 77, 67, 0.4);

  box-shadow: 0 8px 20px rgba(80, 50, 50, 0.12);
}

/* ==================================================
   COLUMNS
================================================== */

.footer-col h4 {
  margin: 6px 0 16px;

  color: #2a1d1d;

  font-family: var(--font-heading);

  font-size: 15px;

  font-weight: 700;

  letter-spacing: 0.02em;
}

.footer-links {
  display: flex;

  flex-direction: column;

  gap: 9px;
}

.footer-link {
  width: fit-content;

  color: #6d5a5a;

  font-size: 13.5px;

  font-weight: 550;

  text-decoration: none;

  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #8f4d43;
}

/* ==================================================
   CONTACT LIST
================================================== */

.footer-contact {
  margin: 0;

  padding: 0;

  list-style: none;

  display: flex;

  flex-direction: column;

  gap: 10px;
}

.footer-contact li {
  display: flex;

  align-items: center;

  gap: 9px;

  color: #6d5a5a;

  font-size: 13.5px;
}

.footer-contact li .v-icon {
  color: #c9a659;
}

.footer-contact a {
  color: #6d5a5a;

  text-decoration: none;

  transition: color 0.2s ease;
}

.footer-contact a:hover {
  color: #8f4d43;
}

.footer-note {
  margin: 16px 0 0;

  padding: 12px 14px;

  border-left: 3px solid rgba(201, 166, 89, 0.6);

  border-radius: 0 12px 12px 0;

  background: rgba(255, 255, 255, 0.6);

  color: #7a6666;

  font-size: 12.5px;

  line-height: 1.7;
}

/* ==================================================
   BOTTOM BAR
================================================== */

.footer-bottom {
  border-top: 1px solid rgba(78, 53, 53, 0.08);

  background: rgba(255, 251, 248, 0.6);
}

.footer-bottom-inner {
  width: min(1200px, calc(100% - 32px));

  margin: 0 auto;

  display: flex;

  align-items: center;

  justify-content: space-between;

  flex-wrap: wrap;

  gap: 8px;

  padding: 16px 0;

  color: #9a8484;

  font-size: 12.5px;
}

.footer-heart i {
  color: #c0392b;

  font-style: normal;
}

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 900px) {
  .footer-inner {
    grid-template-columns: 1fr 1fr;

    gap: 32px;

    padding: 44px 0 32px;
  }
}

@media (max-width: 600px) {
  .site-footer {
    margin-top: 48px;
  }

  .footer-inner {
    grid-template-columns: 1fr;

    gap: 28px;

    padding: 38px 0 28px;
  }

  .footer-bottom-inner {
    flex-direction: column;

    text-align: center;
  }
}
</style>
