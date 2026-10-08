<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> WEDDING MUSIC </span>

        <h1>{{ $t('editor.menu.music') }}</h1>

        <p>{{ $t('musicPanel.desc') }}</p>
      </div>

      <PanelProgressBadge
        :done="progress?.done || 0"
        :total="progress?.total || 0"
      />
    </div>

    <div class="switch-card">
      <div>
        <strong> {{ $t('musicPanel.enable') }} </strong>

        <small> {{ $t('musicPanel.enableHint') }} </small>
      </div>

      <v-switch
        v-model="wedding.music.Enabled"
        color="primary"
        hide-details
      />
    </div>

    <div class="switch-card">
      <div>
        <strong> {{ $t('musicPanel.autoplay') }} </strong>

        <small> {{ $t('musicPanel.autoplayHint') }} </small>
      </div>

      <v-switch
        v-model="wedding.music.Autoplay"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field full">
      <label>{{ $t('musicPanel.chooseSong') }}</label>

      <select v-model="selectedPreset">
        <option
          v-for="option in presetOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <small class="field-help">
        {{ $t('musicPanel.chooseSongHint') }}
      </small>
    </div>

    <div v-if="isCustom" class="editor-field full">
      <label>{{ $t('musicPanel.url') }}</label>

      <UploadField
        v-model="wedding.music.Url"
        kind="audio"
        :button-text="$t('musicPanel.upload')"
        icon="mdi-music-note-plus"
      />

      <small class="field-help">
        {{ $t('musicPanel.urlHint') }}
      </small>
    </div>

    <div class="editor-field full">
      <label>{{ $t('musicPanel.songName') }}</label>

      <input
        v-model="wedding.music.Title"
        type="text"
        :placeholder="$t('musicPanel.songNamePlaceholder')"
      />

      <small class="field-help">
        {{ $t('musicPanel.songNameHint') }}
      </small>
    </div>

    <!-- =====================================================
         NGHE THỬ
    ====================================================== -->

    <div class="music-preview">
      <div class="music-preview-head">
        <div class="music-disc" :class="{ spinning: playing }">
          <v-icon size="18"> mdi-music-note </v-icon>
        </div>

        <div class="music-meta">
          <strong>
            {{ wedding.music.Title || $t('musicPanel.noName') }}
          </strong>

          <span>
            {{ playing ? $t('musicPanel.playing') : $t('musicPanel.previewHint') }}
          </span>
        </div>

        <button
          type="button"
          class="music-play"
          :disabled="!wedding.music.Url"
          :title="playing ? $t('musicPanel.stop') : $t('musicPanel.preview')"
          @click="togglePreview"
        >
          <v-icon size="20">
            {{ playing ? "mdi-pause" : "mdi-play" }}
          </v-icon>
        </button>
      </div>

      <div class="music-progress">
        <span class="music-time">{{ formatTime(currentTime) }}</span>

        <div class="music-track">
          <div
            class="music-track-fill"
            :style="{ width: `${progressPercent}%` }"
          />
        </div>

        <span class="music-time">{{ formatTime(duration) }}</span>
      </div>

      <div class="music-volume">
        <v-icon size="16">
          {{ volumeIcon }}
        </v-icon>

        <input
          v-model.number="volume"
          type="range"
          min="0"
          max="1"
          step="0.05"
          :aria-label="$t('musicPanel.volume')"
        />

        <span class="music-volume-value">
          {{ Math.round(volume * 100) }}%
        </span>
      </div>

      <small v-if="!wedding.music.Url" class="field-help">
        {{ $t('musicPanel.pickToPreview') }}
      </small>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { computed, onBeforeUnmount, ref, watch } from "vue";

import UploadField from "@/components/editor/UploadField.vue"; import PanelProgressBadge from "@/components/editor/PanelProgressBadge.vue";

const { t } = useI18n();

const props = defineProps({
  wedding: { type: Object, required: true },

  /* { done, total } từ Editor.vue — badge hoàn thiện mục. */
  progress: { type: Object, default: null },
});

/*
 * Bài hát có sẵn trong app (file nằm trong
 * public/music — giữ nguyên đường dẫn khi build).
 */
const PRESET_SONGS = [
  {
    get label() { return t("musicPanel.builtin"); },
    url: "/music/So_Beautiful_In_White.mp3",
    title: "Beautiful In White",
  },
];

const CUSTOM_VALUE = "__custom__";

const presetOptions = [
  ...PRESET_SONGS.map((song) => ({
    label: song.label,
    value: song.url,
  })),

  {
    get label() { return t("musicPanel.custom"); },
    value: CUSTOM_VALUE,
  },
];

/*
 * Khởi tạo lựa chọn theo URL hiện có:
 * trùng bài có sẵn thì chọn bài đó,
 * ngược lại coi như đang dùng link tùy chỉnh.
 */
const selectedPreset = ref(
  PRESET_SONGS.some((song) => song.url === props.wedding.music?.Url)
    ? props.wedding.music.Url
    : CUSTOM_VALUE
);

const isCustom = computed(() => selectedPreset.value === CUSTOM_VALUE);

