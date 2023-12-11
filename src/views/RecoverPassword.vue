<template>
    <div>
        <div class="public-ui">
          <div class="logo">
            <img :src="require('../assets/gym-logo.svg')" alt="">
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
                  <p class="disclaimer-text mb-1">
                    Create a new password
                  </p>
                  <hr class="mt-2 mb-4" />
                  <v-form ref="form" >
                    <v-text-field
                      label="New Password"
                      bg-color="#ffffff"
                      class="rounded"
                      variant="outlined"
                      type="password"
                      required
                    />
                    <v-text-field
                      label="Confirm Password"
                      bg-color="#ffffff"
                      class="rounded"
                      variant="outlined"
                      type="password"
                      required
                    />
                    <v-btn
                      type="submit"
                      class="btn-primary mb-2 submit-btn"
                      flat
                      size="x-large"
                      >Send Password</v-btn
                    >
                  </v-form>
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
    
    
    .logo{
      position: absolute;
        width: 10%;
        min-width: 10%;
        height: 100%;
        left: 0;
        top: 10px
    }
    .public-ui{
      background-color: $primary-light;
    }
    
    .submit-btn{
      width: 100%;
      background-color: $primary-normal;
      text-transform: capitalize;
      letter-spacing: 1px;
    }
    
    .v-field--error .v-label.v-field-label,.v-field--focused .v-label.v-field-label {
        opacity: 1;
        background: green !important;
        color: white;
        padding: 1;
        padding: 1px;
    }
    </style>
    
    <script>
    import { Icon } from '@iconify/vue';
    
    export default {
      components: {
            Icon,
        },
    }
    </script>