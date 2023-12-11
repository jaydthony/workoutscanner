<template>
  <div class="clientInfo" style="width: 100%">
    <div class="cover">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Actions</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in $store.state.requestingUsers" :key="item">
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
                  <h5>{{ item.name }}</h5>
                </div>
              </div>
            </td>
            <td>
              <p>{{ item.email }}</p>
            </td>
            <td>
              <p>
                {{ formatISO8601Timestamp(item.created_at) }}
              </p>
            </td>
            <td>
              <div class="bot">
                <button @click="RejectOrganisation(item)">Reject</button>
                <button @click="addOrganisation(item)">Add</button>
              </div>
            </td>
            <!-- <td class="qrcode">
              <img
                @click="QRcode = true"
                :src="require('../../../assets/scan.png')"
                alt=""
              />

              <v-dialog v-model="QRcode" class="qrmodal" width="auto">
                <v-card>
                  <v-card-text>
                    <img :src="require('../../../assets/QR Code.png')" />
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
                    <button @click="printBarcode(selectedBranch.barcode_image)">
                      <Icon icon="bi:printer" width="24" height="24" />
                      Print
                    </button>

                    <v-icon @click="reloadCode(item)">mdi-autorenew</v-icon>
                  </div>
                </v-card>
              </v-dialog>
            </td> -->
          </tr>
        </tbody>
      </table>
      <div
        v-if="!loading && $store.state.requestingUsers < 1"
        class="noregistration"
      >
        <h2>No New Registration Request</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import axiosInstance from "@/utils/axiosInstance";
export default {
  data() {
    return {
      loading: false,
    };
  },

  methods: {
    formatISO8601Timestamp(timestamp) {
      // Parse the ISO 8601 timestamp into a Date object
      const dateObj = new Date(timestamp);

      // Format the Date object into a human-readable string
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3, // Show milliseconds
        timeZoneName: "short",
      };

      return dateObj.toLocaleDateString(undefined, options);
    },

    addOrganisation(item) {
      this.$swal({
        title: `Are you sure you want to add <span style = "color: green">${item.name}</span> to Workout Scanner?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
        footer: `An email would be sent to them with their password to login`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          try {
            await axiosInstance.post(`/accept-user/${item.id}/`);
            this.$swal("User Accepted, Info saved", "", "success");
            this.removeItem(item);
          } catch (error) {
            this.$swal("Changes are not saved", "", "error");
          }
        } else if (result.isDenied) {
          this.$swal("Changes are not saved", "", "info");
        }
      });
    },
    RejectOrganisation(item) {
      this.$swal({
        title: `Are you sure you want to Reject <span style = "color: red">${item.name}</span> to Workout Scanner?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
        footer: `<span style = "color: red">No email would sent to them</span>`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          try {
            await axiosInstance.post(`/reject-user/${item.id}/`);
            this.$swal("User Rejected", "", "success");
            this.removeItem(item);
          } catch (error) {
            this.$swal("An error occured", "", "error");
          }
        } else if (result.isDenied) {
          this.$swal("Changes are not saved", "", "info");
        }
      });
    },
    removeItem(item) {
      const index = this.$store.state.requestingUsers.findIndex(
        (exercise) => exercise.id === item.id
      );

      // Remove the exercise if found
      if (index !== -1) {
        this.$store.state.requestingUsers.splice(index, 1);
      }

      this.$store.state.user.count -= 1;
    },
  },

  async created() {
    this.loading = true;
    await this.$store.dispatch("getRequestUsers");
    //console.log(this.$store.state.requestingUsers, "hello");
    this.loading = false;
  },

  components: {
    Icon,
  },
  updated() {
    //console.log("updated");
  },
};
</script>

<style lang="scss" scoped>
@import "../../../scss/colors";
@import "../../../scss/clientInfo.scss";

.noregistration {
  position: absolute;
  transform: translateX(100%);
  /* right: 0;
  left: 0; */
  bottom: 50%;
}

.bot {
  display: flex;
  gap: 10px;

  button {
    background-color: $accent-normal;
    padding: 5px 15px;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    transition: 0.3s ease;

    &:hover {
      background-color: red;
    }

    &:nth-child(2) {
      background-color: $primary-normal-active;
      color: black;

      &:hover {
        background-color: $primary-dark-hover;
        color: $primary-light;
      }
    }
  }
}

.contain {
  background-color: $primary-light;
  padding: 10px 15px;
  min-height: 100vh;

  .ma-2 {
    background-color: $primary-normal;
    padding: 5px 10px;
    @media (max-width: 1400px) {
      font-size: 10px;
    }
  }
}

.v-card {
  background-color: $primary-normal;
  padding: 10px 20px 20px 20px;
}

.v-card-text {
  img {
    @media (max-width: 500px) {
      width: 100%;
    }
  }
}
</style>
