<template>
  <div class="question" v-if="question">
    <v-container class="mb-16">
      <div class="d-flex justify-end pa-1 mb-10">
        <router-link :to="{ name: 'BookDetails', params:{ isbn: question.isbn }}">
          <v-icon class="mr-1 mb-1" icon="mdi-book-open-variant-outline"></v-icon>
          <span class="text-subtitle-1">「{{ question.bookTitle }}」のページに戻る</span>
        </router-link>
      </div>
      
      <!-- question -->
      <QuestionContent :question="question"/>

      <!-- button -->
      <Button :user="user" :isbn="isbn" :question-id="question.id">
        <template v-slot:answer-button="{ handleClick }">
          <div class="d-flex justify-center pa-1 my-7">
            <v-btn
              size="x-large"
              width="350"
              rounded="md"
              density="comfortable"
              prepend-icon="mdi-pencil"
              @click="handleClick"
            >回答する</v-btn>
          </div>
        </template>
      </Button>

      <!-- answers -->
      <AnswerList :answers="answers" :replies="replies"/>

    </v-container>
  </div>
</template>

<script>
import { format } from "date-fns";
import QuestionContent from '../components/QuestionContent.vue'
import Button from "@/components/Button.vue";
import AnswerList from '../components/AnswerList.vue'
import getDocument from '../composables/getDocument'
import getCollection from '../composables/getCollection'
import { useRouter } from 'vue-router';
import getUser from "@/composables/getUser";
export default {
  props:['isbn', 'id'],
  components: { AnswerList, QuestionContent, Button },
  setup(props) {
    const { user } = getUser()

    const { document: question } = getDocument('questions', props.id);
    const { documents: answers } = getCollection('answers', ['questionId', '==', props.id]);
    const { documents: replies } = getCollection('replies', ['questionId', '==', props.id]);
    
    const router = useRouter();

    const createAnswer = () => {
      router.push({
        name: 'AnswerQuestion',
        params:{
          isbn: props.isbn,
          questionId: question.value.id,
        }
      })
    }

    return { question, answers, replies, createAnswer, user }
  }
}
</script>

<style>

</style>