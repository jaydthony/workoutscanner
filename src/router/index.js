import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import DashboardLayout from "@/views/Layout/DashboardLayout.vue";
import MobileLayout from "@/views/Layout/MobileLayout.vue";

import authLayout from "@/views/Layout/authLayout.vue";

const checkAuthentication = async (to, from, next) => {
  document.title = to.meta.title || document.title;
  store.state.dashboardLoading = true;
  let user = await store.dispatch("getUser");

  if (to.meta.requiresAuth && !user) {
    await next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  } else if (to.name === "login" && user) {
    await next({
      name: "dashboard",
    });
  } else {
    await next();
  }
  store.state.dashboardLoading = false;
};

const checkAuthentication1 = async (to, from, next) => {
  document.title = to.meta.title || document.title;
  // let user = await store.dispatch("getUser");

  store.state.dashboardLoading = true;

  await next();
  store.state.dashboardLoading = false;
};

let dashboardView = {
  path: "/app",
  component: DashboardLayout,
  name: "app",
  redirect: "/app/dashboard",

  children: [
    {
      path: "/app/dashboard",
      name: "dashboard",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/OverView.vue"),
      meta: { title: "Dashboard", requiresAuth: true },
      // beforeEnter: checkAuthentication,
      beforeEnter: checkAuthentication,
    },
    {
      path: "/app/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "dashboard" */ "../views/AboutView.vue"),
      meta: { title: "About", requiresAuth: true },
      // beforeEnter: checkAuthentication,
    },

    {
      path: "/app/content",
      name: "content",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/ContentView.vue"),
      meta: { title: "Content", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },
    {
      path: "/app/program/:id?/:phaseid?",
      name: "program",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/ProgramView.vue"),
      meta: { title: "Program", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },

    {
      path: "/app/program/:id/trainingPhase/:phaseid",
      name: "phaseview",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/ProgramView.vue"),
      meta: { title: "Program", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },
    {
      path: "/app/exercise",
      name: "exercise",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/ExerciseView.vue"),
      meta: { title: "Exercise", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },
    {
      path: "/app/branches",
      name: "branches",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/BranchesView.vue"),
      meta: { title: "Branches", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },
    {
      path: "/app/clients",
      name: "clients",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/ClientView.vue"),
      meta: { title: "Clients", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },
    {
      path: "/app/clients/:id?/",
      name: "clients",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/ClientView.vue"),
      meta: { title: "Clients", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },
    {
      path: "/app/client/:locid/:id?/:phaseid?",
      name: "editclients",
      component: () =>
        import(
          /* webpackChunkName: "home" */ "../components/dashboard/client/customizeClient.vue"
        ),
      meta: { title: "Subscribed Programs", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },
    {
      path: "/app/workouts",
      name: "workouts",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/RoutineView1.vue"),
      meta: { title: "Workouts", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },
    {
      path: "/app/organisations",
      name: "organisations",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/OrganisationsView.vue"),
      meta: { title: "Organisations", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },
    {
      path: "/app/registrations",
      name: "registrations",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/RegistrationsView.vue"),
      meta: { title: "Registrations", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },
    {
      path: "/app/settings",
      name: "settings",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/SettingsView.vue"),
      meta: { title: "Settings", requiresAuth: true },
      beforeEnter: checkAuthentication,
    },
  ],
};

let mobileView = {
  path: "/landing",
  component: MobileLayout,
  name: "main",
  redirect: "/",

  children: [
    {
      path: "/",
      name: "mobile",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/mobile/MainPage.vue"),
      meta: { title: "Landing", requiresAuth: true },
      beforeEnter: checkAuthentication1,
    },
    {
      path: "/loc/:id",
      name: "categories",
      component: () => import("../views/mobile/ProgramTrainer.vue"),
      meta: { title: "Category", requiresAuth: true },
    },
    {
      path: "/category2",
      name: "category2",
      component: () => import("../views/mobile/Category2.vue"),
      meta: { title: "Category2", requiresAuth: true },
    },
    {
      path: "/locat/:id",
      name: "trainer",
      component: () =>
        import(
          /* webpackChunkName: "dashboard" */ "../views/mobile/Trainer.vue"
        ),
      meta: { title: "Trainer", requiresAuth: true },
    },
    {
      path: "/finish",
      name: "finish",
      component: () =>
        import(
          /* webpackChunkName: "dashboard" */ "../views/mobile/Finish.vue"
        ),
      meta: { title: "Finish", requiresAuth: true },
    },
    {
      path: "/landing",
      name: "landing",
      component: () =>
        import(
          /* webpackChunkName: "dashboard" */ "../views/mobile/LandingPage.vue"
        ),
      meta: { title: "LandingPage", requiresAuth: true },
    },
    {
      path: "/section",
      name: "section1",
      component: () =>
        import(
          /* webpackChunkName: "dashboard" */ "../views/mobile/Section1.vue"
        ),
      meta: { title: "Section1", requiresAuth: true },
    },
    {
      path: "/trainerModal",
      name: "trainerModal",
      component: () =>
        import(
          /* webpackChunkName: "dashboard" */ "../views/mobile/TrainerModal.vue"
        ),
      meta: { title: "TrainerModal", requiresAuth: true },
    },
  ],
};

let authView = {
  path: "/auth",
  component: authLayout,
  name: "auth",
  children: [
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
      meta: { title: "Sign In" },
      beforeEnter: checkAuthentication,
    },
    {
      path: "/forgot-password",
      name: "forgot-password",
      component: () =>
        import(/* webpackChunkName: "login" */ "../views/ForgotPassword.vue"),
      meta: { title: "Forgot Password" },
      // beforeEnter: checkAuthentication,
    },
    {
      path: "/recover-password",
      name: "recover-password",
      component: () =>
        import(/* webpackChunkName: "login" */ "../views/RecoverPassword.vue"),
      meta: { title: "Recover Password" },
      // beforeEnter: checkAuthentication,
    },

    {
      path: "/change-password/:token/:uuid",
      name: "change-password",
      component: () =>
        import(/* webpackChunkName: "home" */ "../views/CreatePassword.vue"),
      meta: { title: "Change Password", requiresAuth: false },
      beforeEnter: checkAuthentication,
    },
  ],
};

const routes = [dashboardView, authView, mobileView];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
