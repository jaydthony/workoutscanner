<template>
  <div v-if="!loading" class="phase-cover">
    <!-- video player -->
    <input v-model="phase.name" @blur="onChangeName" class="topnameedit" />
    <v-divider></v-divider>
    <h3>Description</h3>
    <v-textarea
      placeholder="Say something about this phase"
      class="topnameedit"
      rows="2"
      v-model="phase.description"
      @blur="onChangeDescription"
    ></v-textarea>
    <v-divider></v-divider>
    <main>
      <div class="content">
        <section class="main-header grid">
          <h1>Workouts</h1>
        </section>

        <section class="table-header grid">
          <div>
            <label class="select">
              <select
                v-model="selectedAction"
                :disabled="selected.length < 1"
                @change="onDelete"
              >
                <option value="0">Choose action</option>
                <option value="1">Delete</option>
              </select>
            </label>
            <span
              >Selected {{ selected.length }} of
              {{ phase ? phase.routines.length : 0 }} items</span
            >
          </div>

          <a class="button link">
            <span>Filters</span>
            <i class="fa-solid fa-angle-down"></i>
          </a>
        </section>

        <div class="clientInfo">
          <div class="cover">
            <div
              class="buttons"
              style="display: flex; align-items: center; gap: 50px"
            >
              <!-- <button class="button">
                <i class="fa-solid fa-plus"></i>
              </button> -->
              <AddWorkout
                :selectedRoutines="phase.routines ? phase.routines : []"
                @loadDataBasedOnId1="loadDataBasedOnId1"
              />
              <CreateWorkout @loadDataBasedOnId1="loadDataBasedOnId1" />

              <!-- copy to -->
              <CopyTo :selected="selected" :programs="programs" />
            </div>
            <div class="table">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  <v-overlay
                    :model-value="inloading"
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
                  <tr
                    v-for="routine in phase.routines"
                    :key="routine.id"
                    class="selected"
                  >
                    <td>
                      <v-checkbox
                        v-model="selected"
                        :value="routine.id"
                      ></v-checkbox>
                    </td>

                    <td>
                      <v-img
                        v-if="routine.exercises.length === 0"
                        aspect-ratio="10/9"
                        width="100"
                        cover
                        src="../../../assets/scanner-image.jpg"
                      ></v-img>
                      <img
                        v-if="routine.exercises.length > 0"
                        :src="
                          routine.exercises[0].exercise_info.is_upload
                            ? routine.exercises[0].exercise_info.thumb_image
                            : routine.exercises[0].exercise_info
                                .thumb_image_tube
                        "
                        width="100"
                      />
                    </td>
                    <td>
                      <p>{{ routine.name }}</p>
                      <p>
                        est 27mins| {{ routine.exercises.length }} Exercises
                      </p>
                      <p>
                        {{
                          routine.description
                            ? routine.description
                            : "No description"
                        }}
                      </p>
                    </td>
                    <td>
                      <AddExercise
                        @loadDataBasedOnId1="loadDataBasedOnId1"
                        :routine="routine"
                        :edit="true"
                      />
                    </td>
                    <td></td>
                  </tr>
                  <div
                    v-show="phase.routines.length < 1"
                    style="
                      width: 100%;
                      height: 50px;
                      display: flex;
                      justify-content: center;
                    "
                  >
                    No workout added
                  </div>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <div v-else>
    <v-skeleton-loader color="rgb(232, 252, 180)" :elevation="2" height="85vh">
    </v-skeleton-loader>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import AddWorkout from "@/components/AddWorkout.vue";
import AddExercise from "@/components/AddExercise.vue";
import CreateWorkout from "@/components/CreateWorkout.vue";
import CopyTo from "@/components/CopyTo.vue";

