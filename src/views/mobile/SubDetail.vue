<template>
  <!-- <div v-if="!started" class="category"> -->
  <div>
    <div class="category">
      <v-overlay
        :model-value="loading"
        contained
        persistent
        class="align-center justify-center"
        style="height: 100vh"
        :close-on-content-click="false"
      >
        <v-progress-circular
          color="rgb(81, 110, 5)"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
      <div class="category-top" style="color: #fff">
        <v-toolbar class="toolbar-top" style="position: absolute; top: 0">
          <!-- <v-icon class="back-icon" @click="$emit('goBack')"
            >mdi-arrow-right-bold</v-icon
          > -->
          <v-icon
            size="x-large"
            style="position: absolute; right: 5%; top: 15px"
            @click="$emit('goBack')"
            >mdi-close</v-icon
          >
        </v-toolbar>
        <!-- <h2>{{ routine.name }}</h2> -->
        <h3 style="margin-top: 10px">{{ formattedDate }}</h3>

        <h4 v-if="!defaultValue">
          {{
            selectedProgram
              ? selectedProgram.program.name
              : "There is no program name provided"
          }}
        </h4>

        <h4 v-else>
          {{
            selectedProgram
              ? selectedProgram.name
              : "There is no program name provided"
          }}
        </h4>
        <p v-if="!defaultValue" class="para">
          {{
            selectedProgram
              ? selectedProgram.program.description
              : "There is no description inputed"
          }}
        </p>

        <p v-else class="para">
          {{
            selectedProgram
              ? selectedProgram.description
              : "There is no description inputed"
          }}
        </p>
      </div>

      <div v-if="!defaultValue" class="contain">
        <div class="cover">
          <div class="program">
            <div v-if="selectedProgram.program.show_all">
              <div
                v-for="(day, index) in selectedProgram.program.phases"
                :key="day.id"
              >
                <h2 style="color: #000">
                  {{
                    formattedNewDate(
                      selectedProgram.started_at,
                      selectedProgram.days_since_subscription_start,
                      index
                    )
                  }}
                </h2>
                <h3 style="color: #000">{{ day.name }}</h3>
                <div v-if="day.routines.length < 1">
                  No workout for Created not this day
                </div>
                <div
                  @click="viewRoutine(routine)"
                  class="tabs"
                  v-for="routine in day.routines"
                  :key="routine.id"
                >
                  <div class="left">
                    <v-img
                      v-if="routine.exercises.length === 0"
                      aspect-ratio="10/9"
                      width="100"
                      cover
                      src="../../assets/scanner-image.jpg"
                    ></v-img>
                    <img
                      v-if="routine.exercises.length > 0"
                      :src="
                        routine.exercises[0].exercise_info.is_upload
                          ? routine.exercises[0].exercise_info.thumb_image
                          : routine.exercises[0].exercise_info.thumb_image_tube
                      "
                      width="100"
                    />
                    <div class="details">
                      <h3>{{ routine.name }}</h3>
                      <!-- <p>0/5 completeds</p> -->
                    </div>
                  </div>
                  <Icon
                    icon="solar:arrow-right-broken"
                    width="30"
                    height="30"
                  />
                </div>
              </div>
            </div>
            <div v-else>
              <div>
                <h2 style="color: #000">
                  {{
                    formattedNewDate1(
                      selectedProgram.started_at,
                      selectedProgram.days_since_subscription_start
                    )
                  }}
                </h2>
                <h3 style="color: #000">
                  {{
                    selectedProgram.program.phases[
                      selectedProgram.days_since_subscription_start
                    ].name
                  }}
                </h3>
                <div
                  @click="viewRoutine(routine)"
                  class="tabs"
                  v-for="routine in selectedProgram.program.phases[
                    selectedProgram.days_since_subscription_start
                  ].routines"
                  :key="routine.id"
                >
                  <div class="left">
                    <v-img
                      v-if="routine.exercises.length === 0"
                      aspect-ratio="10/9"
                      width="100"
                      cover
                      src="../../assets/scanner-image.jpg"
                    ></v-img>
                    <img
                      v-if="routine.exercises.length > 0"
                      :src="
                        routine.exercises[0].exercise_info.is_upload
                          ? routine.exercises[0].exercise_info.thumb_image
                          : routine.exercises[0].exercise_info.thumb_image_tube
                      "
                      width="100"
                    />
                    <div class="details">
                      <h3>{{ routine.name }}</h3>
                      <!-- <p>0/5 completed</p> -->
                    </div>
                  </div>
                  <Icon
                    icon="solar:arrow-right-broken"
                    width="30"
                    height="30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="contain">
        <div class="cover">
          <div class="program">
            <div>
              <div v-for="day in selectedProgram.phases" :key="day.id">
                <h2 style="color: #000"></h2>
                <h3 style="color: #000">{{ day.name }}</h3>
                <div v-if="day.routines.length < 1">
                  No workout for Created not this day
                </div>
                <div
                  @click="viewRoutine(routine)"
                  class="tabs"
                  v-for="routine in day.routines"
                  :key="routine.id"
                >
                  <div class="left">
                    <v-img
                      v-if="routine.exercises.length === 0"
                      aspect-ratio="10/9"
                      width="100"
                      cover
                      src="../../assets/scanner-image.jpg"
                    ></v-img>
                    <img
                      v-if="routine.exercises.length > 0"
                      :src="
                        routine.exercises[0].exercise_info.is_upload
                          ? routine.exercises[0].exercise_info.thumb_image
                          : routine.exercises[0].exercise_info.thumb_image_tube
                      "
                      width="100"
                    />
                    <div class="details">
                      <h3>{{ routine.name }}</h3>
                      <!-- <p>0/5 completeds</p> -->
                    </div>
                  </div>
                  <Icon
                    icon="solar:arrow-right-broken"
                    width="30"
                    height="30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TrainerModal
      :routine="selectedRoutine"
      :parentDialog="dialog"
      @close="closetItem"
    />
  </div>

  <!-- <Trainer :routine="selectedRoutine" @InitStart="InitStart" v-else /> -->
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import Category from "./Category.vue";
import Category2 from "./Category2.vue";
import Trainer from "./Trainer.vue";
import TrainerModal from "./TrainerModal.vue";
import { useToast } from "vue-toastification";
import { Icon } from "@iconify/vue";
// CommonJS
// const Swal = require("sweetalert2");

