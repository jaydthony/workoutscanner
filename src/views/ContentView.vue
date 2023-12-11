<template>
  <v-container style="max-width: none">
    <div v-if="!loading" class="mb-3">
      <v-tabs v-model="tab" color="default-color-tab " align-tabs="left">
        <v-tab
          v-for="location in $store.state.locations"
          :key="location.id"
          :value="location.id"
          >{{ location.name }}</v-tab
        >
      </v-tabs>
    </div>

    <v-window v-if="!loading" v-model="tab" class="d-window">
      <v-window-item
        v-for="location in $store.state.locations"
        :key="location.id"
        :value="location.id"
      >
        <!-- <h1>tab1</h1> -->
        <ContentDetail1 :location="location" />
      </v-window-item>
    </v-window>

    <div v-if="loading">
      <v-skeleton-loader color="rgb(135, 183, 9)" :elevation="2" height="100vh">
      </v-skeleton-loader>
    </div>
  </v-container>
</template>

<script>
import ContentDetail from "@/components/ContentDetail.vue";
import ContentDetail1 from "@/components/ContentDetail1.vue";

export default {
  data() {
    return {
      tab: null,
      loading: false,
    };
  },
  components: { ContentDetail, ContentDetail1 },

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
