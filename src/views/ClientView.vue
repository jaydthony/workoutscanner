<template>
  <v-container style="max-width: none" class="d-window">
    <div v-if="!loading">
      <ClientDetail :location="location" />
    </div>

    <div v-if="loading">
      <v-skeleton-loader color="rgb(135, 183, 9)" :elevation="2" height="100vh">
      </v-skeleton-loader>
    </div>
  </v-container>
</template>

<script>
import ClientDetail from "@/components/ClientDetail.vue";

export default {
  name: "Client",
  data() {
    return {
      tab: null,
      loading: false,
    };
  },
  components: { ClientDetail },

  async created() {
    this.loading = true;
    await this.$store.dispatch("getLocations");
    this.loading = false;

    //console.log(this.$store.state.locations, "here locations");
    this.tab = this.$store.state.locations[0].id;
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/colors";

.text-default-color-tab {
  color: #000;
  background-color: $primary-normal;
  transition: 0.4s ease;
  &:hover {
    background-color: $primary-normal-active;
  }
}

.d-window {
  background-color: $primary-light;
  // height: 90%;
}
</style>
