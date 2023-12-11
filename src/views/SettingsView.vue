<template>
  <div class="settings">
    <div class="settings-cover">
      <div class="change-pic">
        <div class="pic-cover">
          <!-- <Icon icon="uiw:user" width="120" height="120"  /> -->
          <img
            width="250"
            height="250"
            :src="imageUrl"
            alt=""
            v-if="selectedFile"
          />
          <img
            v-else
            width="250"
            height="250"
            :src="
              $store.state.user.profile_picture
                ? $store.state.user.profile_picture
                : require('../assets/scanner-image.jpg')
            "
            alt=""
          />
        </div>

        <form @submit.prevent="updateProfilePicture">
          <input
            type="file"
            ref="profilePictureInput"
            accept="image/*"
            style="display: none"
            @change="onFileChange"
          />
          <button v-if="!selectedFile" @click="openFileInput">
            Change Profile Picture
          </button>
          <v-btn :loading="loadingprofile" v-else type="submit"
            >Update Profile Picture</v-btn
          >
        </form>
      </div>
      <div class="change-password">
        <h3>Change Password</h3>
        <v-form @submit.prevent="changePassword">
          <v-text-field
            v-model="currentPassword"
            label="Current Password"
            bg-color="#ffffff"
            class="rounded"
            variant="outlined"
            type="password"
            required
          />
          <v-divider></v-divider>
          <br />
          <v-text-field
            v-model="newPassword"
            label="New Password"
            bg-color="#ffffff"
            class="rounded"
            variant="outlined"
            type="password"
            required
          />
          <v-text-field
            v-model="confirmNewPassword"
            label="Confirm Password"
            bg-color="#ffffff"
            class="rounded"
            variant="outlined"
            type="password"
            required
          />
          <v-btn
            type="submit"
            class="btn-primary mb-2 submit-btn"
            flat
            size="x-large"
            :loading="loading"
          >
            Save Password
          </v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from "@iconify/vue";
import axiosInstance from "@/utils/axiosInstance";

import { useToast } from "vue-toastification";

const toast = useToast();
export default {
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      passwordChangeSuccess: false,
      passwordChangeError: null,
      loading: false,
      loadingprofile: false,
      imageUrl: null, // Store the URL of the selected image
      selectedFile: null,
    };
  },
  components: {
    Icon,
  },
  methods: {
    async changePassword() {
      if (this.newPassword !== this.confirmNewPassword) {
        // this.passwordChangeError = "Passwords do not match.";
        toast.error("Passwords do not match.");
        return;
      }
      this.loading = true;

      try {
        const response = await axiosInstance.patch("/change-password/", {
          old_password: this.currentPassword,
          new_password: this.newPassword,
        });

        if (response.status === 200) {
          toast.success("Succesfully changed password");
          this.newPassword = "";
          this.currentPassword = "";
          this.confirmNewPassword = "";
          // Optionally, you can reset the form fields here.
        }
      } catch (error) {
        this.passwordChangeSuccess = false;
        if (error.response && error.response.data) {
          this.passwordChangeError = error.response.data.detail;
        } else {
          this.passwordChangeError =
            "An error occurred while changing the password.";
        }
      }
      this.loading = false;
    },

    openFileInput() {
      // Show the file input when the button is clicked
      this.$refs.profilePictureInput.click();
    },
    onFileChange(event) {
      // Handle file selection and store the selected file
      this.selectedFile = event.target.files[0];

      // Generate a URL for the selected image
      if (this.selectedFile) {
        this.imageUrl = URL.createObjectURL(this.selectedFile);
      } else {
        this.imageUrl = null; // Clear the URL if no image is selected
      }
    },
    async updateProfilePicture() {
      if (this.selectedFile) {
        // Use Axios to upload the selected file to your backend API
        const formData = new FormData();
        formData.append("profile_picture", this.selectedFile);
        this.loadingprofile = true;

        try {
          const response = await axiosInstance.patch(
            "/update-profile-picture/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Ensure proper content type for file uploads
              },
            }
          );

          if (response.status === 200) {
            // Handle success
            toast.success("Profile Picture changes");
            //console.log("Profile picture updated successfully.");
          }
        } catch (error) {
          // Handle error
          console.error("Error updating profile picture:", error);
        }

        // Reset the form and hide the file input
        await this.$store.dispatch("getUser");
        this.selectedFile = null;
        this.showFileInput = false;
        this.loadingprofile = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/colors";
@import "../scss/Settings";
</style>
