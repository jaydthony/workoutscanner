<template>
  <div class="app">
    <div
      class="videoplayer-container"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleVideoClick"
    >
      <videoplayer
        class="videoplayer"
        :src="src"
        :poster="poster"
        :defaultWidth="defaultWidth"
        :defaultHeight="defaultHeight"
        :muted="false"
        :autoplay="false"
        :controls="true"
        :loop="false"
        @play="onPlayerPlay"
        @pause="onPlayerPause"
        @ended="onPlayerEnded"
        @loadeddata="onPlayerLoadeddata"
        @waiting="onPlayerWaiting"
        @playing="onPlayerPlaying"
        @timeupdate="onPlayerTimeupdate"
        @canplay="onPlayerCanplay"
        @canplaythrough="onPlayerCanplaythrough"
        @statechanged="playerStateChanged"
      >
        <template
          v-slot:controls="{
            togglePlay,
            playing,
            percentagePlayed,
            seekToPercentage,
            duration,
            convertTimeToDuration,
            videoMuted,
            toggleMute,
          }"
        >
          <div class="videoplayer-controls" v-if="showControls && !isIOS">
            <v-row>
              <v-col cols="2"
                ><div class="videoplayer-controls-time">
                  {{ convertTimeToDuration(time) }} /
                  {{ convertTimeToDuration(duration) }}
                </div></v-col
              >
              <v-col cols="9">
                <videoplayer-track
                  :percentage="percentagePlayed"
                  @seek="seekToPercentage"
                  class="videoplayer-controls-track"
              /></v-col>
              <v-col cols="1" class="volume-class">
                <v-icon @click="toggleMute">{{
                  videoMuted ? "mdi-volume-off" : "mdi-volume-high"
                }}</v-icon>
              </v-col>
            </v-row>
          </div>
          <div class="playing-button" v-if="showControls">
            <div @click="togglePlay" class="videoplayer-controls-toggleplay">
              <img v-if="playing" :src="require('@/assets/pause.svg')" alt="" />
              <img v-else :src="require('@/assets/play.svg')" alt="" />
            </div>

            <!-- <v-btn
              icon
              @click="togglePlay"
              class="videoplayer-controls-toggleplay"
            >
              <v-icon>{{ playing ? "mdi-pause" : "mdi-play" }}</v-icon>
            
             
            </v-btn> -->
          </div>
        </template>
      </videoplayer>
    </div>
  </div>
</template>

<script>
import videoplayer from "./videoplayer";
import videoplayerTrack from "./videoplayer-track";
import play from "@/assets/play.svg";
import pause from "@/assets/pause.svg";
export default {
  components: {
    videoplayer,
    videoplayerTrack,
    play,
    pause,
  },
  data() {
    return {
      time: 0,
      showControls: true,
      playing: false,
      isIOS: false,
    };
  },

  props: {
    src: { type: String, required: true },
    poster: {
      type: String,
      required: false,
      default: require("@/assets/scanner-image.jpg"),
    },
    width: {
      type: [String, Number], // Accepts both string and number types
      required: false,
      default: "500", // Default value as a string
    },

    defaultWidth: {
      type: [String, Number], // Accepts both string and number types
      required: false,
      default: "500", // Default value as a string
    },

    defaultHeight: {
      type: [String, Number], // Accepts both string and number types
      required: false,
      default: "500", // Default value as a string
    },
  },

  methods: {
    onPlayerPlay({ event, player }) {
      //console.log(event.type);
      player.setPlaying(true);
      this.playing = true;
      this.showControls = false;
    },
    onPlayerPause({ event, player }) {
      //console.log(event.type);
      player.setPlaying(false);
      this.playing = false;
      this.showControls = true;
    },
    onPlayerEnded({ event, player }) {
      //console.log(event.type, "ended");
      player.setPlaying(false);
      this.$emit("onPlayerEnded");
    },
    onPlayerLoadeddata({ event }) {
      //console.log(event.type);
    },
    onPlayerWaiting({ event }) {
      //console.log(event.type);
    },
    onPlayerPlaying({ event }) {
      //console.log(event.type);
    },
    onPlayerTimeupdate({ event }) {
      this.time = event.target.currentTime;
      // //console.log({ event: event.type, time: event.target.currentTime });
    },
    onPlayerCanplay({ event }) {
      //console.log(event.type);
    },
    onPlayerCanplaythrough({ event }) {
      //console.log(event.type);
    },
    playerStateChanged({ event }) {
      //console.log(event.type);
    },

    handleMouseEnter() {
      if (this.playing) {
        this.showControls = true;
      }
    },

    handleMouseLeave() {
      if (this.playing) {
        this.showControls = false;
      }
    },

    handleVideoClick() {
      if (this.showControls && window.innerWidth <= 768) {
        this.showControls = false;
      } else {
        this.showControls = true;
      }
    },
  },

  created() {
    // Check if the user agent contains "iPhone" or "iPad"
    if (/iPhone|iPad/i.test(navigator.userAgent)) {
      this.isIOS = true;
    }
  },
};
</script>

<style lang="scss">
.videoplayer-container {
  position: relative;
  width: -webkit-fill-available;
  // height: 281px; /* Adjust the height as needed */
}

.videoplayer {
  width: 100%;
}

.videoplayer-controls {
  position: absolute;
  bottom: 1px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font: 0.8em sans-serif;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 5px;
}

.playing-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.videoplayer-controls-toggleplay,
.videoplayer-controls-togglemute {
  margin: 0 10px;
}

.videoplayer-controls-toggleplay {
  img {
    cursor: pointer;
  }
}

.videoplayer-controls-time {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.volume-class {
  display: flex;
  justify-content: center;
  align-items: center;
}

.videoplayer-controls-track {
  input {
    width: 100%;
  }
}
</style>
