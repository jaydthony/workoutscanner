<template>
  <div class="detail">
    <v-row no-gutters>
      <!-- Total Gym Group 1st card -->
      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="day-group">
            <p>Welcome</p>
            <h2 style="text-transform: uppercase">
              {{ $store.state.user.name }}
            </h2>
          </div>
        </v-sheet>
      </v-col>

      <!-- Pending Registrations 2nd card -->
      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="day-group">
            <p>Today</p>
            <h2>
              {{ new Date().toLocaleDateString("en-US", { weekday: "long" }) }}
            </h2>
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
            <p>Next</p>
            <h2>
              {{
                new Date(
                  new Date().setDate(new Date().getDate() + 1)
                ).toLocaleDateString("en-US", { weekday: "long" })
              }}
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
            <p>Total Number of location</p>
            <h2>{{ $store.state.user.location_count }}</h2>
          </div>
        </v-sheet>
      </v-col>

      <!-- Total Branch 5th card -->
      <!-- <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="day-group">
            <p>ISD</p>
            <h2>Saturday</h2>
          </div>
        </v-sheet>
      </v-col>


      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="day-group">
            <p>Branch Manager</p>
            <h2>James</h2>
          </div>
        </v-sheet>
      </v-col>

  
      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="day-group">
            <p>Location</p>
            <h2>Califonia</h2>
          </div>
        </v-sheet>
      </v-col>


      <v-col cols="12" md="3" sm="6">
        <v-sheet
          style="background-color: transparent; color: white"
          class="cards"
        >
          <div class="day-group">
            <p>Notification</p>
            <h2>0</h2>
          </div>
        </v-sheet>
      </v-col> -->
    </v-row>
  </div>
</template>

<script>
export default {
  name: "ThisWeek",
};
</script>

<style lang="scss" scoped>
@import "../scss/colors";
@import "../scss/OverviewDet.scss";
</style>
