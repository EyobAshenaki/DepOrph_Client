<template>
  <v-app>
    <AppNavBar :truthValue="valueChanger" @changeValue="valueChanger = !valueChanger"/>
    <v-main
      class="mt-1 max-width: 100%;"
      style="background-image: linear-gradient(to bottom right, rgba(100,115,201,.6), rgba(25,32,72,1);"
    >
      <router-view :truthValue="valueChanger"/>
    </v-main>
  </v-app>
</template>

<script>
import AppNavBar from "./components/AppNavBar";

export default {
  name: "App",

  components: {
    AppNavBar,
  },

  data: () => ({
    //
    valueChanger: false,
  }),
};
</script>
