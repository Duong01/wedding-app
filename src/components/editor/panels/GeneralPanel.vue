<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> WEDDING INFORMATION </span>

        <h1>Thông tin chung</h1>

        <p>Thông tin cơ bản của thiệp cưới.</p>
      </div>
    </div>

    <div class="form-grid">
      <div class="editor-field">
        <label>Tên chú rể</label>

        <input
          v-model="wedding.groomName"
          type="text"
          placeholder="Trần Hiếu"
        />
      </div>

      <div class="editor-field">
        <label>Tên cô dâu</label>

        <input
          v-model="wedding.brideName"
          type="text"
          placeholder="Hà Uyên"
        />
      </div>

      <div class="editor-field">
        <label>Slug</label>

        <input
          v-model="wedding.slug"
          type="text"
          placeholder="ha-uyen-tran-hieu"
        />

        <small class="field-help">
          Đường dẫn của thiệp trên website.
        </small>
      </div>

      <div class="editor-field">
        <label>Ngôn ngữ</label>

        <select v-model="wedding.language">
          <option value="vi">Tiếng Việt</option>

          <option value="en">English</option>
        </select>
      </div>

      <div class="editor-field">
        <label>Ngày cưới</label>

        <input v-model="wedding.weddingDate" type="datetime-local" />
      </div>

      <div class="editor-field full">
        <label>Ảnh bìa</label>

        <input
          v-model="wedding.coverImage"
          type="text"
          placeholder="https://..."
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
