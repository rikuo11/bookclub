<template>
  <div class="set-link">
    <v-card>
      <v-form @submit.prevent="submitURL">
        <v-card-text>
          <v-text-field
            v-model="url"
            label="URL"
            variant="underlined"
            :rules="urlRules"
          ></v-text-field>
          <v-text-field
            v-model="text"
            label="テキスト"
            variant="underlined"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn type="submit">投稿</v-btn>
          <v-btn @click="$emit('close')">キャンセル</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup(props, context) {
    const url = ref(null);
    const text = ref(null);
    const urlRules = ref([
      value => {
        if(value) return true;
        return 'URLを入力してください'
      }
    ]);

    const submitURL = () => {
      if(url.value) {
        let linkText
        if(text.value) {
          linkText = text.value
        } else {
          linkText = url.value
        }
        context.emit('submit-url', { url: url.value, text: linkText });
      } 
    }

    return { url, urlRules, submitURL, text }
  }
}
</script>

<style>

</style>