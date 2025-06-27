<template>
  <div class="submit-image">
    <v-card>
      <v-tabs>
        <v-tab @click="value = 1">ファイル</v-tab>
        <v-tab @click="value = 2">URL</v-tab>
      </v-tabs>
      <div v-if="value == 1">
        <v-form @submit.prevent="submitFile">
          <v-card-text>
            <v-file-input
              label="ファイルを選択"
              variant="underlined"
              v-model="file"
              accept="image/png, image/jpeg, image/bmp"
              :rules="fileRules"
            ></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit">投稿</v-btn>
            <v-btn @click="$emit('close')">キャンセル</v-btn>
          </v-card-actions>
        </v-form>
      </div>
      <div v-if="value == 2">
        <v-form @submit.prevent="submitURL">
          <v-card-text>
            <v-text-field
              v-model="url"
              label="URL"
              variant="underlined"
              :rules="urlRules"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit">投稿</v-btn>
            <v-btn @click="$emit('close')">キャンセル</v-btn>
          </v-card-actions>
        </v-form>
      </div>
    </v-card>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  setup(props, context) {
    const value = ref(1);
    const url = ref(null);
    const urlRules = ref([
      value => {
        if(value) return true;
        return 'URLを入力してください'
      }
    ]);
    const fileRules = ref([
      value => {
        if(value.length) return true;
        return 'ファイルを選択してください'
      },
      value => {
        return !value || !value.length || value[0].size < 2000000 || '2MB以上の画像ファイルは投稿できません'
      },
    ]);
    const file = ref(null);

    const submitURL = () => {
      if(url.value) {
        context.emit('submit-url', { url: url.value, name: undefined })
      } 
    }

    const submitFile = () => {
      const reader = new FileReader()
      
      if(file.value && file.value.size < 2000000) {
        // encode image to base 64
        reader.readAsDataURL(file.value);

        reader.onload = () => {
          url.value = reader.result
          context.emit('submit-url', { url: url.value, name: file.value.name })
        }
      }
    }

    return { value, url, urlRules, fileRules, submitURL, submitFile, file }
  }
}
</script>

<style>

</style>