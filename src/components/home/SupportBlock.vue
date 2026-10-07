<template>
  <section ref="root" class="mk-section mk-section--alt">
    <div class="mk-container support-grid">
      <div class="support-copy rv">
        <p class="mk-eyebrow">{{ $t('footer.support') }}</p>

        <h2>
          {{ $t('support.h2a') }}
          <em>{{ $t('support.h2b') }}</em>
        </h2>

        <p>
          {{ $t('support.lead') }}
        </p>

        <div class="support-actions">
          <a
            :href="CONTACT.messenger"
            target="_blank"
            rel="noopener noreferrer"
            class="mk-btn mk-btn--solid"
          >
            {{ $t('support.message') }}
          </a>

          <router-link :to="{ name: 'Contact' }" class="mk-btn mk-btn--ghost">
            {{ $t('support.channels') }}
          </router-link>
        </div>
      </div>

      <div class="support-stats rv" data-rv-delay="1">
        <div class="stat">
          <strong>{{ $t('support.s1v') }}</strong>
          <span>{{ $t('support.s1') }}</span>
        </div>

        <div class="stat">
          <strong>24/7</strong>
          <span>{{ $t('support.s2v') }}</span>
        </div>

        <div class="stat">
          <strong>{{ $t('support.s3v') }}</strong>
          <span>{{ $t('support.s3') }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useReveal } from "@/composables/useReveal";
import { CONTACT } from "@/data/siteContent";

const root = useReveal();
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
