<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> LOCATION </span>

        <h1>Bản đồ</h1>

        <p>Thiết lập địa điểm và Google Maps.</p>
      </div>
    </div>

    <p v-if="!wedding.events?.length" class="map-hint">
      <v-icon size="15"> mdi-information-outline </v-icon>

      Địa điểm lấy từ mục <strong>Sự kiện cưới</strong>. Hãy thêm sự
      kiện trước.
    </p>

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

          <a
            v-if="event.Map"
            :href="event.Map"
            target="_blank"
            rel="noopener noreferrer"
            class="map-open"
            title="Mở trên Google Maps"
          >
            <v-icon size="16"> mdi-open-in-new </v-icon>
          </a>
        </div>

        <div class="form-grid">
          <div class="editor-field full">
            <label>Địa điểm</label>

            <input
              v-model="event.Location"
              type="text"
              placeholder="VD: Tư gia nhà gái"
            />
          </div>

          <div class="editor-field full">
            <label>Địa chỉ</label>

            <textarea
              v-model="event.Address"
              rows="3"
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
            />
          </div>

          <div class="editor-field full">
            <label>Google Maps</label>

            <input
              v-model="event.Map"
              type="text"
              placeholder="https://maps.google.com/?q=..."
            />

            <button
              type="button"
              class="inline-button"
              @click="buildMapLink(event)"
            >
              <v-icon size="15"> mdi-map-search-outline </v-icon>

              Tạo link từ địa chỉ
            </button>
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
const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Tạo link Google Maps từ địa chỉ người dùng đã nhập —
 * tiện hơn nhiều so với việc tự mở Maps, tìm rồi copy
 * URL dán ngược vào đây.
 */
function buildMapLink(event) {
  const query = [event.Location, event.Address]
    .filter(Boolean)
    .join(", ")
    .trim();

  if (!query) {
    return;
  }

  event.Map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}
</script>

<style scoped>
.map-hint {
  display: flex;

  align-items: center;

  gap: 7px;

  margin: 0 0 16px;

  padding: 11px 14px;

  border-radius: 11px;

  background: rgba(185, 151, 91, 0.1);

  color: #6b5a4e;

  font-size: 11.5px;
}

.map-open {
  width: 34px;

  height: 34px;

  flex: 0 0 34px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border-radius: 9px;

  background: #f4eee6;

  color: #6b5a4e;

  text-decoration: none;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.map-open:hover {
  background: #ece4d9;

  color: var(--wine, #a63a2e);

  transform: translateY(-1px);
}

.inline-button {
  align-self: flex-start;

  display: inline-flex;

  align-items: center;

  gap: 6px;

  margin-top: 2px;

  padding: 7px 12px;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 9px;

  background: #fffdfb;

  color: #6b5a4e;

  font-family: inherit;
  font-size: 11px;
  font-weight: 650;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.inline-button:hover {
  background: #f6f1ea;

  color: var(--wine, #a63a2e);
}
</style>
