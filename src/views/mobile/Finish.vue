<template>
  <div class="finish">
    <div class="finish-cover">
      <h1>{{ formattedDate }}</h1>
      <div class="progress-finish">
        <v-progress-circular
          model-value="100"
          color="#D0FD3E"
          :size="180"
          :width="10"
        >
          <div class="finish-det">
            <h3>100%</h3>
            <p>Completed</p>
          </div>
        </v-progress-circular>
      </div>
      <div class="buttons">
        <button class="finish-btn">
          <router-link to="/landing"> Finish </router-link>
          <Icon icon="solar:round-arrow-right-broken" width="30" height="30" />
        </button>
        <button class="restart-btn">
          Restart<Icon
            icon="solar:restart-circle-broken"
            width="30"
            height="30"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  name: "Finish",
  data() {
    return {
      currentDate: new Date(),
    };
  },
  components: {
    Icon,
  },
  computed: {
    formattedDate() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return this.currentDate.toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/colors";
@import "../../scss/mobiles-styles/Finish.scss";
</style>
