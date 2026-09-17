<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> WEDDING MUSIC </span>

        <h1>Âm nhạc</h1>

        <p>Thiết lập nhạc nền cho thiệp.</p>
      </div>
    </div>

    <div class="switch-card">
      <div>
        <strong> Bật nhạc </strong>

        <small> Hiển thị nút điều khiển nhạc. </small>
      </div>

      <v-switch
        v-model="wedding.music.Enabled"
        color="primary"
        hide-details
      />
    </div>

    <div class="switch-card">
      <div>
        <strong> Tự động phát </strong>

        <small> Trình duyệt có thể chặn autoplay. </small>
      </div>

      <v-switch
        v-model="wedding.music.Autoplay"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field full">
      <label>Chọn bài hát</label>

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
        Chọn bài hát có sẵn trong app hoặc tự nhập link nhạc riêng.
      </small>
    </div>

    <div v-if="isCustom" class="editor-field full">
      <label>URL nhạc</label>

      <UploadField
        v-model="wedding.music.Url"
        kind="audio"
        button-text="Tải nhạc lên"
        icon="mdi-music-note-plus"
      />

      <small class="field-help">
        Tải file .mp3 lên server hoặc dán link trực tiếp để trình duyệt phát
        được.
      </small>
    </div>

    <div class="editor-field full">
      <label>Tên bài hát</label>

      <input
        v-model="wedding.music.Title"
        type="text"
        placeholder="Ví dụ: Beautiful In White"
      />
    </div>

    <div class="music-preview-row">
      <button
        type="button"
        class="small-primary-button"
        :disabled="!wedding.music.Url"
        @click="togglePreview"
      >
        <v-icon size="16">
          {{ playing ? "mdi-stop" : "mdi-play" }}
        </v-icon>

        {{ playing ? "Dừng nghe thử" : "Nghe thử" }}
      </button>

      <small v-if="!wedding.music.Url" class="field-help">
        Chọn hoặc nhập nhạc để nghe thử.
      </small>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from "vue";

import UploadField from "@/components/editor/UploadField.vue";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Bài hát có sẵn trong app (file nằm trong
 * src/assets/music — Vite tự đóng gói khi build).
 */
const PRESET_SONGS = [
  {
    label: "Beautiful In White (có sẵn)",
    url: "/src/assets/music/So_Beautiful_In_White.mp3",
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
    label: "Nhạc từ link khác (tùy chỉnh)",
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

let previewAudio = null;

function togglePreview() {
  const url = props.wedding.music?.Url;

  if (!url) {
    return;
  }

  if (playing.value) {
    previewAudio.pause();
    playing.value = false;

    return;
  }

  if (!previewAudio) {
    previewAudio = new Audio();

    previewAudio.addEventListener("ended", () => {
      playing.value = false;
    });
  }

  previewAudio.src = url;
  previewAudio.play();
  playing.value = true;
}

onBeforeUnmount(() => {
  if (previewAudio) {
    previewAudio.pause();
    previewAudio = null;
  }

  playing.value = false;
});
</script>

<style scoped>
.music-preview-row {
  display: flex;
  align-items: center;
  gap: 12px;

  margin-top: 4px;
}

.music-preview-row .small-primary-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
