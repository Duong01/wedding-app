<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> HERO </span>

        <h1>{{ $t('editor.menu.hero') }}</h1>

        <p>{{ $t('heroPanel.desc') }}</p>
      </div>

      <PanelProgressBadge
        :done="progress?.done || 0"
        :total="progress?.total || 0"
      />
    </div>

    <!-- =====================================================
         XEM TRƯỚC ẢNH BÌA
    ====================================================== -->

    <div class="hero-preview">
      <img
        v-if="wedding.hero.Background"
        :src="wedding.hero.Background"
        :alt="$t('heroPanel.bg')"
      />

      <div v-else class="hero-preview-empty">
        <v-icon size="30"> mdi-image-outline </v-icon>

        <span> {{ $t('heroPanel.noBg') }} </span>
      </div>

      <div class="hero-preview-overlay">
        <span class="hero-preview-kicker">
          {{ wedding.hero.Subtitle || $t('heroPanel.invite') }}
        </span>

        <strong>
          {{ wedding.hero.BrideName || $t('panel.bride') }}
          &amp;
          {{ wedding.hero.GroomName || $t('panel.groom') }}
        </strong>

        <span class="hero-preview-date">
          {{ heroDateLabel || $t('heroPanel.noDate') }}
        </span>
      </div>
    </div>

    <div class="form-grid">
      <div class="editor-field">
        <label>{{ $t('heroPanel.title') }}</label>

        <input
          v-model="wedding.hero.Title"
          type="text"
          placeholder="VD: Save The Date"
        />

        <small class="field-help">
          {{ $t('heroPanel.titleHint') }}
        </small>
      </div>

      <div class="editor-field">
        <label>{{ $t('heroPanel.invite') }}</label>

        <input
          v-model="wedding.hero.Subtitle"
          type="text"
          :placeholder="$t('heroPanel.invitePlaceholder')"
        />

        <small class="field-help">
          {{ $t('heroPanel.inviteHint') }}
        </small>
      </div>

      <div class="editor-field">
        <label>{{ $t('panel.groomName') }}</label>

        <input v-model="wedding.hero.GroomName" type="text" />

        <small class="field-help">
          {{ $t('panel.syncedGeneral') }}
        </small>
      </div>

      <div class="editor-field">
        <label>{{ $t('panel.brideName') }}</label>

        <input v-model="wedding.hero.BrideName" type="text" />

        <small class="field-help">
          {{ $t('panel.syncedGeneral') }}
        </small>
      </div>

      <div class="editor-field">
        <label>{{ $t('panel.weddingDate') }}</label>

        <input
          :value="heroDateInput"
          type="date"
          @input="onHeroDateInput"
        />

        <small class="field-help">
          {{ $t('panel.syncedGeneral') }}
        </small>
      </div>

      <div class="editor-field">
        <label>{{ $t('heroPanel.venue') }}</label>

        <input
          v-model="wedding.hero.Location"
          type="text"
          :placeholder="$t('heroPanel.venuePlaceholder')"
        />

        <small class="field-help">
          {{ $t('heroPanel.venueHint') }}
        </small>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

import PanelProgressBadge from "@/components/editor/PanelProgressBadge.vue";

import {
  parseWeddingDate,
} from "@/utils/datetime";

const props = defineProps({
  wedding: { type: Object, required: true },

  /* { done, total } từ Editor.vue — badge hoàn thiện mục. */
  progress: { type: Object, default: null },
});

/*
 * Hero.WeddingDate là DateTime? bên API — hiển thị dạng
 * ngày (không giờ) vì người dùng chỉ chọn ngày ở mục
 * Thông tin chung. Giữ nguyên giờ cũ khi đổi ngày.
 */
const heroDateInput = computed(() => {
  const raw = props.wedding.hero?.WeddingDate;

  if (!raw) {
    return "";
  }

  return String(raw).slice(0, 10);
});

function onHeroDateInput(event) {
  const day = event.target.value;

  if (!day) {
    props.wedding.hero.WeddingDate = "";
    return;
  }

  const existing = parseWeddingDate(props.wedding.hero?.WeddingDate);

  const hours = existing
    ? String(existing.getHours()).padStart(2, "0")
    : "08";

  const minutes = existing
    ? String(existing.getMinutes()).padStart(2, "0")
    : "00";

  props.wedding.hero.WeddingDate = `${day}T${hours}:${minutes}:00`;
}

const heroDateLabel = computed(() => {
  const date = parseWeddingDate(props.wedding.hero?.WeddingDate);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
});
</script>

<style scoped>
.hero-preview {
  position: relative;

  aspect-ratio: 16 / 9;

  max-height: 260px;

  overflow: hidden;

  margin-bottom: 24px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 16px;

  background: #f6f1ea;
}

.hero-preview img {
  width: 100%;

  height: 100%;

  object-fit: cover;
}

.hero-preview-empty {
  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 7px;

  height: 100%;

  color: #a8988a;

  font-size: 11px;
}

.hero-preview-overlay {
  position: absolute;

  inset: auto 0 0 0;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 3px;

  padding: 26px 16px 16px;

  background: linear-gradient(to top, rgba(20, 12, 8, 0.78), transparent);

  text-align: center;
}

.hero-preview-kicker {
  color: rgba(255, 255, 255, 0.78);

  font-size: 9.5px;

  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-preview-overlay strong {
  color: #fff;

  font-family: var(--font-heading), Georgia, serif;
  font-size: 21px;
  font-weight: 600;
}

.hero-preview-date {
  color: rgba(255, 255, 255, 0.82);

  font-size: 11px;
}
</style>
