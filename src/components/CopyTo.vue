<template>
  <div class="copy">
    <v-menu :disabled="selected.length < 1">
      <template v-slot:activator="{ props }">
        <v-btn
          :disabled="selected.length < 1"
          class="btn-secondary"
          fab
          small
          v-bind="props"
          open-on-hover
        >
          Copy To
          <v-icon>mdi-arrow-right</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="copyTo = true">
          <v-list-item-title>To Programs</v-list-item-title>
        </v-list-item>
        <v-list-item @click="copyTo = true">
          <v-list-item-title> Within This Program</v-list-item-title>
        </v-list-item>
        <v-list-item @click="handleCopy1">
          <v-list-item-title>Workouts</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog v-model="copyTo" width="500px">
      <v-card style="padding: 20px" :loading="loading">
        <v-card-text>
          <h2>Copy This workoot to your program</h2>
        </v-card-text>
        <v-card-text>
          <div class="program">
            <h3 style="margin-bottom: 10px">Select Program</h3>
            <v-select
              v-model="selectedProgram"
              label="Select Program"
              :items="allprogram"
              item-title="name"
              :item-value="(item) => item"
              variant="outlined"
            ></v-select>
          </div>
          <div class="phase">
            <h3 style="margin-bottom: 10px">Select a training phase</h3>
            <v-select
              v-model="selectedValue"
              label="Select a traning phase"
              :items="selectedProgram.phasesProgram"
              item-title="name"
              :item-value="(item) => item"
              variant="outlined"
            ></v-select>
          </div>
        </v-card-text>
        <v-card-text>
          <v-btn :loading="loading" small class="button" @click="handleCopy"
            >Copy</v-btn
          >
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" width="500px">
      <v-card style="padding: 20px" :loading="loading"> </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import { useToast } from "vue-toastification";

const toast = useToast();

export default {
  name: "CopyTo",
  data() {
    return {
      copyTo: false,
      selectedProgram: null,
      select: "",
      selectedValue: "",
      loading: false,
      allprogram: [],
    };
  },
  props: ["selected", "notSelected", "programs"],
  methods: {
    async handleCopy() {
      //   await axiosInstance.post(`/duplicate-routine/${ff}/`);
      this.loading = true;
      for (let i = 0; i < this.selected.length; i++) {
        const element = this.selected[i];
        // //console.log(i + 1, " ", element, this.selectedValue);
        let duplicate = await axiosInstance.post(
          `/duplicate-routine/${element}/`,
          { private: true }
        );
        await axiosInstance.post(
          `/programphase/${this.selectedValue.id}/add_routines/`,
          {
            routines: [duplicate.data.routine.id],
          }
        );
        toast.success(
          `Copied to ${this.selectedProgram.name} into ${this.selectedValue.name}`
        );
      }
      this.loading = false;
      this.selectedProgram = "";
      this.selectedValue = "";
      this.copyTo = false;
    },

    async handleCopy1() {
      //   await axiosInstance.post(`/duplicate-routine/${ff}/`);
      this.inloading = true;
      for (let i = 0; i < this.selected.length; i++) {
        const element = this.selected[i];
        // //console.log(i + 1, " ", element, this.selectedValue);
        let duplicate = await axiosInstance.post(
          `/duplicate-routine/${element}/`,
          { private: false }
        );
        toast.success(`Copied to general workouts`);
      }
      this.inloading = false;
    },
    async getAllPrograms() {
      try {
        let prog = await axiosInstance.get(`/programs2/`);
        this.allprogram = prog.data;
        this.selectedProgram = this.allprogram[0];
        this.selectedValue =
          this.allprogram[0].phasesProgram.length > 0
            ? this.allprogram[0].phasesProgram[0]
            : "";
      } catch (error) {}
    },
  },
  async created() {
    if (!this.notSelected) {
      //console.log(this.programs, "internal", this.selected);
      this.allprogram = this.programs;
      this.selectedProgram = this.allprogram[0];
      this.selectedValue =
        this.allprogram[0].phasesProgram.length > 0
          ? this.allprogram[0].phasesProgram[0]
          : "";
    } else {
      await this.getAllPrograms();
    }
  },
  async updated() {
    if (!this.notSelected) {
      //console.log(this.programs, "internal", this.selected);
      this.selectedProgram = this.programs[0];
    } else {
      await this.getAllPrograms();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/CopyTo.scss";
</style>
