<template>
  <v-app>
    <!-- Main App Layout -->
    <v-main>
      <!-- Navigation Bar -->
      <v-navigation-drawer
        v-model="$store.state.drawerOpened"
        :temporary="$vuetify.display.mdAndDown"
        :permanent="!$vuetify.display.mdAndDown"
        app
        hide-overlay
        class="navigation-drawer"
        :width="`${is_expanded || $vuetify.display.mdAndDown ? '180' : '100'}`"
        @mouseenter="ToggleMenu"
        @mouseleave="ToggleMenu"
      >
        <DrawerComp :is_expanded="is_expanded" />
        <!-- <Sidevar/> -->
      </v-navigation-drawer>

      <!-- Inner Navigation Bar -->

      <AppHeaderComp />

      <!-- Chat Content Area -->
      <!-- Here goes the content area for your chat system -->
      <!-- You can use router-view or your custom components for different chat pages -->
      <!-- For example, you can have separate components for chat list, chat messages, etc. -->

      <main>
        <router-view v-show="!$store.state.dashboardLoading"></router-view>
        <div v-if="$store.state.dashboardLoading">
          <v-skeleton-loader
            color="rgb(232, 252, 180)"
            :elevation="2"
            height="100vh"
          >
          </v-skeleton-loader>
        </div>
      </main>
    </v-main>
  </v-app>
</template>

<script>
import DrawerComp from "../../components/dashboard/DrawerComp.vue";
import AppHeaderComp from "../../components/dashboard/AppHeaderComp.vue";
import Sidevar from "@/components/dashboard/Sidevar.vue";

// Mobile Layout
import MobileLayout from "./MobileLayout.vue";

export default {
  data() {
    return {
      drawerOpen: true,
      drawerOpen1: true,
      is_expanded: false,
    };
  },
  components: { DrawerComp, AppHeaderComp, Sidevar, MobileLayout },
  methods: {
    toggleDrawer() {
      this.drawerOpen = !this.drawerOpen;
    },

    ToggleMenu() {
      this.is_expanded = !this.is_expanded;
    },
  },

  computed: {
    mini() {
      // //console.log(this.$vuetify.display.mdAndDown);
      return this.$vuetify.display.mdAndDown;
    },
  },
};
</script>

<style lang="scss" scoped>
/* @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"); */
@import "../../scss/colors";
/* Style for mobile view */
.v-main {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  /* font-family: Inter, Verdana, sans-serif; */

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $primary-dark-active;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    -moz-border-radius: rem(4px);
    -webkit-border-radius: rem(4px);
    border-radius: rem(4px);
  }
}
.navigation-drawer {
  width: 100%;
  max-width: 100%;
}

.mobile {
  background-color: #1c1c1e;
  height: 100vh;
}

@media (min-width: 960px) {
  .v-container {
    max-width: 1100px;
  }
}

@media (min-width: 1280px) {
  .v-container {
    max-width: 1600px;
  }
}

.v-navigation-drawer__content {
  overflow-y: hidden;
}

/* Style for desktop view */
.chat-history-drawer {
  width: 320px; /* Change this value as needed */
}

.v-skeleton-loader__image {
  height: 100% !important;
}

.v-skeleton-loader .v-skeleton-loader__image {
  height: 100% !important;
}
</style>
