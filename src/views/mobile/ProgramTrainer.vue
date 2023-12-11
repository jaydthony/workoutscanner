<template>
  <div v-if="!selectedProgram" class="section">
    <div class="top">
      <h2 v-if="thelocation">
        {{ thelocation.location.name }}
        {{
          thelocation.location.location
            ? `- ${thelocation.location.location}`
            : ""
        }}
      </h2>
    </div>
    <div class="maincontent">
      <div
        style="
          height: auto;
          display: flex;
          justify-content: center;
          align-items: center;
        "
        v-if="error"
      >
        <v-btn @click="Reload">Retry</v-btn>
      </div>
      <div style="height: 72vh; overflow: auto" v-if="thelocation">
        <!-- Default Prgram -->
        <div
          class="card-cover"
          v-if="thelocation.default && thelocation.default.show_all"
          @click="selectSub(thelocation.default, true)"
        >
          <v-card style="padding: 20px; margin-bottom: 10px">
            <div class="name-cover">
              <h2>{{ thelocation.default.name }}</h2>
              <Icon icon="iconamoon:arrow-right-2" />
            </div>
            <v-progress-linear
              model-value="10"
              style="margin: 10px 0px"
            ></v-progress-linear>
            <p>
              {{ thelocation.default.phases.length }} Programs
              <v-chip
                variant="outlined"
                style="
                  padding: 2px 4px;
                  border-radius: 10px !important;
                  float: right;
                "
              >
                <p style="font-size: 10px; text-transform: uppercase">
                  Default
                </p>
              </v-chip>
            </p>
          </v-card>
        </div>
        <div
          class="card-cover"
          v-if="thelocation.default"
          @click="selectSub(thelocation.default, true)"
        >
          <v-card style="padding: 20px; margin-bottom: 10px">
            <div class="name-cover">
              <h2>{{ thelocation.default.name }}</h2>
              <Icon icon="iconamoon:arrow-right-2" />
            </div>
            <v-progress-linear
              model-value="10"
              style="margin: 10px 0px"
            ></v-progress-linear>
            <p>
              {{ thelocation.default.phases.length }} Programs
              <v-chip
                variant="outlined"
                style="
                  padding: 2px 4px;
                  border-radius: 10px !important;
                  float: right;
                "
              >
                <p style="font-size: 10px; text-transform: uppercase">
                  Defualt
                </p>
              </v-chip>
            </p>
          </v-card>
        </div>

        <!-- Normal Program -->
        <div
          class="card-cover"
          v-for="item in thelocation.location.subscription"
          :key="item.id"
          @click="selectSub(item, false)"
        >
          <v-card style="padding: 20px; margin-bottom: 10px">
            <div class="name-cover">
              <h2>{{ item.program.name }}</h2>
              <Icon icon="iconamoon:arrow-right-2" />
            </div>
            <v-progress-linear
              model-value="10"
              style="margin: 10px 0px"
            ></v-progress-linear>
            <p>0/{{ item.program.phases.length }} Completed</p>
          </v-card>
        </div>
      </div>
    </div>
    <v-overlay
      :model-value="loading"
      contained
      persistent
      class="align-center justify-center"
      style="height: 100vh"
      :close-on-content-click="false"
    >
      <v-progress-circular
        color="rgb(81, 110, 5)"
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
  <SubDetail
    :defaultValue="defaultValue"
    :locationName="thelocation.location.name"
    :selectedProgram="selectedProgram"
    @goBack="goBack"
    v-else
  />
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import { Icon } from "@iconify/vue";
import { useToast } from "vue-toastification";

import SubDetail from "./SubDetail.vue";

const toast = useToast();

export default {
  name: "Section1",
  components: {
    Icon,
    SubDetail,
  },
  data() {
    return {
      cards: [
        {
          programName: "Gyms",
          total: 6,
        },
        {
          programName: "Brains Workout",
          total: 8,
        },
        {
          programName: "WorkoutByJames",
          total: 4,
        },
        {
          programName: "Maliya",
          total: 3,
        },
        {
          programName: "Gyms",
          total: 6,
        },
        {
          programName: "Gyms",
          total: 6,
        },
        {
          programName: "Gyms",
          total: 6,
        },
      ],
      thelocation: null,
      selectedProgram: null,
      loading: false,
      loadDetail: false,
      nothing: false,
      defaultValue: false,
      error: false,
    };
  },

  methods: {
    selectSub(item, defaultValue) {
      this.defaultValue = defaultValue;
      this.selectedProgram = item;
    },
    goBack() {
      this.selectedProgram = null;
    },

    Reload() {
      window.location.reload();
    },
  },

  async created() {
    this.locationId = this.$route.params.id;
    //console.log(this.locationId);
    this.loading = true;
    this.loadDetail = true;

    try {
      let value = await axiosInstance.get(
        `/locations/${this.locationId}/get_routine_for_current_day/`
      );
      console.log(value.data);

      this.thelocation = value.data;
      this.loading = false;
    } catch (error) {
      //console.log(error, "th error");
      if (error.response) {
        if (error.response.status == 404) {
          toast.error("invalid location QR scanned, contact admin");
          this.$router.push({ name: "mobile" });
        }

        if (error.response.status == 404) {
          toast.info("No exercise set for the day");
          this.nothing = true;
        }
      } else {
        toast.error("Network Error");
        this.error = true;
        this.loading = false;
      }
    }

    this.loadDetail = false;
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/mobiles-styles/Section.scss";
</style>
