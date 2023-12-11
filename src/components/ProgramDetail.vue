<template>
  <div id="sample1">
    <v-toolbar
      v-if="$vuetify.display.mdAndDown"
      style="background-color: rgb(135, 183, 9)"
    >
      <v-btn v-if="selectedRoutine" icon @click="selectedRoutine = null">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-toolbar-title>.</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleSidebar">
        <v-icon color="rgb(248, 254, 231)">mdi-menu</v-icon>
      </v-btn>
    </v-toolbar>
    <v-layout style="height: 100%">
      <v-navigation-drawer
        :temporary="$vuetify.display.mdAndDown"
        :permanent="!$vuetify.display.mdAndDown"
        class="chat-nav"
        v-model="leftdrawer"
        style="padding: 20px 0px"
        width="360"
      >
        <!-- Add your list of previous chats here -->

        <div class="left">
          <div class="add-program">
            <NewProgram @activateProgramNew="activateProgramNew" />
          </div>

          <div class="left-contain">
            <div class="input-cover mb-2" style="width: unset">
              <Icon icon="material-symbols:search" width="24" height="24" />
              <!-- <v-icon start color="black" icon="mdi-magnify"></v-icon> -->
              <input
                style="color: #fff"
                v-model="searchQuery"
                type="text"
                placeholder="search for program by name..."
              />
            </div>
            <v-list open-strategy="single" :opened="opened">
              <v-list-group
                v-for="item in programs"
                :key="item.id"
                :value="`${item.id}`"
              >
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    :title="item.name"
                    prepend-icon="mdi-dumbbell"
                    @click="
                      () => {
                        this.onSelectProgram(item);
                      }
                    "
                  >
                  </v-list-item>
                </template>

                <v-list-item
                  title="Summary & Subscribers"
                  prepend-icon=""
                  :active="$route.fullPath === `/app/program/${item.id}`"
                  @click="
                    () => {
                      this.onSelectProgram(item);
                    }
                  "
                >
                </v-list-item>

                <v-divider></v-divider>

                <div
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                  "
                >
                  <h3 class="text-center">Program Days</h3>
                  <v-icon
                    @click="addProgram = true"
                    style="padding: 20px"
                    end
                    icon="mdi-plus"
                  ></v-icon>
                  <v-dialog v-model="addProgram" width="500px">
                    <v-card class="new-branch" style="padding: 15px">
                      <h2 style="margin-bottom: 10px">Add Program Day</h2>
                      <div class="form">
                        <div class="forms">
                          <v-text-field
                            v-model="newDay"
                            density="compact"
                            variant="outlined"
                            label="Program Days"
                            class="mb-2"
                            :rules="nameRules"
                            required
                          ></v-text-field>
                        </div>

                        <div
                          class="form-botton"
                          style="
                            display: flex;
                            align-items: center;
                            justify-content: right;
                            gap: 10px;
                          "
                        >
                          <button
                            style="
                              padding: 10px;
                              border: 1px solid black;
                              border-radius: 6px;
                            "
                            @click="addProgram = false"
                          >
                            Cancel
                          </button>
                          <v-btn
                            @click="addNew"
                            :loading="addLoading"
                            :disabled="!isNameValid"
                            style="
                              padding: 10px;
                              border: 1px solid black;
                              border-radius: 6px;
                            "
                            >Create</v-btn
                          >
                        </div>
                      </div>
                    </v-card>
                  </v-dialog>
                </div>

                <div
                  class="program-phase"
                  v-for="(phase, index) in item.phasesProgram"
                  :key="phase.id"
                  style="display: flex; align-items: center; gap: 5px"
                >
                  <v-list-item
                    prepend-icon="mdi-calendar"
                    :title="phase.name"
                    :value="phase.id"
                    :subtitle="`day ${index + 1}`"
                    :to="{
                      name: 'program',

                      params: { id: item.id, phaseid: phase.id },
                    }"
                  ></v-list-item>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-icon
                        start
                        icon="mdi-dots-vertical"
                        v-bind="props"
                      ></v-icon>
                      <!-- <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn> -->
                    </template>

                    <v-list>
                      <v-list-item>
                        <v-list-item-title>
                          <v-btn
                            @click="deletePhase(phase)"
                            style="background-color: red"
                            >Delete</v-btn
                          >
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>

                <v-divider></v-divider>

                <v-list-item
                  title="delete"
                  prepend-icon="mdi-delete"
                  @click="deleteProgram(item, id)"
                >
                </v-list-item>
              </v-list-group>

              <v-divider :thickness="5"></v-divider>
            </v-list>
            <!-- <div class="left-card">
              <h3>HIIT - 1</h3>
              <p>3 Routines - 2 Weeks</p>
              <v-divider :thickness="3" class="border-opacity-50"></v-divider>
              <div class="icons">
                <Icon icon="solar:pen-2-broken" width="24" height="24" />
                <Icon icon="fluent:delete-48-regular" width="24" height="24" />
              </div>
            </div> -->
            <div
              class="center-div"
              v-if="programs.length < 1 && !loading && !searchQuery"
            >
              No Program Created !!
            </div>

            <div
              class="center-div"
              v-if="programs.length < 1 && !loading && searchQuery"
            >
              No Program with value {{ searchQuery }} !!
            </div>
            <div class="center-div" v-if="loading">
              <v-progress-circular
                color="rgb(180, 244, 12)"
                indeterminate
              ></v-progress-circular>
            </div>
          </div>
        </div>
      </v-navigation-drawer>
      <v-main
        class="chat__wrapper"
        style="overflow-y: auto; overflow-x: hidden"
      >
        <v-row style="padding: 20px 20px">
          <v-col sm="12" xs="12" class="webavail-height1">
            <div v-if="$route.params.id > 0">
              <div
                v-if="$route.params.id && !$route.params.phaseid"
                class="details mt-2"
              >
                <promInfo
                  @setSelected="setSelected"
                  @updateProgram="updateProgram"
                />
              </div>
              <div
                v-if="$route.params.id && $route.params.phaseid"
                class="details mt-2"
                style="overflow-x: auto !important; overflow-y: scroll"
              >
                <phaseInfo
                  @setSelected="setSelected"
                  :programs="programs"
                  @updatePhase="updatePhase"
                />
              </div>
            </div>

            <div class="non-available" v-else>
              <img :src="require('../assets/empty.svg')" alt="" />
              <h3 style="text-transform: capitalize">
                Select a routine or add exercise in routine
              </h3>
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
          </v-col>
        </v-row>
      </v-main>
    </v-layout>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import mainPlayer from "./dashboard/mainPlayer.vue";
