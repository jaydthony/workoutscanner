<template>
  <div v-if="!started" class="category">
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
    <div v-if="routine" class="category-top" style="color: #fff">
      <h2>{{ routine.name }}</h2>
      <h3>{{ formattedDate }}</h3>

      <h4>
        {{
          routine.subscription
            ? routine.subscription.program.name
            : "There is no program name provided"
        }}
      </h4>
      <p v-if="routine" class="para">
        {{
          routine.subscription
            ? routine.subscription.program.description
            : "There is no description inputed"
        }}
      </p>
    </div>

    <div class="contain">
      <div class="cover">
        <div class="program" v-if="routine && routine.subscription">
          <div v-if="routine.subscription.program.show_all">
            <div
              v-for="(day, index) in routine.subscription.program.phases"
              :key="day.id"
            >
              <h2 style="color: #000">
                {{
                  formattedNewDate(
                    routine.subscription.started_at,
                    routine.subscription.days_since_subscription_start,
                    index
                  )
                }}
              </h2>
              <h3 style="color: #000">{{ day.name }}</h3>
              <div
                @click="viewRoutine(routine)"
                class="tabs"
                v-for="routine in day.routines"
                :key="routine.id"
              >
                <div class="left">
                  <v-img
                    v-if="routine.exercises.length === 0"
                    aspect-ratio="10/9"
                    width="100"
                    cover
                    src="../../assets/scanner-image.jpg"
                  ></v-img>
                  <img
                    v-if="routine.exercises.length > 0"
                    :src="
                      routine.exercises[0].exercise_info.is_upload
                        ? routine.exercises[0].exercise_info.thumb_image
                        : routine.exercises[0].exercise_info.thumb_image_tube
                    "
                    width="100"
                  />
                  <div class="details">
                    <h3>{{ routine.name }}</h3>
                    <p>0/5 completeds</p>
                  </div>
                </div>
                <Icon icon="solar:arrow-right-broken" width="30" height="30" />
              </div>
            </div>
          </div>
          <div v-else>
            <div>
              <h2 style="color: #000">
                {{
                  formattedNewDate1(
                    routine.subscription.started_at,
                    routine.subscription.days_since_subscription_start
                  )
                }}
              </h2>
              <h3 style="color: #000">
                {{
                  routine.subscription.program.phases[
                    routine.subscription.days_since_subscription_start
                  ].name
                }}
              </h3>
              <div
                @click="viewRoutine(routine)"
                class="tabs"
                v-for="routine in routine.subscription.program.phases[
                  routine.subscription.days_since_subscription_start
                ].routines"
                :key="routine.id"
              >
                <div class="left">
                  <v-img
                    v-if="routine.exercises.length === 0"
                    aspect-ratio="10/9"
                    width="100"
                    cover
                    src="../../assets/scanner-image.jpg"
                  ></v-img>
                  <img
                    v-if="routine.exercises.length > 0"
                    :src="
                      routine.exercises[0].exercise_info.is_upload
                        ? routine.exercises[0].exercise_info.thumb_image
                        : routine.exercises[0].exercise_info.thumb_image_tube
                    "
                    width="100"
                  />
                  <div class="details">
                    <h3>{{ routine.name }}</h3>
                    <p>0/5 completed</p>
                  </div>
                </div>
                <Icon icon="solar:arrow-right-broken" width="30" height="30" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <TrainerModal
    :routine="selectedRoutine"
    @InitStart="InitStart"
    :trainerDialog="trainerDialog"
    v-else
  />
  <!-- <Trainer :routine="selectedRoutine" @InitStart="InitStart" v-else /> -->
</template>

<script>
import axiosInstance from "@/utils/axiosInstance";
import Category from "./Category.vue";
import Category2 from "./Category2.vue";
// import Trainer from "./Trainer.vue";
import TrainerModal from "./TrainerModal.vue";
import { useToast } from "vue-toastification";
import { Icon } from "@iconify/vue";
// CommonJS
// const Swal = require("sweetalert2");

const toast = useToast();

export default {
  name: "MainTrainer",
  components: { Category, Category2, Icon, TrainerModal },

  data() {
    return {
      started: true,
      locationId: null,
      routine: null,
      nothing: false,
      loading: false,
      selectedRoutine: {},
      allDetail: null,
      locationName: "",
      programName: "",
      managerName: "",
      phaseNumber: null,
      loadDetail: false,
      description: "",
      trainerDialog: true,
    };
  },
  methods: {
    InitStart(value) {
      this.started = value;
    },

    async viewRoutine(routine) {
      this.selectedRoutine = routine;
      this.started = true;
    },

    getIndex(start_date, program_length) {
      const date = new Date(originalDate);
    },

    formattedNewDate(originalDate, daysToAdd, index) {
      //console.log(originalDate, daysToAdd, index);
      let added = daysToAdd - (index + 1);
      if (daysToAdd < 0) {
        added = index;
      }

      // Parse the original date
      const date = new Date(originalDate);

      // Add the specified number of days
      date.setDate(date.getDate() - added);

      // Format the date in the "dd, MMM, yyyy" format
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
    },

    formattedNewDate1(originalDate, daysToAdd) {
      //console.log(originalDate, daysToAdd);

      // Parse the original date
      const date = new Date(originalDate);

      // Add the specified number of days
      date.setDate(date.getDate() + daysToAdd);

      // Format the date in the "dd, MMM, yyyy" format
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-US", options);
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
      //console.log(value.data);
      if (value.status == 200) {
        this.routine = value.data.location;
        if (value.data.location == null) {
          this.nothing = true;
        }
      }
      if (value.status == 404) {
        this.nothing = true;
      }
      this.allDetail = value.data;
      this.locationName = this.allDetail.location.location;
      this.programName = this.allDetail.location.subscription.program.name;
      this.description =
        this.allDetail.location.subscription.program.description;
      this.managerName = this.allDetail.location.managername;
      this.phaseNumber =
        this.allDetail.location.subscription.program.phases.length;
      //console.log(this.phaseNumber, "the number");
      //console.log(this.allDetail.location);
      //console.log(this.locationName);
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
      }
    }
    this.loading = false;
    this.loadDetail = false;
  },

  computed: {
    formattedDate() {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date().toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../scss/colors";
@import "../../scss/mobiles-styles/Category2.scss";
.para {
  // height: 80%;
  overflow-y: scroll;
  font-size: 15px;
  font-weight: 400;
  text-align: center;
  color: #fff;
  max-height: 60%;

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: $primary-normal;
    -moz-border-radius: 4px;
    -webkit-border-radius: 4px;
    border-radius: 4px;
    -moz-border-radius: rem(4px);
    -webkit-border-radius: rem(4px);
    border-radius: rem(4px);
  }
}
</style>
