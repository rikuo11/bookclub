<template>
  <div class="user-info" v-if="user">
    <!-- header -->
    <div class="bg-grey-lighten-4">
      <v-container class="pt-9 pb-7">
        <div class="d-flex ga-6">
          <v-avatar size="80">
            <v-img :src="user.photoURL"></v-img>
          </v-avatar>
          <div class="align-self-center">
            <div class="text-h6 font-weight-bold mb-2">{{ user.displayName }}</div>
            <div class="text-subtitle-1 text-medium-emphasis">
              <v-icon icon="mdi-cake-variant-outline mb-2 mr-1"></v-icon>
              <span class="mt-1">{{ formatTimestamp(user.createAt) }}</span> 
            </div>
          </div>
          <div class="ml-auto mr-1" v-if="user.uid == viewer?.uid">
            <EditProfile :user="user"/>
          </div>
        </div>
        <div class="mt-7 pa-1">
          <div v-if="!user.profile">
            <span class="text-medium-emphasis">自己紹介なし</span>
          </div>
          <div v-if="user.profile">
            <span>{{ user.profile }}</span>
          </div>
        </div>
      </v-container>
    </div>

    <v-divider></v-divider>

    <!-- nav bar -->
    <v-container>
      <v-tabs v-model="tab_active">
        <v-tab @click="changeTab('question')">質問</v-tab>
        <v-tab @click="changeTab('answer')">回答</v-tab>
        <v-tab @click="changeTab('follow')">
          <v-icon icon="mdi-bookmark-check-outline"></v-icon>
          フォロー
        </v-tab>
      </v-tabs>
    </v-container>

    <!-- contents -->
    <v-container class="mt-2">
      <div v-if="tab == 1">
        <ListItems :documents="questions" :uid="uid" tab="question"/>
      </div>
      <div v-if="tab == 2">
        <ListItems :documents="answers" :uid="uid" tab="answer"/>
      </div>
      <div v-if="tab == 3">
        <ListItems :documents="followdDocuments" :uid="uid" tab="follow"/>
      </div>
    </v-container>
  </div>
</template>

<script>
import { format } from "date-fns";
import getDocument from '@/composables/getDocument';
import getUser from "@/composables/getUser";
import { computed, onMounted, ref, watch } from 'vue';
import getCollection from '@/composables/getCollection';
import QuestionList from '@/components/QuestionList.vue';
import EditProfile from "@/components/EditProfile.vue";
import { useRoute, useRouter } from "vue-router";
import ListItems from '../components/ListItems.vue'
export default {
  props:['uid'],
  components: { QuestionList, ListItems, EditProfile },
  setup(props, context) {
    const tab = ref(1)
    const route = useRoute();
    const router = useRouter();
    const tab_active = ref(0)

    const { document: user } = getDocument('users', props.uid);
    const { user: viewer } = getUser()
    const { documents: questions } = getCollection('questions', ['questioner', '==', props.uid]);
    const { documents: answers } = getCollection('answers', ['answerer', '==', props.uid]);
    const { documents: followedQuestions } = getCollection('questions', ['followers', 'array-contains', props.uid]);
    const { documents: followedAnswers } = getCollection('answers', ['followers', 'array-contains', props.uid]);

    watch(() => route.params.uid, () => {
      context.emit('key-change');
    })

    watch(() => route.query.tab, () => {
      switch (route.query.tab) {
        case 'question':
          tab.value = 1
          tab_active.value = 0
          break;
        case 'answer':
          tab.value = 2
          tab_active.value = 1
          break;
        case 'follow':
          tab.value = 3
          tab_active.value = 2
          break;
        default:
          tab.value = 1
          tab_active.value = 0
          break;
      }
    });

    const followdDocuments = ref([])

    watch([ followedQuestions, followedAnswers ], () => {
      followdDocuments.value = followedQuestions.value.concat(followedAnswers.value)
      .sort((doc1, doc2) => {
        return doc2.createAt - doc1.createAt
      })
    })

    onMounted(() => {
      switch (route.query.tab) {
        case 'question':
          tab.value = 1
          tab_active.value = 0
          break;
        case 'answer':
          tab.value = 2
          tab_active.value = 1
          break;
        case 'follow':
          tab.value = 3
          tab_active.value = 2
          break;
        default:
          tab.value = 1
          tab_active.value = 0
          break;
      }
    });

    const changeTab = (tab) => {
      router.push({
        name: 'UserInfo',
        params: { uid: props.uid },
        query: { page: 1, tab: tab } 
      })
    }

    const formatTimestamp = (date) => {
      return format(date.toDate(), "MM/dd/yyyy");
    }

    return { user, viewer, tab, formatTimestamp, questions, answers, changeTab, tab_active, followdDocuments }
  }
}
</script>

<style>

</style>