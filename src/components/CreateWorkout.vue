<template>
  <v-btn v-if="!first" class="btn-secondary" fab small @click="dialog = true">
    <v-icon>mdi-plus</v-icon> Workout Builder
  </v-btn>
  <div
    v-else
    style="
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 10px 20px;
    "
    @click="dialog = true"
  >
    <v-icon color="rgb(0, 0, 0)" start icon="mdi-plus"> </v-icon>
    <p color="rgb(135, 183, 9)">Add Workout</p>
  </div>
  <v-dialog v-model="dialog" width="100vw" persistent>
    <v-card>
      <img
        style="cursor: pointer"
        @click="dialog = false"
        :src="require('../assets/close-circle.png')"
        class="close-btn"
      />
      <v-stepper v-model="step" :items="items" hide-actions>
        <template v-slot:item.1>
          <v-card-title class="text-h5">
            <h3 style="margin-bottom: 20px">Workout Builder</h3></v-card-title
          >
          <v-card-text>
            <div class="cover-first">
              <div class="left-sided">
                <div class="form">
                  <div class="forms">
                    <v-text-field
                      density="compact"
                      variant="outlined"
                      label="Workout Name"
                      hint="Like 90 Day Transformation Challenge"
                      persistent-hint="Like 90 Day Transformation Challenge"
                      class="mb-2"
                      v-model="WorkoutName"
                      :rules="nameRules"
                      required
                    ></v-text-field>
                    <p style="font-size: 13px">
                      Need to bring in a Video Workout? Import a master or build
                      a new master within your master workouts.
                    </p>
                  </div>
                </div>
              </div>
              <v-divider
                :thickness="3"
                class="border-opacity-50"
                vertical
              ></v-divider>
              <div class="right" style="max-height: 60vh">
                <v-row no-gutters class="justify-center">
                  <img
                    style="height: 60vh; width: 50%"
                    :src="require('../assets/mobile.jpg')"
                  />
                </v-row>
              </div>
            </div>

            <v-btn
              class="float-right continue"
              @click="step = 2"
              :disabled="!isNameValid"
            >
              Continue
            </v-btn>
          </v-card-text>
        </template>

        <template v-slot:item.2>
          <v-card-text>
            <div class="sides-cover">
              <div>
                <v-text-field
                  density="compact"
                  variant="outlined"
                  label="Workout Name"
                  hint="Like 90 Day Transformation Challenge"
                  persistent-hint="Like 90 Day Transformation Challenge"
                  class="mb-2"
                  v-model="WorkoutName"
                  :rules="nameRules"
                  required
                ></v-text-field>
                <v-textarea
                  v-model="description"
                  placeholder="(Optional) A short summary of this workout or general cues during workout. 
                  
                  Add rest times and any weight/rep/tempo targets with each exercise so the client can follow along with the mobile app."
                ></v-textarea>
                <div class="left-exercise" ref="scrollableleft">
                  <h2>Exercises</h2>
                  <div
                    v-for="item in newRoutineExercise"
                    :key="item.id"
                    class="left-contain"
                  >
                    <v-row class="left-row">
                      <v-col cols="1" sm="1 ">
                        <v-checkbox
                          v-model="selected"
                          :value="item"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="3" sm="2 " class="center-me">
                        <div class="exercise-image">
                          <img
                            :src="item.image"
                            :alt="require('@/assets/scanner-image.jpg')"
                          />
                          <div class="exerise-name">{{ item.name }}</div>
                        </div></v-col
                      >
                      <v-col cols="4" sm="2" class="center-me">
                        <div class="forms">
                          <label for="exercise">Duration</label>
                          <input
                            v-model="item.duration"
                            id="exercise"
                            type="number"
                            placeholder="minutes"
                          /></div
                      ></v-col>
                      <v-col cols="4" sm="2" class="center-me">
                        <div class="forms">
                          <label for="reps">Reps</label>
                          <input
                            v-model="item.reps"
                            id="reps"
                            type="number"
                            placeholder="count"
                          /></div
                      ></v-col>
                      <v-col cols="4" sm="2" class="center-me">
                        <div class="forms">
                          <label for="wait">Wait</label>
                          <input
                            v-model="item.wait"
                            name="wait"
                            id="wait"
                            type="number"
                            placeholder="seconds"
                          /></div
                      ></v-col>
                      <v-col cols="4" sm="2" class="center-me">
                        <div class="forms">
                          <label for="rest">Sets</label>
                          <input
                            v-model="item.sets"
                            name="rest"
                            id="rest"
                            type="number"
                            placeholder="E.g 6"
                          /></div
                      ></v-col>
                      <v-col cols="4" sm="1" class="center-me">
                        <v-icon
                          @click="deleteExercise(item.id)"
                          style="color: red"
                          >mdi-delete</v-icon
                        ></v-col
                      >
                    </v-row>
                  </div>
                  <div
                    class="non-available"
                    v-if="newRoutineExercise.length < 1"
                  >
                    <h3>
                      Click on any exercise to add them to the to the workout
                    </h3>
                  </div>
                </div>
              </div>
              <div class="right">
                <UploadExercise
                  :custom="true"
                  @onSelectExercise="onSelectExercise"
                />
                <input v-model="searchQuery" type="text" placeholder="search" />
                <div class="right-cover">
                  <v-row style="margin: 0px">
                    <v-col
                      v-for="item in filteredExercises"
                      :key="item.id"
                      sm="3"
                      md="4"
                      cols="6"
                      class="column"
                      @click="onSelectExercise(item)"
                    >
                      <div class="exercise-image right-img">
                        <img
                          :src="
                            item.is_upload
                              ? item.thumb_image
                              : item.thumb_image_tube
                          "
                        />
                        <div class="exerise-name">
                          <p>{{ item.name }}</p>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </div>
            <v-btn
              class="float-right continue"
              @click="createWorkout"
              :loading="loading"
              :disabled="!isNameValid || newRoutineExercise.length < 1"
            >
              Create Workout
            </v-btn>
          </v-card-text>
        </template>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import UploadExercise from "./UploadExercise.vue";
