<template>
  <div class="answer-details">
    <v-card>
      <!-- userinfo -->
      <v-card-item>
        <UserInfomation :user="answer.answerer">
          <template v-slot:date>
            <span
              class="text-caption text-medium-emphasis"
            >質問日 {{ formatTimestamp(answer.createAt) }}</span>
            <span
              class="text-caption text-medium-emphasis ml-3"
              v-if="answer.updateAt"
            >編集日 {{ formatTimestamp(answer.updateAt) }}</span>
          </template>
        </UserInfomation>

        <v-divider class="mt-3"></v-divider>
      </v-card-item>

      <!-- content -->
      <ShowEditorContent :content="answer.content" size="editor-md"/>
      <v-card-actions>
        <Vote :document="answer" collection-name="answers"/>
        <Follow :document="answer" collection-name="answers"/>
        <Shere />
        <v-spacer></v-spacer>
        <v-menu v-if="answer.answerer == user?.uid">
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-cog" v-bind="props"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item @click="handleEdit(answer)">
              <template v-slot:prepend>
                <v-icon icon="mdi-pencil"></v-icon>
              </template>
              <v-list-item-title>編集する</v-list-item-title>
            </v-list-item>
            <v-list-item @click="dialog = true">
              <template v-slot:prepend>
                <v-icon icon="mdi-delete"></v-icon>
              </template>
              <v-list-item-title>削除する</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-actions>

      <!-- replies -->
      <ReplyList :answer="answer" :replies="replies" />

      <!-- delete -->
      <v-dialog
        v-model="dialog"
        width="auto"
      >
        <v-card
          max-width="400"
        >
          <v-card-item>
          </v-card-item>
          <v-card-text class="text-error">本当に削除しますか？</v-card-text>
          <v-card-actions class="mb-2 d-flex justify-center">
            <v-btn @click="dialog = false">キャンセル</v-btn>
            <v-btn @click="handleDelete">削除する</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
    </v-card>
  </div>
</template>

<script>
import { format } from "date-fns";
import getUser from '../composables/getUser'
import useStorage from "../composables/useStorage";
import useDocument from "@/composables/useDocument";
import ReplyList from '../components/ReplyList.vue'
import UserInfomation from '../components/UserInfomation.vue';
import ShowEditorContent from '../components/ShowEditorContent.vue';
import Vote from '../components/Vote.vue'
import Follow from '../components/Follow.vue'
import Shere from '../components/Shere.vue'
import deleteDocuments from '../composables/deleteDocuments'
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { increment } from "firebase/firestore";
export default {
  props:['answer', 'replies'],
  components: { UserInfomation, ReplyList, Vote, Follow, ShowEditorContent, Shere },
  setup(props) {
    const dialog = ref(false);
    const { user } = getUser();
    const { error, deleteAnswer, test } = deleteDocuments()
    const { deleteImages }  = useStorage();
    const { updateDocument } = useDocument('questions', props.answer.questionId) 


    const router = useRouter()

    const formatTimestamp = (date) => {
      return format(date.toDate(), "MM/dd/yyyy");
    }

    const selectedReplies = (id) => {
      return replies.value.filter( data => data.answerId == id );
    }

    const handleEdit = (answer) => {
      router.push({ name: 'EditAnswer', params: { isbn: answer.isbn, answerId: answer.id }})
    }

    const handleDelete = async() => {
      await deleteAnswer(props.answer.id);
      await updateDocument({
        numberOfAnswers: increment(-1)
      })
      dialog.value = false;
    }    

    return { formatTimestamp, selectedReplies, user, handleEdit, dialog, handleDelete }
  }
}
</script>

<style>

</style>