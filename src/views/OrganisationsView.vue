<template>
  <div class="organisation">
    <div class="organisation-cover">
      <div class="organisation-top">
        <div class="new">
          <v-btn style="font-size: 12px !important">New Organisation</v-btn>
        </div>
        <div class="search">
          <v-icon>mdi-magnify</v-icon>
          <input type="text" class="search-input" placeholder="search" />
        </div>
      </div>
      <!-- <v-spacer></v-spacer> -->
      <br />
      <div class="organisation-table">
        <v-table>
          <thead>
            <tr>
              <th>
                <v-divider vertical></v-divider>
                Name
              </th>
              <th>
                <v-divider vertical></v-divider>
                Program
              </th>
              <th>
                <v-divider vertical></v-divider>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-cell="Name">Gym Stallion</td>
              <td data-cell="Programs">
                <v-chip class="ma-2" closable variant="outlined" label>
                  Light Workouts
                </v-chip>
                <v-chip class="ma-2" closable variant="outlined" label>
                  Light Workouts
                </v-chip>
                <v-chip class="ma-2" closable variant="outlined" label>
                  Light Workouts
                </v-chip>
              </td>
              <td data-cell="Actions">
                <div class="actions">
                  <div class="text-center edit">
                    <p
                      variant="text"
                      @click="dialog = true"
                      class="font-weight-bold"
                      style="cursor: pointer; width: fit-content"
                    >
                      Edit
                    </p>

                    <v-dialog v-model="dialog" width="50%">
                      <v-card class="edit-form">
                        <div class="form">
                          <div class="forms">
                            <v-text-field
                              v-model="name"
                              density="compact"
                              variant="outlined"
                              label="Client Name"
                              class="mb-2"
                              required
                            ></v-text-field>
                          </div>
                          <div class="forms">
                            <v-text-field
                              v-model="manager"
                              density="compact"
                              variant="outlined"
                              label="Select Program"
                              class="mb-2"
                              required
                            ></v-text-field>
                          </div>

                          <div class="form-botton">
                            <button @click="dialog = false">Cancel</button>
                            <button @click="createBranch">Save Changes</button>
                          </div>
                        </div>
                      </v-card>
                    </v-dialog>
                  </div>
                  <div class="text-center delete">
                    <p
                      variant="text"
                      @click="dialog2 = true"
                      class="font-weight-bold"
                      style="cursor: pointer; width: fit-content"
                    >
                      Delete
                    </p>

                    <v-dialog v-model="dialog2" width="auto">
                      <v-card class="delete-modal">
                        <h2>Delete Program</h2>
                        <p>
                          You are about to delete the {{ branchName }} program.
                          Press Delete to continue
                        </p>
                        <div class="delete-btn">
                          <v-btn @click="dialog2 = false">Cancel</v-btn>
                          <v-btn>Delete</v-btn>
                        </div>
                      </v-card>
                    </v-dialog>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
      <!-- <v-row v-if="!loading" style="padding: 20px">
        <v-col
          v-for="item in $store.state.users"
          :key="item"
          cols="12" 
          md="2"
          sm="4"
          style="padding: 0px;"
        >
          <v-sheet
            class="ma-2 pa-2 cards"
            style="
              border-radius: 6px;
              background-color: transparent;
              margin: 4px !important;
            "
          >
            <h3>{{ item.name ? item.name : "No Name" }}</h3>
            <p style="margin-bottom: 15px" class="email">{{ item.email }}</p>
            <v-divider></v-divider>
            <div class="bot" style="margin-top: 15px">
              <p>3k Users</p>
              <p>100 Branches</p>
            </div>
          </v-sheet>
        </v-col>
      </v-row> -->
      <!-- <v-row v-else>
        <v-col cols="6" sm="3" v-for="n in 8" :key="n">
          <v-skeleton-loader
            height="200"
            :elevation="4"
            type="article"
          ></v-skeleton-loader>
        </v-col>
      </v-row> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/colors";
@import "../scss/Organisation.scss";
</style>

<script>
export default {
  name: "Organisation",

  data() {
    return {
      organisationTab: [
        {
          groupName: "Hilton Hotel Group",
          email: "admin@hhg.com",
          usersNo: "3k Users",
          noBranch: "100 Branches",
        },
        {
          groupName: "Hilton Hotel Group",
          email: "admin@hhg.com",
          usersNo: "3k Users",
          noBranch: "100 Branches",
        },
        {
          groupName: "Hilton Hotel Group",
          email: "admin@hhg.com",
          usersNo: "3k Users",
          noBranch: "100 Branches",
        },
        {
          groupName: "Hilton Hotel Group",
          email: "admin@hhg.com",
          usersNo: "3k Users",
          noBranch: "100 Branches",
        },
        {
          groupName: "Hilton Hotel Group",
          email: "admin@hhg.com",
          usersNo: "3k Users",
          noBranch: "100 Branches",
        },
        {
          groupName: "Hilton Hotel Group",
          email: "admin@hhg.com",
          usersNo: "3k Users",
          noBranch: "100 Branches",
        },
      ],
      loading: false,
      dialog: false,
      dialog2: false,
    };
  },

  async created() {
    this.loading = true;
    await this.$store.dispatch("getUsers");
    this.loading = false;
    //console.log(this.$store.state.users);
  },
};
</script>
