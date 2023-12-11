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
    <v-layout style="height: -webkit-fill-available">
      <v-navigation-drawer
        :temporary="$vuetify.display.mdAndDown"
        :permanent="!$vuetify.display.mdAndDown"
        class="chat-nav"
        v-model="leftdrawer"
        style="padding: 20px 0px"
        width="420"
      >
        <!-- Add your list of previous chats here -->

        <div class="left" style="position: relative">
          <div
            class="add-program"
            style="
              display: flex;
              align-items: center;
              justify-content: space-around;
            "
          >
            <h3>Training Program:</h3>
            <!-- <NewProgram @activateProgram="activateProgram" /> -->
            <AddModal :programs="programs" @activateProgram="activateProgram" />
          </div>

          <div v-if="!loading && programs" class="left-contain">
            <div class="client-details">
              <v-list open-strategy="single" :opened="opened">
                <v-list-group
                  :is-opened="true"
                  :v-model="opened"
                  :active="true"
                  :value="`${programs.location.name}`"
                >
                  <template v-slot:activator="{ props }">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        padding: 5px auto;
                      "
                    >
                      <v-list-item
                        v-bind="props"
                        :active="true"
                        :title="`${programs.location.name} program`"
                        prepend-icon="mdi-book-open-page-variant"
                        :class="`${
                          $route.params.id == 'custom' ? 'selected-program' : ''
                        } `"
                        @click="
                          () => {
                            this.onSelectProgram('custom', null);
                          }
                        "
                      >
                        <v-chip
                          v-if="!programs.sub_default"
                          variant="outlined"
                          style="
                            padding: 2px 4px;
                            border-radius: 10px !important;
                          "
                        >
                          <p style="font-size: 10px; text-transform: uppercase">
                            Main
                          </p>
                        </v-chip>

                        <v-chip
                          variant="outlined"
                          style="
                            padding: 2px 4px;
                            border-radius: 10px !important;
                            margin-left: 10px;
                          "
                        >
                          <p style="font-size: 10px; text-transform: uppercase">
                            {{ programs.default.show_all ? "On" : "off" }}
                          </p>
                        </v-chip>
                      </v-list-item>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <v-icon
                            icon="mdi-dots-vertical"
                            v-bind="props"
                          ></v-icon>
                        </template>

                        <v-list>
                          <v-list-item>
                            <v-list-item-title
                              style="cursor: pointer"
                              @click="makeDefault(true, false)"
                              >Make main</v-list-item-title
                            >
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </template>

                  <v-list-item
                    title="Summary & Subscribers"
                    prepend-icon=""
                    :active="
                      $route.fullPath ===
                      `/app/client/${$route.params.locid}/custom`
                    "
                    @click="
                      () => {
                        this.onSelectProgram('custom', null);
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
                              @click="addNew(programs.default.id)"
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
                    v-if="programs.default.phasesProgram.length < 1"
                    class="text-center"
                  >
                    No Day added
                  </div>

                  <div
                    class="program-phase"
                    v-for="(phase, index) in programs.default.phasesProgram"
                    :key="phase.id"
                    style="display: flex; align-items: center; gap: 5px"
                  >
                    <v-list-item
                      prepend-icon="mdi-calendar"
                      :title="phase.name"
                      :value="phase.id"
                      :subtitle="`day ${index + 1}`"
                      :to="{
                        name: 'editclients',
                        params: {
                          locid: this.$route.params.locid,
                          id: programs.default.id,
                          phaseid: phase.id,
                        },
                      }"
                    ></v-list-item>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-icon
                          start
                          icon="mdi-dots-vertical"
                          v-bind="props"
                        ></v-icon>
                      </template>

                      <v-list>
                        <v-list-item>
                          <v-list-item-title>
                            <v-btn
                              disabled
                              @click="deletePhase(phase)"
                              style="background-color: red"
                              >Delete</v-btn
                            >
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>

                  <!-- <v-divider></v-divider> -->

                  <!-- <v-list-item
                    title="delete"
                    prepend-icon="mdi-delete"
                    @click="deleteProgram(item, id)"
                  ></v-list-item> -->
                </v-list-group>
                <v-list-group
                  :is-opened="true"
                  :v-model="opened"
                  :active="true"
                  :value="`${prog.id}`"
                  v-for="prog in programs.location.subscription"
                  :key="prog.id"
                >
                  <template v-slot:activator="{ props }">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        padding: 5px auto;
                      "
                    >
                      <v-list-item
                        v-bind="props"
                        :active="true"
                        :title="`${prog.program.name} program`"
                        prepend-icon="mdi-book-open-page-variant"
                        :class="`${
                          $route.params.id == prog.program.id
                            ? 'selected-program'
                            : ''
                        } `"
                        @click="
                          () => {
                            this.onSelectProgram(prog.program.id, prog);
                          }
                        "
                      >
                        <v-chip
                          variant="outlined"
                          style="
                            padding: 2px 4px;
                            border-radius: 10px !important;
                          "
                          v-if="prog.defualt"
                        >
                          <p style="font-size: 10px; text-transform: uppercase">
                            Main
                          </p>
                        </v-chip>
                      </v-list-item>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <v-icon
                            icon="mdi-dots-vertical"
                            v-bind="props"
                          ></v-icon>
                        </template>

                        <v-list>
                          <v-list-item>
                            <v-list-item-title
                              @click="Unsubscribe(prog.id)"
                              style="cursor: pointer"
                              >Unsubscribe</v-list-item-title
                            >
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-title
                              @click="makeDefault(false, prog.id)"
                              style="cursor: pointer"
                              >Make Default</v-list-item-title
                            >
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </template>

                  <v-list-item
                    title="Summary & Subscribers"
                    prepend-icon=""
                    :active="
                      $route.fullPath ===
                      `/app/client/${$route.params.locid}/${prog.program.id}`
                    "
                    @click="
                      () => {
                        this.onSelectProgram(prog.program.id, prog);
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
                              @click="addNew(prog.program.id)"
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
                    v-if="prog.program.phases.length < 1"
                    class="text-center"
                  >
                    No Day added
                  </div>

                  <div
                    class="program-phase"
                    v-for="(phase, index) in prog.program.phases"
                    :key="phase.id"
                    style="display: flex; align-items: center; gap: 5px"
                  >
                    <v-list-item
                      prepend-icon="mdi-calendar"
                      :title="phase.name"
                      :value="phase.id"
                      :subtitle="`day ${index + 1}`"
                      :to="{
                        name: 'editclients',
                        params: {
                          locid: this.$route.params.locid,
                          id: prog.program.id,
                          phaseid: phase.id,
                        },
                      }"
                    ></v-list-item>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-icon
                          start
                          icon="mdi-dots-vertical"
                          v-bind="props"
                        ></v-icon>
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

                  <!-- <v-list-item
                    title="delete"
                    prepend-icon="mdi-delete"
                    @click="deleteProgram(item, id)"
                  ></v-list-item> -->
                </v-list-group>

                <!-- Check if programs is empty -->

                <v-divider :thickness="5"></v-divider>
              </v-list>
            </div>
          </div>
          <div
            class="leftbottom"
            style="position: absolute; bottom: 0; left: 0; right: 0"
          >
            <!-- <nextTraining /> -->
          </div>
        </div>
      </v-navigation-drawer>
      <v-main
        class="chat__wrapper"
        style="overflow-y: scroll; overflow-x: hidden"
      >
        <v-row style="padding: 20px 20px">
          <v-col sm="12" xs="12" class="webavail-height1">
            <div v-if="$route.params.id">
              <div
                v-if="$route.params.id && !$route.params.phaseid"
                class="details mt-2"
              >
                <programinfo
                  v-if="programs"
                  @updateProgram="activateProgram"
                  @updateStatus="updateStatus"
                  :customId="programs.default.id"
                  :selectedSubscription="selectedSubscription"
                />
              </div>
              <div
                v-if="$route.params.id && $route.params.phaseid"
                class="details mt-2"
                style="overflow-x: auto !important; overflow-y: scroll"
              >
                <phaseInfo
                  v-if="programs"
                  :programs="allprogram"
                  @updatePhase="updatePhase"
                  :customId="programs.default.id"
                />
              </div>
            </div>

            <div class="non-available" v-else>
              <img :src="require('../../../assets/empty.svg')" alt="" />
              <h3 style="text-transform: capitalize">
                Select a routine or add exercise in routine
              </h3>
            </div>
          </v-col>
        </v-row>
      </v-main>
    </v-layout>

    <v-overlay
      :model-value="loading"
      contained
      persistent
      class="align-center justify-center"
      style="height: 100vh"
      :close-on-content-click="false"
    >
      <v-progress-circular
        color="rgb(81, 110, 5)"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import mainPlayer from "../mainPlayer.vue";
import YoutubePlayer from "../YoutubePlayer.vue";
import nextTraining from "./nextTraining.vue";
import NewProgram from "@/components/NewProgram.vue";
import AddModal from "./AddModal.vue";
import { Icon } from "@iconify/vue";
//   import programinfo from "./dashboard/program/programinfo.vue";
//   import phaseInfo from "./dashboard/program/phaseInfo.vue";
import programinfo from "./programinfo.vue";
import phaseInfo from "./phaseInfo.vue";

import { useToast } from "vue-toastification";

const toast = useToast();

export default {
  name: "CustomizeClient",

  components: {
    Icon,
    mainPlayer,
    YoutubePlayer,
    NewProgram,
    programinfo,
    phaseInfo,
    nextTraining,
    AddModal,
  },

  props: ["location"],

  data() {
    return {
      leftdrawer: true,
      opened: ["My Programs"],
      programs: null,
      addLoading: false,
      selectedSubscription: null,
      selectedExercise: null,
      searchQuery: "",
      loading: false,

      addProgram: false,
      newDay: "",
      nameRules: [
        (v) => (v && v.length >= 3) || "Name must be at least 3 characters",
      ],
      allprogram: [],
    };
  },
  methods: {
    updateStatus(data) {
      this.programs.sub_default.show_all = data;
    },
    onSelectProgram(id, subscription) {
      this.selectedSubscription = subscription;

      this.$router.push({
        name: "editclients",
        params: {
          locid: this.$route.params.locid,
          id: id,
        },
      });
    },
    // Function to toggle the sidebar
    toggleSidebar() {
      this.leftdrawer = !this.leftdrawer;
    },

    async addNew(id) {
      this.addLoading = true;
      await axiosInstance.post("/programphase/", {
        name: this.newDay,
        program: id,
      });
      await this.activateProgram();

      this.addLoading = false;
      this.newDay = "";
      this.addProgram = false;
    },

    async activateProgram() {
      try {
        let value = await axiosInstance.get(
          `/locations/${this.locationId}/get_subscriptions/`
        );

        if (value.status == 200) {
          this.programs = value.data;
          console.log(this.programs, "programs");
        }
      } catch (error) {
        //console.log(error, "th error");
        if (error.response) {
          if (error.response.status == 404) {
            toast.error("invalid location QR scanned, contact admin");
          }

          if (error.response.status == 404) {
            toast.info("No exercise set for the day");
          }
        } else {
          toast.error("Network Error");
        }
      }
    },

    async Unsubscribe(id) {
      this.loading = true;

      this.$swal({
        title: `Unsubscribe ${this.programs.location.name} from the master program: ${this.programs.default.name}?
