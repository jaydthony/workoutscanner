<template>
  <div>
    <div class="login">
      <div class="login">
        <button @click="$router.push({ name: 'login' })">Login Here</button>
      </div>
    </div>
    <v-carousel
      height="100vh"
      show-arrows="hover"
      hide-delimiter-background
      delimiter-icon="mdi-rectangle"
      color="rgb(180, 244, 12)"
      v-if="!scan"
    >
      <v-carousel-item>
        <div class="testing">
          <div class="testing-top"></div>
          <!-- <div class="testing-intro">
                      <h3>Meet your coach, <br> start your journey</h3>
                  </div> -->
        </div>
      </v-carousel-item>
      <v-carousel-item>
        <div class="testing">
          <div
            class="testing-top2"
            style="background-image: ('../../assets/Background2.png')"
          ></div>
          <!-- <div class="testing-intro">
                      <h3>Create a workout plan, <br> to stay fit</h3>
                  </div> -->
        </div>
      </v-carousel-item>
      <v-carousel-item>
        <div class="testing">
          <div class="testing-top3"></div>
          <!-- <div class="testing-intro">
                      <h3>Workout Scanner </h3>
                      <span>Actions is the key to all success</span>
                      <button>Scan QR Code</button>
                  </div>
  
                  <p>Click to register your gym.</p> -->
        </div>
      </v-carousel-item>
      <div class="onboard-detail">
        <Icon icon="carbon:scan-alt" color="#b4f40c" width="120" height="120" />

        <div class="intro-det">
          <h3>Workout Scanner</h3>
          <h6>Actions is the key to all success</h6>
        </div>

        <button @click="scan = true">
          Scan QR Code <Icon icon="fluent:scan-dash-28-regular" />
        </button>
      </div>

      <!-- <div class="logo">
        <img :src="require('../../assets/gym-logo.svg')" alt="" />
      </div> -->

      <p class="redirect">
        <!-- <router-link to="/categories">
          Click to register your gym.
        </router-link> -->
        <RegisterModal />
      </p>
    </v-carousel>
    <div v-else class="stream">
      <div class="mainContent">
        <qr-stream @decode="onDecode" class="mb">
          <div style="color: red" class="frame"></div>
        </qr-stream>
      </div>
      <div class="result">Result: {{ code }}</div>
      <div
        class="qr-btn"
        style="
          position: absolute;
          bottom: 15%;
          text-align: center;
          width: 100%;
          display: flex;
          justify-content: center;
        "
      >
        <button @click="scan = false">
          Close <Icon icon="solar:close-circle-broken" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import { QrStream, QrCapture, QrDropzone } from "vue3-qr-reader";
import RegisterModal from "./RegisterModal.vue";
import LoginButton from "./Login.vue";
export default {
  name: "Testing",
  data() {
    return {
      code: false,
      scan: false,
    };
  },
  components: {
    Icon,
    RegisterModal,
    QrStream,
    QrCapture,
    QrDropzone,
    LoginButton,
  },
  methods: {
    onDecode(data) {
      this.code = data;
      const url = data;

      // Split the URL by "/"
      const parts = url.split("/");

      // Get the last part (which is the last parameter)
      const lastParameter = parts[parts.length - 1];

      //console.log(lastParameter);
      this.$router.push({ name: "categories", params: { id: lastParameter } });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/colors";
@import "../../scss/mobiles-styles/OnBoarding.scss";

.login {
  position: absolute;
  z-index: 100;
  right: 15px;
  top: 5px;
}

.stream {
  position: relative;
  height: 100vh;
}

.mainContent {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 50%;
  border: 4px dashed $primary-normal;
  /* Add any other child styles as needed */
}

.logo {
  position: absolute;
  width: 10%;
  min-width: 10%;
  height: 100%;
  left: 0;
  top: 10px;
}
</style>
