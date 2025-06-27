<template>
  <div class="test">
    <v-container>
      <v-textarea v-model="text"></v-textarea>
      <v-btn @click="handleClick">送信</v-btn>
    </v-container>
  </div>
</template>

<script>
import { getFunctions, httpsCallable } from 'firebase/functions';
import { ref } from 'vue';

export default {
  setup() {
    const text = ref('')

    const functions = getFunctions()
    const test = httpsCallable(functions, 'test')

    const handleClick = async () => {
      try {
        const result = await test({ uid: '2177VsXMS3URkVWNu78EDZgL5i12'})
      } catch(err) {
        console.log(err.message)
      } 
    }

    return { text, handleClick }
  }
}
</script>

<style>

</style>