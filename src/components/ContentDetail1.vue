<template>
  <div id="sample">
    <v-toolbar
      v-if="$vuetify.display.mdAndDown"
      style="background-color: rgb(135, 183, 9)"
    >
      <v-btn v-if="selectedRoutine" icon @click="selectedRoutine = null">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>.</v-toolbar-title>
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
        style="padding: 20px 0px"
      >
        <!-- Add your list of previous chats here -->

        <div class="left">
          <div
            class=""
            v-for="day in location.location_days"
            :key="day.day"
            :class="`${
              selectedDays
                ? selectedDays.id == day.id
                  ? 'days-active'
                  : ''
                : ''
            } tabs`"
            @click="changeSelectedDay(day)"
          >
            <h4>{{ day.day_display }} {{ day.id }}</h4>
            <p>{{ day.routine_id ? day.routine_name : "No routine added" }}</p>
          </div>
        </div>
      </v-navigation-drawer>
      <v-main class="chat__wrapper">
        <v-row style="padding: 20px 0px">
          <v-col
            v-if="
              ($vuetify.display.mdAndDown && !selectedRoutine) ||
              !$vuetify.display.mdAndDown
            "
            sm="3"
            cols="12"
            class="webavail-height"
          >
            <!-- <v-col sm="3" xs="12" class="webavail-height"> -->
            <div class="right">
              <div>
                <div><h3>Routines</h3></div>
                <div class="input-cover mb-2" style="width: unset">
                  <Icon icon="material-symbols:search" width="24" height="24" />
                  <!-- <v-icon start color="black" icon="mdi-magnify"></v-icon> -->
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="search for routines..."
                  />
                </div>
              </div>
              <div v-if="routines.length > 0">
                <div
                  :class="`${
                    selectedRoutine
                      ? selectedRoutine.id == item.id
                        ? 'native-active'
                        : ''
                      : ''
                  } chips`"
                  v-for="item in filteredRoutines"
                  :key="item.id"
                >
                  <div class="chip-cover">
                    <h4>{{ item.name }}</h4>
                  </div>
                  <div class="chip-icons">
                    <Icon
                      icon="solar:add-square-broken"
                      width="25"
                      height="25"
                      @click="addRoutine(item)"
                      v-if="
                        selectedRoutine
                          ? selectedRoutine.id !== item.id
                            ? true
                            : false
                          : true
                      "
                      style="cursor: pointer"
                    />
                    <Icon
                      v-if="
                        selectedRoutine
                          ? selectedRoutine.id == item.id
                            ? true
                            : false
                          : false
                      "
                      icon="solar:close-square-broken"
                      width="25"
                      height="25"
                      :horizontalFlip="true"
                      style="cursor: pointer"
                      @click="removeRoutine(item)"
                    />
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
                v-if="filteredRoutines.length < 1 && !loading && searchQuery"
              >
                No routine named {{ searchQuery }}
              </div>
            </div>
          </v-col>
          <v-col sm="9" xs="12" class="webavail-height1">
            <div
              v-if="
                selectedRoutine
                  ? selectedRoutine.exercises.length > 0
                    ? true
                    : false
                  : false
              "
              class="details mt-2"
            >
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

              <div class="detail-head">
                <h3 style="margin-top: 10px">
                  {{ selectedExercise.exercise_info.name }}
                </h3>
              </div>

              <h4>Instructions</h4>
              <p>
                {{ selectedExercise.exercise_info.description }}
              </p>

              <h4>Additional Information</h4>
              <p>
                <span
                  >Reps:
                  {{ selectedExercise.reps ? selectedExercise.reps : "none" }}
                </span>
                <span> Duration: {{ selectedExercise.duration }} </span>
              </p>

              <v-divider></v-divider>
              <div class="mb-3"><h4>All Exercises</h4></div>

              <v-sheet
                class="mx-auto"
                elevation="2"
                max-width="900"
                style="background: transparent"
              >
                <v-slide-group
                  v-model="model"
                  class="pa-4"
                  selected-class="bg-success"
                  show-arrows
                >
                  <v-slide-group-item
                    v-for="item in selectedRoutine.exercises"
                    :key="item.id"
                    v-slot="{}"
                  >
                    <div class="d-flex fill-height align-center justify-center">
                      <div
                        style="cursor: pointer"
                        :class="`${
                          item.id == selectedExercise.id
                            ? 'selected-execise'
                            : ''
                        } ma-4 exercise-image`"
                        @click="selectedExercise = item"
                      >
                        <img
                          :src="
                            item.exercise_info.is_upload
                              ? item.exercise_info.thumb_image
                              : item.exercise_info.thumb_image_tube
                          "
                          :alt="require('@/assets/scanner-image.jpg')"
                          style="width: 245px"
                          class="content-img"
                        />
                        <div class="exerise-name">
                          {{ item.exercise_info.name }}
                        </div>
                      </div>
                    </div>
                  </v-slide-group-item>
                </v-slide-group>
              </v-sheet>
            </div>
            <div class="non-available" v-else>
              <h3>Select a routine or no exercise in routine</h3>
            </div>
          </v-col>
        </v-row>
      </v-main>
    </v-layout>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import mainPlayer from "./dashboard/mainPlayer.vue";
import YoutubePlayer from "./dashboard/YoutubePlayer.vue";
import { Icon } from "@iconify/vue";

export default {
  name: "ContentDetail1",

  components: { Icon, mainPlayer, YoutubePlayer },

  props: ["location"],

  data() {
    return {
      leftdrawer: true,
      daysRoutine: [
        {
          days: "Monday",
          status: "Routine added",
        },
        {
          days: "Tuesday",
          status: "No routine added",
        },
        {
          days: "Wednesday",
          status: "No routine added",
        },
        {
          days: "Thursday",
          status: "No routine added",
        },
        {
          days: "Friday",
          status: "No routine added",
        },
        {
          days: "Saturday",
          status: "No routine added",
        },
      ],

      selectedRoutine: null,
      selectedDays: null,

      routines: [],

      selectedExercise: null,
      searchQuery: "",
    };
  },
  methods: {
    // Function to toggle the sidebar
    toggleSidebar() {
      this.leftdrawer = !this.leftdrawer;
    },

    extractVideoId(video) {
      // Regular expression to match YouTube video IDs
      //console.log(video);
      const regex = /[?&]v=([^&#]*)/;

      // Extract video ID from the link using the regex
      const match = video.match(regex);

      if (match && match[1]) {
        return match[1];
      } else {
        return "";
      }
    },

    async removeRoutine(item) {
      this.$swal({
        title: `Do you want to remove ${item.name} from ${this.selectedDays.day_display}?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
        footer: `Not this would mean ${this.selectedDays.day_display} has not assigned day `,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await axiosInstance.patch(`/location-days/${this.selectedDays.id}/`, {
            routine: null,
          });
          this.selectedRoutine = null;
          let location = this.selectedDays;
          await this.$store.dispatch("getLocations");
          await this.changeSelectedDay(location);

          this.changeRoutine(null);
          this.adjustPostion(null);
          this.$swal("Saved!", "", "success");
        } else if (result.isDenied) {
          this.$swal("Changes are not saved", "", "info");
        }
      });
    },

    async addRoutine(item) {
      this.$swal({
        title: `Do you want to add ${item.name} from ${this.selectedDays.day_display}?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
        footer: `This would assign ${item.name} to ${this.selectedDays.day_display} `,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await axiosInstance.patch(`/location-days/${this.selectedDays.id}/`, {
            routine: item.id,
          });
          // this.selectedRoutine = item;
          this.changeRoutine(item);
          let location = this.selectedDays;

          await this.$store.dispatch("getLocations");
          await this.changeSelectedDay(location);
          this.changeRoutine(item);
          this.adjustPostion(item.id);
          this.$swal("Saved!", "", "success");
        } else if (result.isDenied) {
          this.$swal("Changes are not saved", "", "info");
        }
      });
    },

    changeRoutine(value) {
      this.selectedRoutine = value;

      if (this.selectedRoutine) {
        if (this.selectedRoutine.exercises.length > 0) {
          this.selectedExercise = this.selectedRoutine.exercises[0];
        }
      }
    },

    async changeSelectedDay(item) {
      this.selectedDays = item;

      this.adjustPostion(item.routine_id);
      await this.adjustValidRoutine();
    },

    adjustPostion(targetId) {
      // Specify the ID of the item you want to move to the top

      // Find the index of the item with the specified ID
      const targetIndex = this.routines.findIndex(
        (routine) => routine.id === targetId
      );

      // Check if the item with the specified ID exists in the list
      if (targetIndex !== -1) {
        // Remove the item from its current position
        const removedItem = this.routines.splice(targetIndex, 1)[0];

        // Insert the item at the beginning of the list
        this.routines.unshift(removedItem);
      } else {
        this.routines.sort((a, b) => a.id - b.id);
      }
    },

    async adjustValidRoutine() {
      // Use the filter function to find items with the target ID
      const filteredItems = this.routines.filter(
        (item) => item.id === this.selectedDays.routine_id
      );
      //console.log(filteredItems, "filtered");

      if (filteredItems.length > 0) {
        this.changeRoutine(filteredItems[0]);
      } else {
        this.selectedRoutine = null;
      }
    },

    async activateRoutine() {
      await this.$store.dispatch("getRoutines");
      await this.changeSelectedDay(this.location.location_days[0]);

      this.routines = this.$store.state.routines;

      this.adjustPostion(this.selectedDays.routine_id);
      this.adjustValidRoutine();
      //console.log(this.routines, "this is the routines");
    },
  },

  async created() {
    await this.activateRoutine();
  },

  computed: {
    filteredRoutines() {
      const query = this.searchQuery.toLowerCase();
      return this.routines.filter((routine) =>
        routine.name.toLowerCase().includes(query)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/mainContent.scss";

.v-navigation-drawer__content {
  overflow-y: hidden !important;
}

.webavail-height {
  height: -webkit-fill-available;
}

.webavail-height1 {
  height: 100%;
}

.v-row {
  @media (max-width: 600px) {
    width: 100%;
  }
}

.input-cover {
  @media (max-width: 600px) {
    max-width: 100%;
  }
}

.v-col-sm-9 {
  flex: 1;
  /* max-width: 90%; */
  margin: 0px auto;
}
.non-available {
  height: -webkit-fill-available;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
