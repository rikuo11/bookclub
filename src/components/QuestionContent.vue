<template>
  <div class="question-content">
    <div class="mb-3">
      <v-avatar class="mr-2 mb-1" color="warning" rounded="sm" size="small">
        <span>Q</span>
      </v-avatar>
      <div class="d-inline text-h6 font-weight-bold">質問</div>
    </div>
    <v-card>
      <v-card-item>
        <!-- title -->
        <div class="text-h6 my-2">{{ question.title }}</div>

        <!-- userinfo -->
        <UserInfomation :user="question.questioner">
          <template v-slot:date>
            <span
              class="text-caption text-medium-emphasis"
            >質問日 {{ formatTimestamp(question.createAt) }}</span>
            <span
              class="text-caption text-medium-emphasis ml-3"
              v-if="question.updateAt"
            >編集日 {{ formatTimestamp(question.updateAt) }}</span>
          </template>
        </UserInfomation>

        <v-divider class="mt-3"></v-divider>
      </v-card-item>

      <ShowEditorContent :content="question.content" size="editor-md"/>
      
      <v-card-actions>
        <Vote :document="question" collection-name="questions" />
        <Follow :document="question" collection-name="questions" />
        <Shere />
        <v-spacer></v-spacer>
        <v-menu v-if="question.questioner == user?.uid">
          <template v-slot:activator="{ props }">
            <v-btn
              icon="mdi-cog" v-bind="props"
            ></v-btn>
          </template>
          <v-list>
            <v-list-item @click="handleEdit">
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
import deleteDocments from '../composables/deleteDocuments'
import useStorage from "../composables/useStorage";
import UserInfomation from '../components/UserInfomation.vue'
import Vote from '../components/Vote.vue'
import Follow from '../components/Follow.vue'
import Shere from '../components/Shere.vue'
import ShowEditorContent from '../components/ShowEditorContent.vue'
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';
export default {
  props: ['question'],
  components: { UserInfomation, Vote, Follow, Shere, ShowEditorContent },
  setup(props) {

    const dialog = ref(false);

    const router = useRouter();
    const { user } = getUser();
    const { error, deleteQuestion } = deleteDocments();
    const { deleteImages }  = useStorage();

    const formatTimestamp = (date) => {
      return format(date.toDate(), "MM/dd/yyyy");
    }

    const handleEdit = () => {
      router.push({ name: 'EditQuestion', params: { isbn: props.question.isbn, questionId: props.question.id}});
    }

    const handleDelete = async() => {
      const isbn = props.question.isbn;
      await deleteQuestion(props.question.id);
      router.push({ name: 'BookDetails', params: { isbn: isbn }});
    }

 
    return { formatTimestamp, user, handleEdit, handleDelete, dialog }
  }
}
</script>

<style>

</style>