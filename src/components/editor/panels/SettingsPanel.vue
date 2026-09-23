<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> DISPLAY SETTINGS </span>

        <h1>Cài đặt hiển thị</h1>

        <p>Chọn những phần xuất hiện trên thiệp.</p>
      </div>
    </div>

    <div class="settings-toolbar">
      <span>
        Đang bật <strong>{{ enabledCount }}</strong> /
        {{ SETTINGS_ORDER.length }} mục
      </span>

      <div class="settings-toolbar-actions">
        <button type="button" class="toolbar-btn" @click="toggleAll(true)">
          Bật tất cả
        </button>

        <button type="button" class="toolbar-btn" @click="toggleAll(false)">
          Tắt tất cả
        </button>
      </div>
    </div>

    <div class="settings-grid">
      <div
        v-for="key in SETTINGS_ORDER"
        :key="key"
        class="setting-item"
      >
        <div class="setting-info">
          <div class="setting-icon">
            <v-icon size="17">
              {{ settingMeta(key)?.icon || "mdi-eye-outline" }}
            </v-icon>
          </div>

          <div>
            <strong>
              {{ settingMeta(key)?.label || key }}
            </strong>

            <small>
              {{ settingMeta(key)?.description || "" }}
            </small>
          </div>
        </div>

        <v-switch
          v-model="settings[key]"
          color="primary"
          hide-details
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  wedding: { type: Object, required: true },
});

/*
 * Metadata cho từng flag ShowX trong wedding.settings.
 * (Trước đây template gọi settingIcon/settingLabel/
 * settingDescription nhưng các hàm không tồn tại → lỗi runtime.)
 */
const SETTINGS_META = {
  ShowHero: {
    icon: "mdi-image-outline",
    label: "Ảnh bìa",
    description: "Màn hình mở đầu thiệp.",
  },
  ShowCouple: {
    icon: "mdi-heart-outline",
    label: "Cô dâu & Chú rể",
    description: "Thông tin hai nhân vật chính.",
  },
  ShowStory: {
    icon: "mdi-book-heart-outline",
    label: "Chuyện tình yêu",
    description: "Câu chuyện của hai bạn.",
  },
  ShowEvents: {
    icon: "mdi-calendar-heart-outline",
    label: "Sự kiện cưới",
    description: "Ngày giờ và địa điểm.",
  },
  ShowDressCode: {
    icon: "mdi-tshirt-crew-outline",
    label: "Trang phục",
    description: "Gợi ý dress code cho khách.",
  },
  ShowTimeline: {
    icon: "mdi-timeline-outline",
    label: "Timeline",
    description: "Lịch trình ngày cưới.",
  },
  ShowCountdown: {
    icon: "mdi-timer-outline",
    label: "Đếm ngược",
    description: "Thời gian còn lại đến ngày cưới.",
  },
  ShowGallery: {
    icon: "mdi-image-multiple-outline",
    label: "Album ảnh",
    description: "Khoảnh khắc đáng nhớ.",
  },
  ShowMap: {
    icon: "mdi-map-marker-outline",
    label: "Bản đồ",
    description: "Địa điểm và Google Maps.",
  },
  ShowGift: {
    icon: "mdi-gift-outline",
    label: "Mừng cưới",
    description: "Tài khoản nhận mừng cưới.",
  },
  ShowGuestBook: {
    icon: "mdi-message-heart-outline",
    label: "Sổ lưu bút",
    description: "Lời chúc của khách mời.",
  },
  ShowMusic: {
    icon: "mdi-music-outline",
    label: "Âm nhạc",
    description: "Nhạc nền cho thiệp.",
  },
  ShowFooter: {
    icon: "mdi-page-layout-footer",
    label: "Footer",
    description: "Thông tin cuối thiệp.",
  },
};

/*
 * Thứ tự hiển thị mong muốn — theo đúng trình tự các
 * mục xuất hiện trên thiệp, không phụ thuộc thứ tự key
 * trong object (dữ liệu cũ có thể thiếu/thừa key).
 */
const SETTINGS_ORDER = Object.keys(SETTINGS_META);

/*
 * Dữ liệu cũ có thể chưa có ShowDressCode → bổ sung
 * mặc định để switch hiển thị và ghi được giá trị.
 */
const settings = computed(() => {
  const data = props.wedding.settings;

  if (!data || typeof data !== "object") {
    props.wedding.settings = {};
  }

  SETTINGS_ORDER.forEach((key) => {
    if (typeof props.wedding.settings[key] !== "boolean") {
      props.wedding.settings[key] = true;
    }
  });

  return props.wedding.settings;
});

/*
 * Số mục đang bật / tổng số — giúp người dùng biết
 * ngay mình đã tắt bao nhiêu phần.
 */
const enabledCount = computed(
  () => SETTINGS_ORDER.filter((key) => settings.value[key]).length
);

function settingMeta(key) {
  return SETTINGS_META[key];
}

function toggleAll(value) {
  SETTINGS_ORDER.forEach((key) => {
    props.wedding.settings[key] = value;
  });
}
</script>

<style scoped>
.settings-toolbar {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 14px;

  margin-bottom: 16px;

  padding: 11px 14px;

  border: 1px solid var(--border, #ece4da);
  border-radius: 12px;

  background: #fffdfb;
}

.settings-toolbar span {
  color: #8a7a68;

  font-size: 11.5px;
}

.settings-toolbar strong {
  color: #3a2c26;
}

.settings-toolbar-actions {
  display: flex;

  gap: 7px;
}

.toolbar-btn {
  height: 30px;

  padding: 0 12px;

  border: 1px solid var(--border-strong, #e0d4c5);
  border-radius: 8px;

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

.toolbar-btn:hover {
  background: #f6f1ea;

  color: var(--wine, #a63a2e);
}
</style>
