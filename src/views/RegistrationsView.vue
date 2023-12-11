<template>
  <div class="registration">
    <div class="registration-cover">
      <v-row v-if="!loading" no-gutters>
        <v-col
          v-for="item in $store.state.requestingUsers"
          :key="item"
          cols="12"
          md="2"
          sm="4"
        >
          <v-sheet
            class="ma-2 pa-2 card"
            style="border-radius: 6px; background-color: transparent"
          >
            <h3>{{ item.name }}</h3>
            <p class="email">{{ item.email }}</p>
            <p style="margin-bottom: 15px" class="time">
              {{ formatISO8601Timestamp(item.created_at) }}
            </p>
            <v-divider></v-divider>
            <div class="bot" style="margin-top: 15px">
              <button @click="RejectOrganisation(item)">Reject</button>
              <button @click="addOrganisation(item)">Add</button>
            </div>
          </v-sheet>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="6" sm="3" v-for="n in 8" :key="n">
          <v-skeleton-loader
            height="200"
            :elevation="4"
            type="article"
          ></v-skeleton-loader>
        </v-col>
      </v-row>

      <!-- <div class="tab"
                v-for="card in organisationTab" 
                :key="card.name"
            >
                <h3>{{ card.groupName }}</h3>
                <p>{{ card.email }}</p>
                <v-divider></v-divider>
                <div class="bot">
                    <p>{{ card.usersNo }}</p>
                    <p>{{ card.noBranch }}</p>
                </div>
            </div> -->
    </div>
    <div v-if="!loading && $store.state.requestingUsers < 1" class="notaval">
      <h2>No New registration request</h2>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/colors";
@import "../scss/Registration.scss";

.notaval {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import axiosInstance from "@/utils/axiosInstance";

export default {
  name: "Registration",

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    formatISO8601Timestamp(timestamp) {
      // Parse the ISO 8601 timestamp into a Date object
      const dateObj = new Date(timestamp);

      // Format the Date object into a human-readable string
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3, // Show milliseconds
        timeZoneName: "short",
      };

      return dateObj.toLocaleDateString(undefined, options);
    },

    addOrganisation(item) {
      this.$swal({
        title: `Are you sure you want to add <span style = "color: green">${item.name}</span> to Workout Scanner?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
        footer: `An email would be sent to them with their password to login`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          try {
            await axiosInstance.post(`/accept-user/${item.id}/`);
            this.$swal("User Accepted, Info saved", "", "success");
            this.removeItem(item);
          } catch (error) {
            this.$swal("Changes are not saved", "", "error");
          }
        } else if (result.isDenied) {
          this.$swal("Changes are not saved", "", "info");
        }
      });
    },

    RejectOrganisation(item) {
      this.$swal({
        title: `Are you sure you want to Reject <span style = "color: red">${item.name}</span> to Workout Scanner?`,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
        footer: `<span style = "color: red">No email would sent to them</span>`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          try {
            await axiosInstance.post(`/reject-user/${item.id}/`);
            this.$swal("User Rejected", "", "success");
            this.removeItem(item);
          } catch (error) {
            this.$swal("An error occured", "", "error");
          }
        } else if (result.isDenied) {
          this.$swal("Changes are not saved", "", "info");
        }
      });
    },

    removeItem(item) {
      const index = this.$store.state.requestingUsers.findIndex(
        (exercise) => exercise.id === item.id
      );

      // Remove the exercise if found
      if (index !== -1) {
        this.$store.state.requestingUsers.splice(index, 1);
      }
    },
  },
  async created() {
    this.loading = true;
    await this.$store.dispatch("getRequestUsers");
    await this.$store.dispatch("getRequestCount");
    //console.log(this.$store.state.requestingUsers);
    this.loading = false;
  },
};
</script>
