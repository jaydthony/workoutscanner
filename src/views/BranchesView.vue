<template>
  <div>
    <div class="contain">
      <div class="branch-top">
        <div class="input-cover">
          <v-icon start size="20px" color="black" icon="mdi-magnify"></v-icon>
          <input type="text" placeholder="search" />
        </div>
        <NewBranch @init="addItem" :user="this.$store.state.user" />
      </div>
      <div>
        <table
          class="table"
          density="compact"
          v-if="!$vuetify.display.mdAndDown"
          style="border: 1px solid rgba(0, 0, 0, 0.564); border-radius: 10px"
        >
          <thead>
            <tr class="head">
              <th></th>
              <th class="text-left" style="border-top-left-radius: 10px">
                Branch Name
              </th>
              <th class="text-left">Manager</th>
              <th class="text-left">Subscription</th>
              <th class="text-left">Location</th>
              <th class="text-left">Status</th>
              <th class="text-left" style="border-top-right-radius: 10px"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in Locations" :key="item.name">
              <td>
                <v-checkbox v-model="select" :value="item.id"></v-checkbox>
              </td>
              <td style="text-transform: capitalize">{{ item.name }}</td>
              <td>{{ item.managername ? item.managername : "N/A" }}</td>
              <td
                v-if="
                  item.latest_active_subscription &&
                  item.latest_active_subscription.program_length >=
                    item.latest_active_subscription
                      .days_since_subscription_start
                "
              >
                <v-badge
                  v-if="item.latest_active_subscription"
                  color="success"
                  :content="`Day ${item.latest_active_subscription.days_since_subscription_start} of ${item.latest_active_subscription.program_length}`"
                >
                </v-badge>
              </td>
              <td v-else>
                <v-badge
                  v-if="item.latest_active_subscription"
                  color="error"
                  content="Expired"
                >
                </v-badge>
                <v-badge v-else color="info" content="Default Program">
                </v-badge>
              </td>

              <td>{{ item.location ? item.location : "N/A" }}</td>
              <td>
                <v-switch
                  v-model="item.active"
                  color="rgb(135, 183, 9)"
                  value="red"
                  true-value="yes"
                  false-value="no"
                  hide-details
                ></v-switch>
              </td>
              <td>
                <div class="cover-icons">
                  <!-- <img :src="img1" alt="" /> -->
                  <EditBranch @init="init" :location="item" />

                  <div class="text-center qrcode-cover">
                    <img
                      :src="img2"
                      alt="QRcode-icon"
                      @click="openQRcode(item)"
                    />
                    <v-dialog v-model="QRcode" width="auto">
                      <v-card>
                        <v-card-text>
                          <img :src="selectedBranch.barcode_image" />
                        </v-card-text>
                        <div class="qrcode-btn">
                          <button
                            @click="
                              downloadBarcode(selectedBranch.barcode_image)
                            "
                          >
                            <img :src="require('../assets/qrdownload.png')" />
                            Download
                          </button>
                          <button
                            @click="printBarcode(selectedBranch.barcode_image)"
                          >
                            <img :src="require('../assets/printer.png')" />
                            Print
                          </button>

                          <v-icon @click="reloadCode(item)"
                            >mdi-autorenew</v-icon
                          >
                        </div>
                      </v-card>
                    </v-dialog>
                  </div>
                  <!-- <DeleteBranch /> -->
                  <div class="cover">
                    <img
                      @click="checkDelete(item)"
                      :src="require('../assets/trash.png')"
                      alt=""
                    />
                    <a :href="`/app/client/${item.id}`" target="_blank">
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
                          You are about to delete the {{ branchName }} Branch.
                          Press Delete to continue
                        </p>
                        <div class="delete-btn">
                          <button @click="deleting = false">Cancel</button>
                          <v-btn :loading="loading" @click="deleteBranch()"
                            >Delete</v-btn
                          >
                        </div>
                      </v-card>
                    </v-dialog>
                  </div>
                </div>
              </td>
            </tr>
            <v-overlay
              :model-value="loading"
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
        <v-row v-if="$vuetify.display.mdAndDown" no-gutters>
          <v-col
            class="cards"
            v-for="item in Locations"
            :key="item.name"
            cols="12"
            md="2"
            sm="4"
          >
            <v-sheet
              class="ma-2 pa-2 card"
              style="
                border: 1px solid black;
                border-radius: 6px;
                background-color: rgb(0, 99, 99);
              "
            >
              <div class="top">
                <h1>{{ item.name }}</h1>
                <v-switch
                  v-model="item.active"
                  color="rgb(135, 183, 9)"
                  value="red"
                  true-value="yes"
                  false-value="no"
                  hide-details
                  style="max-width: fit-content"
                ></v-switch>
              </div>
              <div class="middle">
                <div class="pic-cover">
                  <img
                    width="50"
                    height="50"
                    :src="
                      $store.state.user.profile_picture
                        ? $store.state.user.profile_picture
                        : require('../assets/scanner-image.jpg')
                    "
                    alt=""
                    style="border-radius: 50%"
                  />
                </div>
                <p>{{ item.location }}</p>
              </div>
              <v-divider></v-divider>
              <div class="icons">
                <EditBranch @init="init" :location="item" />
                <div class="text-center qrcode-cover">
                  <Icon
                    icon="carbon:scan-alt"
                    width="25"
                    color="white"
                    height="25"
                    @click="openQRcode(item)"
                  />
                  <!-- <img
                            :src="img2"
                            alt="QRcode-icon"
                            @click="openQRcode(item)"
                          /> -->
                  <v-dialog v-model="QRcode" width="auto">
                    <v-card>
                      <v-card-text>
                        <img :src="selectedBranch.barcode_image" />
                      </v-card-text>
                      <div class="qrcode-btn">
                        <button
                          @click="downloadBarcode(selectedBranch.barcode_image)"
                        >
                          <img :src="require('../assets/qrdownload.png')" />
                          Download
                        </button>
                        <button
                          @click="printBarcode(selectedBranch.barcode_image)"
                        >
                          <img :src="require('../assets/printer.png')" />
                          Print
                        </button>

                        <v-icon @click="reloadCode(selectedBranch)"
                          >mdi-autorenew</v-icon
                        >
                      </div>
                    </v-card>
                  </v-dialog>
                </div>
                <!-- <DeleteBranch /> -->
                <div class="cover">
                  <img
                    @click="checkDelete(item)"
                    :src="require('../assets/trash.png')"
                    alt=""
                  />
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
                        You are about to delete the {{ branchName }} Branch.
                        Press Delete to continue
                      </p>
                      <div class="delete-btn">
                        <button @click="deleting = false">Cancel</button>
                        <v-btn :loading="loading" @click="deleteBranch()"
                          >Delete</v-btn
                        >
                      </div>
                    </v-card>
                  </v-dialog>
                </div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script>
