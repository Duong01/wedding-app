<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> FOOTER </span>

        <h1>Footer</h1>

        <p>Thông tin cuối thiệp.</p>
      </div>
    </div>

    <div class="form-grid">
      <div class="editor-field">
        <label>Tên chú rể</label>

        <input v-model="wedding.footer.GroomName" type="text" />
      </div>

      <div class="editor-field">
        <label>Tên cô dâu</label>

        <input v-model="wedding.footer.BrideName" type="text" />
      </div>

      <div class="editor-field">
        <label>Copyright</label>

        <input v-model="wedding.footer.Copyright" type="text" />
      </div>

      <div class="editor-field full">
        <label>Lời kết</label>

        <textarea v-model="wedding.footer.Message" rows="6" />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  wedding: { type: Object, required: true },
});
</script>
