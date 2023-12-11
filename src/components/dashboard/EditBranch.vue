<template>
  <div>
    <v-dialog v-model="dialog" width="60%">
      <template v-slot:activator="{}">
        <!-- <img @click="dialog = true" :src="img1" alt="" /> -->
        <Icon
          icon="solar:pen-2-broken"
          width="25"
          height="25"
          style="cursor: pointer"
          color=" rgb(180, 244, 12)"
          @click="dialog = true"
        />
      </template>
      <v-card class="new-branch edit">
        <h2>Edit Branch</h2>
        <div class="form">
          <div class="forms">
            <v-text-field
              v-model="name"
              density="compact"
              variant="outlined"
              label="Location name"
              class="mb-2"
              required
            ></v-text-field>
          </div>
          <div class="forms">
            <v-text-field
              v-model="manager"
              density="compact"
              variant="outlined"
              label="Manager"
              class="mb-2"
              required
            ></v-text-field>
          </div>

          <div class="forms">
            <v-text-field
              v-model="thelocation"
              density="compact"
              variant="outlined"
              label="Enter a location"
              class="mb-2"
              required
            ></v-text-field>
          </div>
          <div class="form-botton">
            <button @click="dialog = false">Cancel</button>
            <button @click="updateBranch">Update</button>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import { Icon } from "@iconify/vue";
export default {
  name: "editBranch",
  components: {
    Icon,
  },
  data() {
    return {
      dialog: false,
      favorites: [],
      selectedLocation: "",
      name: "",
      thelocation: "",
      manager: "",
      states: [
        "Alabama",
        "Alaska",
        "American Samoa",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District of Columbia",
        "Federated States of Micronesia",
        "Florida",
        "Georgia",
        "Guam",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Marshall Islands",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Northern Mariana Islands",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Palau",
        "Pennsylvania",
        "Puerto Rico",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virgin Island",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],

      img1: require("@/assets/edit-dark.png"),
      locationVal: {},
    };
  },
  props: ["location"],

  methods: {
    onChange(value) {
      // Check if the user's input is not empty and not already in the suggestions
      //console.log("value", value);
      if (value) {
        // Add the user's input to the suggestions
        this.states.push(value);
      }
    },
    async updateBranch() {
      await axiosInstance.patch(`/locations/${this.location.id}/`, {
        name: this.name,
        managername: this.manager,
        location: this.thelocation,
      });
      this.$swal("Saved!", "", "success");
      this.$emit("init");
      this.dialog = false;
    },
  },

  created() {
    this.name = this.location.name;
    this.thelocation = this.location.location;
    this.manager = this.location.managername;
  },
  updated() {
    this.name = this.location.name;
    this.thelocation = this.location.location;
    this.manager = this.location.managername;
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/colors";
@import "@/scss/NewBranch.scss";

.v-overlay__content {
  width: 60%;
}
.cover {
  .ma-2 {
    background-color: $primary-normal;
    padding: 5px 10px;
    @media (max-width: 1400px) {
      font-size: 10px;
    }
  }
}
</style>
