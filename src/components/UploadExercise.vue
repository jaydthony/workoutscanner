<template>
  <div class="text-center">
    <v-btn class="upload-cover" v-if="!custom" @click="dialog = true">
      <v-icon start icon="mdi-plus"></v-icon>
      Create Exercise
    </v-btn>
    <v-btn
      v-else
      @click="dialog = true"
      style="background-color: rgb(135, 183, 9); color: white"
      class="mb-2"
    >
      Add Custom Exercise
    </v-btn>
    <div class="ma-2">
      <v-dialog v-model="dialog" activator="parent" width="auto">
        <v-card class="dialog">
          <v-card-text>
            <h1>Upload Exercise</h1>
          </v-card-text>
          <div class="tabs">
            <v-tabs v-model="tab" color="default-color-tab" align-tabs="left">
              <v-tab value="direct">Direct Upload</v-tab>
              <v-tab value="youtube">Youtube Upload</v-tab>
            </v-tabs>

            <v-window v-model="tab" class="mt-5 pt-5">
              <v-window-item value="direct" class="tab-cover">
                <div class="left">
                  <DropFile :files="files" @resetFiles="resetFiles" />
                  <!-- <img :src="require('../assets/drag-upload.png')" alt="upload"> -->
                </div>
                <div class="right">
                  <div class="forms">
                    <label for="exercise">Exercise name</label>
                    <input v-model="name1" id="exercise" type="text" />
                  </div>
                  <div class="forms">
                    <label for="desc">Instructions</label>
                    <textarea
                      v-model="description1"
                      id="desc"
                      cols="30"
                      rows="3"
                    ></textarea>
                  </div>
                  <div class="form-botton">
                    <v-btn @click="dialog = false">Cancel</v-btn>
                    <v-btn :loading="loading1" @click="uploadExercise"
                      >Save</v-btn
                    >
                  </div>
                </div>
              </v-window-item>
              <v-window-item value="youtube" class="tab-cover2">
                <div class="left">
                  <YoutubePlayer :youtubeId="videoId" />

                  <!-- https://www.youtube.com/watch?v=mDIuY-xtneM -->

                  <div class="input-cover">
                    <div class="forms">
                      <label for="link">Upload Link</label>
                      <input
                        v-model="youtubeLink"
                        type="text"
                        id="link"
                        placeholder="https//"
                      />
                    </div>
                    <button @click="extractVideoId">Process</button>
                  </div>
                </div>
                <div class="right">
                  <div class="forms">
                    <label for="exercise">Exercise name</label>
                    <input v-model="name2" id="exercise" type="text" />
                  </div>
                  <div class="forms">
                    <label for="desc">Instructions</label>
                    <textarea
                      v-model="description2"
                      id="desc"
                      cols="30"
                      rows="3"
                    ></textarea>
                  </div>
                  <div class="form-botton">
                    <v-btn @click="dialog = false">Cancel</v-btn>
                    <v-btn
                      :disabled="!name2 || !description2 || !videoId"
                      :loading="loading2"
                      @click="uploadExerciseYoutube"
                      >Save</v-btn
                    >
                  </div>
                </div>
              </v-window-item>
            </v-window>
            <v-dialog
              v-model="dialog3"
              v-if="uploadProgress > 0"
              class="progress-dialog"
              persistent
            >
              <v-progress-linear
                color="rgb(232, 252, 180)"
                :model-value="uploadProgress"
                :height="12"
                rounded
              ></v-progress-linear>
            </v-dialog>
          </div>
          <v-card-actions>
            <!-- <v-btn color="primary" style="opacity: 0;" block @click="dialog = false">Close Dialog</v-btn> -->
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <!-- second dialog -->
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/UploadExercise.scss";
@import "../scss/colors";

.upload-cover {
  display: flex;
  align-items: center;
  background-color: $primary-normal;

  @media (max-width: 1400px) {
    font-size: 10px;
  }
  @media (max-width: 600px) {
    padding-top: 0px;
  }
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
  width: 100%;
  margin: 0px !important;
  font-size: inherit !important;
}

.mt-5 {
  background-color: $primary-light;
  padding: 10px 20px;
}

.text-center {
  .ma-2 {
    /* background-color: $primary-normal; */
    /* padding: 5px 10px; */
    @media (max-width: 1400px) {
      font-size: 10px;
    }
  }
}

.progress-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999; /* Ensure it's above other content */
  background-color: white; /* Optionally, set a background color */
  padding: 20px; /* Add padding for spacing around the progress bar */
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); /* Optionally, add a box shadow */
}
</style>

<script>
import axiosInstance from "@/utils/axiosInstance";
import DropFile from "./dashboard/DropFile.vue";
import YoutubePlayer from "./dashboard/YoutubePlayer.vue";

export default {
  name: "UploadExercise",
  components: { DropFile, YoutubePlayer },
  data() {
    return {
      tab: null,
      loading1: false,
      loading2: false,
      dialog: false,
      dialog2: false,
      dialog3: true,
      dialog4: false,
      files: [],
      name1: "",
      name2: "",
      description1: "",
      description2: "",
      youtubeLink: "",
      videoId: "",
      uploadProgress: 0, // Initialize uploadProgress to 0
    };
  },
  props: ["custom"],
  methods: {
    extractVideoId() {
      // Regular expression to match YouTube video IDs
      const regex = /[?&]v=([^&#]*)/;

      // Extract video ID from the link using the regex
      const match = this.youtubeLink.match(regex);

      if (match && match[1]) {
        this.videoId = match[1];
      } else {
        this.videoId = "";
      }
    },

    resetFiles() {
      this.files = [];
    },

    async uploadExercise() {
      this.loading1 = true;
      try {
        const formData = new FormData();
        formData.append("name", this.name1);
        formData.append("description", this.description1);
        formData.append("is_upload", true);
        formData.append("video_upload", this.files[0]);

        // Send the Axios request using axiosInstance with onUploadProgress event
        await axiosInstance
          .post("/exercises/", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              //console.log("started with progresss", progressEvent);
              // Calculate the upload progress percentage
              this.uploadProgress = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
            },
          })
          .then((res) => {
            //console.log("Exercise uploaded:", res.data);

            // Clear form fields after successful upload
            this.name1 = "";
            this.description1 = "";
            this.files = [];

            this.$store.dispatch("getExercise");
            this.$emit("onSelectExercise", res.data);
            this.dialog = false;
          });
      } catch (error) {
        console.error("Error uploading exercise:", error);
      }

      this.loading1 = false;
      this.uploadProgress = 0; // Reset the progress after upload completion or error
    },

    async uploadExerciseYoutube() {
      this.loading2 = true;
      try {
        //console.log(this.files, "the files");
        const formData = new FormData();
        formData.append("name", this.name2);
        formData.append("description", this.description2);
        formData.append("is_upload", false);
        // Append other fields...
        formData.append("youtube_link", this.youtubeLink);

        // Send the Axios request using axiosInstance
        const response = await axiosInstance
          .post("/exercises/", formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Required for file upload
            },
          })
          .then((res) => {
            this.name2 = "";
            this.description2 = "";
            this.$store.dispatch("getExercise");
            this.$emit("onSelectExercise", res.data);
            this.dialog = false;
          });

        // Clear form fields after successful upload
      } catch (error) {
        console.error("Error uploading exercise:", error);
      }

      this.loading2 = false;
    },
  },
};
</script>
