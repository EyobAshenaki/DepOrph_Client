<template>
  <div>
    <v-app-bar absolute dark elevate-on-scroll>
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(100,115,201,.5), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

      <v-toolbar-title>CDN</v-toolbar-title>

      <v-spacer></v-spacer>

      <template>
        <v-btn text class="mr-0 py-8">New Orphan</v-btn>
        <v-btn text class="py-8">Support Plans</v-btn>
        <v-btn text class="mr-0 py-8">Change Status</v-btn>
      </template>

      <!-- <template>
        <v-tooltip bottom nudge-top="8">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text class="mr-0 py-8" v-bind="attrs" v-on="on">New</v-btn>
          </template>
          <span>New Orphans</span>
        </v-tooltip>
        
        <v-tooltip bottom nudge-top="8">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text class="mr-0 py-8" v-bind="attrs" v-on="on">Waiting</v-btn>
          </template>
          <span>Waiting Orphans</span>
        </v-tooltip>
        
        <v-tooltip bottom nudge-top="8">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text class="mr-0 py-8" v-bind="attrs" v-on="on">Sponsored</v-btn>
          </template>
          <span>Sponsored Orphans</span>
        </v-tooltip>
        
        <v-tooltip bottom nudge-top="8">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text class="mr-0 py-8" v-bind="attrs" v-on="on">Graduated</v-btn>
          </template>
          <span>Graduated Orphans</span>
        </v-tooltip>
        
      </template> -->

      <!-- <template>
        <v-btn text class="mr-0 py-8">View</v-btn>
        <v-btn text class="mr-0 py-8">Register</v-btn>
        <v-btn text class="mr-0 py-8">User</v-btn>
      </template> -->

      <v-spacer></v-spacer>
      <v-responsive max-width="300" class="mr-3">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          class="pt-5"
          color="orange"
        ></v-text-field>
      </v-responsive>
      <v-menu
        v-model="accountMenu"
        :close-on-content-click="false"
        bottom
        offset-y
        nudge-bottom="5"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon size="27">mdi-account</v-icon>
          </v-btn>
        </template>

        <v-card min-width="300px">
          <v-card-title class="py-1">
            <v-row>
              <v-col cols="10" class="pa-4 pl-13 pt-5 body-2 text-center"
                >Account</v-col
              >
              <v-col cols="2" class="subtitle-1 justify-end">
                <v-icon size="19" @click="closeAccountMenu">mdi-close</v-icon>
              </v-col>
            </v-row>
          </v-card-title>
          <v-divider class=""></v-divider>
          <v-card-text>
            <v-row>
              <v-col sm="3">
                <v-avatar color="green">
                  <span class="white--text text-h5">EA</span>
                </v-avatar>
              </v-col>
              <v-col sm="9">
                <v-col class="pa-0">
                  <span class="black--text">Eyob Aschenaki</span>
                </v-col>
                <span class="gray--text">ethioeyoba@gmail.com</span>
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider class=""></v-divider>
          <v-card-actions class="py-1 justify-end">
            <v-btn color="red" text @click="logOut">Logout</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>
    <!-- <v-navigation-drawer v-model="drawer" absolute temporary style="color: #FF9983;">
      <v-list nav dense>
        <v-list-item-group
          active-class="deep-purple--text text--accent-4"
        >
          <router-link to="/test"></router-link>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Test</v-list-item-title>
          </v-list-item>

          <router-link to="/"></router-link>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Orphans</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      accountMenu: false,
      search: "",
      drawer: false,
    };
  },
  methods: {
    closeAccountMenu() {
      this.accountMenu = false;
    },
    logOut() {
      console.log("Logging out...");
    },
  },
};
</script>
