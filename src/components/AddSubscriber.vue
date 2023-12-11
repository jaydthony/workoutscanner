<template>
  <div class="text-center">
    <v-btn
      @click="dialog = true"
      style="background-color: rgb(135, 183, 9); color: white"
    >
      Add Subscriber
    </v-btn>

    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-text>
          <h2>Subscribe clients(Location) to {{ program.name }}</h2>
          <div class="add-details">
            <div class="detail">
              <p>Clients you want to subscribe</p>
              <!-- <v-select
                v-model="select"
                clearable
                chips
                label="Select locations"
                :loading="loading"
                :items="items"
                v-model:search="search"
                item-title="name"
                :item-value="(item) => item"
                multiple
              ></v-select> -->
              <v-autocomplete
                v-model="select"
                :loading="loading"
                :items="items"
                item-title="name"
                :item-value="(item) => item"
                label="Select"
                multiple
                chips
                closable-chips
              >
                <template v-slot:chip="{ props, item }">
                  <v-chip
                    v-bind="props"
                    :prepend-avatar="
                      item.raw.company.profile_picture
                        ? item.raw.company.profile_picture
                        : require('../assets/scanner-image.jpg')
                    "
                    :text="item.raw.name"
                  ></v-chip>
                </template>

                <template v-slot:item="{ props, item }">
                  <v-list-item
                    v-bind="props"
                    :prepend-avatar="
                      item?.raw?.company?.profile_picture
                        ? item?.raw?.company?.profile_picture
                        : require('../assets/scanner-image.jpg')
                    "
                    :title="item?.raw?.name"
                    :subtitle="item?.raw?.email"
                  ></v-list-item>
                </template>
              </v-autocomplete>
            </div>

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
            <div class="detail">
              <p>Subscribe the program as</p>
              <v-select
                label="Select"
                :items="['Main Program', 'Add-On Program']"
                variant="outlined"
              ></v-select>
            </div>
          </div>
        </v-card-text>
        <v-card-text>
          <div class="sub">
            <v-btn
              :loading="subLoading"
              class="sub-btn"
              block
              :disabled="!dateToStart || !select.length > 0"
              @click="Addsubscriber"
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
@import "../scss/AddSubscriber.scss";
</style>

<script>
import axiosInstance from "@/utils/axiosInstance";
import _ from "lodash";
import axios from "axios";
export default {
  name: "AddSubscriber",

  data() {
    return {
      select: [],
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

  props: ["program"],
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
    dialog(query) {
      this.querySearch(" ");
    },
  },
  methods: {
    querySearch: _.debounce(function querySearch(query) {
      //console.log("the", query);
      this.loading = true;
      this.apiQuery({ value: query })
        .then((response) => {
          console.log(_.unionBy(this.items, response.data, "@id"), "helllo");
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

    async Addsubscriber() {
      //console.log(this.dateToStart, "the start");
      this.subLoading = true;

      for (let i = 0; i < this.select.length; i++) {
        const element = this.select[i];
        //console.log(element);
        try {
          await axiosInstance.post("/subscription/create/", {
            location: element.id,
            program: this.program.id,
            started_at: this.dateToStart,
          });
        } catch (error) {}
      }

      this.$emit("getSubscribers");
      this.select = null;
      this.search = null;
      this.items = [];
      this.loading = false;
      this.subLoading = false;
      this.dateToStart = "";
      this.dialog = false;
    },
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
  created() {
    this.querySearch(" ");
    console.log("created");
  },
};
</script>