import NewBranch from "@/components/NewBranch.vue";
import DeleteBranch from "@/components/DeleteBranch.vue";
import EditBranch from "../components/dashboard/EditBranch.vue";
import axiosInstance from "@/utils/axiosInstance";
import { Icon } from "@iconify/vue";

import axios from "axios";

export default {
  data() {
    return {
      QRcode: false,

      img1: require("../assets/edit-dark.png"),
      img2: require("../assets/scan.png"),
      img3: require("../assets/trash.png"),
      qrcode: require("../assets/QR Code.png"),

      Locations: [],
      ex11: "no",
      qrimage: "",
      selectedBranch: {},
      select: [],
      loading: false,
      // deleteItem is the ID of the branch that whats to be deleted
      deleteItem: "",
      deleting: false,
      branchName: "",
    };
  },
  components: { NewBranch, DeleteBranch, EditBranch, Icon },

  methods: {
    checkDelete(item) {
      this.selectedBranch = item;
      // //console.log(item.id)
      this.deleting = true;
      this.deleteItem = item.id;
      this.branchName = item.name;
      // //console.log(item.name)
      // //console.log(this.deleteItem)
    },

    async deleteBranch() {
      this.loading = true;
      let selectedDelete = this.deleteItem;
      //console.log("branch");
      // //console.log(selectedDelete)

      let branch = await axiosInstance.delete(`/locations/${this.deleteItem}/`);

      //console.log(branch.data, "datas");

      this.init();

      this.deleting = false;
      this.loading = false;
    },

    openQRcode(item) {
      this.qrimage = item.barcode_image;
      this.selectedBranch = item;
      this.QRcode = true;
    },

    async init() {
      await this.$store.dispatch("getLocations");
      //console.log(this.$store.state.locations);
      this.Locations = this.$store.state.locations;
    },

    addItem(item) {
      this.Locations.push(item);
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
  },

  async created() {
    this.loading = true;
    await this.init();
    this.loading = false;
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/colors";
@import "../scss/Branches.scss";

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
