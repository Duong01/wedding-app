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

          <EditorItemActions
            :index="index"
            :total="wedding.events.length"
            remove-title="Xoá sự kiện"
            @move="moveEvent"
            @remove="removeEvent"
          />
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>Loại sự kiện</label>

            <input
              v-model="event.EventType"
              type="text"
              list="event-type-options"
              placeholder="VD: Lễ thành hôn"
            />

            <datalist id="event-type-options">
              <option value="Lễ ăn hỏi" />
              <option value="Lễ thành hôn" />
              <option value="Tiệc cưới" />
              <option value="Lễ vu quy" />
              <option value="Lễ tân hôn" />
            </datalist>
          </div>

          <div class="editor-field">
            <label>Tên sự kiện</label>

            <input v-model="event.Title" type="text" />
          </div>

          <div class="editor-field full">
            <label>Ngày tổ chức</label>

            <input
              :value="toDateInput(event.EventDate)"
              type="date"
              @input="onEventDateInput(event, $event)"
            />

            <small class="field-help">
              Thứ, ngày, tháng, năm bên dưới được điền tự động.
            </small>
          </div>

          <div class="editor-field">
            <label>Giờ</label>

            <input v-model="event.EventTime" type="time" />
          </div>

          <div class="editor-field">
            <label>Âm lịch</label>

            <input
              v-model="event.Lunar"
              type="text"
              placeholder="VD: 12 tháng 5 năm Bính Ngọ"
            />
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

          <div class="editor-field full">
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

            <small v-if="event.Map" class="field-help">
              <a
                :href="event.Map"
                target="_blank"
                rel="noopener noreferrer"
                class="field-link"
              >
                Mở thử trên Google Maps ↗
              </a>
            </small>
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

import EditorItemActions from "@/components/editor/EditorItemActions.vue";

import { confirmDialog } from "@/composables/useConfirm";

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

async function removeEvent(index) {
  if (!props.wedding) return;

  if (!Array.isArray(props.wedding.events)) return;

  const event = props.wedding.events[index];

  const ok = await confirmDialog({
    title: "Xoá sự kiện này?",
    message: "Sự kiện sẽ bị xoá khỏi thiệp. Bạn vẫn hoàn tác được.",
    detail: event?.Title || `Sự kiện ${index + 1}`,
    confirmText: "Xoá sự kiện",
    danger: true,
  });

  if (!ok) {
    return;
  }

  props.wedding.events.splice(index, 1);
}

function moveEvent(index, direction) {
  const list = props.wedding.events;

  const target = index + direction;

  if (!Array.isArray(list) || target < 0 || target >= list.length) {
    return;
  }

  const [item] = list.splice(index, 1);

  list.splice(target, 0, item);
}

/*
 * Input type="date" chỉ nhận "YYYY-MM-DD" còn dữ liệu
 * có thể đang là ISO đầy đủ ("2026-11-14T08:00:00") —
 * cắt lấy phần ngày để input hiển thị đúng.
 */
function toDateInput(value) {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 10);
}

function onEventDateInput(event, domEvent) {
  event.EventDate = domEvent.target.value;

  applyEventDate(event);
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

<style scoped>
.field-link {
  color: var(--wine, #a63a2e);

  text-decoration: none;
}

.field-link:hover {
  text-decoration: underline;
}
</style>
