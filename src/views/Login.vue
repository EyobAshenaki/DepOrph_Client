<template>
  <div style="height: 100vh; padding-top: 200px;">
    <v-card dark class="mx-auto" max-width="400" color="rgba(25,32,72,1)">
      <v-card-text class="px-6">
        <!-- <h2 class="text-h3 text-center pt-3">Welcome</h2>
      <h3 class="text-center">To Your Account</h3>

      <v-row justfiy="center" style="margin: 30px">
        <v-avatar class="mx-auto" size="70">
          <v-icon size="100" class="mx-auto"> mdi-account-circle </v-icon>
        </v-avatar>
      </v-row> -->

        <h2 class="text-h3 text-center pt-3" style="color: #ff9983">Login</h2>
        <v-form>
        <v-text-field
          v-model="loginEmail"
          class="mt-7"
          label="Email"
          dense
          type="email"
          outlined
          color="#FF9983"
        ></v-text-field>
        <v-text-field
        v-model="loginPassword"
          label="Password"
          dense
          type="password"
          outlined
          color="#FF9983"
        ></v-text-field>
        </v-form>
        <v-row justify="space-between">
          <v-checkbox
            class="mt-0 ml-3"
            v-model="selected"
            label="Remember me"
            value="rememberMeTruthValue"
            color="#ff9983"
          ></v-checkbox>
          <a class="mt-1 mr-3" style="color: #ff9983;" href="http://"
            >Forgot your password?</a
          >
        </v-row>
      </v-card-text>
      <v-card-actions class="px-6">
        <v-row>
          <v-col cols="12">
            <v-btn
              @click="login"
              dark
              block
              class="mx-auto mt-n3"
              color="rgba(25,32,72, 0.5)"
            >
              LOGIN
            </v-btn>
          </v-col>
          <v-col cols="12" class="text-center py-0">
            <p>
              don't have an account?
              <v-btn
                class="px-0"
                text
                plain
                color="#FF9983"
                @click="reveal = true"
                >create account</v-btn
              >
            </p>
          </v-col>
        </v-row>
      </v-card-actions>
      <!-- signup -->
      <v-expand-transition>
        <v-card
          v-if="reveal"
          class="transition-fast-in-fast-out v-card--reveal"
          style="height: 100%; width: 100%"
          color="rgba(25,32,72, 1)"
        >
          <v-card-text class="pb-0">
            <h2 class="text-h3 text-center pt-3 mb-7" style="color: #ff9983">
              Signup
            </h2>
            <p class="text-center mb-0">
              Please provide an email, we can contact you with
            </p>
            <p class="text-center mb-0">
              and you can contact us at <a style="color: #ff9983" href="">CDN@gmail.com</a>
            </p>

            <v-text-field
              class="mt-15"
              label="Email"
              dense
              type="email"
              outlined
              color="#FF9983"
            ></v-text-field>
          </v-card-text>
          <v-card-actions class="pt-0 mx-2">
            <v-btn
              dark
              block
              color="rgba(25,32,72, 0.5)"
              class="mt-9"
              @click="reveal = false"
            >
              Confirm
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>

<script>
import axios from "axios";

export default {

  data() {
    return {
      reveal: false,
      selected: false,
      loginEmail: "",
      loginPassword: "",
      role: "",
    };
  },
  methods: {
    login() {
      axios
        .post(
          "/graphql",
          {
            query: `mutation login($email: String!, $password: String!) {
                      login(email: $email, password: $password) {
                        user {
                          id
                          email
                          role
                          coordinators {
                            id
                          }
                          heads {
                            id
                          }
                          donors {
                            id
                          }
                          socialWorkers {
                            id
                          }
                        }
                      }
                    }`,
            variables: {
              email: this.loginEmail,
              password: this.loginPassword
            }
          },
          // {
          //   withCredentials: true,
          // }
        )
        // .then((res) => console.log(res))
        .then((res) => res.data.data.login.user)
        .then(user => {
          if (user.role === "Head") {
            this.$router.push({name: "Head_v2", params: { id: user.heads[0].id}})
          } else if (user.role === "Donor") {
            this.$router.push({name: "Donor", params: { id: user.donors[0].id}})
          } else if (user.role === "Coordinator") {
            this.$router.push({name: "Coordinator", params: { id: user.coordinators[0].id}})
          } else if (user.role === "SocialWorker") {
            this.$router.push({name: "SocialWorker", params: { id: user.socialWorkers[0].id}})
          }
        }) 
        .catch((err) => console.warn(err));
    },
  },
};
</script>
