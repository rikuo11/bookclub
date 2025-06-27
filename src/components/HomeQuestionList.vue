<template>
  <div class="home-question-list">
    <v-row>
      <v-col cols="12" v-for="question in questions" :key="question.id">
        <v-card>
          <v-card-item>
            <!-- title -->
            <div
              @click="$router.push({ name: 'QuestionDetails', params: { isbn: question.isbn, id: question.id }})"
              class="cursor-pointer text-primary py-2"
            >{{ question.title }}</div>

            <!-- tags -->
            <div class="my-1">
              <v-chip
                v-for="tag in question.tags" :key="tag"
                class="mr-2 my-1"
                color="warning"
                variant="outlined"
                size="small"
                density="comfortable"
                @click="changeTag(tag)"
              >{{ tag }}</v-chip>
            </div>

            <!-- book title -->
            <div class="text-primary text-subtitle-2">
              <v-icon icon="mdi-book-open-variant-outline" color="info" class="mr-1 mb-1"></v-icon>
              <router-link
                :to="{ name: 'BookDetails', params: { isbn: question.isbn }}"
              >{{ question.bookTitle }}</router-link>
            </div>

            <!-- info -->
            <div class="mb-2 mt-1 text-subtitle-2 text-medium-emphasis">
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
  </div>
</template>

<script>
import { format } from "date-fns";
export default {
  props: ['questions'],
  setup(props, context) {
    const formatTimestamp = (date) => {
      return format(date.toDate(), "MM/dd/yyyy");
    }

    const vote = (document) => {
      return document.like.length + -1*document.dislike.length
    }

    const changeTag = (tag) => {
      context.emit('change-tag', tag)
    }

    return { formatTimestamp, vote, changeTag }
  }
}
</script>

<style>

</style>