import YoutubePlayer from "./dashboard/YoutubePlayer.vue";
import NewProgram from "./NewProgram.vue";
import { Icon } from "@iconify/vue";
import promInfo from "./dashboard/program/promInfo.vue";
import phaseInfo from "./dashboard/program/phaseInfo.vue";

export default {
  name: "ContentDetail1",

  components: {
    Icon,
    mainPlayer,
    YoutubePlayer,
    NewProgram,
    promInfo,
    phaseInfo,
  },

  props: ["location"],

  data() {
    return {
      leftdrawer: true,
      opened: [],
      programs: [],
      nameRules: [
        (v) => (v && v.length >= 3) || "Name must be at least 3 characters",
      ],
      newDay: "",
      addLoading: false,
      selectedProgram: null,
      selectedDays: null,
      loading: false,

      routines: [],

      selectedExercise: null,
      searchQuery: "",

      addProgram: false,
    };
  },
  methods: {
    async deleteProgram(item) {
      this.$swal({
        title: `Are you sure you want to delete ${item.name}?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.$swal({
            title: `Second warning!!! Are you sure you want to delete ${item.name}?`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
          }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              let prog = await axiosInstance.delete(`/programs/${item.id}/`);
              this.$swal("Deleted!", "", "success");
              this.activateProgram();
              this.$router.push({ name: "program" });
            } else if (result.isDenied) {
              // this.$swal("Changes are not saved", "", "info");
            }
          });
        } else if (result.isDenied) {
          // this.$swal("Changes are not saved", "", "info");
        }
      });
    },

    setSelected(id) {
      this.opened = [String(id)];
    },
    onSelectProgram(item) {
      this.selectedProgram = item;

      this.setSelected(item.id);

      this.$router.push({
        name: "program",
        params: {
          id: item.id,
        },
      });
    },

    async addNew() {
      this.addLoading = true;
      await axiosInstance.post("/programphase/", {
        name: this.newDay,
        program: this.$route.params.id,
      });
      await this.activateProgram();

      this.addLoading = false;
      this.newDay = "";
      this.addProgram = false;
    },

    async deletePhase(item) {
      this.$swal({
        title: `Are you sure you want to delete ${item.name}?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.$swal({
            title: `Second warning!!! Are you sure? This could disrupt a lot?`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
          }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              await axiosInstance.delete(`/programphase/${item.id}/`);
              this.$swal("Deleted!", "", "success");
              this.activateProgram();

              this.$router.push({
                name: "program",
                params: { id: this.$route.params.id },
              });
            } else if (result.isDenied) {
              // this.$swal("Changes are not saved", "", "info");
            }
          });
        } else if (result.isDenied) {
          // this.$swal("Changes are not saved", "", "info");
        }
      });
    },
    // Function to toggle the sidebar
    toggleSidebar() {
      this.leftdrawer = !this.leftdrawer;
    },

    async activateProgram() {
      this.loading = true;
      let fetchedPrograms = await axiosInstance.get("/programs/");
      this.programs = fetchedPrograms.data;
      //console.log(this.programs, "data");
      this.loading = false;
    },

    async activateProgramNew(item) {
      //console.log("The item", item);
      await this.activateProgram();
      this.$router.push({
        name: "program",
        params: { id: item.id },
      });
    },

    updatePhase({ programId, phaseId, updatedData }) {
      // //console.log(
      //   { programId, phaseId, updatedData },
      //   this.programs,
      //   programId
      // );
      const programIndex = this.programs.findIndex(
        (p) => p.id === Number(programId)
      );
      //console.log(programIndex, "programIndex");
      if (programIndex !== -1) {
        const phaseIndex = this.programs[programIndex].phasesProgram.findIndex(
          (p) => p.id === Number(phaseId)
        );
        //console.log(phaseIndex, "phaseIndex");
        if (phaseIndex !== -1) {
          // Update the phase with the new data
          //console.log("updated");
          Object.assign(
            this.programs[programIndex].phasesProgram[phaseIndex],
            updatedData
          );
        } else {
          console.error(
            `Phase with ID ${phaseId} not found in program ${this.programs[programIndex].name}`
          );
        }
      } else {
        console.error(`Program with ID ${programId} not found`);
      }
    },

    updateProgram({ programId, updatedData }) {
      const programIndex = this.programs.findIndex(
        (p) => p.id === Number(programId)
      );
      //console.log(programIndex, "programIndex");
      if (programIndex !== -1) {
        //console.log("updated");
        Object.assign(this.programs[programIndex], updatedData);
      } else {
        console.error(`Program with ID ${programId} not found`);
      }
    },
  },

  async created() {
    //console.log(this.$route.fullPath, "this is");
    await this.activateProgram();
    //console.log(this.$route.params.id == "", "the id");
  },

  computed: {
    filteredRoutines() {
      const query = this.searchQuery.toLowerCase();
      return this.routines.filter((routine) =>
        routine.name.toLowerCase().includes(query)
      );
    },
    isNameValid() {
      return this.nameRules[0](this.newDay) === true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/mainContent.scss";
@import "../scss/ProgramDetail.scss";

#sample1 {
  @media (max-width: 600px) {
    min-height: 100vh !important;
  }
}

.v-main {
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $primary-dark-active;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    -moz-border-radius: rem(4px);
    -webkit-border-radius: rem(4px);
    border-radius: rem(4px);
  }
}

.v-navigation-drawer__content {
  overflow-y: hidden !important;
}

.webavail-height {
  height: -webkit-fill-available;
}

.webavail-height1 {
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
  flex-direction: column;
  align-items: center;

  img {
    width: 40%;
  }
}

.center-div {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
