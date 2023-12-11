<template>
  <div class="cover">
    <img
      @click="deleting = true"
      :src="require('../assets/trash.png')"
      alt=""
    />
    <v-dialog v-model="deleting" width="auto">
      <v-card class="new-branch">
        <h2>New Branch</h2>
        <p>
          You are about to delete the I-Fitness LG1 Branch. Press Delete to
          continue
        </p>
        <div class="bottom-btn">
          <button @click="deleting = false">Cancel</button>
          <button>Save</button>
        </div> 
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import "../scss/DeleteBranch";
@import "../scss/colors";

.cover {
  img {
    cursor: pointer;
  }
}

.new-branch {
  padding: 30px;

  .bottom-btn {
    display: flex;
    align-items: center;
    gap: 20px;
    justify-content: end;

    button {
      padding: 10px 15px;
      border-radius: 4px;
    }

    button:nth-child(1) {
      color: $primary-dark;
    }

    button:nth-child(2) {
      background-color: #ff8eaa;
      color: $primary-darker;
      padding: 5px 10p;
      border: 4px;
    }
  }
}
</style>

<script>
name: "DeleteBranch";

export default {
  data() {
    return {
      deleting: false,
    };
  },
};
</script>