watch(selectedPreset, (value) => {
  if (value === CUSTOM_VALUE) {
    return;
  }

  const song = PRESET_SONGS.find((item) => item.url === value);

  if (!song) {
    return;
  }

  props.wedding.music.Url = song.url;

  if (!props.wedding.music.Title) {
    props.wedding.music.Title = song.title;
  }
});

/* =========================================================
   NGHE THỬ
========================================================= */

const playing = ref(false);

const currentTime = ref(0);
const duration = ref(0);

const volume = ref(0.8);

let previewAudio = null;

const progressPercent = computed(() => {
  if (!duration.value) {
    return 0;
  }

  return Math.min(100, (currentTime.value / duration.value) * 100);
});

const volumeIcon = computed(() => {
  if (volume.value === 0) {
    return "mdi-volume-off";
  }

  return volume.value < 0.5 ? "mdi-volume-medium" : "mdi-volume-high";
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const total = Math.floor(seconds);

  const minutes = Math.floor(total / 60);

  const rest = String(total % 60).padStart(2, "0");

  return `${minutes}:${rest}`;
}

/*
 * Tạo thẻ Audio một lần rồi tái sử dụng — tránh việc
 * mỗi lần bấm nghe thử lại tải lại file.
 */
function ensureAudio() {
  if (previewAudio) {
    return previewAudio;
  }

  previewAudio = new Audio();

  previewAudio.volume = volume.value;

  previewAudio.addEventListener("ended", () => {
    playing.value = false;
    currentTime.value = 0;
  });

  previewAudio.addEventListener("timeupdate", () => {
    currentTime.value = previewAudio.currentTime;
  });

  previewAudio.addEventListener("loadedmetadata", () => {
    duration.value = previewAudio.duration;
  });

  return previewAudio;
}

function togglePreview() {
  const url = props.wedding.music?.Url;

  if (!url) {
    return;
  }

  const audio = ensureAudio();

  if (playing.value) {
    audio.pause();
    playing.value = false;

    return;
  }

  if (audio.src !== new URL(url, window.location.href).href) {
    audio.src = url;
    currentTime.value = 0;
    duration.value = 0;
  }

  audio
    .play()
    .then(() => {
      playing.value = true;
    })
    .catch((error) => {
      console.warn("[MusicPanel] Không phát được nhạc:", error);

      playing.value = false;
    });
}

watch(volume, (value) => {
  if (previewAudio) {
    previewAudio.volume = value;
  }
});

/*
 * Đổi bài khác thì dừng bản đang phát — tránh nghe lẫn
 * 2 bài.
 */
watch(
  () => props.wedding.music?.Url,
  () => {
    if (previewAudio) {
      previewAudio.pause();
    }

    playing.value = false;
    currentTime.value = 0;
    duration.value = 0;
  }
);

onBeforeUnmount(() => {
  if (previewAudio) {
    previewAudio.pause();
    previewAudio = null;
  }

  playing.value = false;
});
</script>

<style scoped>
.music-preview {
  display: flex;

  flex-direction: column;

  gap: 12px;

  margin-top: 6px;

  padding: 16px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 16px;

  background:
    radial-gradient(circle at 90% 10%, rgba(185, 151, 91, 0.12), transparent 60%),
    #fffdfb;
}

.music-preview-head {
  display: flex;

  align-items: center;

  gap: 12px;
}

.music-disc {
  width: 40px;

  height: 40px;

  flex: 0 0 40px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: linear-gradient(140deg, #a63a2e, #7c2a20);

  color: #f7e6c8;
}

.music-disc.spinning {
  animation: music-spin 3.2s linear infinite;
}

@keyframes music-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .music-disc.spinning {
    animation: none;
  }
}

.music-meta {
  flex: 1;

  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 2px;
}

.music-meta strong {
  overflow: hidden;

  white-space: nowrap;

  text-overflow: ellipsis;

  color: #3a2c26;

  font-size: 13px;
}

.music-meta span {
  color: #a8988a;

  font-size: 10.5px;
}

.music-play {
  width: 40px;

  height: 40px;

  flex: 0 0 40px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border: 0;

  border-radius: 50%;

  background: var(--wine, #a63a2e);

  color: #fff;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.music-play:hover:not(:disabled) {
  transform: scale(1.06);
}

.music-play:disabled {
  opacity: 0.4;

  cursor: not-allowed;
}

.music-progress {
  display: flex;

  align-items: center;

  gap: 9px;
}

.music-time {
  flex: 0 0 auto;

  color: #a8988a;

  font-size: 10px;

  font-variant-numeric: tabular-nums;
}

.music-track {
  flex: 1;

  height: 4px;

  border-radius: 999px;

  background: #ece4d9;

  overflow: hidden;
}

.music-track-fill {
  height: 100%;

  border-radius: 999px;

  background: var(--wine, #a63a2e);

  transition: width 0.2s linear;
}

.music-volume {
  display: flex;

  align-items: center;

  gap: 9px;

  color: #8a7a68;
}

.music-volume input[type="range"] {
  flex: 1;

  min-width: 0;

  accent-color: var(--wine, #a63a2e);
}

.music-volume-value {
  flex: 0 0 34px;

  text-align: right;

  color: #a8988a;

  font-size: 10px;

  font-variant-numeric: tabular-nums;
}
</style>
