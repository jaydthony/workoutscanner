<template>
  <div class="routine-cover">
    <div
      class="add-click"
      style="
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 10px 20px;
      "
      @click="newRoutine = true"
    >
      <v-icon color="rgb(0, 0, 0)" start icon="mdi-plus"> </v-icon>
      <p color="rgb(135, 183, 9)">Add Workout</p>
    </div>
    <v-dialog v-model="newRoutine" width="auto">
      <v-card>
        <div class="new-routine">
          <h2>New Workout</h2>
          <div class="form">
            <div class="forms">
              <label for="routine-name">Workout name</label>
              <input v-model="name" id="routine-name" type="text" />
            </div>
            <div class="forms">
              <label for="routine-description">Instructions</label>
              <textarea
                v-model="description"
                name="routine-description"
                id="routine-description"
                cols="30"
                rows="3"
              ></textarea>
            </div>
            <div class="form-botton">
              <v-btn style="box-shadow: none" @click="newRoutine = false"
                >Cancel</v-btn
              >
              <v-btn
                :loading="loading"
                :disabled="!name || !description"
                @click="addRoutine"
                class="save"
                >Save</v-btn
              >
            </div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/colors";
@import "../scss/NewRoutines.scss";
</style>

<script>
import axiosInstance from "@/utils/axiosInstance";

name: "NewRoutine";
export default {
  data() {
    return {
      newRoutine: false,
      loading: false,
      description: "",
      name: "",
    };
  },
  methods: {
    async addRoutine() {
      this.loading = true;
      await axiosInstance.post("/routines/", {
        name: this.name,
        description: this.description,
      });
      await this.$emit("getRoutines");
      this.loading = false;
      this.newRoutine = false;
    },
  },
};
</script>
