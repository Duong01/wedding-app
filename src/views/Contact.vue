<template>
  <main class="mk-page">
    <div class="mk-container">
      <PageBreadcrumb :trail="[{ label: 'Liên hệ' }]" />
    </div>

    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="mk-hero">
      <div class="mk-hero__glow" aria-hidden="true"></div>

      <div class="mk-container mk-hero__inner">
        <p class="mk-eyebrow">Liên hệ</p>

        <h1>
          Có câu hỏi?
          <em>Nhắn tụi mình.</em>
        </h1>

        <p class="mk-hero__lead">
          Dù bạn đang cân nhắc, đang làm dở tấm thiệp hay gặp trục trặc ngay
          trước ngày cưới — cứ nhắn. Tụi mình trả lời trong vài phút.
        </p>
      </div>
    </section>

    <!-- =====================================================
         KÊNH LIÊN HỆ
    ====================================================== -->
    <section class="mk-section mk-section--tight">
      <div class="mk-container">
        <RailHint text="Vuốt ngang để xem đủ bốn kênh" />

        <div class="mk-grid mk-grid--4">
          <a
            :href="CONTACT.messenger"
            target="_blank"
            rel="noopener noreferrer"
            class="mk-card channel"
          >
            <span class="mk-orn" aria-hidden="true">❝</span>

            <h3>Messenger</h3>

            <p>Nhanh nhất — thường trả lời trong vài phút.</p>

            <span class="channel-value">Nhắn ngay →</span>
          </a>

          <a
            :href="CONTACT.facebook"
            target="_blank"
            rel="noopener noreferrer"
            class="mk-card channel"
          >
            <span class="mk-orn" aria-hidden="true">✦</span>

            <h3>Facebook</h3>

            <p>Xem mẫu mới và các thiệp tụi mình đã làm.</p>

            <span class="channel-value">Mở trang →</span>
          </a>

          <a :href="`mailto:${CONTACT.email}`" class="mk-card channel">
            <span class="mk-orn" aria-hidden="true">◈</span>

            <h3>Email</h3>

            <p>Phù hợp khi bạn cần gửi kèm file hoặc yêu cầu dài.</p>

            <span class="channel-value">{{ CONTACT.email }}</span>
          </a>

          <a :href="`tel:${phoneHref()}`" class="mk-card channel">
            <span class="mk-orn" aria-hidden="true">❦</span>

            <h3>Điện thoại</h3>

            <p>Gọi trực tiếp trong giờ hỗ trợ nếu cần gấp.</p>

            <span class="channel-value">{{ CONTACT.phone }}</span>
          </a>
        </div>

        <p class="hours">
          <v-icon size="16"> mdi-clock-outline </v-icon>
          Hỗ trợ {{ CONTACT.hours }} — kể cả ngày lễ, kể cả ngoài giờ khi bạn
          đang cần gấp.
        </p>
      </div>
    </section>

    <!-- =====================================================
         FORM
    ====================================================== -->
    <section class="mk-section">
      <div class="mk-container contact-grid">
        <div class="contact-copy">
          <p class="mk-eyebrow">Gửi tin nhắn</p>

          <h2>
            Điền vài dòng,
            <em>tụi mình phản hồi.</em>
          </h2>

          <p>
            Nếu bạn mô tả càng rõ vấn đề đang gặp, tụi mình càng trả lời được
            đúng thứ bạn cần ngay từ tin nhắn đầu tiên.
          </p>

          <ul class="contact-hints">
            <li>
              <span class="tick" aria-hidden="true">✦</span>
              Ghi rõ tên thiệp hoặc đường link nếu đang có sự cố
            </li>

            <li>
              <span class="tick" aria-hidden="true">✦</span>
              Kèm ảnh chụp màn hình nếu lỗi hiển thị
            </li>

            <li>
              <span class="tick" aria-hidden="true">✦</span>
              Nêu ngày cưới để tụi mình ưu tiên đúng mức
            </li>
          </ul>
        </div>

        <form class="contact-form" @submit.prevent="submit">
          <div class="field">
            <label for="cf-name">Họ và tên</label>

            <input
              id="cf-name"
              v-model.trim="form.name"
              type="text"
              required
              placeholder="Nguyễn Minh Anh"
            />
          </div>

          <div class="field-row">
            <div class="field">
              <label for="cf-email">Email</label>

              <input
                id="cf-email"
                v-model.trim="form.email"
                type="email"
                required
                placeholder="minhanh@email.com"
              />
            </div>

            <div class="field">
              <label for="cf-phone">Số điện thoại</label>

              <input
                id="cf-phone"
                v-model.trim="form.phone"
                type="tel"
                placeholder="0912 345 678"
              />
            </div>
          </div>

          <div class="field">
            <label for="cf-topic">Chủ đề</label>

            <select id="cf-topic" v-model="form.topic">
              <option v-for="topic in CONTACT_TOPICS" :key="topic" :value="topic">
                {{ topic }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="cf-message">Nội dung</label>

            <textarea
              id="cf-message"
              v-model.trim="form.message"
              rows="5"
              required
              placeholder="Mô tả ngắn gọn điều bạn cần hỗ trợ…"
            ></textarea>
          </div>

          <button type="submit" class="mk-btn mk-btn--solid submit">
            Gửi tin nhắn
          </button>

          <p class="form-note">
            Tin nhắn sẽ mở sẵn trong ứng dụng email của bạn. Nếu muốn nhanh
            hơn, hãy
            <a
              :href="CONTACT.messenger"
              target="_blank"
              rel="noopener noreferrer"
            >
              nhắn qua Messenger
            </a>
            .
          </p>
        </form>
      </div>
    </section>

    <FinalCta
      title="Chưa cần hỏi gì?"
      title-accent="Cứ thử trước đã."
      text="Mở editor, chọn một mẫu và điền thử vài dòng. Không mất phí, không cần đăng nhập."
      cta="Tạo thiệp ngay"
    />
  </main>
</template>

<script setup>
import { reactive } from "vue";

import PageBreadcrumb from "@/components/marketing/PageBreadcrumb.vue";
import FinalCta from "@/components/marketing/FinalCta.vue";
import RailHint from "@/components/marketing/RailHint.vue";

import { useSeo } from "@/composables/useSeo";

import {
  BRAND,
  CONTACT,
  CONTACT_TOPICS,
  phoneHref,
} from "@/data/siteContent";

const form = reactive({
  name: "",
  email: "",
  phone: "",
  topic: CONTACT_TOPICS[0],
  message: "",
});

/*
 * Chưa có API backend cho form liên hệ. Giai đoạn này
 * soạn sẵn nội dung rồi mở ứng dụng email của người dùng
 * — không gửi dữ liệu đi đâu cả.
 */
function submit() {
  const lines = [
    `Họ tên: ${form.name}`,
    `Email: ${form.email}`,
    form.phone ? `Điện thoại: ${form.phone}` : "",
    `Chủ đề: ${form.topic}`,
    "",
    form.message,
  ].filter(Boolean);

  const subject = `[${BRAND.name}] ${form.topic} — ${form.name}`;

  window.location.href =
    `mailto:${CONTACT.email}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(lines.join("\n"))}`;
}

useSeo({
  title: "Liên hệ",
  description:
    `Liên hệ ${BRAND.name} để được tư vấn chọn mẫu thiệp, hỗ trợ kỹ thuật ` +
    "hoặc yêu cầu thiết kế riêng. Hỗ trợ qua Messenger, email và điện thoại.",
  path: "/lien-he",
});
</script>

<style scoped>
/* =====================================================
   KÊNH LIÊN HỆ
===================================================== */

.channel {
  display: flex;
  flex-direction: column;

  text-decoration: none;
}

.channel-value {
  margin-top: 16px;

  color: var(--studio-seal, #a63a2e);

  font-size: 13px;
  font-weight: 650;

  word-break: break-word;
}

.hours {
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  margin: 28px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 13.5px;

  text-align: center;
}

.hours .v-icon {
  color: var(--studio-foil, #b9975b);
}

/* =====================================================
   FORM
===================================================== */

.contact-grid {
  display: grid;
  grid-template-columns: 1fr;

  gap: 32px;
  align-items: start;
}

.contact-copy h2 {
  margin: 0 0 14px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: 600;

  line-height: 1.15;
}

.contact-copy h2 em {
  color: var(--studio-seal, #a63a2e);

  font-style: italic;
}

.contact-copy p {
  max-width: 460px;

  margin: 0 0 22px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 15.5px;

  line-height: 1.8;
}

.contact-hints {
  margin: 0;
  padding: 0;

  list-style: none;

  display: flex;
  flex-direction: column;

  gap: 11px;
}

.contact-hints li {
  display: flex;

  gap: 10px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 14px;

  line-height: 1.6;
}

.tick {
  flex-shrink: 0;

  color: var(--studio-foil, #b9975b);

  font-size: 12px;

  line-height: 1.6;
}

.contact-form {
  padding: 28px 24px;

  border: 1px solid var(--studio-line, rgba(43, 33, 24, 0.14));
  border-radius: 24px;

  background: var(--studio-card, #fffdf8);

  box-shadow: 0 20px 48px rgba(43, 33, 24, 0.07);
}

.field {
  display: flex;
  flex-direction: column;

  gap: 7px;

  margin-bottom: 16px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr;

  gap: 16px;
}

.field label {
  color: var(--studio-ink, #2b2118);

  font-size: 12.5px;
  font-weight: 650;

  letter-spacing: 0.02em;
}

.field input,
.field select,
.field textarea {
  width: 100%;

  padding: 12px 14px;

  border: 1px solid var(--studio-line-strong, rgba(43, 33, 24, 0.22));
  border-radius: 12px;

  background: var(--studio-card, #fffdfb);
  color: var(--studio-ink, #2b2118);

  font-family: inherit;
  font-size: 14px;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field textarea {
  resize: vertical;

  min-height: 120px;

  line-height: 1.6;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: var(--studio-seal, #a63a2e);

  box-shadow: 0 0 0 3px rgba(166, 58, 46, 0.1);
}

.field input::placeholder,
.field textarea::placeholder {
  color: rgba(43, 33, 24, 0.32);
}

.submit {
  width: 100%;

  margin-top: 6px;
}

.form-note {
  margin: 14px 0 0;

  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12.5px;

  line-height: 1.7;

  text-align: center;
}

.form-note a {
  color: var(--studio-seal, #a63a2e);

  font-weight: 600;

  text-decoration: none;
}

.form-note a:hover {
  text-decoration: underline;
}

@media (min-width: 768px) {
  .contact-grid {
    grid-template-columns: 0.9fr 1.1fr;

    gap: 48px;
  }

  .field-row {
    grid-template-columns: 1fr 1fr;
  }

  .contact-form {
    padding: 32px 30px;
  }
}
</style>
