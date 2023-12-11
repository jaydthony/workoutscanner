<template>
    <div class="text-center">
      <button
        @click="dialog = true"
      >
        Login
    </button>
  
      <v-dialog
        v-model="dialog"
        width="80%"
      >
        <v-card>
          <v-card-text>
            <h1 style="margin-bottom: 10px"> Login</h1>
            <v-form>
                <v-text-field
                  label="Email"
                  bg-color="#ffffff"
                  class="rounded mb-3"
                  variant="outlined"
                  required
                />
                <v-text-field
                  label="Password"
                  type="password"
                  bg-color="#ffffff"
                  class="rounded mb-3"
                  variant="outlined"
                  required
                />
                <v-btn
                  type="submit"
                  flat
                  @click="dialog = false"
                >
                    Sign In
                </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
  </template>

<script>
export default {
    name: "Login",
    data () {
        return {
        dialog: false,
        }
    },
}
</script>