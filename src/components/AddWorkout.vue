<template>
  <div class="text-center">
    <p @click="dialog = true" style="cursor: pointer">Import</p>

    <v-dialog v-model="dialog" width="100%">
      <v-card style="padding: 20px" :loading="loading">
        <h3 style="margin-bottom: 20px">Add Workout</h3>

        <div class="right">
          <v-row no-gutters align-self="end">
            <v-col cols="12" md="4" sm="4" xs="12"
              ><input
                @keydown.prevent.enter="searchRoutine"
                v-model="searchQuery"
                type="text"
                placeholder="search for workouts by name"
            /></v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              v-for="routine in routines"
              :key="routine.id"
              cols="12"
              md="4"
              sm="6"
              xs="2"
            >
              <v-sheet class="ma-2 pa-2">
                <v-img
                  v-if="routine.exercises.length === 0"
                  aspect-ratio="10/9"
                  width="130"
                  cover
                  src="../assets/scanner-image.jpg"
                ></v-img>

                <img
                  v-if="routine.exercises.length > 0"
                  :src="
                    routine.exercises[0].exercise_info.is_upload
                      ? routine.exercises[0].exercise_info.thumb_image
                      : routine.exercises[0].exercise_info.thumb_image_tube
                  "
                  width="150"
                />
                <div class="det">
                  <h4>{{ routine.name }}</h4>
                  <P
                    >{{ routine.exercises.length }} exercise{{
                      routine.exercises.length > 1 ? "s" : ""
                    }}
                    - 27 mins est</P
                  >
                </div>
                <v-checkbox
                  v-if="activeRoutines.includes(routine.id)"
                  style="display: flex; align-items: center"
                  color="white"
                  v-model="activeRoutines"
                  :value="routine.id"
                  :disabled="activeRoutines.includes(routine.id)"
                ></v-checkbox>
                <v-checkbox
                  v-else
                  style="display: flex; align-items: center"
                  color="white"
                  v-model="newRoutines"
                  :value="routine.id"
                ></v-checkbox>
              </v-sheet>
            </v-col>
          </v-row>
        </div>
        <div class="buttons">
          <button color="primary" block @click="dialog = false">Cancel</button>
          <button color="primary" block @click="addWorkouts">
            Add Workouts
          </button>
        </div>
        <v-overlay
          :model-value="loading"
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
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";

export default {
  name: "AddWorkout",
  data() {
    return {
      dialog: false,
      loading: true,
      routines: [],
      activeRoutines: [],
      newRoutines: [],
      searchQuery: "",
    };
  },

  props: ["selectedRoutines"],

  methods: {
    async getRoutines() {
      this.loading = true;
      await this.$store.dispatch("getRoutines");

      this.routines = this.$store.state.routines;
      this.loading = false;
      //console.log(this.routines, "the rout", this.selectedRoutines);
      // this.activeRoutines = this.selectedRoutines;
      for (let i = 0; i < this.selectedRoutines.length; i++) {
        const element = this.selectedRoutines[i];
        this.activeRoutines.push(element.id);
      }
      //console.log(this.activeRoutines, "the active route");
    },

    async addWorkouts() {
      //console.log(this.newRoutines, "new");
      await axiosInstance.post(
        `/programphase/${this.$route.params.phaseid}/add_routines/`,
        {
          routines: this.newRoutines,
        }
      );
      this.$emit("loadDataBasedOnId1");
      this.dialog = false;
    },
    async searchRoutine() {
      // this.loading = true;
      let routines = await axiosInstance.get(
        `/routines/?search=${this.searchQuery}`
      );
      this.routines = routines.data;
      // this.loading = false;
    },
  },
  async created() {
    await this.getRoutines();
  },
  watch: {
    dialog: async function (newId, oldId) {
      // Do something when the 'id' route parameter changes
      //console.log("New ID dialog:", newId);
      //console.log("Old ID:", oldId);
      await this.getRoutines();
    },
  },

  computed: {
    // filteredRoutines() {
    //   return this.routines.filter((exercise) =>
    //     exercise.exercise_info.name.toLowerCase().includes(query)
    //   );
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/AddWorkout.scss";

input {
  border: 1px solid black;
  border-radius: 19px;
  width: 100%;
  padding: 8px;
  outline: none;
}
</style>
