<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> OUR STORY </span>

        <h1>Chuyện tình yêu</h1>

        <p>Kể lại câu chuyện của hai bạn.</p>
      </div>
    </div>

    <div class="editor-field">
      <label>Tiêu đề</label>

      <input v-model="wedding.story.Title" type="text" />
    </div>

    <div class="editor-field">
      <label>Nội dung</label>

      <textarea
        v-model="wedding.story.Description"
        rows="10"
        placeholder="Viết câu chuyện tình yêu..."
      />
    </div>
  </section>
</template>

<script setup>
defineProps({
  wedding: { type: Object, required: true },
});
</script>
