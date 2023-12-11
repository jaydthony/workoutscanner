<template>
  <div class="clientInfo" style="width: 100%">
    <div
      class="branch-top"
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div class="input-cover">
        <v-icon start size="20px" color="black" icon="mdi-magnify"></v-icon>
        <input type="text" placeholder="search" />
      </div>
      <NewBranch @init="addToLocation" :user="user" />
    </div>
    <div class="cover">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Program</th>
            <th>Current Day</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="location in user.locations"
            :key="location.id"
            @click="getDetails(location)"
          >
            <td>
              <v-checkbox
                style="display: flex"
                v-model="selected"
                :value="location"
              ></v-checkbox>
            </td>
            <td>
              <div class="name-cover">
                <img
                  :src="require('../../../assets/scanner-image.jpg')"
                  style="width: 30px; border-radius: 10px"
                  alt=""
                />
                <div class="name-det">
                  <router-link :to="`/app/client/${location.id}`">
                    <h5>{{ location.name }}</h5>
                  </router-link>
                </div>
              </div>
            </td>
            <td
              v-if="
                location.latest_active_subscription &&
                location.latest_active_subscription.program_length >=
                  location.latest_active_subscription
                    .days_since_subscription_start
              "
            >
              <v-badge
                v-if="location.latest_active_subscription"
                color="success"
                :content="`Day ${location.latest_active_subscription.days_since_subscription_start} of ${location.latest_active_subscription.program_length}`"
              >
              </v-badge>
            </td>
            <td v-else>
              <v-badge
                v-if="location.latest_active_subscription"
                color="error"
                content="Expired"
              >
              </v-badge>
              <v-badge v-else color="info" content="Default Program"> </v-badge>
            </td>
            <td>
              <p>
                {{
                  location.latest_active_subscription
                    ? location.latest_active_subscription
                        .days_since_subscription_start
                    : "None"
                }}
              </p>
            </td>

            <td class="qrcode">
              <v-dialog v-model="QRcode" width="auto">
                <v-card>
                  <v-card-text>
                    <img :src="selectedBranch.barcode_image" />
                  </v-card-text>
                  <div class="qrcode-btn">
                    <button
                      @click="downloadBarcode(selectedBranch.barcode_image)"
                    >
                      <img :src="require('../../../assets/qrdownload.png')" />
                      Download
                    </button>
                    <button @click="printBarcode(selectedBranch.barcode_image)">
                      <img :src="require('../../../assets/printer.png')" />
                      Print
                    </button>

                    <button @click="reloadCode(selectedBranch)">
                      <v-icon>mdi-autorenew</v-icon>
                      Reload
                    </button>
                  </div>
                </v-card>
              </v-dialog>

              <div class="cover">
                <img
                  @click="openQRcode(location)"
                  :src="require('../../../assets/scan.png')"
                  alt=""
                />
                <img
                  @click="checkDelete(location)"
                  :src="require('../../../assets/trash.png')"
                  alt=""
                />
                <a :href="`/app/client/${location.id}`" target="_blank">
                  <v-btn append-icon="mdi-open-in-new"> open </v-btn>
                </a>

                <v-dialog v-model="deleting" width="auto">
                  <v-card
                    class="new-branch"
                    style="
                      background-color: rgb(37, 37, 37) !important;
                      color: white;
                    "
                  >
                    <h2>Delete Branch</h2>
                    <p>
                      You are about to delete the {{ branchName }} Branch. Press
                      Delete to continue
                    </p>
                    <div class="delete-btn">
                      <button @click="deleting = false">Cancel</button>
                      <v-btn :loading="deletingLoading" @click="deleteBranch()"
                        >Delete</v-btn
                      >
                    </div>
                  </v-card>
                </v-dialog>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import axiosInstance from "@/utils/axiosInstance";
import { useToast } from "vue-toastification";
import NewBranch from "@/components/NewBranch.vue";

const toast = useToast();
export default {
  data() {
    return {
      QRcode: false,
      qrimage: "",
      selectedBranch: {},
      deleteItem: "",
      deleting: false,
      deletingLoading: false,
      branchName: "",
      selected: [],
    };
  },
  components: {
    Icon,
    NewBranch,
  },
  props: ["user"],

  methods: {
    onSelectItem(item) {
      //console.log("Clicked", item.id);

      this.$router.push({
        name: "editclients",
        params: {
          id: item.id,
        },
      });
    },

    getDetails(item) {
      //console.log(item);
    },

    openQRcode(item) {
      this.qrimage = item.barcode_image;
      this.selectedBranch = item;
      this.QRcode = true;
    },

    checkDelete(item) {
      this.selectedBranch = item;
      // //console.log(item.id)
      this.deleting = true;
      this.deleteItem = item.id;
      this.branchName = item.name;
      // //console.log(item.name)
      // //console.log(this.deleteItem)
    },

    async downloadBarcode(imageUrl) {
      try {
        //console.log(imageUrl, "imageurl");
        const response = await fetch(`${imageUrl}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create an anchor element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.download = "barcode.png";
        link.click();

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading barcode image:", error);
      }
    },
    printBarcode(imageUrl) {
      // Open a new window or iframe
      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        console.error("Failed to open print window.");
        return;
      }

      // Load the HTML content and CSS for printing
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print</title>
          <link rel="stylesheet" type="text/css" href="styles-for-print.css">
        </head>
        <body>
          <div style="display: flex;
    justify-content: center;
    align-items: center;" class="printable">
            
            <img src="${imageUrl}" />
          </div>
          
        </body>
        </html>
      `;

      // Write the HTML content to the new window or iframe
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      // printWindow.document.close();
    },

    reloadCode(item) {
      const locationId = "your_location_id"; // Replace with the actual location ID

      axiosInstance
        .post(`/locations/${item.id}/generate_qr_code/`)
        .then((response) => {
          //console.log("QR code generated successfully");
          this.init();
          this.$swal("Saved!", "", "success");
          // You can handle the response here if needed
        })
        .catch((error) => {
          console.error("Error generating QR code:", error);
          // Handle the error here
        });
    },

    async deleteBranch() {
      // //console.log("the user", this.user);

      if (this.user.locations.length < 2) {
        toast.error("A user must have at list one Branch/Location");
        return;
      }
      this.deletingLoading = true;
      this.loading = true;
      let selectedDelete = this.deleteItem;
      //console.log("branch");
      // //console.log(selectedDelete)

      let branch = await axiosInstance.delete(`/locations/${this.deleteItem}/`);

      //console.log(branch.data, "datas");

      this.init();

      this.user.locations = this.user.locations.filter(
        (item) => item.id !== this.deleteItem
      );
      this.deletingLoading = false;
      this.deleting = false;
      this.loading = false;
    },
    addToLocation(item) {
      this.user.locations.push(item);
    },
    async init() {
      // await this.$store.dispatch("getLocations");
      await this.$store.dispatch("getUsers");
      //console.log(this.$store.state.locations);
    },
  },
  updated() {
    //console.log("updated");
  },
};
</script>

<style lang="scss" scoped>
@import "../../../scss/colors";
@import "../../../scss/clientInfo.scss";

.input-cover {
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 6px;
  padding: 8px;
  border: 1px solid black;

  input {
    outline: none !important  ;
  }
}

.qrcode {
  button {
    background-color: $primary-normal !important;
    padding: 5px 15px;
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
