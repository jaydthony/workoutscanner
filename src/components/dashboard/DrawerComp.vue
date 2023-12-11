<template>
  <div class="side">
    <div
      :class="`${
        is_expanded || $vuetify.display.mdAndDown ? 'is-expanded' : ''
      } sider`"
    >
      <div class="top">
        <div class="logo-contain">
          <div class="logo">
            <!-- <img src='../../assets/gym.png' alt="logo" /> -->
            <v-img
              :src="require('../../assets/gym-logo.svg')"
              class="img"
              contain
              height="50"
              style="padding-bottom: 10px; margin-top: 30px"
            />
          </div>
          <!-- <hr style="margin-bottom: 20px" /> -->
        </div>
        <v-divider></v-divider>

        <div
          class="menu"
          :style="{
            'margin-bottom': !$store.state.user.is_superuser ? '80px' : '0',
          }"
        >
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :class="`button `"
            :to="item.to"
            v-show="
              item.onlyuser === !$store.state.user.is_superuser || item.both
            "
          >
            <div class="icon-cover">
              <Icon :icon="item.icon" width="30" height="30" />
              <!-- {{ item.icon }} -->
            </div>
            <span>{{ item.title }}</span>
          </router-link>
        </div>

        <div v-if="$store.state.user.is_superuser" class="menu">
          <router-link
            v-for="admin in adminItems"
            :key="admin.name"
            :class="`button `"
            :to="admin.to"
          >
            <div class="icon-cover">
              <v-badge
                v-if="admin.badge"
                overlap
                color="red"
                style="display: block !important"
              >
                <template v-slot:badge>
                  <!-- You can customize the badge content here -->
                  <p class="white--text">{{ $store.state.user.count }}</p>
                </template>
                <Icon :icon="admin.icon" width="30" height="30" />
              </v-badge>
              <Icon v-else :icon="admin.icon" width="30" height="30" />
            </div>
            <span>{{ admin.title }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <div
      :class="`${
        is_expanded || $vuetify.display.mdAndDown ? 'is-expanded-bottom' : ''
      } bottom`"
    >
      <v-divider></v-divider>
      <div @click="logout" class="bottom-btn" to="/logout">
        <div class="icon-cover">
          <!-- <v-img
            :src="require('../../assets/logout.png')"
            class="img-bottom"
            contain
            height="20"
          /> -->
          <Icon icon="ph:power" width="30" height="30" />
        </div>
        <span style="font-weight: 600">Logout</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  name: "DrawerComp",

  components: {
    Icon,
  },

  data() {
    return {
      opened: [],

      adminItems: [
        // {
        //   icon: "ic:round-app-registration",
        //   title: "Registration",
        //   value: "registration",
        //   name: "registration",
        //   link: true,
        //   divider: false,
        //   to: "/app/registrations",
        //   badge: true,
        // },
        // {
        //   icon: "gg:organisation",
        //   title: "Organisation",
        //   value: "organisation",
        //   name: "organisation",
        //   link: true,
        //   divider: false,
        //   to: "/app/organisations",
        //   badge: false,
        // },
        {
          // icon: require("../../assets/building.png"),
          icon: "fluent:people-community-48-regular",
          title: "clients",
          value: "clients",
          name: "clients",
          link: true,
          divider: false,
          to: "/app/clients",
          permission: false,
          onlyuser: false,
          both: true,
        },
      ],

      navigationItems: [
        {
          // icon: require("../../assets/home.png"),
          icon: "solar:home-2-broken",
          // icons: this.icon="solar:home-2-broken",
          title: "Overview",
          value: "overview",
          name: "overview",
          link: true,
          divider: false,
          to: "/app/dashboard",
          permission: false,
          onlyuser: false,
          both: true,
        },

        {
          // icon: require("../../assets/exercise.png"),
          icon: "streamline:travel-hotel-dumbell-sports-weights-dumbbell-sport-fitness",
          title: "exercise",
          value: "exercise",
          name: "exercise",
          link: true,
          divider: false,
          to: "/app/exercise",
          permission: false,
          onlyuser: false,
          both: true,
        },

        {
          // icon: require("../../assets/routine.png"),
          icon: "jam:task-list",
          title: "Workouts",
          value: "workouts",
          name: "workouts",
          link: false,
          divider: false,
          to: "/app/workouts",
          permission: false,
          onlyuser: false,
          both: true,
        },

        // {
        //   // icon: require("../../assets/video.png"),
        //   icon: "solar:videocamera-broken",
        //   title: "Content",
        //   value: "content",
        //   name: "content",
        //   link: true,
        //   divider: false,
        //   to: "/app/content",
        //   permission: false,
        // onlyuser:false
        // },
        {
          // icon: require("../../assets/video.png"),
          icon: "solar:videocamera-broken",
          title: "Program",
          value: "program",
          name: "program",
          link: true,
          divider: false,
          to: "/app/program",
          permission: false,
          onlyuser: false,
          both: true,
        },

        {
          // icon: require("../../assets/building.png"),
          icon: "solar:branching-paths-up-broken",
          title: "branches",
          value: "branches",
          name: "branches",
          link: true,
          divider: false,
          to: "/app/branches",
          permission: false,
          onlyuser: true,
          both: false,
        },

        {
          // icon: require("../../assets/setting.png"),
          icon: "solar:settings-broken",
          title: "Settings",
          value: "settings",
          name: "settings",
          link: true,
          divider: false,
          to: "/app/settings",
          both: true,
        },
      ],
    };
  },
  props: ["is_expanded"],

  methods: {
    async logout() {
      await this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
  },
};
</script>

<style lang="scss">
@import "../../scss/colors";
@import "../../scss/DrawerComp.scss";
</style>
<!-- <style lang="scss">
@import "../../scss/colors";
@import "../../scss/DrawerComp.scss";
</style> -->
