<template>
  <div class="edit-profile">
    <v-btn
      variant="text"
      size="medium"
      class="px-2 py-1"
      @click="dialog = true"
    >
      <v-icon icon="mdi-cog-outline" class="mr-1"></v-icon>
      <span>編集</span>
    </v-btn>
    <v-dialog
      max-width="800"
      class="mx-auto"
      v-model="dialog"
    >
      <v-card>
        <v-card-item color="primary">
          <v-card-title>
            プロフィールを編集する
          </v-card-title>
        </v-card-item>
        <v-form @submit.prevent="handleSubmit">
          <v-card-text>
            <div class="font-weight-bold my-1">自己紹介</div>
            <v-textarea v-model="text" variant="outlined" :rules="textRules"></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn type="submit" :loading="isPending">保存</v-btn>
            <v-btn @click="dialog = !dialog">キャンセル</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';
import useDocument from '@/composables/useDocument';
export default {
  props: ['user'],
  setup(props) {
    const dialog = ref(false);
    const text = ref('')
    const textRules = ref([
      value => {
        if(value) return true;
        return 'プロフィールを入力してください'
      },
      value => {
        if(value.length <= 160) return true;
        return '160字以内で入力してください'
      }
    ]);
    const { error, isPending, updateDocument } = useDocument('users', props.user.uid)

    const handleSubmit = () => {
      const doc = {
        profile: text.value
      }

      if(text.value) {
        updateDocument(doc)
        text.value = ''
        dialog.value = false
      }
    }

    return { dialog, error, isPending, handleSubmit, text, textRules }
  }
}
</script>

<style>

</style>