import { defineStore } from "pinia";

/*
 * Theme giao diện sáng / tối.
 *
 * Hai chế độ: "light" (mặc định) và "dark".
 *
 * Lựa chọn lưu ở localStorage để giữ nguyên giữa các lần vào.
 * Theme được áp bằng class "theme-dark" trên <html> — lớp phủ
 * src/assets/styles/dark.css dựa vào class đó để đảo token.
 * Script inline trong index.html gắn class này TRƯỚC khi CSS tải
 * để không chớp nền sáng khi mở trang ở chế độ tối.
 */

const STORAGE_KEY = "thiepduyen:theme";

export const THEME_MODES = ["light", "dark"];

const MODE_META = {
  light: { label: "Sáng", icon: "mdi-weather-sunny" },
  dark: { label: "Tối", icon: "mdi-weather-night" },
};

function readPreference() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return THEME_MODES.includes(stored) ? stored : "light";
  } catch {
    return "light";
  }
}

export const useThemeStore = defineStore("theme", {
  state: () => ({
    /* Lựa chọn của người dùng: light | dark */
    preference: "light",
  }),

  getters: {
    /* Theme thực tế — đúng khi preference là "dark" */
    isDark(state) {
      return state.preference === "dark";
    },

    preferenceLabel(state) {
      return MODE_META[state.preference]?.label ?? MODE_META.light.label;
    },

    /* Icon nút bấm: mặt trời khi sáng, mặt trăng khi tối */
    preferenceIcon(state) {
      return MODE_META[state.preference]?.icon ?? MODE_META.light.icon;
    },
  },

  actions: {
    /* Gọi một lần khi App mount: đọc lựa chọn đã lưu rồi áp dụng. */
    init() {
      this.preference = readPreference();

      this.apply();
    },

    setPreference(preference) {
      if (!THEME_MODES.includes(preference)) {
        return;
      }

      this.preference = preference;

      try {
        localStorage.setItem(STORAGE_KEY, preference);
      } catch {
        /* localStorage bị chặn (private mode...) — vẫn đổi được trong phiên */
      }

      this.apply();
    },

    /* Nút bấm: sáng ↔ tối */
    toggle() {
      this.setPreference(this.isDark ? "light" : "dark");
    },

    /*
     * Gắn class "theme-dark" trên <html> + đổi màu thanh trình
     * duyệt (meta theme-color) theo nền hiện tại.
     */
    apply() {
      document.documentElement.classList.toggle("theme-dark", this.isDark);

      const meta = document.querySelector('meta[name="theme-color"]');

      if (meta) {
        meta.setAttribute("content", this.isDark ? "#17120d" : "#a63a2e");
      }
    },
  },
});
