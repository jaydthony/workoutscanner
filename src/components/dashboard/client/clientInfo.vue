<template>
  <div class="clientInfo">
    <div class="cover">
      <NewUser @getUser="getUser" />
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Branche(s)</th>
            <th>Est Users</th>
            <th>Joined date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in $store.state.users" :key="user.id">
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
                  v-if="user.profile_picture"
                  :src="user.profile_picture"
                  alt=""
                  style="width: 30px; border-radius: 10px"
                />
                <img
                  v-else
                  :src="require('../../../assets/scanner-image.jpg')"
                  alt=""
                  style="width: 30px; border-radius: 10px"
                />
                <div class="name-det">
                  <h5>{{ user.name }}</h5>
                </div>
              </div>
            </td>
            <td>
              <p>{{ user.locations.length }}</p>
            </td>
            <td>
              <p>5</p>
            </td>
            <td>
              <p>{{ user.date_joined }}</p>
            </td>
            <td>
              <v-btn
                @click="ViewUser(user)"
                style="background-color: rgb(135, 183, 9); color: white"
              >
                View
              </v-btn>

              <v-icon @click="deleteClient(user)" color="red"
                >mdi-trash-can-outline</v-icon
              >
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
          <v-dialog v-model="dialog" class="qrmodal" width="1200px">
            <v-card style="background-color: white !important">
              <v-card-title>
                <Icon
                  @click="dialog = false"
                  style="float: right; cursor: pointer"
                  icon="carbon:close-filled"
                />
              </v-card-title>
              <v-card-text>
                <viewClient :user="user" />
              </v-card-text>
            </v-card>
          </v-dialog>
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
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import viewClient from "./viewClient.vue";
import NewUser from "./NewUser.vue";
import axiosInstance from "@/utils/axiosInstance";

export default {
  data() {
    return {
      QRcode: false,
      loading: false,
      dialog: false,
      user: null,
      selectedClient: null,
    };
  },
  components: {
    Icon,
    viewClient,
    NewUser,
  },

  methods: {
    async getUser() {
      this.loading = true;
      await this.$store.dispatch("getUsers");
      this.loading = false;
      //console.log(this.$store.state.users, "users");
    },

    formatDateTime(dateTime) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      const formattedDate = new Date(dateTime).toLocaleDateString(
        "en-US",
        options
      );
      return formattedDate;
    },

    ViewUser(user) {
      this.user = user;
      this.dialog = true;
    },

    async deleteClient(item) {
      this.$swal({
        title: `Are you sure you want to delete user ${item.name}?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.$swal({
            title: `Second warning!!! ${item.name} has ${item.locations.length} location(s)?`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`,
          }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.loading = true;
              await axiosInstance.delete(`/users/${item.id}/`);
              await this.$store.dispatch("getUsers");
              this.$swal("Deleted!", "", "success");
              this.loading = false;
            } else if (result.isDenied) {
              // this.$swal("Changes are not saved", "", "info");
            }
          });
        } else if (result.isDenied) {
          // this.$swal("Changes are not saved", "", "info");
        }
      });
      this.loading = false;
    },
  },

  //   async updated() {
  //     await this.getUser();
  //   },

  async created() {
    await this.getUser();
  },

  watch: {
    // Watch for changes in the 'id' route parameter
    "$route.params.id": async function (newId, oldId) {
      // Do something when the 'id' route parameter changes
      //console.log("New ID:", newId);
      //console.log("Old ID:", oldId);

      await this.getUser();

      // You can perform actions or fetch data based on the new 'id'
      // For example, load data based on the new 'id'
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../../scss/colors";
@import "../../../scss/clientInfo.scss";

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
