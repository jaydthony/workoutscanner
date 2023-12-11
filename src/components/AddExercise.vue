<template>
  <div class="text-center">
    <span @click="dialog = true" v-if="edit" style="color: #fff">edit</span>
    <v-btn v-else color="primary" @click="dialog = true" variant="text">
      <v-icon color="rgb(135, 183, 9)" start icon="mdi-plus"></v-icon>

      <span style="color: rgb(135, 183, 9)">Add Exercise</span>
    </v-btn>

    <v-dialog v-model="dialog" fullscreen="" width="100%">
      <v-card class="card">
        <div class="top">
          <h3>Add Exercise -- {{ routine.name }}</h3>
          <img
            style="cursor: pointer"
            @click="dialog = false"
            :src="require('../assets/close-circle.png')"
            class="close-btn"
          />
          <!-- <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn> -->
        </div>
        <div
          class="toggle"
          v-if="$vuetify.display.mdAndDown"
          @click="displayLeft = !displayLeft"
        >
          <v-icon color="greenyellow">mdi-menu</v-icon>
        </div>

        <div class="sides-cover">
          <div>
            <v-text-field
              density="compact"
              variant="outlined"
              label="Workout Name"
              hint="Like 90 Day Transformation Challenge"
              persistent-hint="Like 90 Day Transformation Challenge"
              class="mb-2"
              v-model="routine.name"
              :rules="nameRules"
              required
            ></v-text-field>
            <v-textarea
              v-model="routine.description"
              placeholder="(Optional) A short summary of this workout or general cues during workout. 
                  
                  Add rest times and any weight/rep/tempo targets with each exercise so the client can follow along with the mobile app."
            ></v-textarea>
            <div style="display: flex">
              <h2>Exercises</h2>
              <v-btn
                :disabled="selected.length < 1"
                color="error"
                xs
                class="ml-2"
                @click="deleting = true"
                >delete</v-btn
              >
            </div>
            <div class="left-exercise" ref="scrollableleft">
              <div
                v-for="item in routineExercise"
                :key="item.id"
                class="left-contain"
              >
                <v-row>
                  <v-col cols="1" sm="1 ">
                    <v-checkbox v-model="selected" :value="item"></v-checkbox>
                  </v-col>
                  <v-col cols="3" sm="2 " class="center-me">
                    <div class="exercise-image">
                      <img
                        :src="
                          item.exercise_info.is_upload
                            ? item.exercise_info.thumb_image
                            : item.exercise_info.thumb_image_tube
                        "
                        :alt="require('@/assets/scanner-image.jpg')"
                      />
                      <div
                        class="exerise-name"
                        style="font-weight: 600; font-size: 13px"
                      >
                        {{ item.exercise_info.name }}
                      </div>
                    </div>
                  </v-col>
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
                        placeholder="minutes"
                      />
                    </div>
                  </v-col>
                  <v-col cols="4" sm="2" class="center-me">
                    <div class="forms">
                      <label for="wait">Wait</label>
                      <input
                        v-model="item.wait"
                        name="wait"
                        id="wait"
                        type="number"
                        placeholder="minutes"
                      /></div
                  ></v-col>
                  <v-col cols="4" sm="2" class="center-me">
                    <div class="forms">
                      <label for="rest">Set</label>
                      <input
                        v-model="item.sets"
                        name="rest"
                        id="rest"
                        type="number"
                        placeholder="E.g 6"
                      />
                    </div>
                  </v-col>
                  <v-col cols="4" sm="1" class="center-me"> </v-col>
                </v-row>
              </div>

              <div
                v-for="item in newRoutineExercise"
                :key="item.id"
                class="left-contain"
              >
                <v-row class="left-row">
                  <v-col cols="1" sm="1 ">
                    <v-checkbox v-model="selected" :value="item"></v-checkbox>
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
                        placeholder="minutes"
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
                        placeholder="minutes"
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
                    <v-icon @click="deleteExercise(item.id)" style="color: red"
                      >mdi-delete</v-icon
                    ></v-col
                  >
                </v-row>
              </div>
              <div
                class="non-available"
                v-if="newRoutineExercise.length < 1 && routineExercise < 1"
              >
                <h3>Click on any exercise to add them to the to the workout</h3>
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
                  v-for="item in allExercise"
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

        <div class="bottom" style="width: 95vw">
          <div class="buttons">
            <button @click="dialog = false">Cancel</button>
            <v-btn class="float-right" :loading="inloading" @click="saveAll"
              >Save</v-btn
            >
          </div>
        </div>

        <!-- <v-card-actions></v-card-actions> -->

        <v-dialog v-model="deleting" width="auto">
          <v-card
            class="new-branch"
            style="background-color: rgb(37, 37, 37) !important; color: white"
          >
            <v-card-text>
              <h2>Delete</h2>
              <p>Are you sure?</p>
            </v-card-text>
            <v-card-actions>
              <div class="delete-btn">
                <button @click="deleting = false">Cancel</button>
                <v-spacer></v-spacer>
                <v-btn :loading="loading" @click="deleteExercise2"
                  >Delete</v-btn
                >
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
// @import "../scss/AddExercise.scss";
@import "../scss/CreateWorkout.scss";

