<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ props }">
      <v-icon v-bind="props" text="Open Dialog">
        mdi-clipboard-text-clock</v-icon
      >
    </template>
    <v-card>
      <v-card-text>
        <h2>Change Subscription Start Date</h2>
        <div class="add-details">
          <div class="detail">
            <p>When do you want to start the program</p>
            <input
              v-model="dateToStart"
              type="date"
              class="date"
              name="date"
              id="date"
              :min="computeMinDate"
            />
          </div>
        </div>
      </v-card-text>
      <v-card-text>
        <div class="sub">
          <v-btn
            :loading="subLoading"
            class="sub-btn"
            block
            @click="ChangeDate"
            :disabled="!dateToStart"
          >
            Change
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
@import "../scss/AddSubscriber.scss";
</style>

<script>
import axiosInstance from "@/utils/axiosInstance";
import _ from "lodash";
export default {
  name: "AddSubscriber",

  data() {
    return {
      select: null,
      search: null,
      items: [],
      loading: false,
      subLoading: false,
      apiSource: null,
      dialog: false,
      dateToStart: "",
      minDate: this.computeMinDate,
    };
  },

  props: ["sub"],
  created() {
    // this.preloading();
  },

  watch: {
    select(value) {
      //console.log(value, "select");
    },
    value(value) {
      this.setValue(value);
    },
    search(query) {
      if (query && (!this.select || this.select.text !== query)) {
        this.querySearch(query);
      }
    },
  },
  methods: {
    querySearch: _.debounce(function querySearch(query) {
      //console.log("the", query);
      this.loading = true;
      this.apiQuery({ value: query })
        .then((response) => {
          //console.log(_.unionBy(this.items, response.data, "@id"), "helllo");
          this.items = response.data;
        })
        .finally(() => {
          this.loading = false;
        });
    }, 500),

    async apiQuery(filters) {
      //console.log(filters, "filtered");
      let info = await axiosInstance.get(`/locations/?search=${filters.value}`);
      return info;
    },

    async ChangeDate() {
      this.subLoading = true;

      await axiosInstance.patch(`/subscriptions/${this.sub.id}/`, {
        started_at: this.dateToStart,
      });

      this.$emit("getSubscribers");

      this.subLoading = false;
      this.dateToStart = "";
      this.dialog = false;
    },
  },

  created() {
    //console.log(this.sub, "the sub");
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
