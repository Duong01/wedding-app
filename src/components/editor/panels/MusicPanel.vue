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

    <div class="form-grid">
      <div class="editor-field">
        <label>Tên bài hát</label>

        <input v-model="wedding.music.Title" type="text" />
      </div>

      <div class="editor-field">
        <label>URL nhạc</label>

        <input
          v-model="wedding.music.Url"
          type="text"
          placeholder="/music/wedding.mp3"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  wedding: { type: Object, required: true },
});
</script>