const toast = useToast();

export default {
  name: "MainTrainer",
  components: { Category, Trainer, Category2, Icon, TrainerModal },

  data() {
    return {
      dialog: false,

      started: false,
      locationId: null,
      routine: null,
      nothing: false,
      loading: false,
      selectedRoutine: {},
      allDetail: null,
      locationName: "",
      programName: "",
      managerName: "",
      phaseNumber: null,
      loadDetail: false,
      description: "",
    };
  },
  props: ["selectedProgram", "defaultValue", "locationName"],
  methods: {
    InitStart(value) {
      this.started = value;
    },

    closetItem() {
      this.dialog = false;
      // this.selectedItem = null;
    },

    viewRoutine(routine) {
      this.selectedRoutine = routine;
      this.dialog = true;
      // this.started = true;
      //console.log("Trainer Dialog =", this.dialog, routine);
    },

    getIndex(start_date, program_length) {
      const date = new Date(originalDate);
    },

    formattedNewDate(originalDate, daysToAdd, index) {
      //console.log(originalDate, daysToAdd, index);
      let added = daysToAdd - (index + 1);
      if (daysToAdd < 0) {
        added = index;
      }

      // Parse the original date
      const date = new Date(originalDate);

      // Add the specified number of days
      date.setDate(date.getDate() - added);

      // Format the date in the "dd, MMM, yyyy" format
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    },

    formattedNewDate1(originalDate, daysToAdd) {
      //console.log(originalDate, daysToAdd);

      // Parse the original date
      const date = new Date(originalDate);

      // Add the specified number of days
      date.setDate(date.getDate() + daysToAdd);

      // Format the date in the "dd, MMM, yyyy" format
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    },
  },

  computed: {
    formattedDate() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date().toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/colors";
@import "../../scss/mobiles-styles/Category2.scss";

.toolbar-top {
  background-color: $primary-dark-active;
}
.para {
  // height: 80%;
  overflow-y: scroll;
  font-size: 15px;
  font-weight: 400;
  text-align: center;
  color: #fff;
  max-height: 60%;

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $primary-normal;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    -moz-border-radius: rem(4px);
    -webkit-border-radius: rem(4px);
    border-radius: rem(4px);
  }
}

.back-icon {
  position: absolute;
  color: white;
  font-size: 30px;
  z-index: 1;
  top: 10px;
  right: 15px;
  cursor: pointer;
  // width: 80px;
}
</style>
