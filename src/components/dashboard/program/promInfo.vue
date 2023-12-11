<template>
  <div v-if="!loading">
    <!-- video player -->
    <input v-model="program.name" @blur="onChangeName" class="topnameedit" />

    <!-- <h4>12 weeks</h4> -->
    <v-divider></v-divider>
    <h3>Description</h3>
    <textarea
      placeholder="Say something about this program"
      class="topnameedit"
      rows="2"
      v-model="program.description"
      @blur="onChangeDescription"
    ></textarea>
    <v-divider></v-divider>
    <main>
      <div class="content">
        <section class="main-header grid"></section>

        <section class="table-header grid">
          <div>
            <!-- <button class="button">
              <i class="fa-solid fa-plus"></i>
              <span></span>
            </button> -->
            <AddSubscriber
              :program="program"
              @getSubscribers="getSubscribers"
            />
          </div>

          <v-tooltip
            text="True is to make every day visible, false is when you want only one workout shown per day"
          >
            <template v-slot:activator="{ props }">
              <v-switch
                v-bind="props"
                v-model="program.show_all"
                hide-details
                inset
                :update:modelValue="onChangeShowAll"
                :label="`Show all: ${program.show_all}`"
              ></v-switch>
            </template>
          </v-tooltip>
        </section>

        <div class="clientInfo">
          <div class="cover">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Start date</th>
                  <th>Program Length</th>
                  <th>Current day</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sub in subscribers" :key="sub.id">
                  <td>
                    <v-checkbox
                      style="display: flex"
                      v-model="selected"
                      :value="routine"
                    ></v-checkbox>
                  </td>
                  <td>
                    <div class="name-cover">
                      <img
                        :src="require('../../../assets/scanner-image.jpg')"
                        alt=""
                        style="width: 30px; border-radius: 10px"
                      />
                      <div class="name-det">
                        <h5>{{ sub.location.name }}</h5>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p>{{ formatDateTime(sub.started_at) }}</p>
                  </td>
                  <td>
                    <p>
                      {{ sub.program_length }} Day{{
                        sub.program_length > 0 ? "s" : ""
                      }}
                    </p>
                  </td>
                  <td>
                    <p
                      v-if="
                        sub.days_since_subscription_start <= sub.program_length
                      "
                    >
                      {{
                        getSubscriptionMessage(
                          sub.days_since_subscription_start
                        )
                      }}
                    </p>
                    <v-badge
                      v-else
                      color="error"
                      content="Expired"
                      inline
                    ></v-badge>
                  </td>
                  <td class="qrcode">
                    <img
                      @click="openQRcode(sub)"
                      :src="require('../../../assets/scan.png')"
                      alt=""
                    />
                    <ChangeDate @getSubscribers="getSubscribers" :sub="sub" />
                    <v-dialog v-model="QRcode" class="qrmodal" width="auto">
                      <v-card>
                        <v-card-text>
                          <img :src="selectedSub.location.barcode_image" />
                        </v-card-text>
                        <div class="qrcode-btn">
                          <button>
                            <Icon
                              icon="solar:file-download-broken"
                              width="24"
                              height="24"
                            />
                            Download
                          </button>
                          <button
                            @click="printBarcode(selectedBranch.barcode_image)"
                          >
                            <Icon icon="bi:printer" width="24" height="24" />
                            Print
                          </button>

                          <v-icon @click="reloadCode(item)"
                            >mdi-autorenew</v-icon
                          >
                        </div>
                      </v-card>
                    </v-dialog>
                  </td>
                </tr>
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
              </tbody>
            </table>
            <div
              v-if="subscribers.length < 1 && !loading"
              style="display: flex; justify-content: center"
            >
              No subscriber
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
import clientInfo from "../client/clientInfo.vue";
import AddSubscriber from "@/components/AddSubscriber.vue";
import ChangeDate from "@/components/ChangeDate.vue";

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

  methods: {
    getSubscriptionMessage(days) {
      if (days > 0) {
        return `Day ${days}`;
      } else if (days === 0) {
        return "Starts today";
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
      this.$emit("setSelected", id);
      this.loading = true;
      let prog = await axiosInstance.get(`/programs/${id}/`);
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

      await axiosInstance
        .patch(`/programs/${this.program.id}/`, {
          show_all: newId,
        })
        .then((res) => {});

      this.inloading = false;
    },

    async onChangeDescription() {
      this.inloading = true;
      if (this.blurActive) {
        // Perform actions when @blur is active

        //console.log(this.program.description);

        await axiosInstance
          .patch(`/programs/${this.program.id}/`, {
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
      axiosInstance
        .get(`/program/${this.$route.params.id}/subscribed_users/`)
        .then((res) => {
          this.subscribers = res.data;
          this.inloading = false;
          console.log(this.subscribers, "the subscriber");
        });
    },
  },

  mounted() {
    // Activate @blur after component is mounted
    this.blurActive = true;
  },

  async created() {
    if (this.$route.params.id && this.$route.params.id !== "") {
      this.$emit("setSelected", this.$route.params.id);
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
