<template>
  <div class="cover">
    <v-btn class="ma-2" @click="newbranch = true">
      <v-icon start icon="mdi-plus"></v-icon>
      Add New Branch
    </v-btn>
    <v-dialog v-model="newbranch" width="500px">
      <v-card class="new-branch">
        <h2>New Branch</h2>
        <div class="form">
          <div class="forms">
            <v-text-field
              v-model="name"
              density="compact"
              variant="outlined"
              label="Branch name"
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
              label="Location name"
              class="mb-2"
              required
            ></v-text-field>
          </div>
          <div class="form-botton">
            <button @click="newbranch = false">Cancel</button>
            <v-btn :disabled="!name" :loading="loading" @click="createBranch"
              >Create</v-btn
            >
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/colors";
@import "../scss/NewBranch.scss";

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

<script>
import axiosInstance from "@/utils/axiosInstance";
import { useToast } from "vue-toastification";

const toast = useToast();
export default {
  name: "NewBranch",
  data() {
    return {
      newbranch: false,
      favorites: [],
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
      loading: false,
    };
  },
  props: ["user"],
  methods: {
    async createBranch() {
      this.loading = true;
      let Location = await axiosInstance.post(`/locations/`, {
        name: this.name,
        managername: this.manager,
        location: this.thelocation,
        company: this.user.id,
      });
      this.$emit("init", Location.data);
      this.$swal("Created!", "", "success");
      toast.success("Location Created Successfully!!!");

      this.loading = false;
      this.name = "";
      this.manager = "";
      this.thelocation = "";
      this.newbranch = false;
    },
  },
};
</script>
