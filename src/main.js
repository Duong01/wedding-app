import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import router from "./router";

// Vuetify
import { createVuetify } from "vuetify";
import "vuetify/styles";
import '@mdi/font/css/materialdesignicons.css';

// Components
// KHÔNG import toàn bộ "vuetify/components" — vite-plugin-vuetify
// sẽ tự tree-shake, chỉ gói những component thực sự dùng trong template
// (v-icon, v-dialog, v-btn, v-switch...). Giảm bundle chính ~500kB.
import "./assets/styles/theme.css";

// Design system cho các trang ứng dụng (Manage/Admin/Payment/Profile/Login)
// — mở rộng studio tokens, dùng chung thay vì CSS nhân bản từng view.
import "./assets/styles/app.css";

// Khung dùng chung cho trang chủ + các trang marketing/hỗ trợ
// (Giới thiệu, Bảng giá, Hướng dẫn, Liên hệ, trang đích SEO).
import "./assets/styles/marketing.css";

// Lớp phủ tối — đảo token studio khi <html> có class theme-dark
// (xem stores/theme.js + script inline trong index.html).
import "./assets/styles/dark.css";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
    directives,
    icons: {
        defaultSet: 'mdi'
    },
    theme: {
        defaultTheme: "light",

        themes: {
            light: {
                dark: false,

                colors: {
                    primary: "#a63a2e",
                    secondary: "#b9975b",
                    background: "#f7f1e6",
                    surface: "#fffdf8",
                    success: "#2e6b3f",
                    error: "#a03030",
                    info: "#2196F3",
                    warning: "#9a6b1f"
                }
            },

            // Đồng bộ với dark.css (class theme-dark trên <html>)
            // — App.vue đổi theme Vuetify theo store theme.
            dark: {
                dark: true,

                colors: {
                    primary: "#c96b5b",
                    secondary: "#d3b271",
                    background: "#17120d",
                    surface: "#241d15",
                    success: "#7fbf8f",
                    error: "#d07070",
                    info: "#64a8e8",
                    warning: "#d3b271"
                }
            }
        }
    }
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);


app.mount("#app");