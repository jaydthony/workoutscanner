<template>
  <div justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      transition="dialog-bottom-transition"
      activator="parent"
    >
      <v-card>
        <v-toolbar dark class="toolbar-top">
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
          <div class="video">
            <mainPlayer
              v-if="selectedExercise.exercise_info.is_upload"
              :poster="selectedExercise.exercise_info.thumb_image"
              :src="selectedExercise.exercise_info.video_upload"
              :defaultWidth="`inherit`"
              @onPlayerEnded="onPlayerEnded"
            />
            <YoutubePlayer
              v-else
              :youtubeId="
                extractVideoId(selectedExercise.exercise_info.youtube_link)
              "
              @ended="onPlayerEnded"
              widthDefault="-webkit-fill-available"
              heightDefault="240"
            />
          </div>
          <div class="video-name">
            <h2>{{ selectedExercise.exercise_info.name }}</h2>
            <h3>{{ selectedExercise.exercise_info.description }}</h3>
            <div class="instruct">
              <div class="set">
                <h4>
                  Set:
                  <span style="font-size: 13px; font-weight: 600">{{
                    selectedExercise.sets
                      ? selectedExercise.sets
                      : "No data given"
                  }}</span>
                </h4>
              </div>
              <div class="wait">
                <h4>
                  Wait:
                  <span style="font-size: 13px; font-weight: 600">{{
                    selectedExercise.wait
                      ? selectedExercise.wait
                      : "No data given"
                  }}</span>
                </h4>
              </div>
              <div class="rep">
                <h4>
                  Rep:
                  <span style="font-size: 13px; font-weight: 600">{{
                    selectedExercise.reps
                      ? selectedExercise.reps
                      : "No data given"
                  }}</span>
                </h4>
              </div>
              <div class="dura">
                <h4>
                  Duration:
                  <span style="font-size: 13px; font-weight: 600">{{
                    selectedExercise.reps
                      ? selectedExercise.duration
                      : "No data given"
                  }}</span>
                </h4>
              </div>
            </div>
          </div>
        </v-container>
      </v-card>
    </v-dialog>

    <!-- second dialog -->
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import mainPlayer from "../../components/dashboard/mainPlayer.vue";
import YoutubePlayer from "../../components/dashboard/YoutubePlayer.vue";
export default {
  name: "TrainerModal",
  data() {
    return {
      dialog: true,
      dialog2: false,
      selected: {},
    };
  },
  props: ["parentDialog", "selectedExercise"],
  components: {
    Icon,
    mainPlayer,
    YoutubePlayer,
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

    onPlayerEnded() {
      //console.log("ended here");
      setTimeout(() => {
        this.$emit("close");
      }, 3000);
    },
  },
  mounted() {
    //console.log("component mounted", this.parentDialog);
  },
  watch: {
    parentDialog(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.dialog = newVal;
        //console.log(newVal, "here");
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
