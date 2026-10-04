<template>
  <section class="editor-panel">
    <div class="panel-header panel-header-row">
      <div>
        <span class="panel-eyebrow"> WEDDING EVENTS </span>

        <h1>{{ $t('editor.menu.events') }}</h1>

        <p>{{ $t('eventsPanel.desc') }}</p>
      </div>

      <button
        type="button"
        class="small-primary-button"
        @click="addEvent"
      >
        <v-icon size="17"> mdi-plus </v-icon>

        {{ $t('eventsPanel.add') }}
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
            <span> {{ $t('eventsPanel.itemLabel') }} {{ index + 1 }} </span>

            <strong>
              {{ event.Title || $t('panel.untitled') }}
            </strong>
          </div>

          <EditorItemActions
            :index="index"
            :total="wedding.events.length"
            :remove-title="$t('eventsPanel.remove')"
            @move="moveEvent"
            @remove="removeEvent"
          />
        </div>

        <div class="form-grid">
          <div class="editor-field">
            <label>{{ $t('eventsPanel.type') }}</label>

            <input
              v-model="event.EventType"
              type="text"
              list="event-type-options"
              :placeholder="$t('eventsPanel.typePlaceholder')"
            />

            <small class="field-help">
              {{ $t('couplePanel.roleHint') }}
            </small>

            <datalist id="event-type-options">
              <option value="Lễ ăn hỏi" />
              <option value="Lễ thành hôn" />
              <option value="Tiệc cưới" />
              <option value="Lễ vu quy" />
              <option value="Lễ tân hôn" />
            </datalist>
          </div>

          <div class="editor-field">
            <label>{{ $t('eventsPanel.name') }}</label>

            <input
              v-model="event.Title"
              type="text"
              :placeholder="$t('eventsPanel.namePlaceholder')"
            />

            <small class="field-help">
              {{ $t('eventsPanel.nameHint') }}
            </small>
          </div>

          <div class="editor-field full">
            <label>{{ $t('eventsPanel.date') }}</label>

            <input
              :value="toDateInput(event.EventDate)"
              type="date"
              @input="onEventDateInput(event, $event)"
            />

            <small class="field-help">
              {{ $t('eventsPanel.dateHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('eventsPanel.time') }}</label>

            <input v-model="event.EventTime" type="time" />

            <small class="field-help">
              {{ $t('eventsPanel.timeHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('eventsPanel.lunar') }}</label>

            <input
              v-model="event.Lunar"
              type="text"
              :placeholder="$t('generalPanel.lunarPlaceholder')"
            />

            <small class="field-help">
              {{ $t('eventsPanel.lunarHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('eventsPanel.weekday') }}</label>

            <input v-model="event.Weekday" type="text" />

            <small class="field-help">
              {{ $t('eventsPanel.autoHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('eventsPanel.day') }}</label>

            <input v-model="event.Day" type="text" />

            <small class="field-help">
              {{ $t('eventsPanel.autoHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('eventsPanel.month') }}</label>

            <input v-model="event.Month" type="text" />

            <small class="field-help">
              {{ $t('eventsPanel.autoHint') }}
            </small>
          </div>

          <div class="editor-field">
            <label>{{ $t('eventsPanel.year') }}</label>

            <input v-model="event.Year" type="text" />

            <small class="field-help">
              {{ $t('eventsPanel.autoHint') }}
            </small>
          </div>

          <div class="editor-field full">
            <label>{{ $t('heroPanel.venue') }}</label>

            <input
              v-model="event.Location"
              type="text"
              :placeholder="$t('eventsPanel.venuePlaceholder')"
            />

            <small class="field-help">
              {{ $t('eventsPanel.venueHint') }}
            </small>
          </div>

          <div class="editor-field full">
            <label>{{ $t('couplePanel.address') }}</label>

            <input
              v-model="event.Address"
              type="text"
              :placeholder="$t('couplePanel.addressPlaceholder')"
            />

            <small class="field-help">
              {{ $t('eventsPanel.addressHint') }}
            </small>
          </div>

          <div class="editor-field full">
            <label>Google Maps</label>

            <input
              v-model="event.Map"
              type="text"
              placeholder="https://maps.google.com/..."
            />

            <button
              type="button"
              class="inline-button"
              @click="buildMapLink(event)"
            >
              <v-icon size="15"> mdi-map-search-outline </v-icon>

              {{ $t('eventsPanel.mapFromAddress') }}
            </button>

            <small class="field-help">
              {{ $t('eventsPanel.mapHint') }}
            </small>

            <small v-if="event.Map" class="field-help">
              <a
                :href="event.Map"
                target="_blank"
                rel="noopener noreferrer"
                class="field-link"
              >
                {{ $t('eventsPanel.openMaps') }}
              </a>
            </small>
          </div>
        </div>
      </article>

      <div v-if="!wedding.events?.length" class="empty-card">
        <v-icon size="32"> mdi-calendar-heart-outline </v-icon>

        <strong> {{ $t('eventsPanel.empty') }} </strong>

        <span> {{ $t('eventsPanel.emptyHint') }} </span>
      </div>

      <button type="button" class="add-button" @click="addEvent">
        <v-icon> mdi-plus </v-icon>

        {{ $t('eventsPanel.add') }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { watch } from "vue";

import EditorItemActions from "@/components/editor/EditorItemActions.vue";

import { confirmDialog } from "@/composables/useConfirm";

const { t } = useI18n();

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
    get title() { return t("eventsPanel.confirmTitle"); },
    get message() { return t("eventsPanel.confirmMessage"); },
    detail: event?.Title || t("eventsPanel.itemN", { n: index + 1 }),
    get confirmText() { return t("eventsPanel.remove"); },
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
