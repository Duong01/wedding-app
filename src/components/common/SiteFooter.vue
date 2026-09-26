<template>
  <footer class="site-footer">
    <div class="footer-glow" aria-hidden="true"></div>

    <div class="footer-inner">
      <!-- =========================================
           BRAND + GIỚI THIỆU
      ========================================== -->
      <div class="footer-brand">
        <div class="footer-logo">
          <span class="footer-mark">Thiệp</span>
          <span class="footer-name">Duyên</span>
        </div>

        <p class="footer-desc">
          {{ BRAND.slogan }} Tạo thiệp cưới online đẹp mắt, gửi tặng khách mời
          chỉ trong vài phút.
        </p>

        <div class="footer-socials">
          <a
            :href="CONTACT.facebook"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn social-facebook"
            aria-label="Liên hệ qua Facebook"
          >
            <v-icon size="18"> mdi-facebook </v-icon>

            <span> Facebook </span>
          </a>

          <a
            v-if="CONTACT.zalo"
            :href="CONTACT.zalo"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn"
            aria-label="Chat Zalo"
          >
            <v-icon size="18"> mdi-chat-processing-outline </v-icon>

            <span> Zalo </span>
          </a>

          <a
            :href="CONTACT.messenger"
            target="_blank"
            rel="noopener noreferrer"
            class="social-btn"
            aria-label="Nhắn tin qua Messenger"
          >
            <v-icon size="18"> mdi-message-text-outline </v-icon>

            <span> Messenger </span>
          </a>
        </div>
      </div>

      <!-- =========================================
           LIÊN KẾT NHANH
      ========================================== -->
      <div
        v-for="group in FOOTER_GROUPS"
        :key="group.title"
        class="footer-col"
      >
        <h4>{{ group.title }}</h4>

        <nav class="footer-links">
          <router-link
            v-for="link in group.links"
            :key="link.routeName"
            :to="{ name: link.routeName }"
            class="footer-link"
          >
            {{ link.label }}
          </router-link>
        </nav>
      </div>

      <!-- =========================================
           HỖ TRỢ / LIÊN HỆ
      ========================================== -->
      <div class="footer-col">
        <h4>Liên hệ</h4>

        <ul class="footer-contact">
          <li>
            <v-icon size="16"> mdi-clock-outline </v-icon>

            <span> Hỗ trợ {{ CONTACT.hours }} </span>
          </li>

          <li>
            <v-icon size="16"> mdi-email-outline </v-icon>

            <a :href="`mailto:${CONTACT.email}`">{{ CONTACT.email }}</a>
          </li>

          <li>
            <v-icon size="16"> mdi-phone-outline </v-icon>

            <a :href="`tel:${phoneHref()}`">{{ CONTACT.phone }}</a>
          </li>
        </ul>

        <p class="footer-note">
          Cần hỗ trợ kích hoạt thiệp, thanh toán hay chỉnh sửa nội dung?
          Nhắn tin trực tiếp qua Messenger — phản hồi trong vài phút.
        </p>
      </div>
    </div>

    <!-- =========================================
         COPYRIGHT
    ========================================== -->
    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <span>
          © {{ currentYear }} {{ BRAND.name }} — {{ BRAND.domain }}
        </span>

        <span class="footer-heart">
          Made with <i>♥</i> for your big day
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { BRAND, CONTACT, FOOTER_GROUPS, phoneHref } from "@/data/siteContent";

const currentYear = new Date().getFullYear();
</script>

<style scoped>
/* ==================================================
   FOOTER
================================================== */

.site-footer {
  position: relative;

  overflow: hidden;

  margin-top: 70px;

  border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.12));

  background:
    radial-gradient(circle at 50% 0%, rgba(185, 151, 91, 0.1), transparent 60%),
    linear-gradient(180deg, #f3ecdd 0%, #efe6d2 100%);
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
      rgba(185, 151, 91, 0.16),
      transparent 70%
    );
}

.footer-inner {
  position: relative;

  width: min(1200px, calc(100% - 32px));

  margin: 0 auto;

  display: grid;

  grid-template-columns: 1.6fr 0.7fr 0.8fr 0.8fr 1fr;

  gap: 36px;

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

  color: var(--studio-ink, #2b2118);
}

.footer-mark {
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

.footer-desc {
  max-width: 380px;

  margin: 14px 0 20px;

  color: var(--studio-ink-soft, #5c4f43);

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
  color: var(--studio-ink-soft, #5c4f43);

  background: var(--studio-card, #fffdf8);

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.16));
}

.social-btn:not(.social-facebook):hover {
  transform: translateY(-2px);

  border-color: rgba(185, 151, 91, 0.55);

  box-shadow: 0 8px 20px rgba(43, 33, 24, 0.1);
}

/* ==================================================
   COLUMNS
================================================== */

.footer-col h4 {
  margin: 6px 0 16px;

  color: var(--studio-ink, #2b2118);

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

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13.5px;

  font-weight: 550;

  text-decoration: none;

  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--studio-seal, #a63a2e);
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

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 13.5px;
}

.footer-contact li .v-icon {
  color: var(--studio-foil, #b9975b);
}

.footer-contact a {
  color: var(--studio-ink-soft, #5c4f43);

  text-decoration: none;

  transition: color 0.2s ease;
}

.footer-contact a:hover {
  color: var(--studio-seal, #a63a2e);
}

.footer-note {
  margin: 16px 0 0;

  padding: 12px 14px;

  border-left: 3px solid rgba(185, 151, 91, 0.6);

  border-radius: 0 12px 12px 0;

  background: var(--studio-glass, rgba(255, 253, 248, 0.7));

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12.5px;

  line-height: 1.7;
}

/* ==================================================
   BOTTOM BAR
================================================== */

.footer-bottom {
  border-top: 1px solid var(--studio-line, rgba(43, 33, 24, 0.1));

  background: rgba(43, 33, 24, 0.05);
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

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12.5px;
}

.footer-heart i {
  color: var(--studio-seal, #a63a2e);

  font-style: normal;
}

/* ==================================================
   MOBILE
================================================== */

@media (max-width: 1100px) {
  .footer-inner {
    grid-template-columns: 1.4fr 1fr 1fr;

    gap: 32px;
  }
}

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

  /*
   * Trên điện thoại, năm khối xếp thành một cột khiến footer
   * dài gần hai màn hình — khách phải vuốt rất nhiều mới hết.
   * Thương hiệu vẫn chiếm trọn chiều ngang, còn bốn cột còn
   * lại gấp thành lưới hai cột: chiều cao giảm gần một nửa mà
   * vẫn đọc được đủ.
   */
  .footer-inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 24px 18px;

    padding: 32px 0 24px;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }

  .footer-desc {
    max-width: none;

    margin: 12px 0 16px;
  }

  .footer-col h4 {
    margin: 0 0 12px;

    font-size: 14px;
  }

  .footer-links {
    gap: 8px;
  }

  .footer-link,
  .footer-contact li {
    font-size: 13px;
  }

  /*
   * Khối "Liên hệ" chứa ghi chú dài — cho trải rộng cả hai cột
   * để câu chữ không bị bó thành cột hẹp khó đọc.
   */
  .footer-col:last-child {
    grid-column: 1 / -1;
  }

  .footer-note {
    margin-top: 14px;
  }

  .footer-bottom-inner {
    flex-direction: column;

    text-align: center;
  }
}

@media (max-width: 380px) {
  .footer-inner {
    gap: 20px 14px;
  }

  .footer-link,
  .footer-contact li {
    font-size: 12.5px;
  }
}
</style>
