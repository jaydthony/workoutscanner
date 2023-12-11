<template>
  <div class="text-center">
    <div @click="dialog = true" style="cursor: pointer">
      Click to register your gym.
    </div>

    <v-dialog
      v-model="dialog"
      :width="$vuetify.display.mdAndDown ? '100vw' : '50vw'"
    >
      <v-card
        style="
          padding: 20px;
          background-color: #1c1c1e;
          color: rgb(232, 252, 180);
        "
      >
        <h2 style="margin-bottom: 20px">Register</h2>
        <v-form
          @submit.prevent="createBranch"
          ref="form"
          v-model="isValid"
          class="pa-4 pt-6"
        >
          <div class="form">
            <div class="forms">
              <v-text-field
                v-model="name"
                density="compact"
                variant="outlined"
                label="Company Name"
                class="mb-2"
                :rules="[rules.length(2)]"
                required
              ></v-text-field>
            </div>
            <div class="forms">
              <v-text-field
                v-model="email"
                density="compact"
                variant="outlined"
                label="Email"
                class="mb-2"
                :rules="[rules.email]"
                required
              ></v-text-field>
            </div>

            <div class="forms">
              <v-textarea
                v-model="Description"
                density="compact"
                variant="outlined"
                label="Description"
                class="mb-2"
                required
                :rules="[rules.length(10)]"
              ></v-textarea>
            </div>
            <div class="form-botton">
              <button :disabled="loading" @click="cancelRegistration">
                Cancel
              </button>
              <v-btn :loading="loading" type="submit" class="btn-register"
                >Register</v-btn
              >
            </div>
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";

export default {
  name: "RegisterModal",
  data() {
    return {
      dialog: false,
      isValid: false,
      name: "",
      email: "",
      Description: "",
      loading: false,
      rules: {
        email: (v) => !!(v || "").match(/@/) || "Please enter a valid email",
        length: (len) => (v) =>
          (v || "").length >= len ||
          `Invalid character length, required ${len}`,
        password: (v) =>
          !!(v || "").match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/
          ) ||
          "Password must contain an upper case letter, a numeric character, and a special character",
        required: (v) => !!v || "This field is required",
      },
    };
  },
  methods: {
    async createBranch() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        this.loading = true;
        const requestData = {
          name: this.name,
          description: this.Description,
          email: this.email,
        };

        try {
          // Make the POST request to the Django backend
          const response = await axiosInstance.post(
            "/requesting-users/",
            requestData
          );

          // Handle the response as needed (e.g., show success message)
          //console.log("Registration success:", response.data);
          this.$swal(
            "Request have been sent check your email for confirmation",
            "",
            "success"
          );

          this.$refs.form.reset();
          // Close the dialog
          this.dialog = false;
        } catch (error) {
          // Handle any errors (e.g., show error message)
          console.error("Registration error:", error);
          this.$swal(`Registration error: ${error}`, "", "info");
        }
        this.loading = false;
      }
    },
    cancelRegistration() {
      // Clear the form and close the dialog without making a request
      this.$refs.form.reset();
      this.dialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/colors";
h2 {
  color: $primary-light-active;
}

.form-botton {
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 15px;

  button {
    border: 1px solid rgb(232, 252, 180);
    padding: 10px;
    border-radius: 6px;
    transition: 0.3s ease;

    &:hover {
      background-color: $primary-normal-hover;
      border: 1px solid transparent;
      color: #1c1c1e;
    }
  }
}

.btn-register {
  background-color: $primary-normal;
  color: $secondary-normal;
}
</style>
