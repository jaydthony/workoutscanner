<template>
  <div class="overview">
    <div class="top">
      <v-card
        style="
          background-color: transparent;
          color: black;
          margin-bottom: 50px;
          margin-top: 40px;
        "
      >
        <v-card-text style="background-color: #434739; color: white">
          <Location :info="dataInfo" :loading="loading" />
        </v-card-text>
      </v-card>

      <v-card-text
        class="top-cover"
        style="background-color: #434739; color: white"
      >
        <ThisWeek :info="dataInfo" :loading="loadingInfo" />
      </v-card-text>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/colors";
@import "../scss/Overview.scss";

.v-tab--selected {
  background-color: $primary-normal-active;
}

.v-card--variant-elevated {
  box-shadow: none !important;
}
</style>

<script>
import ThisWeek from "@/components/ThisWeek.vue";
import Location from "@/components/Location.vue";
import { defineComponent } from "vue";
import axiosInstance from "@/utils/axiosInstance";

export default defineComponent({
  name: "HomeView",
  components: { ThisWeek, Location },
  data() {
    return {
      tab: null,
      loadingInfo: true,
      dataInfo: null,
    };
  },

  async mounted() {
    let dataInfo = await axiosInstance.get("/dashboard-data/");
    this.dataInfo = await dataInfo.data;
    this.loadingInfo = false;
  },
});
</script>
