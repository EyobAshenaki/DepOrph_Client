<template>
  <div>
    <v-app-bar
      absolute
      dark
      elevate-on-scroll
      scroll-target="#scrolling-techniques-3"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
         gradient="to top right, rgba(100,115,201,.5), rgba(25,32,72,.7)"
        ></v-img>
      </template>

      <v-app-bar-nav-icon @click="changeTruthValue()"></v-app-bar-nav-icon>

      <v-toolbar-title >SiteName's Site Orphans</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-responsive max-width="300">
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          class="pt-5"
          color="orange"
        ></v-text-field>
      </v-responsive>

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
  // props: ['truthValue'],
  props: {
    truthValue: Boolean
  },
  data() {
    return {
      search: "",
      drawer: false,
    };
  },
  methods: {
    changeTruthValue() {
      console.log(`event Emitted!`);
      this.$emit('changeValue');
    },
  },
};
</script>
