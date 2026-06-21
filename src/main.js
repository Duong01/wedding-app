import { createApp } from "vue";
import App from "./App.vue";

import { createPinia } from "pinia";
import router from "./router";

// Vuetify
import { createVuetify } from "vuetify";
import "vuetify/styles";

// Material Design Icons
// import "@mdi/font/css/materialdesignicons.css";

// Global Style
// import "@/assets/css/main.scss";
// import "@/assets/css/animation.scss";

// Plugins
// import axios from "@/plugins/axios";
// import gsapPlugin from "@/plugins/gsap";
// import aosPlugin from "@/plugins/aos";
// import swiperPlugin from "@/plugins/swiper";

// Components


// Vuetify
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
    components,
    directives,
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

app.use(axios);

app.use(gsapPlugin);

app.use(aosPlugin);

app.use(swiperPlugin);

app.component("AppLoading", Loading);

app.component("ScrollTop", ScrollTop);

app.component("FloatingMusic", FloatingMusic);

app.mount("#app");