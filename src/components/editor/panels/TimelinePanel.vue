<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> WEDDING DAY </span>

        <h1>Timeline</h1>

        <p>Các mốc thời gian trong ngày cưới.</p>
      </div>

      <button
        type="button"
        class="small-primary-button"
        @click="addTimeline"
      >
        <v-icon size="17"> mdi-plus </v-icon>

        Thêm mốc
      </button>
    </div>

    <div class="items-list">
      <article
        v-for="(item, index) in wedding.timeline"
        :key="item.Id || index"
        class="editor-card timeline-card"
      >
        <div class="card-header">
          <div>
            <span> MỐC {{ index + 1 }} </span>

            <strong>
              {{ item.Title || "Chưa đặt tên" }}
            </strong>
          </div>

          <button
            type="button"
            class="danger-icon"
            title="Xóa mốc"
            @click="removeTimeline(index)"
          >
            <v-icon size="18"> mdi-delete-outline </v-icon>
          </button>
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>Thời gian</label>

            <input v-model="item.Time" type="time" />
          </div>

          <div class="editor-field">
            <label>Tiêu đề</label>

            <input v-model="item.Title" type="text" />
          </div>

          <div class="editor-field">
            <label>Địa điểm</label>

            <input v-model="item.Location" type="text" />
          </div>

          <div class="editor-field">
            <label>Icon</label>

            <input v-model="item.Icon" type="text" placeholder="♡" />
          </div>

          <div class="editor-field full">
            <label>Mô tả</label>

            <textarea v-model="item.Description" rows="4" />
          </div>
        </div>
      </article>

      <button type="button" class="add-button" @click="addTimeline">
        <v-icon> mdi-plus </v-icon>

        Thêm mốc thời gian
      </button>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  wedding: { type: Object, required: true },
});

function addTimeline() {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.timeline)) {
    props.wedding.timeline = [];
  }

  props.wedding.timeline.push({
    Id: Date.now(),
    Time: "",
    Title: "",
    Description: "",
    Location: "",
    Icon: "",
  });
}

function removeTimeline(index) {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.timeline)) return;

  props.wedding.timeline.splice(index, 1);
}
</script>
