<template>
  <div class="video-track">
    <input
      type="range"
      min="0"
      max="100"
      step="1"
      :value="valueRamge"
      @input="onInput"
    />
    <!-- <v-slider
      v-model="valueRamge"
      color="rgb(144, 195, 10)"
      track-color="rgb(180, 244, 12)"
      @input="onInput"
    ></v-slider> -->
  </div>
</template>

<script>
export default {
  name: "VideoTrack",
  props: {
    percentage: { type: Number, required: true },
  },
  methods: {
    onInput(e) {
      this.$emit("seek", e.target.value);
    },
  },

  computed: {
    valueRamge() {
      return this.percentage.toFixed(1);
    },
  },
};
</script>

<style lang="scss">
@import "../../scss/colors";

input[type="range"] {
  position: relative;
  top: -1px;
  overflow: hidden;
  width: 245px;
  -webkit-appearance: none;
  background-color: $primary-normal;
  color: $primary-normal-active;
  border-radius: 5px;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 8px;
  -webkit-appearance: none;
  color: $primary-normal-active;
  margin-top: -1px;
}

input[type="range"]::-webkit-slider-thumb {
  width: 8px;
  -webkit-appearance: none;
  height: 8px;
  cursor: ew-resize;
  background: $primary-normal-active;
  box-shadow: -245px 0 0 245px #333;
}
</style>
