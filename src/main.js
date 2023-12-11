import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import Toast, { use } from "vue-toastification";
import "vue-toastification/dist/index.css";
// import VueYouTubeEmbed from "vue-youtube-embed";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

import QrReader from "vue3-qr-reader";
import "./registerServiceWorker";

const options = {
  confirmButtonColor: "rgb(144, 195, 10)",
  cancelButtonColor: "rgb(153, 156, 148)",
};
loadFonts(); 

import YouTube from "vue3-youtube";

// Vue.component('YouTube', YouTube)

createApp(App)
  .use(router)
  .use(store)
  .use(VueSweetalert2, options)
  .use(vuetify)
  .use(Toast)
  .use(QrReader)
  .component("YouTube", YouTube)
  .mount("#app");
