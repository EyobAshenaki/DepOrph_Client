<template>
  <div style="margin-top: 1.5rem">
    <AppNavBar :user="socialWorkerUser" />
    <social-worker-orphan-list
      class="mt-16 pt-3"
      :socialWorerkId="$route.params.id"
    ></social-worker-orphan-list
    ><v-snackbar v-model="snackBar" top right :color="snackBarColor" outlined>
      <v-row>
        <div class="ml-2">{{ snackbarText }}</div>
        <v-spacer></v-spacer>
        <v-icon color="gray" @click="snackBar = false" right>
          mdi-close</v-icon
        ></v-row
      >
    </v-snackbar>
  </div>
</template>

<script>
import SocialWorkerOrphanList from "@/components/SocialWorkerOrphanList.vue";
import AppNavBar from "@/components/AppNavBar.vue";
import axios from "axios";

export default {
  data() {
    return {
      snackBar: false,
      snackbarText: "",
      snackBarColor: "success",
      socialWorker: null,
      socialWorkerUser: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        role: ""
      }
    };
  },
  components: {
    SocialWorkerOrphanList,
    AppNavBar
  },
  created() {
    this.initializeSocialWorker();
  },
  methods: {
    initializeSocialWorker() {
      axios
        .post("/graphql/", {
          query: `query socialWorker($id: ID!) {
            socialWorker(id: $id) {
                    id
                    firstName
                    middleName
                    lastName
                    user {
                      id
                      email
                      role
                    }
                  }
                }`,
          variables: {
            id: this.$route.params.id
          }
        })
        .then(res => {
          if (res.data.errors?.length)
            throw new Error(res.data.errors[0].message.message);
          else return res.data.data.socialWorker;
        })
        .then(socialWorker => {
          this.socialWorker = Object.assign({}, socialWorker);
          this.socialWorkerUser = Object.assign(
            this.socialWorkerUser,
            socialWorker.user
          );
          for (const property in this.socialWorker) {
            if (Object.hasOwnProperty.call(this.socialWorker, property)) {
              this.socialWorkerUser[property] = socialWorker[property];
            }
          }
        })
        .catch(error => {
          this.snackBar = true;
          this.snackBarColor = "error";
          this.snackbarText = error;
          console.error(error);
        });
    }
  }
};
</script>

<style>
.v-dialog,
.v-menu__content {
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
    0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
}
</style>
