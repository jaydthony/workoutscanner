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
              <!-- <p class="disclaimer-text mb-1">or</p>
              <p class="disclaimer-text mb-1">
                Don't have an account already?
                <router-link to="/register">Sign up here</router-link>
              </p> -->
              <hr class="mt-2 mb-4" />
              <v-form @submit.prevent="onSubmit" ref="form" v-model="isValid">
                <v-text-field
                  v-model="user.email"
                  label="Email"
                  bg-color="#ffffff"
                  class="rounded mb-3"
                  variant="outlined"
                  required
                  :rules="[rules.email]"
                />
                <v-text-field
                  v-model="user.password"
                  label="Password"
                  type="password"
                  bg-color="#ffffff"
                  class="rounded mb-3"
                  variant="outlined"
                  :rules="[rules.length(4)]"
                  required
                />
                <v-btn
                  type="submit"
                  class="btn-primary mb-2 submit-btn login-btn"
                  flat
                  size="x-large"
                  @click.prevent="onSubmit"
                  :loading="loading"
                  >Sign In</v-btn
                >

                <p>
                  Forgot Password?
                  <router-link to="/forgot-password">Click here</router-link>
                </p>
              </v-form>
              <!-- <p class="disclaimer-text">
                Forgot your password?
                <router-link to="/recovery">Request a new one</router-link>
              </p> -->
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  components: {},
  data() {
    return {
      loading: false,
      user: {
        email: "",
        password: "",
      },
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
      },
    };
  },
  methods: {
    async onSubmit() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        this.loading = true;
        try {
          await this.$store.dispatch("login", this.user);
          this.$route.query.redirect
            ? this.$router.push(this.$route.query.redirect)
            : this.$router.push("/app/dashboard");
        } catch (err) {
          // //console.log(err);
        }
        this.loading = false;
      }
    },
  },
  created() {
    // if (this.$store.getters.isLoggedIn) {
    //   this.$router.push("/app/dashboard");
    // }
  },
};
</script>

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
}

.v-field--error .v-label.v-field-label,
.v-field--focused .v-label.v-field-label {
  opacity: 1;
  background: green !important;
  color: white;
  padding: 1;
  padding: 1px;
}

.login-btn {
  background: transparent;

  color: $primary-darker;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid $primary-normal-hover;
  &:hover {
    background-color: $primary-normal-active;
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 20px $primary-normal-active;
  }
}
</style>
