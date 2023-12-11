<template>
  <div class="video-container">
    <iframe
      :width="widthDefault"
      :height="heightDefault"
      :src="`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;"
      allowfullscreen
      class="youtube-vid"
      :style="{ 'border-radius': '8px', width: widthDefault }"
      id="youtube-player"
    ></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      player: null,
      duration: 0,
      percentagePlayed: 0,
      videoMuted: false,
      isIOS: false,
    };
  },
  props: {
    youtubeId: { type: String, required: true, default: "3234fdsd" },
    widthDefault: { type: String, required: true, default: "560" },
    heightDefault: { type: String, required: true, default: "315" },
  },
  mounted() {
    // Callback function for when the YouTube API is ready
    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player("youtube-player", {
        events: {
          onStateChange: this.onPlayerStateChange,
        },
      });
      this.player = player;
      // //console.log(player, "player");
    };
    try {
      const player = new window.YT.Player("youtube-player", {
        events: {
          onStateChange: this.onPlayerStateChange,
        },
      });

      this.player = player;

      // //console.log(player, "player");
    } catch (error) {}
  },

  updated() {
    // Callback function for when the YouTube API is ready
    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player("youtube-player", {
        events: {
          onStateChange: this.onPlayerStateChange,
        },
      });
      this.player = player;
      // //console.log(player, "player");
    };
    try {
      const player = new window.YT.Player("youtube-player", {
        events: {
          onStateChange: this.onPlayerStateChange,
        },
      });
      this.player = player;
      // //console.log(player, "player2");
    } catch (error) {}
  },
  methods: {
    onPlayerStateChange(event) {
      if (event.data === window.YT.PlayerState.PLAYING) {
        // Video is playing, wait for 2 seconds, then go fullscreen
        //console.log(this.player);
        setTimeout(() => {
          // document.documentElement.requestFullscreen();
          // this.player.fullscreen(); // Go fullscreen
          // //console.log(this.player, "here");
        }, 2000);
      } else if (event.data === window.YT.PlayerState.ENDED) {
        // Video has ended, you can perform your action here
        // //console.log("Video ended");
        this.$emit("ended");
      }
    },
  },
};
</script>
