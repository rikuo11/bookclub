<template>
  <div class="notification-dialog">
    <v-list-item @click="dialog = true">
      <template v-slot:prepend>
        <v-icon icon="mdi-bell-ring"></v-icon>
      </template>
      <v-list-item-title>通知</v-list-item-title> 
      <template v-slot:append>
        <v-badge
          color="red-accent-4"
          :content="notificationNum"
          v-model="badge"
          inline
        ></v-badge>
      </template>
    </v-list-item>

    <!-- dialog -->
     <v-dialog
      v-model="dialog"
      width="auto"
     >
      <v-card max-width="400">
        <v-card-item>
          <div>
            <v-icon icon="mdi-bell-ring" class="mr-3 mb-1" color="primary"></v-icon>
            <span class="text-h6">通知</span>
          </div>
        </v-card-item>
      </v-card>
     </v-dialog>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue';

export default {
  props:['notifications'],
  setup(props) {
    const notificationNum = computed(() => {
      let num = 0
      props.notifications.forEach(doc => {
        if(!doc.isNotified) {
          num += 1
        }
      });
      return num
    })

    const badge = ref(false)

    watch(
      notificationNum, 
      () => {
        if(notificationNum.value == 0) {
          badge.value = false
        } else {
          badge.value =  true
        }
      },
      { immediate: true }
    )

    // dialog
    const dialog = ref(false)

    return { notificationNum, badge, dialog }
  }
}
</script>

<style>

</style>