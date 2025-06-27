<template>
  <div class="show-editor-content pa-2 my-2" >
    <EditorContent :editor="editor"/>
  </div>
</template>

<script>
import { Mathematics } from '@tiptap-pro/extension-mathematics'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import Youtube from '@tiptap/extension-youtube'
import 'katex/dist/katex.min.css'
import { onMounted, onUpdated, ref } from 'vue'
export default {
  components: { EditorContent },
  props: ['content', 'size'],
  setup(props) {
    // tiptap
    const editor = useEditor({
      content: '',
      editorProps: {
        attributes: {
          class: `${props.size}`,
        },
      },
      extensions: [
        StarterKit,
        Mathematics,
        Image,
        Underline,
        Link,
        Youtube.configure({
          controls: false,
          nocookie: true,
        }),
      ],
      editable: false
    });

    Image.configure({
      allowBase64: true,
      inline: true,
    })

    onMounted(() => {
      editor.value.commands.setContent(props.content);
    });

    onUpdated(() => {
      editor.value.commands.setContent(props.content);
    })

    return { editor }
  }

}
</script>

<style>

</style>