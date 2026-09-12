<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> HERO </span>

        <h1>Ảnh bìa</h1>

        <p>Nội dung xuất hiện đầu tiên khi khách mở thiệp.</p>
      </div>
    </div>

    <div class="form-grid">
      <div class="editor-field">
        <label>Tiêu đề</label>

        <input v-model="wedding.hero.Title" type="text" />
      </div>

      <div class="editor-field">
        <label>Lời mời</label>

        <input v-model="wedding.hero.Subtitle" type="text" />
      </div>

      <div class="editor-field">
        <label>Tên chú rể</label>

        <input v-model="wedding.hero.GroomName" type="text" />
      </div>

      <div class="editor-field">
        <label>Tên cô dâu</label>

        <input v-model="wedding.hero.BrideName" type="text" />
      </div>

      <div class="editor-field">
        <label>Ngày cưới</label>

        <input v-model="wedding.hero.WeddingDate" type="text" />
      </div>

      <div class="editor-field">
        <label>Địa điểm</label>

        <input v-model="wedding.hero.Location" type="text" />
      </div>

      <div class="editor-field full">
        <label>Ảnh nền</label>

        <input
          v-model="wedding.hero.Background"
          type="text"
          placeholder="/images/hero.jpg"
        />
      </div>

      <div class="editor-field full">
        <label>Nhạc</label>

        <input
          v-model="wedding.hero.Music"
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