import { useToast } from "vue-toastification";

const toast = useToast();
export default {
  components: { UploadExercise },

  data: () => ({
    shipping: 0,
    step: 1,
    dialog: false,
    items: ["Create Order", "Build Exercise"],
    WorkoutName: "",
    e1: 1,
    steps: 2,
    searchQuery: "",
    description: "",
    newRoutineExercise: [],
    loading: false,
    nameRules: [
      (v) => (v && v.length >= 3) || "Name must be at least 3 characters",
    ],
  }),

  props: ["first"],

  methods: {
    async fetchExercise() {
      await this.$store.dispatch("getExercise");

      // //console.log(this.routineExercise, this.routine);
    },
    deleteExercise(id) {
      // Find the index of the exercise with the given ID
      const index = this.newRoutineExercise.findIndex(
        (exercise) => exercise.id === id
      );

      // Remove the exercise if found
      if (index !== -1) {
        this.newRoutineExercise.splice(index, 1);
      }
    },
    onSelectExercise(item) {
      const lastItemId =
        this.newRoutineExercise.length > 0
          ? this.newRoutineExercise[this.newRoutineExercise.length - 1].id
          : 0;
      //console.log(item);
      let newItem = {
        id: lastItemId + 1,
        exerciseId: item.id,
        image: item.is_upload ? item.thumb_image : item.thumb_image_tube,
        exerciseName: item.name,
      };
      this.newRoutineExercise.push(newItem);
      this.scrollToBottom();
      this.displayLeft = true;
    },

    scrollToBottom() {
      // Get a reference to the scrollable div using $refs
      // Get a reference to the scrollable div using $refs
      const scrollableDiv = this.$refs.scrollableleft;

      // Scroll the div to the bottom after the next DOM update
      this.$nextTick(() => {
        if (scrollableDiv) {
          scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
        }
      });
    },

    async createWorkout() {
      this.loading = true;
      try {
        let routine = await axiosInstance.post("/createroutines/", {
          name: this.WorkoutName,
          routineexercise: this.newRoutineExercise,
          description: this.description,
          private: !this.first,
          programphase_id: this.$route.params.phaseid,
        });

        this.$emit("loadDataBasedOnId1");
        this.$emit("getRoutines");
        this.$emit("appendRoutine", routine.data);
        toast("Routine Created Succesfully");
        this.step = 1;
        this.WorkoutName = "";
        this.e1 = 1;

        this.searchQuery = "";
        this.description = "";
        this.newRoutineExercise = [];
        this.dialog = false;
      } catch (error) {}
      this.loading = false;
    },
  },

  computed: {
    isNameValid() {
      return this.nameRules[0](this.WorkoutName) === true;
    },

    filteredExercises() {
      const query = this.searchQuery.toLowerCase();
      return this.$store.state.exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(query)
      );
    },
  },

  watch: {
    // Watch for changes in the 'id' route parameter
    dialog: async function (newId, oldId) {
      // Do something when the 'id' route parameter changes
      //console.log("New ID:", newId);
      //console.log("Old ID:", oldId);

      await this.fetchExercise();

      // You can perform actions or fetch data based on the new 'id'
      // For example, load data based on the new 'id'
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/CreateWorkout.scss";

.center-me {
  align-items: center;
  display: flex;
}

.close-btn {
  position: absolute;
  right: 35px;
  top: 75px;
}

.forms {
  label {
    position: relative;
    transform: translateX(0px) translateY(0px);
  }
}
</style>
