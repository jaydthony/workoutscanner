<template>
  <div>
    <!-- <div class="cover"></div> -->
    <div id="sample" class="cover">
      <v-toolbar
        v-if="$vuetify.display.mdAndDown"
        style="background-color: rgb(135, 183, 9)"
      >
        <v-btn
          v-if="selectedToExercise"
          icon
          @click="selectedToExercise = false"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title></v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="toggleSidebar">
          <v-icon color="rgb(248, 254, 231)">mdi-menu</v-icon>
        </v-btn>
      </v-toolbar>
      <v-layout style="height: -webkit-fill-available">
        <v-navigation-drawer
          :temporary="$vuetify.display.mdAndDown"
          :permanent="!$vuetify.display.mdAndDown"
          class="chat-nav"
          v-model="leftdrawer"
          style="background-color: #171914"
        >
          <!-- Add your list of previous chats here -->

          <div class="left">
            <h3>Workouts</h3>
            <div class="left-cover">
              <div class="left-det">
                <div class="input-cover mb-2">
                  <v-icon start color="white" icon="mdi-magnify"></v-icon>
                  <input
                    style="color: #fff"
                    type="text"
                    v-model="search"
                    placeholder="search for workout."
                  />
                </div>
                <div
                  v-show="!loading"
                  class=""
                  v-for="routine in routinesWorkout"
                  :key="routine.id"
                  :class="`${
                    selectedRoutine
                      ? selectedRoutine.id == routine.id
                        ? 'first-active'
                        : ''
                      : ''
                  } tabs`"
                  @click="clickRoutine(routine)"
                  @dblclick="handleDoubleClick(routine)"
                >
                  <!-- <h4>{{ day.days }}</h4> -->
                  <p>
                    {{ routine.name }}
                    <v-tooltip
                      v-if="routine.company == $store.state.user.id"
                      text="Uploaded By You"
                    >
                      <template v-slot:activator="{ props }">
                        <span v-bind="props"
                          ><v-badge dot color="success"> </v-badge
                        ></span>
                      </template>
                    </v-tooltip>
                  </p>

                  <img :src="require('../assets/arrow-right.png')" alt="" />
                </div>
                <div v-if="loading">
                  <v-skeleton-loader
                    v-for="n in 6"
                    :key="n"
                    :elevation="4"
                    type="list-item-avatar"
                    color="rgb(135, 183, 9)"
                    class="mb-4"
                  ></v-skeleton-loader>
                </div>
                <div
                  v-if="routinesWorkout.length < 1 && !loading"
                  class="not-available"
                >
                  <h2>No workouts created</h2>
                </div>
              </div>
            </div>
          </div>
          <div class="last">
            <v-divider></v-divider>
            <CreateWorkout
              v-if="!loading"
              @getRoutines="getRoutines"
              @appendRoutine="appendRoutine"
              :first="true"
            />
          </div>
        </v-navigation-drawer>
        <v-main class="chat__wrapper">
          <v-row>
            <v-col
              v-if="
                ($vuetify.display.mdAndDown && !selectedToExercise) ||
                !$vuetify.display.mdAndDown
              "
              sm="3"
              cols="12"
              class="webavail-height"
              style="position: relative"
            >
              <!-- <v-col sm="3" xs="12" class="webavail-height"> -->
              <div class="right">
                <div><h3>Exercises</h3></div>
                <div class="right-cover">
                  <div class="right-det">
                    <div class="input-cover mb-2">
                      <v-icon start color="black" icon="mdi-magnify"></v-icon>
                      <input
                        type="text"
                        v-model="searchQuery"
                        placeholder="search for exercise."
                      />
                    </div>
                    <div
                      v-if="
                        exercisePart.length > 0 && !loading && selectedExercise
                      "
                    >
                      <div
                        :class="`${
                          selectedExercise.id == exercise.id
                            ? 'native-active'
                            : ''
                        } chips`"
                        v-for="exercise in filteredExercises"
                        @click="clickExercise(exercise)"
                        :key="exercise.id"
                      >
                        <div class="chip-cover">
                          <h4>{{ exercise.exercise_info.name }}</h4>
                        </div>
                        <div class="chip-icons">
                          <img
                            v-if="
                              selectedRoutine.company == $store.state.user.id
                            "
                            @click="deleteExercise(exercise)"
                            :src="require('../assets/close-square.png')"
                            alt=""
                          />
                          <!-- <v-img :src="item.icon1" contain height="20" />
                            <v-img :src="item.icon2" contain height="20" /> -->
                        </div>
                      </div>
                    </div>
                    <div
                      style="
                        height: 60vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 18px;
                      "
                      v-if="
                        filteredExercises.length < 1 && !loading && searchQuery
                      "
                    >
                      No exercise named {{ searchQuery }}
                    </div>
                    <div v-if="loading">
                      <v-skeleton-loader
                        v-for="n in 6"
                        :key="n"
                        :elevation="4"
                        type="list-item-avatar"
                        color="rgb(232, 252, 180)"
                        class="mb-4"
                      ></v-skeleton-loader>
                    </div>
                    <div
                      v-if="exercisePart.length < 1 && !loading"
                      class="not-available"
                    >
                      <h2>Add an exercise</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div class="right-last">
                <v-divider></v-divider>
                <AddExercise
                  @updateRoutines="updateRoutines"
                  :routine="selectedRoutine"
                  v-if="
                    selectedRoutine &&
                    selectedRoutine.company == $store.state.user.id
                  "
                />
              </div>
            </v-col>
            <v-col sm="9" xs="12" class="webavail-height1">
              <div v-if="selectedExercise" class="details mt-2">
                <!-- video player -->

                <mainPlayer
                  v-if="selectedExercise.exercise_info.is_upload"
                  :poster="selectedExercise.exercise_info.thumb_image"
                  :src="selectedExercise.exercise_info.video_upload"
                  :defaultWidth="`inherit`"
                />
                <YoutubePlayer
                  v-else
                  :youtubeId="
                    extractVideoId(selectedExercise.exercise_info.youtube_link)
                  "
                  :widthDefault="`100%`"
                  :heightDefault="400"
                />

                <!-- video player -->

                <div class="detail-head">
                  <h3 style="margin-top: 10px">
                    {{ selectedExercise.exercise_info.name }}
                  </h3>
                </div>

                <h4>Description</h4>
                <p>
                  {{ selectedExercise.exercise_info.description }}
                </p>

                <v-divider></v-divider>
                <div v-if="selectedExercise.notes">
                  <h4>Note</h4>
                  <p>
                    {{ selectedExercise.notes }}
                  </p>
                </div>

                <h4>Additional Information</h4>
                <p>
                  <span>Reps: {{ selectedExercise.reps }}</span>
                  <span> Duration: {{ selectedExercise.duration }}</span>
                  <span> Sets: {{ selectedExercise.sets }}</span>
                </p>
              </div>
              <div v-else class="not-available">
                <h2>Please select an exercise</h2>
              </div>
            </v-col>
          </v-row>
        </v-main>
      </v-layout>
    </div>

    <!--Edit routine  -->
    <v-dialog v-model="dialog" width="60%" class="edit-routine">
      <v-card style="padding: 10px">
        <v-card-text>
          <h2>Edit Routine</h2>
          <div class="dialog3-det">
            <div class="forms">
              <v-text-field
                v-model="routineName"
                label="Routine Name"
                variant="outlined"
              ></v-text-field>
            </div>
            <div class="forms">
              <v-textarea
                v-model="routineDescription"
                label="Description"
                variant="outlined"
              ></v-textarea>
            </div>
          </div>
          <div class="edit-btn">
            <v-btn class="delete-btn" @click="deleteModal = true">Delete</v-btn>
            <div class="right-btn">
              <v-btn @click="dialog = false">Cancel</v-btn>
              <v-btn
                class="save-btn"
                :loading="loadingSave"
                @click="editRoutine"
                >Save</v-btn
              >
            </div>
          </div>
        </v-card-text>
        <!-- <v-card-actions>
          <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>
        </v-card-actions> -->
      </v-card>
    </v-dialog>

    <!-- delete Dialog -->
    <v-dialog v-model="deleteModal" width="auto">
      <v-card
        style="
          background-color: rgb(37, 37, 37) !important;
          color: white;
          padding: 10px;
        "
      >
        <h2>Delete Routine</h2>
        <p>
          You are about to delete the {{ routineName }} Routine. Press Delete to
          continue
        </p>
        <div class="deletebtn">
          <button @click="deleteModal = false">Cancel</button>
          <v-btn :loading="loadingDelete" @click="deleteRoutine">Delete</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// import videoplayer from "./dashboard/videoplayer.vue";
import NewRoutines from "@/components/NewRoutines.vue";
import AddExercise from "@/components/AddExercise.vue";
import mainPlayer from "../components/dashboard/mainPlayer.vue";
import YoutubePlayer from "../components/dashboard/YoutubePlayer.vue";
import axiosInstance from "@/utils/axiosInstance";
import CreateWorkout from "@/components/CreateWorkout.vue";
import _ from "lodash";

import { useToast } from "vue-toastification";

const toast = useToast();

export default {
  //   name: "ContentDetail1",
  components: {
    NewRoutines,
    AddExercise,
    mainPlayer,
    YoutubePlayer,
    CreateWorkout,
  },
  data() {
    return {
      leftdrawer: true,

      selectedRoutine: null,
      selectedExercise: null,
      routinesWorkout: [],

      exercisePart: [],
      selectedToExercise: false,
      loading: false,
      loadingSave: false,
      loadingDelete: false,
      searchQuery: "",
      search: "",
      dialog: false,

      routineName: "",
      routineDescription: "",
      routineId: null,
      deleteModal: false,
    };
  },
  methods: {
    extractVideoId(video) {
      // Regular expression to match YouTube video IDs
      // //console.log(video);
      const regex = /[?&]v=([^&#]*)/;

      // Extract video ID from the link using the regex
      const match = video.match(regex);

      if (match && match[1]) {
        return match[1];
      } else {
        return "";
      }
    },
    // Function to toggle the sidebar
    toggleSidebar() {
      this.leftdrawer = !this.leftdrawer;
    },

    // Double click
    handleDoubleClick(routine) {
      if (routine.company !== this.$store.state.user.id) {
        toast.error("you not have permission to edit this workout");
        return;
      }
      this.selectedRoutine = routine;
      this.routineName = routine.name;
      this.routineDescription = routine.description;
      this.routineId = routine.id;

      this.dialog = true;
      this.routinesWorkout;
      //console.log("double click");
      //console.log(routine);
    },

    // delete routine
    async deleteRoutine() {
      this.loadingDelete = true;

      let routine = await axiosInstance.delete(`/routines/${this.routineId}/`);

      //console.log(routine.data, "datas");
      this.loadingDelete = false;
      this.deleteModal = false;
      this.dialog = false;
      this.routinesWorkout = this.routinesWorkout.filter(
        (obj) => obj.id !== this.routineId
      );
      toast.success("deleted successfully");
      this.selectedRoutine = null;
      this.selectedExercise = null;
      // this.getRoutines();
    },

    // edit routine
    async editRoutine() {
      this.loadingSave = true;
      let check = await axiosInstance.patch(`/routines/${this.routineId}/`, {
        name: this.routineName,
        description: this.routineDescription,
      });

      //console.log(check.data, "checking");
      this.loadingSave = false;
      this.dialog = false;
      this.getRoutines();
    },
    appendRoutine(item) {
      this.routinesWorkout.unshift(item);
    },

    deleteExercise(item) {
      //console.log(item, "the item");
      this.$swal({
        title: `Do you want to delete ${item.exercise_info.name} from ${this.selectedRoutine.name}?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
        footer: `This would assign ${item.exercise_info.name}`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await axiosInstance.delete(`/routine-exercises/${item.id}/`);
          this.removeItem(item);
          this.$swal("Saved!", "", "success");
        } else if (result.isDenied) {
          this.$swal("Changes are not saved", "", "info");
        }
      });
    },

    removeItem(item) {
      const index = this.exercisePart.findIndex(
        (exercise) => exercise.id === item.id
      );

      //console.log();

      // Remove the exercise if found
      if (index !== -1) {
        this.exercisePart.splice(index, 1);
      }
      this.selectedExercise = "";
    },

    async getRoutines() {
      await this.$store.dispatch("getRoutines");
      this.routinesWorkout = this.$store.state.routines;
      //console.log(this.routinesWorkout, "this is it");
    },

    async updateRoutines(data) {
      let routine = await axiosInstance.get(`/routines/${data.id}/`);
      // //console.log("trying to update", routine.data);
      await this.$store.dispatch("getRoutines");
      this.routinesWorkout = this.$store.state.routines;
      this.clickRoutine(routine.data);
    },

    clickRoutine(routine) {
      this.selectedRoutine = routine;
      this.exercisePart = routine.exercises;
      // //console.log(routine.exercises, "the data info 1");
      // //console.log(routine, "the data info 1");
      this.selectedExercise = routine.exercises[0];
      if (this.$vuetify.display.mdAndDown) {
        this.leftdrawer = false;
      }
    },

    clickExercise(exercise) {
      this.selectedExercise = exercise;
      this.selectedToExercise = true;
    },

    searchClick: _.debounce(function querySearch(query) {
      //console.log("the", query);
      this.loading = true;
      this.apiQuery({ value: query })
        .then((response) => {
          this.routinesWorkout = response.data.results;
          //console.log(this.routinesWorkout, "new indo");
          this.initRoutine();
        })
        .finally(() => {
          this.loading = false;
        });
    }, 500),

    async apiQuery(filters) {
      //console.log(filters, "filtered");
      let info = await axiosInstance.get(`/routines/?search=${filters.value}`);
      return info;
    },

    initRoutine() {
      if (this.routinesWorkout.length > 0) {
        this.selectedRoutine = this.routinesWorkout[0];
        this.exercisePart = this.routinesWorkout[0].exercises;
        // //console.log(this.exercisePart, "exercise part");
        if (this.routinesWorkout[0].exercises.length > 0) {
          this.selectedExercise = this.routinesWorkout[0].exercises[0];
        }
      } else {
        this.selectedExercise = null;
      }
    },
  },

  watch: {
    search(query) {
      if (query !== null) {
        this.searchClick(query);
      }
    },
  },

  async created() {
    this.loading = true;
    await this.getRoutines();
    this.loading = false;
    // //console.log(this.routinesWorkout, "routines");

    this.initRoutine();

    // this.selectedToExercise = true;
  },

  computed: {
    filteredExercises() {
      const query = this.searchQuery.toLowerCase();
      return this.exercisePart.filter((exercise) =>
        exercise.exercise_info.name.toLowerCase().includes(query)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
/* @import "../scss/mainContent.scss"; */
@import "../scss/Routine1.scss";

.cover {
  background-color: $primary-light;
  min-height: 100%;
  padding: 20px;
}

.v-col-sm-9 {
  @media (max-width: 600px) {
    height: 85vh !important;
  }
}

.v-navigation-drawer__content {
  overflow-y: hidden !important;
}

.webavail-height {
  height: -webkit-fill-available;
}

.v-row {
  @media (max-width: 600px) {
    width: 100%;
    height: 85vh;
  }
}

.webavail-height1 {
  height: 100%;
}
</style>
