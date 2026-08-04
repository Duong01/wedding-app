import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import router from "./router";

// Vuetify
import { createVuetify } from "vuetify";
import "vuetify/styles";
import '@mdi/font/css/materialdesignicons.css';

// Components
// import Loading from "./components/common/Loading.vue";
import ScrollTop from "./components/common/ScrollTop.vue";
import FloatingMusic from "./components/common/FloatingMusic.vue";

// Vuetify
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
    components,
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
                    primary: "#E8B4B8",
                    secondary: "#D4AF37",
                    background: "#FFF8F6",
                    surface: "#FFFFFF",
                    success: "#4CAF50",
                    error: "#F44336",
                    info: "#2196F3",
                    warning: "#FFC107"
                }
            }
        }
    }
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

// app.component("AppLoading", Loading);
app.component("ScrollTop", ScrollTop);
app.component("FloatingMusic", FloatingMusic);

app.mount("#app");