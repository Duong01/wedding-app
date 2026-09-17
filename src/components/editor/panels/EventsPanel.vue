<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> WEDDING EVENTS </span>

        <h1>Sự kiện cưới</h1>

        <p>Các buổi lễ và tiệc cưới.</p>
      </div>

      <button
        type="button"
        class="small-primary-button"
        @click="addEvent"
      >
        <v-icon size="17"> mdi-plus </v-icon>

        Thêm sự kiện
      </button>
    </div>

    <div class="items-list">
      <article
        v-for="(event, index) in wedding.events"
        :key="event.Id || index"
        class="editor-card"
      >
        <div class="card-header">
          <div>
            <span> SỰ KIỆN {{ index + 1 }} </span>

            <strong>
              {{ event.Title || "Chưa đặt tên" }}
            </strong>
          </div>

          <button
            type="button"
            class="danger-icon"
            title="Xóa sự kiện"
            @click="removeEvent(index)"
          >
            <v-icon size="18"> mdi-delete-outline </v-icon>
          </button>
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>Loại sự kiện</label>

            <input v-model="event.EventType" type="text" />
          </div>

          <div class="editor-field">
            <label>Tên sự kiện</label>

            <input v-model="event.Title" type="text" />
          </div>

          <div class="editor-field">
            <label>Thứ</label>

            <input v-model="event.Weekday" type="text" />
          </div>

          <div class="editor-field">
            <label>Ngày</label>

            <input v-model="event.Day" type="text" />
          </div>

          <div class="editor-field">
            <label>Tháng</label>

            <input v-model="event.Month" type="text" />
          </div>

          <div class="editor-field">
            <label>Năm</label>

            <input v-model="event.Year" type="text" />
          </div>

          <div class="editor-field">
            <label>Ngày tổ chức</label>

            <input v-model="event.EventDate" type="date" />
          </div>

          <div class="editor-field">
            <label>Giờ</label>

            <input v-model="event.EventTime" type="time" />
          </div>

          <div class="editor-field">
            <label>Âm lịch</label>

            <input v-model="event.Lunar" type="text" />
          </div>

          <div class="editor-field">
            <label>Địa điểm</label>

            <input v-model="event.Location" type="text" />
          </div>

          <div class="editor-field full">
            <label>Địa chỉ</label>

            <input v-model="event.Address" type="text" />
          </div>

          <div class="editor-field full">
            <label>Google Maps</label>

            <input
              v-model="event.Map"
              type="text"
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>
      </article>

      <div v-if="!wedding.events?.length" class="empty-card">
        <v-icon size="32"> mdi-calendar-heart-outline </v-icon>

        <strong> Chưa có sự kiện </strong>

        <span> Hãy thêm sự kiện cưới đầu tiên. </span>
      </div>

      <button type="button" class="add-button" @click="addEvent">
        <v-icon> mdi-plus </v-icon>

        Thêm sự kiện
      </button>
    </div>
  </section>
</template>

<script setup>
import { watch } from "vue";

const props = defineProps({
  wedding: { type: Object, required: true },
});

function addEvent() {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.events)) {
    props.wedding.events = [];
  }

  props.wedding.events.push({
    Id: Date.now(),
    EventType: "",
    Title: "",
    Weekday: "",
    Day: "",
    Month: "",
    Year: "",
    EventDate: "",
    EventTime: "",
    Lunar: "",
    Location: "",
    Address: "",
    Map: "",
  });
}

function removeEvent(index) {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.events)) return;

  props.wedding.events.splice(index, 1);
}

/*
 * Tự điền Weekday/Day/Month/Year từ EventDate —
 * người dùng chỉ cần chọn ngày là đủ, không phải
 * nhập lại từng trường.
 */
function applyEventDate(event) {
  if (!event?.EventDate) {
    return;
  }

  const date = new Date(event.EventDate);

  if (Number.isNaN(date.getTime())) {
    return;
  }

  const weekdays = [
    "CHỦ NHẬT",
    "THỨ HAI",
    "THỨ BA",
    "THỨ TƯ",
    "THỨ NĂM",
    "THỨ SÁU",
    "THỨ BẢY",
  ];

  event.Weekday = weekdays[date.getDay()];
  event.Day = String(date.getDate());
  event.Month = String(date.getMonth() + 1);
  event.Year = String(date.getFullYear());
}

watch(
  () => props.wedding?.events,
  (events) => {
    if (!Array.isArray(events)) {
      return;
    }

    events.forEach((event) => {
      if (event && event.EventDate) {
        applyEventDate(event);
      }
    });
  },
  { deep: true }
);
</script>
