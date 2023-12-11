<template>
  <div class="text-center">
    <v-btn style="width: 100%" fab small @click="dialog = true">
      <v-icon>mdi-plus</v-icon> Add Next
    </v-btn>

    <v-dialog v-model="dialog" width="600px">
      <v-card>
        <div class="close">
          <Icon
            icon="solar:close-circle-broken"
            width="30"
            height="30"
            @click="dialog = false"
          />
        </div>
        <v-card-text>
          <h2>Add Next Traning Phase</h2>
          <input
            type="text"
            placeholder="Traning phase name, like `Weight loss plan`"
            class="name"
          />
          <div class="start">
            <h4>Start on</h4>
            <input
              v-model="dateToStart"
              type="date"
              class="date"
              name="date"
              id="date"
              :min="computeMinDate"
            />
            <h4>for</h4>
            <input type="number" class="number" />
            <h4>weeks</h4>
          </div>
          <div class="text">
            <p>This training will end on 4 Dec 2023 (Monday).</p>
            <v-select
              :items="['Ends in weeks', 'Ends in months', 'Ends on date']"
              variant="outlined"
            ></v-select>
          </div>
        </v-card-text>
        <v-card-text style="display: flex">
          <div class="save-btn">
            <v-btn
              block
              @click="dialog = false"
              class="save"
              style="color: rgb(21, 21, 21)"
              >Save</v-btn
            >
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
export default {
  name: "nextTraining",
  data() {
    return {
      dialog: false,
    };
  },
  components: {
    Icon,
  },
};
</script>

<style lang="scss" scoped>
@import "../../../scss/colors";
@import "../../../scss/NextTraining.scss";

.v-btn {
  color: $primary-dark;
}
</style>
