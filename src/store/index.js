import { createStore } from "vuex";

import axiosInstance from "@/utils/axiosInstance";
import Swal from "sweetalert2";
import router from "@/router";

export default createStore({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: {},
    dashboardLoading: false,
    drawerOpened: true,
    exercises: [],
    locations: [],
    routines: [],
    requestingUsers: [],
    requestingCount: 0,
    users: [],
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    set_user(state, user) {
      state.user = user;
    },

    set_users(state, users) {
      state.users = users;
    },

    set_loading(state, loading) {
      state.dashboardLoading = loading;
    },
    auth_success(state, token) {
      state.status = "success";
      state.token = token;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
    },
    set_exercise(state, exercises) {
      state.exercises = exercises;
    },

    set_locations(state, locations) {
      state.locations = locations;
    },

    set_routines(state, routines) {
      state.routines = routines;
    },
    set_requestusers(state, requestingUsers) {
      state.requestingUsers = requestingUsers;
    },
    set_requestCount(state, requestingCount) {
      state.requestingCount = requestingCount;
    },
  },

  actions: {
    // get the user instance
    async getUser({ commit }) {
      let user = false;

      commit("set_loading", true);

      try {
        const response = await axiosInstance.get("/user/");
        user = response.data;
        //console.log(user, "the user");
        if (response.status == 200) {
          commit("set_user", user);
          commit("set_loading", false);
          return true;
        }
        return false;
      } catch (error) {
        commit("set_user", false);
        commit("set_loading", false);
        return false;
      }
      commit("set_loading", false);
    },

    async getLocations({ commit }) {
      try {
        let location = await axiosInstance.get("/locations/");

        commit("set_locations", location.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Display a 'Swal' alert for 401 status
          Swal.fire({
            title: "Unauthorized",
            text: "You are not authorized to access this resource.",
            icon: "error",
          }).then(() => {
            // Navigate to the "login" route after clicking "OK"
            router.push({ name: "login" });
          });
        } else {
          // Handle other errors if needed
          console.error("Error fetching users:", error);
        }
      }
    },

    async getRequestUsers({ commit }) {
      try {
        let users = await axiosInstance.get("/requesting-users/");

        commit("set_requestusers", users.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Display a 'Swal' alert for 401 status
          Swal.fire({
            title: "Unauthorized",
            text: "You are not authorized to access this resource.",
            icon: "error",
          }).then(() => {
            // Navigate to the "login" route after clicking "OK"
            router.push({ name: "login" });
          });
        } else {
          // Handle other errors if needed
          console.error("Error fetching users:", error);
        }
      }
    },

    async getRequestCount({ commit }) {
      try {
        let users = await axiosInstance.get(
          "/count-unprocessed-requesting-users/"
        );

        commit("set_requestCount", users.data.count);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Display a 'Swal' alert for 401 status
          Swal.fire({
            title: "Unauthorized",
            text: "You are not authorized to access this resource.",
            icon: "error",
          }).then(() => {
            // Navigate to the "login" route after clicking "OK"
            router.push({ name: "login" });
          });
        } else {
          // Handle other errors if needed
          console.error("Error fetching users:", error);
        }
      }
    },

    async getUsers({ commit }) {
      try {
        let users = await axiosInstance.get("/users/");
        commit("set_users", users.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Display a 'Swal' alert for 401 status
          Swal.fire({
            title: "Unauthorized",
            text: "You are not authorized to access this resource.",
            icon: "error",
          }).then(() => {
            // Navigate to the "login" route after clicking "OK"
            router.push({ name: "login" });
          });
        } else {
          // Handle other errors if needed
          console.error("Error fetching users:", error);
        }
      }
    },

    async getExercise({ commit }) {
      try {
        let exercise = await axiosInstance.get("/exercises/");

        commit("set_exercise", exercise.data.results);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Display a 'Swal' alert for 401 status
          Swal.fire({
            title: "Unauthorized",
            text: "You are not authorized to access this resource.",
            icon: "error",
          }).then(() => {
            // Navigate to the "login" route after clicking "OK"
            router.push({ name: "login" });
          });
        } else {
          // Handle other errors if needed
          console.error("Error fetching users:", error);
        }
      }
    },

    async getRoutines({ commit }) {
      try {
        let routines = await axiosInstance.get("/routines/");

        commit("set_routines", routines.data.results);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Display a 'Swal' alert for 401 status
          Swal.fire({
            title: "Unauthorized",
            text: "You are not authorized to access this resource.",
            icon: "error",
          }).then(() => {
            // Navigate to the "login" route after clicking "OK"
            router.push({ name: "login" });
          });
        } else {
          // Handle other errors if needed
          console.error("Error fetching users:", error);
        }
      }
    },

    // Register action
    async register({ commit }, user) {
      try {
        await axiosInstance.post("/register/", user);

        toast.success("account created success");

        router.push({ name: "login" });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Display a 'Swal' alert for 401 status
          Swal.fire({
            title: "Unauthorized",
            text: "You are not authorized to access this resource.",
            icon: "error",
          }).then(() => {
            // Navigate to the "login" route after clicking "OK"
            router.push({ name: "login" });
          });
        } else {
          // Handle other errors if needed
          console.error("Error fetching users:", error);
        }
      }
    },

    // login action
    async login({ commit }, user) {
      try {
        const res = await axiosInstance.post("/login/", user);

        const data = res.data.data.access;

        localStorage.setItem("gymkey", data);
        //console.log(data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Display a 'Swal' alert for 401 status
          Swal.fire({
            title: "Unauthorized",
            text: "You are not authorized to access this resource.",
            icon: "error",
          }).then(() => {
            // Navigate to the "login" route after clicking "OK"
            router.push({ name: "login" });
          });
        } else {
          // Handle other errors if needed
          console.error("Error fetching users:", error);
        }
      }
    },

    // Logout action
    async logout({ commit }) {
      // const res = await axiosInstance.post("/logout/", {});
      localStorage.removeItem("gymkey");
    },

    // ...other actions...
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    user: (state) => state.user,
    error: (state) => state.error,
  },
});
