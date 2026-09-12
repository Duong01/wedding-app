<template>
  <section class="editor-panel">
    <div class="panel-header">
      <div>
        <span class="panel-eyebrow"> DISPLAY SETTINGS </span>

        <h1>Cài đặt hiển thị</h1>

        <p>Chọn những phần xuất hiện trên thiệp.</p>
      </div>
    </div>

    <div class="settings-grid">
      <div
        v-for="(value, key) in wedding.settings"
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
          v-model="wedding.settings[key]"
          color="primary"
          hide-details
        />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
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

function settingMeta(key) {
  return SETTINGS_META[key];
}
</script>
