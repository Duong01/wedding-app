<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> LOCATION </span>

        <h1>Bản đồ</h1>

        <p>Thiết lập địa điểm và Google Maps.</p>
      </div>
    </div>

    <div class="items-list">
      <article
        v-for="(event, index) in wedding.events"
        :key="event.Id || index"
        class="editor-card"
      >
        <div class="card-header">
          <div>
            <span> ĐỊA ĐIỂM {{ index + 1 }} </span>

            <strong>
              {{ event.Title || "Sự kiện" }}
            </strong>
          </div>
        </div>

        <div class="form-grid">
          <div class="editor-field full">
            <label>Địa điểm</label>

            <input v-model="event.Location" type="text" />
          </div>

          <div class="editor-field full">
            <label>Địa chỉ</label>

            <textarea v-model="event.Address" rows="3" />
          </div>

          <div class="editor-field full">
            <label>Google Maps</label>

            <input
              v-model="event.Map"
              type="text"
              placeholder="https://maps.google.com/?q=..."
            />
          </div>
        </div>
      </article>

      <div v-if="!wedding.events?.length" class="empty-card">
        <v-icon size="30"> mdi-map-marker-outline </v-icon>

        <strong> Chưa có địa điểm </strong>

        <span> Hãy thêm sự kiện trước khi thiết lập bản đồ. </span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  wedding: { type: Object, required: true },
});
</script>