.close-btn {
  position: absolute;
  right: 35px;
  top: 20px;
}
.center-me {
  align-items: center;
  display: flex;
}

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}

.card {
  padding: 30px;
}

.text-center .ma-2[data-v-59df4ca9] {
  background-color: none !important;
}
// .v-input--horizontal {
//   grid-template-areas: none;
//   grid-template-columns: max-content minmax(0, 1fr) max-content;
//   grid-template-rows: auto auto;
//   /* width: 100px; */
// }

// .v-text-field .v-field {
//   width: 100px;
// }
.non-available {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(135, 183, 9);
}

.forms {
  label {
    position: relative;
    transform: translateX(0px) translateY(0px);
  }
}
</style>

<script>
import axiosInstance from "@/utils/axiosInstance";
import UploadExercise from "./UploadExercise.vue";
import _ from "lodash";
export default {
  name: "AddExercise",
  components: { UploadExercise },
  data() {
    return {
      dialog: false,
      deletes: false,
      displayLeft: true,
      routineExercise: [],
      newRoutineExercise: [],
      allExercise: [],
      selected: [],
      loading: false,
      searchQuery: "",
      inloading: false,
      deleting: false,
    };
  },
  computed: {
    filteredExercises() {
      const query = this.searchQuery.toLowerCase();
      return this.$store.state.exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(query)
      );
    },
  },

  watch: {
    searchQuery(query) {
      if (query !== null) {
        this.searchClick(query);
      }
    },
  },
  props: ["routine", "edit"],
  methods: {
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
    searchClick: _.debounce(function querySearch(query) {
      //console.log("the", query);
      this.loading = true;
      this.apiQuery({ value: query })
        .then((response) => {
          this.allExercise = response.data.results;
        })
        .finally(() => {
          this.loading = false;
        });
    }, 500),

    async apiQuery(filters) {
      //console.log(filters, "filtered");
      let info = await axiosInstance.get(
        `/exercises/?page=1&search=${filters.value}`
      );
      return info;
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

    deleteExercise1(id) {
      // Find the index of the exercise with the given ID
      const index = this.routineExercise.findIndex(
        (exercise) => exercise.id === id
      );

      // Remove the exercise if found
      if (index !== -1) {
        this.routineExercise.splice(index, 1);
      }
    },

    async deleteExercise2() {
      this.deleting = false;
      for (let i = 0; i < this.selected.length; i++) {
        const item = this.selected[i];
        //console.log(item, "the item");
        try {
          await axiosInstance.delete(`/routine-exercises/${item.id}/`);
          this.deleteExercise1(item.id);
        } catch (error) {}
      }
    },

    async saveAll() {
      this.inloading = true;
      try {
        await axiosInstance.patch(`/routines/${this.routine.id}/`, {
          name: this.routine.name,
          description: this.routine.description,
        });
        this.routineExercise.forEach(async (element) => {
          let data = {
            duration: element.duration,
            reps: element.reps,
            sets: element.sets,
            notes: element.notes,
            wait: element.wait,
          };

          await axiosInstance.patch(`/routine-exercises/${element.id}/`, data);

          //console.log(data, "data all");
          this.inloading = false;
        });

        this.newRoutineExercise.forEach(async (element) => {
          let data = {
            routine_exercise: this.routine.id,
            exercise_routine: element.exerciseId,
            duration: element.duration,
            reps: element.reps,
            sets: element.sets,
            notes: element.notes,
            wait: element.wait,
          };

          await axiosInstance.post(`/routine-exercises/`, data);
        });

        await this.$store.dispatch("getRoutines");
        this.$emit("updateRoutines", this.routine);
        this.$emit("loadDataBasedOnId1");
        this.inloading = false;
        this.dialog = false;
      } catch (error) {
        this.inloading = false;
      }
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
  },
  async updated() {
    await this.$store.dispatch("getExercise");
    this.allExercise = this.$store.state.exercises;
    this.routineExercise = this.routine.exercises;
    // //console.log(this.routineExercise, this.routine);
    this.newRoutineExercise = [];
  },
  async created() {
    await this.$store.dispatch("getExercise");
    this.routineExercise = this.routine.exercises;
    // //console.log(this.routineExercise, this.routine);
    this.newRoutineExercise = [];
  },
};
</script>
