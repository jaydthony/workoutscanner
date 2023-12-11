<template>
  <v-carousel
    height="100vh"
    show-arrows="hover"
    hide-delimiter-background
    cycle
  >
    <!-- <div class="logo">
      <img :src="require('../../assets/gym-logo.svg')" alt="" />
    </div> -->
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
        <h3 class="h3">Please Access With Your Phone</h3>
      </div>

      <v-btn :disabled="true" @click="scan = true">
        Scan QR Code <Icon icon="fluent:scan-dash-28-regular" />
      </v-btn>
    </div>

    <p class="redirect">
      <!-- <router-link to="/categories"> Click to register your gym. </router-link> -->
      <RegisterModal />
    </p>
    <div class="login">
      <button class="login-btn" @click="$router.push({ name: 'login' })">
        Login Here
      </button>
    </div>
  </v-carousel>
</template>

<script>
import { Icon } from "@iconify/vue";
import RegisterModal from "./RegisterModal.vue";

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
  },
  methods: {},
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

.login-btn {
  background: transparent;

  color: $primary-darker;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid $primary-normal-hover;
  &:hover {
    background-color: $primary-normal-active;
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 20px $primary-normal-active;
  }
}
.logo {
  position: absolute;
  width: 20%;
  min-width: 20%;
  /* height: 100%; */
  height: fit-content;
  left: 0;
  top: 10px;
}

.onboard-detail {
  @media (max-height: 700px) {
    gap: 20px;
  }
}
</style>
