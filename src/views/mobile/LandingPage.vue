<template>
  <main>
    <!-- <div class="leftarr">

        <Icon @click="$emit('changeShow', false)" icon="ep:arrow-left" width="35" height="30" />

    </div> -->
    <!-- <img
      :src="require('../../assets/Mask group.png')"
      class="entry-image"
      alt="entry image"
    /> -->
    <Icon
      class="entry-image"
      icon="carbon:scan-alt"
      color="#b4f40c"
      width="120"
      height="120"
    />
    <div class="entry">
      <h2><span>Workout</span><br />Scanner</h2>
    </div>
  </main>
</template>

<script>
import { Icon } from "@iconify/vue";

export default {
  name: "LandingPage",
  mounted() {
    //console.log("Component mounted");

    setTimeout(() => {
      // Use Vue Router to navigate to another component
      this.$router.push({ name: "mobile" });
    }, 3000);
  },
  components: { Icon },
};
</script>

<style lang="scss" scoped>
.leftarr {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.552);
  border-radius: 50%;
  top: 10px;
  left: 10px;
}

main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  height: 100%;
  justify-content: center;
}

img,
svg {
  /* width: 50%; */
  margin-bottom: 30px;
}

.entry {
  h2 {
    color: #d0fd3e;
    font-size: 40px;
    font-weight: 800;
    text-align: center;
    text-transform: uppercase;
    line-height: 50px;
    span {
      font-size: 50px;
      font-weight: 800;
      text-align: center;
      text-transform: uppercase;
    }
  }
}
</style>
