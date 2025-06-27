<template>
  <div v-if="question" class="edit-question">
    <v-container>
      <div class="text-h6 font-weight-bold mb-2">質問編集</div>
      <v-card>
        <v-form @submit.prevent="handleSubmit" @keydown.enter="$event.preventDefault()">
          <v-card-text>
            <div class="text-subtitle-1 font-weight-bold my-2">タイトル</div>
            <v-text-field
              variant="outlined"
              :rules="titleRules"
              v-model="title"
            ></v-text-field>
            <div class="text-subtitle-1 font-weight-bold my-2">タグ</div>
            <div class="my-2">
              <v-chip
                v-for="tag in tags" :key="tag"
                class="mr-2"
                color="warning"
                variant="outlined"
                closable
                @click:close="deleteTag(tag)"
              >{{ tag }}</v-chip>
            </div>
            <v-text-field
              variant="outlined"
              v-model="tag"
              append-inner-icon="mdi-plus-circle-outline"
              @click:append-inner="addTag"
              @keydown.enter="addTag"
            ></v-text-field>
            <div class="text-subtitle-1 font-weight-bold my-2">質問内容</div>
            <Editor @emit-content="setContent" size="editor-md" :text="question.content"/>
          </v-card-text>
          <v-card-actions class="d-flex justify-end">
            <v-btn @click="$router.go(-1)">キャンセル</v-btn>
            <v-btn type="submit" :loading="isPending">編集する</v-btn>
          </v-card-actions>
          <div v-if="error" class="text-error my-2 pa-2 d-flex justify-end">
            質問の編集に失敗しました。
          </div>
        </v-form>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import useDocument from '../composables/useDocument'
import getDocument from '../composables/getDocument'
import useStorage from "../composables/useStorage";
import { ref, watch } from 'vue'
import { serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import Editor from '../components/Editor.vue'
export default {
  props:['isbn', 'questionId'],
  components: { Editor },
  setup(props) {
    const router = useRouter();

    const { error, isPending, updateDocument } = useDocument('questions', props.questionId)
    const { document: question } = getDocument('questions', props.questionId)
    const { uploadImage, deleteImage } = useStorage();

    watch(question, () => {
      title.value = question.value.title
      tags.value = question.value.tags
    });

    // title
    const title = ref('');
    const titleRules = ref([
      value => {
        if(value) return true;
        return 'タイトルを入力してください'
      }
    ]);

    // tag
    const tag = ref('')
    const tags = ref([])

    const addTag = () => {
      let text = tag.value.replace(/\s+/g, "");
      if(text && !tags.value.includes(text)) {
        tags.value.push(text);
        tag.value = ''
      } else {
        tag.value = ''
      }
    }

    const deleteTag = (text) => {
      tags.value = tags.value.filter((tag) => {
        return tag != text
      })
    }

    // content
    const content = ref('');
    const NewFilePaths = ref([]);
    const contentRules = ref([
      value => {
        if(value) return true;
        return '質問内容を入力してください'
      }
    ]);

    const setContent = (text) => {
      content.value = text;
    }

    // submit
    const handleSubmit = async () => {

      if (title.value && content.value) {
        // upload Images
        let parser = new DOMParser();
        let dom = parser.parseFromString(content.value, "text/html");
        let OldImgTags = dom.getElementsByTagName('img');

        for(const element of Array.from(OldImgTags)){
          if(element.src.startsWith('data:image')){
            // convert base64 to Blob
            // send Blob to firebase storage
            // change the image source
            element.title = Math.floor(Math.random()*100) + element.title;
            element.src = await uploadImage('questions', props.questionId, base64toBlob(element.src), element.title);
          }
        }

        content.value = dom.getElementsByTagName('body')[0].innerHTML;

        // deleteImage
        let NewImgTags = dom.getElementsByTagName('img');

        for(const element of Array.from(NewImgTags)){
          if(element.src.startsWith('https://firebasestorage')){
       
            NewFilePaths.value.push(element.title);
          }
        }

        question.value.filePaths.forEach(fileName => {
          if(!NewFilePaths.value.includes(fileName)) {
            deleteImage('questions', props.questionId, fileName);
          }
        });

        // update question
        const doc = {
          title: title.value,
          content: content.value,
          updateAt: serverTimestamp(),
          filePaths: NewFilePaths.value,
          tags: tags.value
        }

        const ref = await updateDocument(doc)

        if(!error.value) {
          router.push({ name: 'QuestionDetails', params: { isbn: props.isbn, id: props.questionId }})
        }
      }
    }

    const base64toBlob = (base64) => {
    const bin = atob(base64.replace(/^.*,/, ""));
    const buffer = new Uint8Array(bin.length).map((_, i) => bin.charCodeAt(i));
      try {
        return new Blob([buffer.buffer], {
          type: "image/jpeg",
        });
      } catch (e) {
        return false;
      }
    }
    

    return { title, content, handleSubmit, titleRules, contentRules, error, isPending, question, setContent, tag, tags, addTag, deleteTag }
  }
}
</script>

<style>

</style>