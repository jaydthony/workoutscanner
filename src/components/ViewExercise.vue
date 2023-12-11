<template>
  <div class="text-center">
    <v-dialog v-model="dialog" activator="parent">
      <v-card
        class="dialog2"
        width="auto"
        style="background-color: rgb(232, 252, 180)"
      >
        <!-- <img :src="require('../assets/workoutvid.png')" alt="" /> -->
        <mainPlayer
          v-if="exercise.is_upload"
          :poster="exercise.thumb_image"
          :src="exercise.video_upload"
          :defaultWidth="$vuetify.display.mdAndDown ? `300px` : `400px`"
        />
        <YoutubePlayer
          v-else
          :youtubeId="extractVideoId(exercise.youtube_link)"
        />

        <div class="dialog2-det">
          <div class="dialog2-det-top">
            <h1>{{ exercise.name }}</h1>
            <img
              v-if="exercise.company == $store.state.user.id"
              @click="dialog3 = true"
              :src="require('../assets/edit-dark.png')"
              alt=""
              style="cursor: pointer"
            />
          </div>
          <div class="dialog2-det-bot">
            <h3>Description</h3>
            <p>
              {{ exercise.description }}
            </p>
          </div>
        </div>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="$emit('close')" class="close-first">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 3rd dialog -->
    <v-dialog v-model="dialog3">
      <v-card class="dialog3" style="background-color: rgb(232, 252, 180)">
        <mainPlayer
          v-if="exercise.is_upload"
          :poster="exercise.thumb_image"
          :src="exercise.video_upload"
          :defaultWidth="`-webkit-fill-available`"
        />
        <YoutubePlayer
          v-else
          :youtubeId="extractVideoId(exercise.youtube_link)"
        />
        <div class="dialog3-det">
          <div class="forms">
            <label for="exercise">Exercise name</label>
            <input v-model="exercise.nameEdit" id="exercise" type="text" />
          </div>
          <div class="forms">
            <label for="desc">Description</label>
            <textarea
              v-model="exercise.descriptionEdit"
              id="desc"
              cols="30"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="dialog3-bot">
          <div class="left">
            <button @click="dialog4 = !dialog4">Delete Exercise</button>
          </div>
          <div class="right">
            <button @click="dialog3 = false">Cancel</button>
            <v-btn
              :disabled="
                exercise.descriptionEdit != exercise.description &&
                exercise.nameEdit != exercise.name
              "
              @click="updateExercise"
              :loading="loading"
              style="background-color: transparent"
              >Save Changes</v-btn
            >
          </div>
        </div>
        <v-card-text>
          <!-- <v-btn color="primary" @click="dialog4 = !dialog4">
              Open Dialog 4
            </v-btn> -->
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- 4th modal -->
    <v-dialog v-model="dialog4" width="auto">
      <v-card class="dialog4" style="background-color: rgb(244, 253, 219)">
        <v-card-title>
          <h2>Are you sure?</h2>
          <p>
            You are about to delete the {{ exercise.name }} video. Press Delete
            to proceed or return to edit mode.
          </p>
        </v-card-title>
        <v-card-actions
          style="display: flex; align-items: end; flex-direction: column"
        >
          <div class="dialog4-btn">
            <v-btn variant="text" class="back" @click="dialog4 = false">
              Back to edit mode
            </v-btn>
            <v-btn
              class="delete-btn"
              variant="text"
              @click="deleteExercise"
              :loading="loading"
            >
              Delete
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/UploadExercise.scss";
@import "../scss/colors";

.back,
.close-first {
  color: $secondary-darker;
  border: 1px solid $secondary-darker;
}

.delete-btn {
  color: $accent-normal;
  border: 1px solid $accent-normal;
}
.text-default-color-tab {
  color: #000;
  background-color: $primary-normal;
  transition: 0.4s ease;
  &:hover {
    background-color: $primary-normal-active;
  }
}
.ma-2 {
  background-color: $primary-normal;
}

.mt-5 {
  background-color: $primary-light;
  padding: 10px 20px;
}
</style>

<script>
import axiosInstance from "@/utils/axiosInstance";
import mainPlayer from "./dashboard/mainPlayer.vue";
import YoutubePlayer from "./dashboard/YoutubePlayer.vue";

export default {
  name: "ViewExercise",
  components: { mainPlayer, YoutubePlayer },
  data() {
    return {
      tab: null,
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      loading: false,
    };
  },

  methods: {
    extractVideoId(video) {
      // Regular expression to match YouTube video IDs
      const regex = /[?&]v=([^&#]*)/;

      // Extract video ID from the link using the regex
      const match = video.match(regex);

      if (match && match[1]) {
        return match[1];
      } else {
        return "";
      }
    },
    async updateExercise() {
      this.loading = true;

      let exercise = await axiosInstance.patch(
        `/exercises/${this.exercise.id}/`,
        {
          name: this.exercise.nameEdit,
          description: this.exercise.descriptionEdit,
        }
      );
      //console.log(exercise.data, "datat");

      this.exercise.name = this.exercise.nameEdit;
      this.exercise.description = this.exercise.descriptionEdit;
      // this.exercise = exercise.data;
      this.$emit("getAllExercise");

      this.loading = false;
    },

    async deleteExercise() {
      this.loading = true;

      let exercise = await axiosInstance.delete(
        `/exercises/${this.exercise.id}/`
      );

      this.$emit("getAllExercise");
      // this.$emit("close");
      this.dialog4 = false;
      this.dialog = false;
      this.dialog3 = false;
      this.loading = false;
    },
  },

  created() {
    this.exercise.nameEdit = this.exercise.name;
    this.exercise.descriptionEdit = this.exercise.description;
  },

  updated() {
    this.exercise.nameEdit = this.exercise.name;
    this.exercise.descriptionEdit = this.exercise.description;
  },

  props: ["parentDialog", "exercise"],

  methods: {
    extractVideoId(video) {
      // Regular expression to match YouTube video IDs
      const regex = /[?&]v=([^&#]*)/;

      // Extract video ID from the link using the regex
      const match = video.match(regex);

      if (match && match[1]) {
        return match[1];
      } else {
        return "";
      }
    },
    async updateExercise() {
      this.loading = true;

      let exercise = await axiosInstance.patch(
        `/exercises/${this.exercise.id}/`,
        {
          name: this.exercise.nameEdit,
          description: this.exercise.descriptionEdit,
        }
      );
      //console.log(exercise.data, "datat");

      this.exercise.name = this.exercise.nameEdit;
      this.exercise.description = this.exercise.descriptionEdit;
      // this.exercise = exercise.data;
      this.$emit("getAllExercise");

      this.loading = false;
    },

    async deleteExercise() {
      this.loading = true;

      let exercise = await axiosInstance.delete(
        `/exercises/${this.exercise.id}/`
      );

      this.$emit("getAllExercise");
      // this.$emit("close");
      this.dialog4 = false;
      this.dialog = false;
      this.dialog3 = false;
      this.loading = false;
    },
  },

  created() {
    this.exercise.nameEdit = this.exercise.name;
    this.exercise.descriptionEdit = this.exercise.description;
  },

  updated() {
    this.exercise.nameEdit = this.exercise.name;
    this.exercise.descriptionEdit = this.exercise.description;
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
