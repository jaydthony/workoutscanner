<template>
  <div>
    <div class="public-ui">
      <div class="logo">
        <img :src="require('../assets/gym-logo.svg')" alt="" />
      </div>
      <v-container fluid class="public-ui">
        <v-row class="bg-form">
          <!-- <v-col cols="4" class="left-side">
              <div class="content">
                <h1>Artisan</h1>
                <p>AI-Powered Business Development at scale</p>
              </div>
            </v-col> -->
          <v-col cols="12" class="right-side pl-5" style="height: 100vh">
            <div class="public-form">
              <h1>{{ this.$route.meta.title }}</h1>
              <p class="disclaimer-text mb-1">Please enter your details</p>
              <hr class="mt-2 mb-4" />
              <v-form
                ref="form"
                v-model="isValid"
                @submit.prevent="requestChange"
              >
                <v-text-field
                  v-model="password"
                  label="Enter New Password"
                  bg-color="#ffffff"
                  class="rounded"
                  variant="outlined"
                  required
                  :rules="[rules.password]"
                />

                <v-text-field
                  v-model="password1"
                  label="confirm Password"
                  bg-color="#ffffff"
                  class="rounded"
                  variant="outlined"
                  required
                  :rules="rules.confirmPassword"
                />
                <v-btn
                  class="btn-primary mb-2 submit-btn"
                  flat
                  size="x-large"
                  :loading="loading"
                  @click.prevent="requestChange"
                  >Change Password</v-btn
                >
              </v-form>
              <p class="disclaimer-text" style="margin-top: 10px">
                <router-link
                  to="/login"
                  style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    color: black;
                    text-decoration: none;
                  "
                  ><Icon
                    icon="solar:alt-arrow-left-broken"
                    width="20"
                    height="20"
                  />
                  Back To Login</router-link
                >
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/scss/app-public.scss";
@import "../scss/colors";

.logo {
  position: absolute;
  width: 10%;
  min-width: 10%;
  height: 100%;
  left: 0;
  top: 10px;
}
.public-ui {
  background-color: $primary-light;
}

.submit-btn {
  width: 100%;
  background-color: $primary-normal;
  text-transform: capitalize;
}

.v-field--error .v-label.v-field-label,
.v-field--focused .v-label.v-field-label {
  opacity: 1;
  background: green !important;
  color: white;
  padding: 1;
  padding: 1px;
}
</style>

<script>
import axiosInstance from "@/utils/axiosInstance";
import { Icon } from "@iconify/vue";
import { useToast } from "vue-toastification";

const toast = useToast();
export default {
  name: "ForgotPassword",
  components: {
    Icon,
  },
  data() {
    return {
      loading: false,
      password: "",
      password1: "",
      isValid: false,

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
        confirmPassword: [
          (value) => !!value || "Confirmation is required",
          (value) => value === this.password || "Passwords do not match",
        ],
      },
    };
  },
  methods: {
    async requestChange() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        try {
          this.loading = true;

          await axiosInstance.post(
            `/password-reset/confirm/${this.$route.params.uuid}/${this.$route.params.token}/`,
            {
              password: this.password,
            }
          );
          toast.success("Request Sucessfull, Password Changed");
          this.$refs.form.reset();
          this.$router.push("/login");
          this.loading = false;
        } catch (error) {
          this.$refs.form.reset();
          this.loading = false;
          this.$router.push("/login");
        }
      }
    },
  },
};
</script>
