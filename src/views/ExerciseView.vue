<template>
  <v-container class="cover">
    <div class="contain mb-2">
      <v-row justify="start" style="align-items: center" class="top-cover">
        <v-col cols="12" sm="8">
          <h4>All Exercise</h4>
        </v-col>
        <v-col cols="6" sm="2">
          <div class="form">
            <button :disabled="!search" @click="searchClick" type="submit">
              Search
            </button>
            <input v-model="search" type="search" placeholder="Search..." />
          </div>
        </v-col>
        <v-col cols="6" sm="2" class="upload">
          <UploadExercise @getAllExercise="getAllExercise" />
        </v-col>
      </v-row>
      <v-row v-if="!loading">
        <v-col
          style="
            height: 100vh;
            justify-content: center;
            display: flex;
            align-items: center;
          "
          v-if="exercises.length < 1"
          sm="12"
          cols="12"
        >
          <h2 v-if="!search">
            Please add an exercise by clicking the green button above
          </h2>
          <h2 v-else>No exercise with value {{ search }}</h2>
        </v-col>
        <v-col
          @click="selectItem(item)"
          cols="6"
          sm="3"
          class="exercise-card"
          v-for="item in exercises"
          :key="item.name"
        >
          <div class="exercise-image">
            <img
              :src="item.is_upload ? item.thumb_image : item.thumb_image_tube"
              :alt="require('@/assets/scanner-image.jpg')"
            />
            <p class="exerise-name">
              {{ item.name }}
            </p>
            <p class="exerise-desc">
              {{ item.description }}
            </p>

            <v-tooltip
              v-if="item.company == $store.state.user.id"
              text="Uploaded By You"
            >
              <template v-slot:activator="{ props }">
                <span
                  v-bind="props"
                  style="position: absolute; right: 53px; bottom: 7px"
                  ><v-badge dot color="success"> </v-badge
                ></span>
              </template>
            </v-tooltip>
          </div>
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
    </div>

    <div class="pagination">
      <v-pagination
        v-model="pagination.page"
        :length="Math.ceil(pagination.total / pagination.perPage)"
        :total-visible="pagination.visible"
      >
      </v-pagination>
    </div>
    <ViewExercise
      :parentDialog="dialog"
      :exercise="selectedItem"
      @close="closetItem"
      @getAllExercise="getAllExercise"
    />
  </v-container>
</template>

<script>
import UploadExercise from "@/components/UploadExercise.vue";
import ContentDetail from "@/components/ContentDetail.vue";
import ViewExercise from "@/components/ViewExercise.vue";
import axiosInstance from "@/utils/axiosInstance";
import _ from "lodash";

export default {
  data() {
    return {
      dialog: false,
      selectedItem: { name: "carvi" },
      pagination: {
        page: 1,
        total: 0,
        perPage: 20,
        visible: 3,
      },
      exercises: [],
      loading: false,
      search: "",
    };
  },
  components: { UploadExercise, ContentDetail, ViewExercise },

  methods: {
    async getAllExercise() {
      let res = await axiosInstance.get(`/exercises/`);
      this.exercises = res.data.results;
      this.pagination.total = res.data.count;
      //console.log(this.exercises, "exercises");
    },
    async next(page) {
      this.loading = true;
      let res = await axiosInstance.get(
        `/exercises/?page=${page}&search=${this.search}`
      );
      this.exercises = res.data.results;
      this.pagination.total = res.data.count;
      this.loading = false;
    },
    async searchClick() {
      this.loading = true;
      let res = await axiosInstance.get(
        `/exercises/?page=${this.pagination.page}&search=${this.search}`
      );
      this.exercises = res.data.results;
      this.pagination.total = res.data.count;
      this.pagination.page = 1;
      this.loading = false;
    },
    selectItem(item) {
      this.selectedItem = item;
      this.dialog = true;
    },

    closetItem() {
      this.dialog = false;
      // this.selectedItem = null;
    },

    searchClick: _.debounce(function querySearch(query) {
      //console.log("the", query);
      this.loading = true;
      this.apiQuery({ value: query })
        .then((response) => {
          this.exercises = response.data.results;
        })
        .finally(() => {
          this.loading = false;
        });
    }, 500),

    async apiQuery(filters) {
      //console.log(filters, "filtered");
      let info = await axiosInstance.get(
        `/exercises/?page=1&search=${filters.value}`
      );
      return info;
    },
  },
  async created() {
    this.loading = true;
    await this.getAllExercise();
    this.loading = false;
  },

  watch: {
    search(query) {
      if (query !== null) {
        this.searchClick(query);
      }
    },

    // Watch for changes in the 'id' route parameter
    "pagination.page": function (newId, oldId) {
      // Do something when the 'id' route parameter changes

      this.next(newId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/colors";
@import "../scss/Exercise.scss";

.cover {
  background-color: $primary-light;
  // padding: 10px 15px;
  // min-height: 80vh;
  height: 90vh;
  border-radius: 10px;
  max-width: none;

  .ma-2 {
    background-color: $primary-normal;
  }

  .pagination {
    .--is-active {
      background-color: $primary-normal;
    }
  }
}

.d-window {
  background-color: $primary-light;
  height: 90%;
}
</style>
