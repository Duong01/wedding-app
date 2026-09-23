<template>
  <section class="mk-section">
    <div class="mk-container support-grid">
      <div class="support-copy">
        <p class="mk-eyebrow">Hỗ trợ</p>

        <h2>
          Khi bạn cần,
          <em>tụi mình luôn có mặt.</em>
        </h2>

        <p>
          Ngày cưới có trăm việc phải lo — đừng để tấm thiệp làm bạn mất thời
          gian. Nhắn tụi mình bất cứ lúc nào, kể cả ngoài giờ.
        </p>

        <div class="support-actions">
          <a
            :href="CONTACT.messenger"
            target="_blank"
            rel="noopener noreferrer"
            class="mk-btn mk-btn--solid"
          >
            Nhắn tụi mình
          </a>

          <router-link :to="{ name: 'Contact' }" class="mk-btn mk-btn--ghost">
            Xem kênh liên hệ
          </router-link>
        </div>
      </div>

      <div class="support-stats">
        <div class="stat">
          <strong>Dưới 1 phút</strong>
          <span>Thời gian phản hồi</span>
        </div>

        <div class="stat">
          <strong>24/7</strong>
          <span>Kể cả ngày lễ</span>
        </div>

        <div class="stat">
          <strong>Miễn phí</strong>
          <span>Hỗ trợ chỉnh sửa</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { CONTACT } from "@/data/siteContent";
</script>

<style scoped>
.support-grid {
  display: grid;
  grid-template-columns: 1fr;

  gap: 28px;
  align-items: center;
}

.support-copy h2 {
  margin: 0 0 14px;

  color: var(--studio-ink, #2b2118);

  font-family: var(--font-heading);
  font-size: clamp(24px, 3.2vw, 36px);
  font-weight: 600;

  line-height: 1.15;
}

.support-copy h2 em {
  color: var(--studio-seal, #a63a2e);

  font-style: italic;
}

.support-copy p {
  max-width: 520px;

  margin: 0 0 24px;

  color: var(--studio-ink-soft, #5c4f43);

  font-size: 15.5px;

  line-height: 1.8;
}

.support-actions {
  display: flex;
  flex-wrap: wrap;

  gap: 12px;
}

.support-stats {
  display: grid;
  grid-template-columns: 1fr;

  gap: 12px;
}

.stat {
  padding: 22px 20px;

  border: 1px solid rgba(185, 151, 91, 0.34);
  border-radius: 20px;

  background:
    radial-gradient(circle at 88% 12%, rgba(185, 151, 91, 0.16), transparent 60%),
    var(--studio-card, #fffdf8);

  text-align: center;
}

.stat strong {
  display: block;

  margin-bottom: 4px;

  color: var(--studio-seal, #a63a2e);

  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 600;
}

.stat span {
  color: var(--studio-ink-faint, #8a7a68);

  font-size: 12px;

  letter-spacing: 0.06em;
  text-transform: uppercase;
}

@media (min-width: 768px) {
  .support-grid {
    grid-template-columns: 1.1fr 0.9fr;

    gap: 48px;
  }

  .support-stats {
    gap: 14px;
  }
}
</style>
