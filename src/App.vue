<template>
  <v-app>
    <v-main
      class="max-width: 100%;"
      style="background: rgba(238,238,238,1);"
    >
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
