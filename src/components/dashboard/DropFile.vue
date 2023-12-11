<template>
  <div>
    <div
      v-if="!videoURL"
      class="dropzone-container"
      :style="isDragging && 'border-color: green;'"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
    >
      <input
        type="file"
        name="file"
        id="fileInput"
        class="hidden-input"
        @change="onChange"
        ref="file"
        accept=".mp4,.mov"
      />

      <label for="fileInput" class="file-label">
        <div v-if="isDragging">Release to drop files here.</div>
        <div v-else>Drop files here or <u>click here</u> to upload.</div>
      </label>
    </div>
    <div v-else>
      <v-icon @click="removeVideo"> mdi-close </v-icon>
      <mainPlayer :src="videoURL" :defaultWidth="`400px`" />
    </div>
  </div>
</template>

<script>
import mainPlayer from "./mainPlayer.vue";
import { useToast } from "vue-toastification";

const toast = useToast();
export default {
  data() {
    return {
      isDragging: false,
      //   files: [],
      videoURL: null,
    };
  },
  props: ["files"],
  components: { mainPlayer },
  methods: {
    onChange() {
      const selectedFile = this.$refs.file.files[0];

      if (selectedFile && selectedFile.size <= 20 * 1024 * 1024) {
        // Check file size <= 20MB
        const validExtensions = [".mp4", ".mov"];
        const fileExtension = selectedFile.name.slice(
          ((selectedFile.name.lastIndexOf(".") - 1) >>> 0) + 2
        );

        if (validExtensions.includes(`.${fileExtension}`)) {
          // Check valid extension
          this.files.push(selectedFile);
          this.displayVideo();
        } else {
          toast.error(
            "Invalid file format. Supported formats: .mp4, .mov, .mkv"
          );
        }
      } else {
        toast.error("File size exceeds the maximum limit of 20MB.");
      }
    },
    dragover(e) {
      e.preventDefault();
      this.isDragging = true;
    },

    removeVideo() {
      this.$emit("resetFiles");
      this.displayVideo();
    },

    displayVideo() {
      if (this.files.length > 0) {
        const file = this.files[0];
        this.videoURL = URL.createObjectURL(file);
      } else {
        this.videoURL = null;
      }
    },
    dragleave() {
      this.isDragging = false;
    },
    drop(e) {
      e.preventDefault();
      this.$refs.file.files = e.dataTransfer.files;
      this.onChange();
      this.isDragging = false;
    },
  },

  watch: {
    files: {
      handler() {
        this.displayVideo();
      },
      immediate: true,
    },
  },
};
</script>
<style scoped lang="scss">
@import "../../scss/DropFile.scss";
</style>
