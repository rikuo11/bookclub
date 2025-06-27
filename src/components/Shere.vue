<template>
  <v-btn icon="mdi-share" @click="handleClick"></v-btn>
</template>

<script>
import { useRoute } from 'vue-router';
export default {
  setup() {
    const route = useRoute();

    const handleClick = async() => {
      if(!window.navigator.share) {
        console.log('お使いのブラウザでは共有することができません');
      } else {
        try {
          await window.navigator.share({
            url: window.location.href
          });
        } catch (error) {
          console.log(error.message);
        }
      }
    }

    return { handleClick }
  }
}
</script>

<style>

</style>