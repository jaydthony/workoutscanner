<template>
  <div class="detail">
    <v-row no-gutters>
      <!-- Total Gym Group 1st card -->
      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="left">
            <p>Total Program</p>
            <h2>
              {{ info ? info.total_programs : "" }}
              <v-progress-circular
                v-if="loading"
                color="rgb(180, 244, 12)"
                indeterminate
              ></v-progress-circular>
            </h2>
          </div>
          <v-divider
            class="border-opacity-75"
            color="white"
            vertical
          ></v-divider>
          <div class="right">
            <router-link
              style="text-decoration: none; color: rgb(180, 244, 12)"
              to="/app/program"
              >View</router-link
            >
          </div>
        </v-sheet>
      </v-col>

      <!-- Pending Registrations 2nd card -->
      <v-col cols="12" md="3" sm="6">
        <v-sheet
          v-if="$store.state.user.is_superuser"
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="left">
            <p>Pending Registrations</p>
            <h2>
              {{ $store.state.user ? $store.state.user.count : "" }}
              <v-progress-circular
                v-if="loading"
                color="rgb(180, 244, 12)"
                indeterminate
              ></v-progress-circular>
            </h2>
          </div>
          <v-divider
            class="border-opacity-75"
            color="white"
            vertical
          ></v-divider>
          <div class="right">
            <router-link
              style="text-decoration: none; color: rgb(180, 244, 12)"
              to="/app/clients/pending"
              >View</router-link
            >
          </div>
        </v-sheet>
        <v-sheet
          v-else
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="left">
            <p>Total Subscribed Program</p>
            <h2>
              {{ info ? info.total_subscribed_programs : "" }}
              <v-progress-circular
                v-if="loading"
                color="rgb(180, 244, 12)"
                indeterminate
              ></v-progress-circular>
            </h2>
          </div>
          <v-divider
            class="border-opacity-75"
            color="white"
            vertical
          ></v-divider>
          <div class="right">
            {{ info ? info.total_subscribed_programs : "" }}
          </div>
        </v-sheet>
      </v-col>

      <!-- Highest Day 3rd Card -->
      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="day-group">
            <p>Total Scanned Today</p>
            <h2>
              {{ info ? info.total_scanned_today : "" }}
              <v-progress-circular
                v-if="loading"
                color="rgb(180, 244, 12)"
                indeterminate
              ></v-progress-circular>
            </h2>
          </div>
        </v-sheet>
      </v-col>

      <!-- Most Active 4th card -->
      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="day-group">
            <p>Total Scanned Last 7 Days</p>
            <h2>
              {{ info ? info.total_scanned_last_7_days : "" }}
              <v-progress-circular
                v-if="loading"
                color="rgb(180, 244, 12)"
                indeterminate
              ></v-progress-circular>
            </h2>
          </div>
        </v-sheet>
      </v-col>

      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="day-group">
            <p>Total Scanned in 1 Month</p>
            <h2>
              {{ info ? info.total_scanned_last_30_days : "" }}
              <v-progress-circular
                v-if="loading"
                color="rgb(180, 244, 12)"
                indeterminate
              ></v-progress-circular>
            </h2>
          </div>
        </v-sheet>
      </v-col>

      <!-- Total Branch 5th card -->
      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="left">
            <p>Total Branches</p>
            <h2>
              {{ info ? info.total_branches : "" }}
              <v-progress-circular
                v-if="loading"
                color="rgb(180, 244, 12)"
                indeterminate
              ></v-progress-circular>
            </h2>
          </div>
          <v-divider
            class="border-opacity-75"
            color="white"
            vertical
          ></v-divider>
          <div class="right">
            <router-link
              style="text-decoration: none; color: rgb(180, 244, 12)"
              to="/app/branches"
              >View</router-link
            >
          </div>
        </v-sheet>
      </v-col>

      <!-- Total Visitors -->
      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="left">
            <p>Total Visitors (est)</p>
            <h2>
              {{ info ? info.total_visitors : "" }}
              <v-progress-circular
                v-if="loading"
                color="rgb(180, 244, 12)"
                indeterminate
              ></v-progress-circular>
            </h2>
          </div>
          <v-divider
            class="border-opacity-75"
            color="white"
            vertical
          ></v-divider>
          <div class="right">200</div>
        </v-sheet>
      </v-col>

      <!-- Low Days -->
      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="day-group">
            <p>Low Days</p>
            <h2>
              {{ info ? (info.low_days ? info.low_days : "--") : "" }}
              <v-progress-circular
                v-if="loading"
                color="rgb(180, 244, 12)"
                indeterminate
              ></v-progress-circular>
            </h2>
          </div>
        </v-sheet>
      </v-col>

      <!-- Less Active Group -->
      <!-- <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="day-group">
            <p>Less Active Groups</p>
            <h2>Fit Star</h2>
          </div>
        </v-sheet>
      </v-col> -->
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ThisWeek",
  props: ["info", "loading"],
  created() {
    console.log(this.info, this.loading);
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/colors";
@import "../scss/OverviewDet.scss";
</style>
