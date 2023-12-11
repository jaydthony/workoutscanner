<template>
  <div class="text-center">
    <!-- <p @click="dialog = true" style="cursor: pointer">Add Program</p> -->
    <v-btn class="btn-secondary" fab small @click="dialog = true">
      <v-icon>mdi-plus</v-icon> Add Program
    </v-btn>

    <v-dialog v-model="dialog" width="100%">
      <v-card style="padding: 10px">
        <v-card-title class="text-h5">
          <h3 style="margin-bottom: 20px">New Program</h3></v-card-title
        >
        <v-card-text>
          <div class="cover">
            <div class="left">
              <div class="form">
                <div class="forms">
                  <v-text-field
                    v-model="programname"
                    density="compact"
                    variant="outlined"
                    label="Program Name"
                    hint="Like 90 Day Transformation Challenge"
                    persistent-hint="Like 90 Day Transformation Challenge"
                    class="mb-2"
                    required
                  ></v-text-field>
                </div>
                <div class="forms">
                  <!-- <v-select
                    v-model="selectedPhase"
                    :items="phases"
                    label="Select Phase"
                    item-text="phaseLabel"
                    item-value="phaseValue"
                  ></v-select> -->

                  <v-select
                    v-model="selectDay"
                    :items="days"
                    item-title="dayLabel"
                    item-value="dayValue"
                    label="Select"
                    persistent-hint
                    return-object
                    single-line
                  ></v-select>

                  <!-- <v-row>
                    <v-col sm="3" class="adjust-margin"
                      ><v-select
                        v-model="select"
                        :items="phases"
                        item-title="phaseLabel"
                        item-value="phaseValue"
                        label="Select"
                        persistent-hint
                        return-object
                        single-line
                      ></v-select
                    ></v-col>
                    <v-col sm="1" class="middle adjust-margin">X</v-col>
                    <v-col sm="3" class="adjust-margin"
                      ><v-select
                        v-model="selectweek"
                        :items="weeks"
                        item-title="weekLabel"
                        item-value="weekValue"
                        label="Select"
                        persistent-hint
                        return-object
                        single-line
                      ></v-select
                    ></v-col>
                    <v-col sm="1" class="middle adjust-margin">=</v-col>
                    <v-col sm="3" class="adjust-margin">
                      <v-text-field
                        v-model="manager"
                        density="compact"
                        variant="outlined"
                        label="Weeks Per Phase"
                        :model-value="`${totalWeeks} weeks`"
                        disabled
                        class=""
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row> -->
                </div>

                <p>
                  Info: A periodized program with training days. You can also
                  schedule workouts,
                </p>
              </div>
            </div>
            <v-divider
              :thickness="3"
              class="border-opacity-50"
              vertical
            ></v-divider>
            <div class="right">
              <v-row no-gutters class="justify-center">
                <img
                  style="height: 60vh; width: 58%"
                  :src="require('../assets/mobile.jpg')"
                />
                <p class="text-center">
                  A periodized program with training days. You can also schedule
                  workouts.
                </p>
              </v-row>
            </div>
          </div></v-card-text
        >

        <v-card-actions>
          <div class="buttons" style="width: 100%">
            <v-btn
              color="primary"
              style="color: black !important; width: 15%; min-width: 10px"
              block
              @click="dialog = false"
            >
              Cancel
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              style="color: black !important; width: 15%; min-width: 10px"
              :loading="loading"
              color="primary"
              :disabled="!programname"
              block
              @click="addProgram"
            >
              Add Program
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
export default {
  name: "NewProgram",
  data() {
    return {
      dialog: false,
      phases: Array.from({ length: 50 }, (_, index) => ({
        phaseLabel: `${index + 1} Phase${index === 0 ? "" : "s"}`,
        phaseValue: `${index + 1}`,
      })),

      select: {
        phaseLabel: "Phases 4",
        phaseValue: 4,
      },
      days: Array.from({ length: 16 }, (_, index) => ({
        dayLabel: `${index + 1} days`,
        dayValue: `${index + 1}`,
      })),
      selectDay: {
        dayLabel: "4 days",
        dayValue: "4",
      },
      loading: false,
      programname: "",
    };
  },

  methods: {
    // Adding New Program
    async addProgram() {
      this.loading = true;
      let phase = this.select.phaseValue;
      let days = this.selectDay.dayValue;
      let name = this.programname;
      // //console.log("this is the", phase, name, weeks);

      try {
        let Program = await axiosInstance.post("/create_program/", {
          programName: name,
          days: days,
          phases: phase,
        });
        //console.log(Program.data);
        this.$emit("activateProgramNew", Program.data);
      } catch (error) {
        //console.log("error", error);
        this.loading = false;
      }
      this.loading = false;
      this.dialog = false;
      //console.log("successful");
    },
  },

  computed: {
    totalWeeks() {
      const selectedPhase = parseInt(this.select.phaseValue);
      const selectedWeeks = parseInt(this.selectweek.weekValue);
      const total = selectedPhase * selectedWeeks;

      //console.log(total, "the total");

      if (!isNaN(total)) {
        return total;
      } else {
        return 0; // Or any other default value if the inputs are not valid
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/NewProgram.scss";
</style>
