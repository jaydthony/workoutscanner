<template>
  <div class="cover">
    <v-btn class="ma-2" @click="newbranch = true">
      <v-icon start icon="mdi-plus"></v-icon>
      Add New User
    </v-btn>
    <v-dialog v-model="newbranch" width="500px">
      <v-card class="new-branch">
        <h2>New User</h2>
        <v-form ref="form" v-model="validForm">
          <div class="form">
            <div class="forms">
              <v-text-field
                v-model="email"
                density="compact"
                variant="outlined"
                label="Company Email"
                class="mb-2"
                required
                :rules="[
                  (v) => !!v || 'Company Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
                ]"
              ></v-text-field>
            </div>
            <div class="forms">
              <v-text-field
                v-model="name"
                density="compact"
                variant="outlined"
                label="Manager"
                class="mb-2"
                required
                :rules="[(v) => !!v || 'Company Name is required']"
              ></v-text-field>
            </div>

            <div class="info-message">
              An email will be sent to the provided email address with login
              details like password
            </div>
            <div class="form-botton">
              <button @click="newbranch = false">Cancel</button>
              <v-btn
                :loading="loading"
                @click="createUser"
                :disabled="!validForm"
                >Create</v-btn
              >
            </div>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<!-- ... (remaining styles and script remain unchanged) -->

<!-- ... (remaining styles and script remain unchanged) -->

<style lang="scss" scoped>
@import "../../../scss/colors";
@import "../../../scss/NewBranch.scss";

.cover {
  .ma-2 {
    background-color: $primary-normal;
    padding: 5px 10px;
    @media (max-width: 1400px) {
      font-size: 10px;
    }
  }

  .info-message {
    color: $primary-normal;
    margin-bottom: 10px;
  }
}
</style>

<script>
import axiosInstance from "@/utils/axiosInstance";

export default {
  name: "NewBranch",
  data() {
    return {
      newbranch: false,

      name: "",

      email: "",
      loading: false,
    };
  },

  methods: {
    async createUser() {
      this.loading = true;
      if (this.validForm) {
        await axiosInstance.post(`/add-user/`, {
          company_name: this.name,
          company_email: this.email,
        });
        this.$swal("Created!", "", "success");
        this.$emit("getUser");
        this.newbranch = false;
      }

      this.loading = false;
    },

    validForm() {
      // Check if all fields are valid
      return this.$refs.form.validate();
    },
  },
};
</script>
