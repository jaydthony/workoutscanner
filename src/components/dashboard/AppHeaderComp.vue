<template>
  <v-app-bar class="header">
    <div class="header-cover">
      <v-toolbar-title style="display: flex; align-items: center">
        <div class="left-cover">
          <v-btn
            v-if="$store.state.drawerOpened"
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="$store.state.drawerOpened = !$store.state.drawerOpened"
          ></v-btn>
          <v-btn
            v-else
            variant="text"
            icon="mdi-chevron-right"
            @click.stop="$store.state.drawerOpened = !$store.state.drawerOpened"
          ></v-btn>
          <span v-if="!$store.state.dashboardLoading" class="page-name">{{
            $route.meta.title
          }}</span>
          <v-progress-circular
            v-else
            color="rgb(180, 244, 12)"
            indeterminate
          ></v-progress-circular>
        </div>
      </v-toolbar-title>
      <!-- <v-spacer></v-spacer> -->
      <!-- <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text to="/">QuickMobile</v-btn>
        <v-btn @click="logout">Logout</v-btn>
      </v-toolbar-items> -->
      <div class="right-cover">
        <Icon
          icon="solar:bell-broken"
          width="28"
          height="28"
          style="cursor: pointer"
        />
        <!-- <img :src="require('../../assets/scanner-image.jpg')" alt="" style="cursor: pointer;"> -->
        <img
          @click="$router.push({ name: 'settings' })"
          width="50"
          height="50"
          :src="
            $store.state.user.profile_picture
              ? $store.state.user.profile_picture
              : require('../../assets/scanner-image.jpg')
          "
          alt=""
        />
      </div>
    </div>
  </v-app-bar>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  name: "AppHeaderComp",
  methods: {
    async logout() {
      await this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
  },
  components: {
    Icon,
  },
};
</script>

<style lang="scss" scoped>
header {
  background: #ffffff !important;
  box-shadow: none !important;
  .v-toolbar-title {
    padding-left: 20px;
    padding-top: 5px;
    .v-toolbar-title__placeholder {
      display: flex;
      align-items: center;
    }
  }
}

.header .v-toolbar-title {
  padding: 0px !important;
}

.header-cover {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 30px;
  align-items: baseline;
}

.left-cover {
  display: flex;
  align-items: center;
}
.right-cover {
  display: flex;
  align-items: center;
  gap: 20px;
  img {
    // background-color: $primary-light-hover;

    border-radius: 50%;
  }
}
.header {
  background-color: #ffffff;
}
.header .v-toolbar-title {
  font: normal normal medium 24px Montserrat;
  color: #333333;
  padding-top: 30px;
  /* display: flex; */
  img {
    max-width: 80px !important;
  }
  .page-name {
    font-size: 30px;
    font-weight: 500;
    text-transform: capitalize;

    @media (max-width: 960px) {
      font-size: 21px;
    }
  }
}
.v-toolbar-title__placeholder {
  display: flex;
  align-items: center;
}
</style>
