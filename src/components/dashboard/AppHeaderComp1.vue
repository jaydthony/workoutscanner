<template>
  <v-app-bar class="header">
    <v-toolbar-title>
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
      Logo
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn text to="/">QuickMobile</v-btn>
      <v-btn @click="logout">Logout</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppHeaderComp",
  methods: {
    async logout() {
      await this.$store.dispatch("logout").then(() => {
        this.$router.push("/login");
      });
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  background: #f7f7f7 !important;
  box-shadow: none !important;
  .v-toolbar-title {
    padding-left: 20px;
    padding-top: 5px;
  }
}
.header {
  background-color: #f7f7f7;
}
.header .v-toolbar-title {
  font: normal normal medium 24px Montserrat;
  color: #333333;
  img {
    max-width: 80px !important;
  }
}
</style>
