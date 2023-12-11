<template>
  <div justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      transition="dialog-bottom-transition"
      activator="parent"
    >
      <v-card>
        <v-toolbar dark class="toolbar-top" style="display: flex !important">
          <v-btn icon dark @click="$emit('close')">
            <v-icon size="x-large">mdi-close</v-icon>
          </v-btn>
          <!-- <v-toolbar-title @click="getData" style="font-weight: 600;">Trainer</v-toolbar-title> -->
          <v-spacer></v-spacer>
          <div class="logo">
            <img
              :src="require('../../assets/gym-logo.png')"
              style="width: 50px"
              alt="gym-logo"
            />
          </div>
        </v-toolbar>
        <v-container>
          <div class="name" @click="getData">
            <Icon
              icon="material-symbols:circle-outline"
              color="#b4f40c"
              width="50"
              height="50"
            />
            <h2>{{ this.routine.name }}</h2>
          </div>
          <div class="description">
            <h3>Description:</h3>
            <p>{{ this.routine.description }}</p>
          </div>
          <div class="duration">
            <h3>
              Number of Exercise:
              <span>{{ this.routine.exercises.length }}</span>
            </h3>
          </div>
        </v-container>

        <v-container>
          <div class="exercise-cover">
            <h2>Exercises</h2>
            <div class="video">
              <div
                class="video-detail-cover"
                v-for="item in routine.exercises"
                :key="item.id"
                @click="selectedExercise(item)"
              >
                <img
                  class="image-list"
                  :src="
                    item.exercise_info.is_upload
                      ? item.exercise_info.thumb_image
                      : item.exercise_info.thumb_image_tube
                  "
                />
                <div class="video-detail">
                  <p class="info-name">{{ item.exercise_info.name }}</p>
                  <p>{{ item.exercise_info.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </v-container>

        <!-- <div class="bottom-circle">
          <h3>Start Now</h3>
        </div> -->
      </v-card>
    </v-dialog>

    <!-- second dialog -->
    <VideoDialog
      v-if="selected"
      :selectedExercise="selected"
      :parentDialog="dialog2"
      @close="closer()"
    />
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import mainPlayer from "../../components/dashboard/mainPlayer.vue";
import YoutubePlayer from "../../components/dashboard/YoutubePlayer.vue";
import VideoDialog from "./VideoDialog.vue";

export default {
  name: "TrainerModal",
  data() {
    return {
      dialog: false,
      dialog2: false,
      selected: null,
    };
  },
  props: ["parentDialog", "routine"],
  components: {
    Icon,
    mainPlayer,
    YoutubePlayer,
    VideoDialog,
  },
  methods: {
    selectedExercise(detail) {
      // //console.log(detail)
      this.selected = detail;
      //console.log("this is the selected Exercise", this.selected);
      //console.log("this is the name", this.selected.exercise_info.name);
      // //console.log(
      //   "this is the description",
      //   this.selected.exercise_info.description
      // );
      this.dialog2 = true;
    },

    closer() {
      this.selected = null;
      this.dialog2 = false;
    },
  },
  mounted() {
    //console.log("component mounted", this.parentDialog);
  },
  watch: {
    parentDialog(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.dialog = newVal;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/mobiles-styles/TrainerModal.scss";

.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>
