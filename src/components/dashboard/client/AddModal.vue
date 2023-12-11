<template>
  <div class="text-center">
    <v-btn
      @click="dialog = true"
      style="background-color: rgb(135, 183, 9); color: white"
      :disabled="!programs"
    >
      Add Program
    </v-btn>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-text class="card-cover">
          <h2>Subscribe to master program</h2>

          <div class="select">
            <p>Select a program</p>
            <v-autocomplete
              v-model="selected"
              label="Select program"
              :items="allPrograms"
              item-title="name"
              :item-value="(item) => item"
              variant="outlined"
            ></v-autocomplete>
          </div>

          <div class="start">
            <p>When do you want the program to start?</p>
            <input
              v-model="dateToStart"
              type="date"
              class="date"
              name="date"
              id="date"
              :min="computeMinDate"
            />
          </div>

          <div class="program">
            <p>Subscribe the program as</p>
            <v-select
              label="Main Program"
              :items="['Main Program', 'Add-On Program']"
              variant="outlined"
            ></v-select>
          </div>
        </v-card-text>
        <v-card-text>
          <div class="sub">
            <v-btn
              :loading="subLoading"
              :disabled="!selected"
              @click="Addsubscriber"
              class="sub-btn"
              block
            >
              Subscribe
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import "../../../scss/AddModal.scss";
</style>

<script>
import axiosInstance from "@/utils/axiosInstance";

export default {
  name: "AddModal",

  data() {
    return {
      dialog: false,
      dateToStart: "",
      selected: null,
      subLoading: false,
      allPrograms: null,
    };
  },

  props: {
    programs: {
      type: [Boolean, Array], // Accepts both string and number types
      required: false,
      default: false, // Default value as a string
    },
  },

  methods: {
    async activateProgram() {
      let fetchedPrograms = await axiosInstance.get("/programs/");
      this.allPrograms = fetchedPrograms.data;
      //console.log(this.allPrograms, "joshijax");
    },

    async Addsubscriber() {
      this.subLoading = true;
      //console.log(this.selected, this.dateToStart, this.$route.params.locid);
      if (this.programs.location.subscription) {
        if (
          confirm(
            `${this.programs.location.name} has a main program already set up\n Press okay to replace the already existing program`
          )
        ) {
          try {
            await axiosInstance.post("/subscription/create/", {
              location: this.$route.params.locid,
              program: this.selected.id,
              started_at: this.dateToStart,
            });
          } catch (error) {}
        }
      } else {
        await axiosInstance.post("/subscription/create/", {
          location: this.$route.params.locid,
          program: this.selected.id,
          started_at: this.dateToStart,
        });
      }

      this.$emit("activateProgram");
      this.select = null;
      this.search = null;
      this.items = [];
      this.loading = false;
      this.subLoading = false;
      this.dateToStart = "";
      this.dialog = false;
    },
  },

  async created() {
    await this.activateProgram();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to 12:00 AM (midnight)
    today.setDate(today.getDate() + 1); // Add 1 day to make it tomorrow
    this.dateToStart = today.toISOString().split("T")[0];
  },

  computed: {
    // Compute max date to restrict selection to today or earlier
    // Compute min date to restrict selection to future dates
    computeMinDate() {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to 12:00 AM (midnight)
      today.setDate(today.getDate() + 1); // Add 1 day to make it tomorrow
      return today.toISOString().split("T")[0];
    },
  },
};
</script>