`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Confirm",
        denyButtonText: `Cancel`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          try {
            await axiosInstance.post(
              `/unsubscribe/${this.$route.params.locid}/`,
              { sub_id: id }
            );
            this.activateProgram();
          } catch (error) {}
        } else if (result.isDenied) {
          // this.$swal("Changes are not saved", "", "info");
        }
      });

      this.loading = false;
    },

    async makeDefault(default_value, sub_id) {
      this.loading = true;

      this.$swal({
        title: `Make Default in ${this.programs.location.name} from the master program: ${this.programs.default.name}?
`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: "Confirm",
        denyButtonText: `Cancel`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          try {
            await axiosInstance.post(
              `/makedefault/${this.$route.params.locid}/`,
              {
                makehome: default_value,
                subscription: sub_id,
              }
            );
            await this.activateProgram();
          } catch (error) {}
        } else if (result.isDenied) {
          // this.$swal("Changes are not saved", "", "info");
        }
      });

      this.loading = false;
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
              if (this.$route.params.phaseid == item.id) {
                this.$router.push({
                  name: "program",
                  params: {
                    locid: this.$route.params.locid,
                    id: this.$route.params.id,
                  },
                });
              }
            } else if (result.isDenied) {
              // this.$swal("Changes are not saved", "", "info");
            }
          });
        } else if (result.isDenied) {
          // this.$swal("Changes are not saved", "", "info");
        }
      });
    },
  },

  async created() {
    this.locationId = this.$route.params.locid;
    //console.log(this.locationId);
    this.loading = true;
    this.loadDetail = true;
    await this.activateProgram();
    this.loading = false;
    this.loadDetail = false;
  },

  computed: {
    isNameValid() {
      return this.nameRules[0](this.newDay) === true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../scss/mainContent.scss";
@import "../../../scss/ProgramDetail.scss";

.left-contain {
  margin-top: 50px;
}
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
.selected-program {
  border-left: solid 2px blanchedalmond;
}
</style>
