<template>
  <div class="category">
    <div class="leftarr">
      <!-- <router-link to="/">
        <Icon icon="ep:arrow-left" width="35" height="30" />
      </router-link> -->
    </div>
    <div class="categories">
      <div class="categories-top"></div>
      <div class="categories-detail">
        <div class="category-main-det">
          <h5>{{ formattedDate }}</h5>
          <h3 v-if="!nothing">
            Todays Workout is
            <span v-if="!loading">{{ routine ? routine.name : "None" }}</span>
            <span v-else>
              <v-progress-circular indeterminate></v-progress-circular
            ></span>
          </h3>
          <h3 v-else>
            Opps, it seems no workout is set today
            <br />
            <span>See you tommorrow 💪</span>
          </h3>

          <p>
            {{
              routine ? routine.description : "There is no description inputed"
            }}
            <!-- Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec
            libero ante. Nullam ipsum ante, sodales vel cursus rhoncus, luctus in
            arcu. Pellentesque at consectetur odio. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Aliquam nec libero ante. Nullam ipsum
            ante, sodales vel cursus rhoncus, luctus in arcu. Pellentesque at
            consectetur odio. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Aliquam nec libero ante. Nullam ipsum ante, sodales vel cursus
            rhoncus, luctus in arcu. Pellentesque at consectetur odio. -->
          </p>
        </div>
      </div>
      <div class="categories-btn">
        <v-btn :disabled="!routine" @click="$emit('InitStart', true)">
          <span>Let's Go </span>
          <Icon icon="solar:round-arrow-right-broken" width="28" height="28" />
        </v-btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../../scss/colors";
@import "../../scss/mobiles-styles/Category.scss";
</style>

<script>
import { Icon } from "@iconify/vue";

export default {
  name: "Category",
  data() {
    return {
      currentDate: new Date(),
    };
  },
  components: {
    Icon,
  },
  props: ["start", "routine", "nothing", "loading"],

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
