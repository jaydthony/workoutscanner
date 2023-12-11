<template>
  <router-view />
  <v-overlay
    :model-value="$store.state.dashboardLoading"
    contained
    persistent
    class="align-center justify-center"
    :close-on-content-click="false"
  >
    <v-progress-circular
      color="rgb(81, 110, 5)"
      indeterminate
      size="64"
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
// Components

export default {
  name: "App",

  components: {},

  data: () => ({
    //
  }),

  mounted() {},
};
</script>

<style lang="scss">
html {
  overflow: hidden !important;
}

/* .exercise-image {
  position: relative;
  img {
  position: relative;
    width: 100%;
    cursor: pointer;
    border-radius: 8px;
  }
  .exerise-name {
    position: absolute;
    bottom: 10px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px;
    width: 100%;
    height: 54px;
  }
} */

.not-available {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-items: center;
  align-items: center;
}

.v-field--active .v-label.v-field-label,
.v-field--focused .v-label.v-field-label {
  opacity: 1;
  background: #87b709 !important;
  color: white;
  padding: 1;
  padding: 1px;
}

.swal2-container {
  // z-index: 2500 !important;
}

.swal2-show {
  z-index: 2500 !important;
}

.v-skeleton-loader__image {
  height: 100% !important;
}

.v-skeleton-loader .v-skeleton-loader__image {
  height: 100% !important;
}

.v-badge__badge {
  display: block !important;
  left: 24px !important;
}
</style>
