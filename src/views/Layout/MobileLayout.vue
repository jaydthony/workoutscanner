<template>
  <v-app>
    <!-- Main App Layout -->
    <v-main>
      <!-- Chat Content Area -->
      <!-- Here goes the content area for your chat system -->
      <!-- You can use router-view or your custom components for different chat pages -->
      <!-- For example, you can have separate components for chat list, chat messages, etc. -->
      <div class="logo">
        <img :src="require('../../assets/gym-logo.svg')" alt="" />
      </div>
      <div v-if="$vuetify.display.mdAndDown" style="height: 100%">
        <router-view></router-view>
      </div>
      <div v-else class="not-allowed">
        <!-- <router-view></router-view>   -->
        <OnBoarding />
      </div>
      <v-overlay
        :model-value="$store.state.dashboardLoading"
        contained
        persistent
        class="align-center justify-center"
        :close-on-content-click="false"
      >
        <v-progress-circular
          color="rgb(81, 110, 5)"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </v-main>
  </v-app>
</template>

<script>
import OnBoarding from "../mobile/OnBoarding.vue";

const isStandalonePWAInstalled = () => {
  if ("standalone" in navigator) {
    // iOS devices
    return navigator.standalone;
  }
  if (
    window.matchMedia &&
    window.matchMedia("(display-mode: standalone)").matches
  ) {
    // Other platforms with support for the media query
    return true;
  }
  // PWA is not installed
  return false;
};

const isInStandaloneMode = () =>
  "standalone" in window.navigator && window.navigator.standalone;

const isMobile = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();

  return /iphone|ipad|ipod|android|webos|blackberry|windows phone/i.test(
    userAgent
  );
};

const userAgent = navigator.userAgent.toLowerCase();
const isAndroid = /android/i.test(userAgent);
const isIos = /iphone|ipad|ipod/.test(userAgent);

export default {
  name: "MobileLayout",
  data: () => ({
    installEvent: null,
    isIPhone: false,
    isIPhone: isIos,
    isAndroid: isAndroid,
  }),
  components: { OnBoarding },
  methods: {
    showPrompt() {
      //console.log("shwoing ");
      this.$swal({
        title: "Workout Scanner App",

        html: `
        <div>

          <div class="prompt-content">
            <img width="80" class="logo" src="./gym-logo.png" alt="Workout Scanner" />

            <p>This website becomes a mobile app when added to the home screen</p>

          </div>
        </div>
      `,
        icon: "Info",

        showCancelButton: true,
        confirmButtonText: "Install",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          // Do something when the user confirms
          this.installPWA();
        } else {
          // Do something when the user cancels
          sessionStorage.setItem("shown", true);
        }
      });
    },

    showPrompt1() {
      if (this.isIPhone) {
        this.$swal({
          title: "Workout Scanner",
          html: `
        <div>

          <div class="prompt-content">
            <img width="80" class="logo" src="./gym-logo.png" alt="Workout Scanner" />

            <p>This website becomes a mobile app when added to home screen</p>

            <p>
              1. Tap on the

              <img src="https://img.favpng.com/3/12/19/share-icon-computer-icons-button-safari-web-browser-png-favpng-SG6z4WDFeH7cCR0LxR5nAbFEY.jpg" width="60"/>
            </p>
            <p>2. Select <button class="btn-action" @click="showPrompt">Add to Home Screen</button></p>
          </div>
        </div>
      `,
          showCancelButton: true,
          confirmButtonText: "Add to Home Screen",
          cancelButtonText: "Cancel",
          customClass: {
            // Add custom CSS classes here if needed
          },
        }).then((result) => {
          if (result.isConfirmed) {
            // Handle the user's confirmation action if needed
          }
        });
      }
      if (this.isAndroid) {
        this.$swal({
          title: "Workout Scanner",
          html: `
        <div>

          <div class="prompt-content">
            <img width="80" class="logo" src="gym-logo.png" alt="Workout Scanner" />

            <p>This website becomes a mobile app when added to home screen</p>


            <p v-if="isAndroid">
              1. Tap on the
              <img src="https://www.svgrepo.com/show/313878/ellipsis-v-solid.svg" width="60"/>
            </p>
            <p>2. Select <button class="btn-action" @click="showPrompt">Add to Home Screen</button></p>
          </div>
        </div>
      `,
          showCancelButton: true,
          confirmButtonText: "Add to Home Screen",
          cancelButtonText: "Cancel",
          customClass: {
            // Add custom CSS classes here if needed
          },
        }).then((result) => {
          if (result.isConfirmed) {
            // Handle the user's confirmation action if needed
          }
        });
      }
    },

    installPWA() {
      //console.log(this.installEvent, "event");
      this.installEvent.prompt();
      this.installEvent.userChoice.then((choice) => {
        if (choice.outcome === "accepted") {
          // Do something additional if the user chose to install
        } else {
          // Do something additional if the user declined
        }
      });
    },
  },

  created() {
    // this.showPrompt();
    const shown = sessionStorage.getItem("shown");
    if (isMobile() && !isInStandaloneMode() && !shown) {
      if (!isStandalonePWAInstalled()) {
        setTimeout(() => {
          const installPromptListener = (e) => {
            e.preventDefault();

            this.installEvent = e;
            //console.log(this.installEvent, "event");
            this.showPrompt();

            // Remove the event listener after it's been used once
            window.removeEventListener(
              "beforeinstallprompt",
              installPromptListener
            );
          };

          window.addEventListener("beforeinstallprompt", installPromptListener);

          // Set a timeout to handle the case where the event is not triggered
          setTimeout(() => {
            // Check if the installEvent is still null, indicating that the event did not occur
            if (!this.installEvent) {
              this.showPrompt1();
              // Handle the case where the event is not found
              // //console.log(
              //   "beforeinstallprompt event not triggered within the timeout"
              // );
              // Do something here
            }
          }, 4000); // Adjust the timeout duration as needed
        }, 3000);
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");
@import "../../scss/colors";
.v-main {
  font-family: Inter, Verdana, sans-serif;
  /* background-color: #1c1c1e; */
  // background-color: $neutral-dark;
}

.logo {
  position: absolute;
  color: white;
  font-size: 20px;
  z-index: 1;
  top: 0;
  left: 0;
  width: 80px;
}

.not-allowed {
  color: $secondary-darker;
  background-color: $neutral-dark-hover;
  height: 100vh;
  display: flex;
  align-content: center;
  align-self: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  h1 {
    font-size: 60px;
    /* font-style: italic; */
  }

  h2 {
    font-size: 40px;
    font-style: italic;
    color: $primary-normal-active;
  }
}
</style>
