<template>
  <v-app>
    <v-main
      class="max-width: 100%;"
      style="background: #eee;"
    >
      <!-- style="background-image: linear-gradient(to bottom right, rgba(100,115,201,.6), rgba(25,32,72,1);" -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: "App",

  data: () => ({
    //
    valueChanger: false,
  }),
};
</script>
