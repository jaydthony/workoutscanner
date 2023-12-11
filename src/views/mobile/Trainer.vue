<template>
  <!-- <h1>Trainer</h1> -->
  <div>
    <div v-if="!showFinished" class="trainer">
      <div class="top">
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

      <div class="info">
        <v-icon class="leftarr" @click="$emit('InitStart', false)"
          >mdi-arrow-right-bold</v-icon
        >
        <div class="info-top">
          <h3>{{ selectedExercise.exercise_info.name }}</h3>
          <p>
            {{ selectedExercise.exercise_info.description }}
          </p>
        </div>
        <div class="info-table">
          <div class="tab">
            <h3>
              {{ selectedExercise.duration ? selectedExercise.duration : "1" }}
            </h3>
            <p>Duration</p>
          </div>
          <v-divider vertical></v-divider>
          <div class="tab">
            <h3>{{ selectedExercise.reps ? selectedExercise.reps : "1" }}</h3>
            <p>Reps</p>
          </div>
          <v-divider vertical></v-divider>
          <div class="tab">
            <h3>{{ selectedExercise.wait ? selectedExercise.wait : "1" }}</h3>
            <p>Wait</p>
          </div>
          <v-divider vertical></v-divider>
          <div class="tab">
            <h3>{{ selectedExercise.sets ? selectedExercise.sets : "1" }}</h3>
            <p>Sets</p>
          </div>
        </div>
        <div class="progress-info">
          <v-progress-circular
            :rotate="360"
            :model-value="completedPercentage"
            :size="150"
            :width="12"
            color="#D0FD3E"
            style="flex-direction='column';"
            class="flex-column progress-circle"
          >
            <div class="progress-det">
              <h3>{{ completedPercentage }}%</h3>
              <p>{{ completionMessage }}</p>
            </div>
          </v-progress-circular>
        </div>
        <div class="next-vid">
          <h3>Next Video</h3>

          <v-sheet class="mx-auto" max-width="600">
            <v-slide-group
              v-model="selectedItem"
              ref="slideGroup"
              :center-active="true"
              :show-arrows="false"
            >
              <v-slide-group-item
                v-for="item in routine.exercises"
                :key="item.id"
                v-slot="{ selectedClass }"
              >
                <v-card
                  color="grey-lighten-1"
                  width="250"
                  style="height: fit-content"
                  :class="`${
                    item.id == selectedExercise.id ? 'selectedClass ' : ''
                  } ma-4 exercise-image ${
                    item.id == selectedExercise.id ? selectedClass : ''
                  }`"
                  :disabled="!lockedExercise(item)"
                >
                  <img
                    @click="selectExercise(item)"
                    class="slide-image"
                    :src="
                      item.exercise_info.is_upload
                        ? item.exercise_info.thumb_image
                        : item.exercise_info.thumb_image_tube
                    "
                    alt=""
                  />
                  <div class="detail">
                    <p style="display: flex; align-items: center">
                      {{ item.exercise_info.name }}
                    </p>
                    <span>{{ item.duration }}mins </span>
                  </div>
                  <span
                    style="
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                    "
                    v-if="!lockedExercise(item)"
                  >
                    <Icon
                      style="font-size: 24px; color: rgb(180, 244, 12)"
                      icon="mdi-lock"
                    />
                  </span>
                </v-card>
              </v-slide-group-item>
            </v-slide-group>
          </v-sheet>
        </div>
      </div>
    </div>
    <Finish @changeShow="changeShow" else="showFinished" />
  </div>
</template>

<style lang="scss" scoped>
@import "../../scss/colors";
@import "../../scss/mobiles-styles/Trainer.scss";

.v-progress-circular__content {
  display: flex;
  flex-direction: column;
}
</style>

<script>
import { Icon } from "@iconify/vue";
import mainPlayer from "../../components/dashboard/mainPlayer.vue";
import YoutubePlayer from "../../components/dashboard/YoutubePlayer.vue";
import Finish from "./Finish.vue";

export default {
  name: "Trainer",
  data: () => ({
    model: null,
    interval: {},
    value: 10,
    selectedExercise: "",
    currentDate: new Date(),
    watchedVideos: [], // Array to store watched video objects
    showFinished: false,
    selectedExerciseIndex: 0,
    selectedItem: null,
  }),
  props: ["routine"],
  components: {
    Icon,
    mainPlayer,
    YoutubePlayer,
    Finish,
  },
  methods: {
    changeShow(value) {
      this.showFinished = value;
    },
    selectExercise(item, init = false) {
      //console.log(init);
      this.selectedExercise = item;

      //console.log(item, "here it is");

      // Access the v-slide-group using the ref
      const slideGroup = this.$refs.slideGroup;

      const exercises = this.routine.exercises;
      const selectedExerciseIndex = exercises.findIndex(
        (exercise) => exercise.id === item.id
      );

      this.selectedItem = selectedExerciseIndex;
    },
    initTrainer() {
      //console.log("the routine", this.routine);
      if (this.routine) {
        if (this.routine.exercises.length > 0) {
          const watched = this.getWatchedVideosForDate(this.currentDate);

          if (watched.length > 0) {
            // //console.log(
            //   watched.length,
            //   "length",
            //   this.routine.exercises[watched.length],
            //   this.routine.exercises
            // );

            if (this.routine.exercises.length == watched.length) {
              this.selectExercise(
                this.routine.exercises[watched.length - 1],
                true
              );
              return;
            }

            this.selectExercise(this.routine.exercises[watched.length], true);
            // //console.log("Value of the last object:", lastObject);
            return;
          }

          this.selectExercise(this.routine.exercises[0]);
        }
      }
    },

    lockedExercise(item) {
      return (
        this.getSelectedIndex(item) <=
        this.getWatchedVideosForDate(this.currentDate).length
      );
    },

    getNextExercise(currentExercise) {
      const exercises = this.routine.exercises;
      const currentIndex = exercises.findIndex(
        (exercise) => exercise.id === currentExercise.id
      );

      // Check if the current exercise exists in the array
      if (currentIndex !== -1) {
        const nextIndex = currentIndex + 1;

        // Check if there is a next exercise in the array
        if (nextIndex < exercises.length) {
          return exercises[nextIndex];
        }
      }

      // If there is no next exercise or the current exercise is not found, return a default value (e.g., null)
      return null;
    },

    // Function to check if a video has been watched for a specific date
    isVideoWatchedForDate(date, videoId) {
      const watchedVideosForDate = this.getWatchedVideosForDate(date);
      return watchedVideosForDate.includes(videoId);
    },

    // Function to mark a video as watched for a specific date
    markVideoAsWatchedForDate(date, videoId) {
      const watchedVideosForDate = this.getWatchedVideosForDate(date);
      if (!watchedVideosForDate.includes(videoId)) {
        watchedVideosForDate.push(videoId);
        this.storeWatchedVideosForDate(date, watchedVideosForDate);
      }
    },

    // Function to format a date as "ddmmyyyy"
    formatDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear());
      return day + month + year;
    },

    // Function to get the watched videos for a specific date
    getWatchedVideosForDate(date) {
      const dateStr = this.formatDate(date); // Format the date as "ddmmyyyy"

      const watchedVideos = this.watchedVideos.find(
        (item) => item.id === dateStr
      );
      return watchedVideos ? watchedVideos.watchedIndex : [];
    },

    // Function to store the watched videos for a specific date
    storeWatchedVideosForDate(date, watchedIndex) {
      const dateStr = this.formatDate(date); // Format the date as "ddmmyyyy"
      const index = this.watchedVideos.findIndex((item) => item.id === dateStr);
      if (index !== -1) {
        // Update the existing entry
        this.watchedVideos[index].watchedIndex = watchedIndex;
      } else {
        // Add a new entry
        this.watchedVideos.push({
          id: dateStr,
          videoCount: this.routine.exercises.length, // Assuming all videos are available for the day
          watchedIndex,
        });
      }
      // Store the watchedVideos array in local storage
      localStorage.setItem("watchedVideos", JSON.stringify(this.watchedVideos));
    },

    // ... your existing methods ...

    getSelectedIndex(currentExercise) {
      const exercises = this.routine.exercises;

      return exercises.findIndex(
        (exercise) => exercise.id === currentExercise.id
      );
    },

    onPlayerEnded() {
      const currentExercise = this.selectedExercise;

      const currentDate = new Date(); // Get the current date
      const currentIndex = this.getSelectedIndex(currentExercise);

      // Check if the current video has been watched for the current date
      if (!this.isVideoWatchedForDate(currentDate, currentIndex)) {
        // If not watched, mark it as watched for the current date
        this.markVideoAsWatchedForDate(currentDate, currentIndex);
      }

      // Get the next exercise
      const nextExercise = this.getNextExercise(currentExercise);

      if (nextExercise !== null) {
        // Play the next exercise
        this.selectExercise(nextExercise);
      } else {
        // Handle when there is no next exercise
        // //console.log("No more exercises");

        setTimeout(() => {
          // Use Vue Router to navigate to another component
          this.showFinished = true;
        }, 3000);
      }
    },

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
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
  mounted() {
    // //console.log(this.routine.exercises, "hereeeeee");
    // this.interval = setInterval(() => {
    //   if (this.value === 100) {
    //     return (this.value = 0);
    //   }
    //   this.value += 10;
    // }, 1000);
  },
  created() {
    const storedWatchedVideos = localStorage.getItem("watchedVideos");
    if (storedWatchedVideos) {
      this.watchedVideos = JSON.parse(storedWatchedVideos);
    }

    this.initTrainer();
  },

  computed: {
    completedPercentage() {
      if (!this.routine || this.routine.exercises.length === 0) {
        return 0; // Return 0 if there are no exercises
      }

      const totalExercises = this.routine.exercises.length;

      return Math.round(
        (this.getWatchedVideosForDate(this.currentDate).length /
          totalExercises) *
          100
      );
    },

    completionMessage() {
      const percentage = this.completedPercentage;

      if (percentage === 0) {
        return "Start"; // When the completion percentage is 0
      } else if (percentage < 20) {
        return "Keep Pushing"; // When the completion percentage is less than 20
      } else if (percentage < 50) {
        return "Almost There"; // When the completion percentage is less than 50
      } else if (percentage < 70) {
        return "Close to Success"; // When the completion percentage is less than 70
      } else {
        return "Success"; // When the completion percentage is 70 or higher
      }
    },
  },
};
</script>