export default {
  name: "ContentDetail1",
  components: { AddWorkout, AddExercise, CreateWorkout, CopyTo },
  data() {
    return {
      phase: this.$route.params.phaseid ? this.$route.params.phaseid : null,
      loading: true,
      phaseid: null,
      selected: [],
      blurActive: false, // Add a flag to control @blur
      items: ["Item 1", "Item 2", "Item 3"],
      // there will be a selected item
      selectedAction: 0,
      inloading: false,
    };
  },
  props: ["programs"],

  methods: {
    async loadDataBasedOnId(id) {
      this.$emit("setSelected", this.$route.params.id);
      this.loading = true;
      let phase = await axiosInstance.get(`/phase/${id}/`);
      this.phase = phase.data;
      this.loading = false;
      //console.log(this.phase, "the phase");
      // Implement your data loading logic here
    },

    async onDelete() {
      //console.log("this is it ");
      await axiosInstance.post(
        `/programphase/${this.$route.params.phaseid}/remove_routines/`,
        {
          routines: this.selected,
        }
      );
      await this.loadDataBasedOnId1();
      this.selectedAction = 0;
      this.selected = [];
    },
    async loadDataBasedOnId1() {
      this.inloading = true;
      let phase = await axiosInstance.get(
        `/phase/${this.$route.params.phaseid}/`
      );
      this.phase = phase.data;
      this.inloading = false;
      //console.log(this.phase, "the phase");
      // Implement your data loading logic here
    },

    async onChangeName() {
      this.inloading = true;
      if (this.blurActive) {
        // Perform actions when @blur is active

        //console.log(this.phase.name);
        let programId = this.$route.params.id;
        let phaseId = this.$route.params.phaseid;
        let updatedData = this.phase;

        await axiosInstance
          .patch(`/programphase/${this.phase.id}/`, { name: this.phase.name })
          .then((res) => {
            this.$emit("updatePhase", { programId, phaseId, updatedData });
          });
      } else {
        // @blur is inactive during initial render
        this.blurActive = true; // Activate @blur for subsequent interactions
      }
      this.inloading = false;
    },

    async onChangeDescription() {
      this.inloading = true;
      if (this.blurActive) {
        // Perform actions when @blur is active

        //console.log(this.phase.description);

        await axiosInstance
          .patch(`/programphase/${this.phase.id}/`, {
            description: this.phase.description,
          })
          .then((res) => {});
      } else {
        // @blur is inactive during initial render
        this.blurActive = true; // Activate @blur for subsequent interactions
      }
      this.inloading = false;
    },
  },

  async created() {
    if (this.$route.params.phaseid && this.$route.params.phaseid !== "") {
      await this.loadDataBasedOnId(this.$route.params.phaseid);
    }
  },

  mounted() {
    // Activate @blur after component is mounted
    this.blurActive = true;
  },

  watch: {
    // Watch for changes in the 'id' route parameter
    "$route.params.phaseid": function (newId, oldId) {
      // Do something when the 'id' route parameter changes
      //console.log("New ID:", newId);
      //console.log("Old ID:", oldId);

      // You can perform actions or fetch data based on the new 'id'
      // For example, load data based on the new 'id'
      //console.log(newId, newId !== undefined, newId === undefined);
      if (newId !== undefined && newId !== "") {
        this.loadDataBasedOnId(newId);
      }
    },

    "this.phaseid": function (newId, oldId) {
      // Do something when the 'id' route parameter changes
      //console.log("New ID:", newId);
      //console.log("Old ID:", oldId);

      // You can perform actions or fetch data based on the new 'id'
      // For example, load data based on the new 'id'
      if (newId !== undefined) {
        this.loadDataBasedOnId(newId);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../scss/table.scss";
@import "../../../scss/phaseInfo.scss";
@import "../../../scss/colors";
@import "../../../scss/clientInfo.scss";

.v-navigation-drawer__content {
  overflow-y: hidden !important;
}

.webavail-height {
  height: -webkit-fill-available;
}

.webavail-height1 {
  height: 100%;
}

.v-main {
  height: 100%;
}
.v-row {
  @media (max-width: 600px) {
    width: 100%;
  }
}

.input-cover {
  @media (max-width: 600px) {
    max-width: 100%;
  }
}

.v-col-sm-9 {
  flex: 1;
  /* max-width: 90%; */
  margin: 0px auto;
}
.non-available {
  height: -webkit-fill-available;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
