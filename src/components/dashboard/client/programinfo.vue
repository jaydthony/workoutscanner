<template>
  <div v-if="!loading">
    <!-- video player -->
    <input v-model="program.name" class="topnameedit" />

    <!-- <h4>12 weeks</h4> -->
    <v-divider></v-divider>
    <h3>Description</h3>
    <textarea
      v-if="$route.params.id === 'custom'"
      placeholder="Say something about this program"
      class="topnameedit"
      rows="2"
      v-model="program.description"
      :disabled="!$route.params.id == 'custom'"
      @blur="onChangeDescription"
    ></textarea>
    <textarea
      v-else
      placeholder="Say something about this program"
      class="topnameedit"
      rows="2"
      v-model="program.description"
      :disabled="!$route.params.id == 'custom'"
    ></textarea>
    <v-divider></v-divider>
    <main>
      <div class="content">
        <section class="main-header grid"></section>

        <section class="table-header grid">
          <div v-if="$route.params.id !== 'custom'" style="font-size: 20px">
            Start date: {{ formatDateTime(selectedSubscription.started_at) }}
          </div>

          <v-tooltip v-if="$route.params.id === 'custom'" text="Show default">
            <template v-slot:activator="{ props }">
              <v-switch
                :disabled="$route.params.id === 'custom' ? false : true"
                v-bind="props"
                v-model="program.show_all"
                hide-details
                inset
                :update:modelValue="onChangeShowAll"
                :label="`Visible default: ${program.show_all}`"
              ></v-switch>
            </template>
          </v-tooltip>
          <ChangeDate
            v-if="$route.params.id !== 'custom'"
            :sub="selectedSubscription"
            :customId="customId"
          />
        </section>

        <div class="clientInfo">
          <div class="cover"></div>
        </div>
      </div>
      <v-overlay
        :model-value="inloading"
        contained
        class="align-center justify-center"
        :close-on-content-click="false"
        persistent
      >
        <v-progress-circular
          color="rgb(81, 110, 5)"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </main>
  </div>
  <div v-else>
    <v-skeleton-loader color="rgb(232, 252, 180)" :elevation="2" height="85vh">
    </v-skeleton-loader>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import clientInfo from "../client/clientInfo.vue";
import AddSubscriber from "@/components/AddSubscriber.vue";
import ChangeDate from "./ChangeDate.vue";

export default {
  name: "ContentDetail1",
  data() {
    return {
      program: null,
      loading: true,
      blurActive: false, // Add a flag to control @blur
      subscribers: [],
      selected: [],
      QRcode: false,
      qrimage: null,
      selectedSub: [],
      inloading: false,
    };
  },

  components: { clientInfo, AddSubscriber, ChangeDate },

  props: ["customId", "selectedSubscription"],

  methods: {
    getSubscriptionMessage(days) {
      if (days > 0) {
        return `Day ${days}`;
      } else if (days === 0) {
        return "Starting today";
      } else {
        return `Starts in ${-days} day(s)`;
      }
    },
    openQRcode(item) {
      this.qrimage = item.location.barcode_image;
      this.selectedSub = item;
      this.QRcode = true;
    },
    async loadDataBasedOnId(id) {
      this.loading = true;
      let customValue = id === "custom" ? this.customId : this.$route.params.id;
      //console.log(customValue, "checking");
      let prog = await axiosInstance.get(`/programs2/${customValue}/`);
      this.program = prog.data;
      this.loading = false;
      // Implement your data loading logic here
      //console.log(this.program, "all program");
    },

    formatDateTime(dateTime) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      const formattedDate = new Date(dateTime).toLocaleDateString(
        "en-US",
        options
      );
      return formattedDate;
    },

    async onChangeName() {
      this.inloading = true;
      if (this.blurActive) {
        // Perform actions when @blur is active

        //console.log(this.program.name);
        let programId = this.$route.params.id;
        let updatedData = this.program;

        try {
          await axiosInstance
            .patch(`/programs/${this.program.id}/`, { name: this.program.name })
            .then((res) => {
              this.$emit("updateProgram", { programId, updatedData });
            });
        } catch (error) {}
      } else {
        // @blur is inactive during initial render
        this.blurActive = true; // Activate @blur for subsequent interactions
      }
      this.inloading = false;
    },

    async onChangeShowAll(newId) {
      //console.log(newId, "new value");
      // return;
      this.inloading = true;

      // Perform actions when @blur is active

      //console.log(this.program.description);

      let customValue =
        this.$route.params.id === "custom"
          ? this.customId
          : this.$route.params.id;

      await axiosInstance
        .patch(`/programs2/${customValue}/`, {
          show_all: newId,
        })
        .then((res) => {});
      this.$emit("updateProgram");

      this.inloading = false;
    },

    async onChangeDescription() {
      this.inloading = true;
      if (this.blurActive) {
        // Perform actions when @blur is active

        //console.log(this.program.description);

        await axiosInstance
          .patch(`/programs2/${this.program.id}/`, {
            description: this.program.description,
          })
          .then((res) => {});
      } else {
        // @blur is inactive during initial render
        this.blurActive = true; // Activate @blur for subsequent interactions
      }
      this.inloading = false;
    },

    async getSubscribers() {
      this.inloading = true;
      let customValue =
        this.$route.params.id === "custom"
          ? this.customId
          : this.$route.params.id;
      axiosInstance
        .get(`/program/${customValue}/subscribed_users/`)
        .then((res) => {
          this.subscribers = res.data;
          this.inloading = false;
          //console.log(this.subscribers, "the subscriber");
        });
    },
  },

  mounted() {
    // Activate @blur after component is mounted
    this.blurActive = true;
  },

  async created() {
    if (this.$route.params.id && this.$route.params.id !== "") {
      await this.loadDataBasedOnId(this.$route.params.id);
      await this.getSubscribers();
    }
  },

  watch: {
    // Watch for changes in the 'id' route parameter
    "$route.params.id": async function (newId, oldId) {
      // Do something when the 'id' route parameter changes
      //console.log("New ID:", newId);
      //console.log("Old ID:", oldId);

      // You can perform actions or fetch data based on the new 'id'
      // For example, load data based on the new 'id'
      if (newId !== undefined && newId !== "") {
        await this.loadDataBasedOnId(newId);
        await this.getSubscribers();
      }
    },

    "program.show_all": async function (newId, oldId) {
      // Do something when the 'id' route parameter changes
      //console.log("New pro ID:", newId);
      //console.log("Old program ID:", oldId);

      // You can perform actions or fetch data based on the new 'id'
      // For example, load data based on the new 'id'
      if (oldId !== null) {
        try {
          await this.onChangeShowAll(newId);
        } catch (error) {
          this.program.show_all = oldId;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../scss/table.scss";
@import "../../../scss/colors";
@import "../../../scss/clientInfo.scss";

.qrcode-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  button {
    padding: 5px 15px;
    background-color: $primary-normal;
    border-radius: 6px;
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
  align-items: center;
}
</style>
