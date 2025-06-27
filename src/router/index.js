import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchResultView from '../views/SearchResultView.vue'
import AuthorDetailsView from '../views/AuthorDetailsView.vue'
import BookDetailsView from '../views/BookDetailsView.vue'
import QuestionDetailsView from '../views/QuestionDetailsView.vue'
import AskQuestionView from '../views/AskQuestionView.vue'
import AnswerQuestionView from '../views/AnswerQuestionView.vue'
import EditQuestionView from '../views/EditQuestionView.vue'
import EditAnswerView from '../views/EditAnswerView.vue'
import UserInfoView from '../views/UserInfoView.vue'
import TestView from '@/views/TestView.vue'
import { auth } from '@/firebase/config'

const requireAuth = (to, from, next) => {
  let user = auth.currentUser
  if(!user) {
    next({ name: 'Home' });
  } else {
    next();
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/search',
    name: 'SearchResult',
    component: SearchResultView,
    props: true,
  },
  {
    path: '/author/:author',
    name: 'AuthorDetails',
    component: AuthorDetailsView,
    props: true
  },
  {
    path: '/books/:isbn',
    name: 'BookDetails',
    component: BookDetailsView,
    props: true
  },
  {
    path: '/questions/:isbn/:id',
    name: 'QuestionDetails',
    component: QuestionDetailsView,
    props: true
  },
  {
    path:'/questions/ask/:isbn/:bookTitle',
    name: 'AskQuestion',
    component: AskQuestionView,
    props: true,
    beforeEnter: requireAuth
  },
  {
    path:'/questions/answer/:isbn/:questionId',
    name: 'AnswerQuestion',
    component: AnswerQuestionView,
    props: true,
    beforeEnter: requireAuth
  },
  {
    path:'/questions/edit/:isbn/:questionId',
    name: 'EditQuestion',
    component: EditQuestionView,
    props: true,
    beforeEnter: requireAuth
  },
  {
    path:'/answers/edit/:isbn/:answerId',
    name: 'EditAnswer',
    component: EditAnswerView,
    props: true,
    beforeEnter: requireAuth
  },
  {
    path:'/users/:uid',
    name: 'UserInfo',
    component: UserInfoView,
    props: true
  },
  {
    path:'/test',
    name: 'Test',
    component: TestView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return { top: 0 }
  }
})

export default router
