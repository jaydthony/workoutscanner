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
        width="360"
      >
        <!-- Add your list of previous chats here -->

        <div class="left">
          <div class="left-head">
            <h1>Clients</h1>
          </div>
          <div class="left-body">
            <div
              :class="`pending ${
                $route.params.id === 'pending' ? 'active' : ''
              } `"
              @click="onSelectClient('pending')"
            >
              <Icon icon="quill:clock" width="24" height="24" />
              <p>Pending</p>
              <v-badge
                color="info"
                :content="$store.state.user.count"
                inline
              ></v-badge>
            </div>
            <div
              :class="`coaching ${
                $route.params.id == 'coaching' || !$route.params.id
                  ? 'active'
                  : ''
              } `"
              @click="onSelectClient('coaching')"
            >
              <Icon icon="mdi:worker" width="24" height="24" />
              <p>Coaching</p>
            </div>
          </div>
        </div>
      </v-navigation-drawer>
      <v-main class="chat__wrapper">
        <div
          class="clientInfo"
          style="width: 100%; overflow-y: scroll"
          v-if="$route.params.id == 'coaching' || !$route.params.id"
        >
          <clientInfo />
        </div>
        <div
          class="clientInfo"
          style="width: 100%; overflow-y: scroll"
          v-if="$route.params.id === 'pending'"
        >
          <pendingClient />
        </div>
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
import clientInfo from "./dashboard/client/clientInfo.vue";
import pendingClient from "./dashboard/client/pendingClient.vue";

export default {
  name: "ClientDetail1",

  components: {
    Icon,
    mainPlayer,
    YoutubePlayer,
    NewProgram,
    promInfo,
    phaseInfo,
    clientInfo,
    pendingClient,
  },

  props: ["location"],

  data() {
    return {
      leftdrawer: true,
      opened: ["My Programs"],
      programs: [],

      selectedProgram: null,
      selectedDays: null,

      routines: [],

      selectedExercise: null,
      searchQuery: "",
      selectedClient: null,
    };
  },
  methods: {
    onSelectClient(item) {
      this.selectedClient = item;
      // Now 'item' will be 'Pending' or 'Coaching' based on which element was clicked
      //console.log("Selected Item:", this.selectedClient);
      // You can perform further actions based on the selected 'item'
      this.$router.push({
        name: "clients",
        params: {
          id: item,
        },
      });
    },

    // Function to toggle the sidebar
    toggleSidebar() {
      this.leftdrawer = !this.leftdrawer;
    },
  },

  computed: {
    filteredRoutines() {
      const query = this.searchQuery.toLowerCase();
      return this.routines.filter((routine) =>
        routine.name.toLowerCase().includes(query)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/mainContent.scss";
@import "../scss/ProgramDetail.scss";

.clientInfo {
  overflow: scroll;
  // min-height: 100vh;
  overflow-x: hidden;

  @media (max-width: 600px) {
    max-height: 100%;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: 5px;
    margin-left: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $primary-dark;
  }
}

.left-head {
  background-color: $primary-dark;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 5px;
}
.coaching,
.pending {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  gap: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: 0.3s ease;

  &:hover {
    background-color: $primary-normal;
    color: black;
  }
}

.active {
  background-color: $primary-normal;
  color: black;
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
</style>
