<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> COUNTDOWN </span>

        <h1>Đếm ngược</h1>

        <p>Hiển thị thời gian còn lại đến ngày cưới.</p>
      </div>
    </div>

    <div class="switch-card">
      <div>
        <strong> Hiển thị Countdown </strong>

        <small> Tự động đếm ngược đến ngày cưới. </small>
      </div>

      <v-switch
        v-model="wedding.countdown.Enabled"
        color="primary"
        hide-details
      />
    </div>

    <div class="editor-field">
      <label>Ngày kết thúc</label>

      <input v-model="wedding.countdown.Target" type="datetime-local" />
    </div>
  </section>
</template>

<script setup>
defineProps({
  wedding: { type: Object, required: true },
});
</script>
