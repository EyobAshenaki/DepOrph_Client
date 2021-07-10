<template style="positon: relative;">
  <social-worker-orphan-list
    :socialWorerkId="$route.params.id"
  ></social-worker-orphan-list>
</template>

<script>
import SocialWorkerOrphanList from "@/components/SocialWorkerOrphanList.vue";

export default {
  components: {
    SocialWorkerOrphanList
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
