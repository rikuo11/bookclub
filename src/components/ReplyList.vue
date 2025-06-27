<template>
  <div class="reply-list">
    <v-list v-if="replies.length">
      <v-list-item v-for="reply in selectedReplies(answer.id)" :key="reply.id">
        <v-divider></v-divider>
        <v-card-text>
          <span class="mr-1">{{ reply.content }}</span>
          <router-link class="mr-1" :to="{ name: 'UserInfo', params: { uid: reply.user }}">{{ reply.displayName }}</router-link>
          <span class="text-subtitle-2 text-medium-emphasis">{{ formatTimestamp(reply.createAt) }}</span>
        </v-card-text>
      </v-list-item>
    </v-list>
    <v-card-text>
      <div v-if="toggleComment">
        <v-form>
          <v-textarea
            variant="outlined"
            :rules="contentRules"
            v-model="content"
            auto-grow>
          </v-textarea>
        </v-form>
        <div class="d-flex justify-end">
          <v-btn variant="text" @click="toggleComment = !toggleComment">キャンセル</v-btn>
          <v-btn variant="text" :loading="isPending" @click="handleSubmit">投稿</v-btn>
        </div>
        <div v-if="error" class="text-error my-2 pa-2 d-flex justify-end">コメントの投稿に失敗しました。</div>
      </div>
      <div v-else class="d-flex justify-end">
        <!-- <v-btn variant="text" @click="toggleComment = !toggleComment">コメントする</v-btn> -->
        <Button :user="user" @toggleComment="toggleComment = !toggleComment">
          <template v-slot:reply-button="{ handleClick }">
            <v-btn variant="text" @click="handleClick">コメントする</v-btn>
          </template>
        </Button>

      </div>
    </v-card-text>
  </div>
</template>

<script>
import { format } from "date-fns";
import { ref } from 'vue';
import useCollection from '../composables/useCollection'
import useDocument from '../composables/useDocument'
import getUser from '../composables/getUser'
import { serverTimestamp, increment } from 'firebase/firestore';
import { useRouter } from 'vue-router';
import Button from "./Button.vue";
export default {
  props: ['answer', 'replies'],
  components: { Button },
  setup(props) {
    const toggleComment = ref(false);
    const content = ref('')
    const contentRules = ref([
      value => {
        if(value) return true;
        return 'コメントを入力してください'
      }
    ]);


    const { updateDocument } = useDocument('answers', props.answer.id)
    const { error, addDocument, isPending } = useCollection('replies');
    const { user } = getUser();
    const router = useRouter();

    const selectedReplies = (id) => {
      return props.replies.filter( data => data.answerId == id );
    }
    const formatTimestamp = (date) => {
      return format(date.toDate(), "MM/dd/yyyy");
    }

    const handleSubmit = async () => {
      if (content.value) {
        const doc = {
          questionId: props.answer.questionId,
          answerId: props.answer.id,
          user: user.value.uid,
          displayName: user.value.displayName,
          content: content.value,
          createAt: serverTimestamp()
        }
        const ref = await addDocument(doc);
        content.value = '';
        toggleComment.value = false;
      }

      await updateDocument({
        numberOfReplies: increment(1)
      })
    }

    

    return { toggleComment, selectedReplies, handleSubmit, formatTimestamp, contentRules, content, error, isPending, user }
  }
}
</script>

<style>

</style>