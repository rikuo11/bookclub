<template>
  <div class="question-list">
    <v-row v-if="questions.length">
      <v-col cols="12" v-for="question in questions" :key="question.id">
        <v-card class="d-flex">
          <div class="align-self-center ml-4">
            <v-avatar color="warning" rounded="sm" size="x-small">
              <span class="text-subtitle-2">Q</span>
            </v-avatar>
          </div>
          <v-card-item style="max-width:90%;">
            <!-- title -->
            <div
              @click="$router.push({ name: 'QuestionDetails', params: { isbn: question.isbn, id: question.id }})"
              class="cursor-pointer text-primary py-2"
            >{{ question.title }}</div>

            <!-- info -->
            <div class="mb-2 text-subtitle-2 text-medium-emphasis">
              <v-icon icon="mdi-comment-processing-outline" color="info" class="mr-1"></v-icon>
              <span class="mr-2">{{ question.numberOfAnswers }}</span>
              <v-icon icon="mdi-thumb-up-outline" color="info" class="mr-1 mb-1"></v-icon>
              <span class="mr-2">{{ vote(question) }}</span>
              <router-link
                class="mr-1 text-primary"
                :to="{ name: 'UserInfo', params: { uid: question.questioner }}"
              >{{ question.displayName }}
              </router-link>
              <span>{{ formatTimestamp(question.createAt) }}</span>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <!-- no question -->
     <div v-if="!questions.length" class="mb-16">
        <p class="text-medium-emphasis">質問がありません。</p>
     </div>
  </div>
</template>

<script>
import { format } from "date-fns";
export default {
  props: ['questions'],
  setup(props) {
    const formatTimestamp = (date) => {
      return format(date.toDate(), "MM/dd/yyyy");
    }

    const vote = (document) => {
      return document.like.length + -1*document.dislike.length
    }

    return { formatTimestamp, vote }
  }
}
</script>

<style>

</style>