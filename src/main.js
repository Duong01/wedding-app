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
                    primary: "#8f4d43",
                    secondary: "#c9a659",
                    background: "#faf7f2",
                    surface: "#FFFFFF",
                    success: "#2e7d32",
                    error: "#c62828",
                    info: "#2196F3",
                    warning: "#e9a13b"
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