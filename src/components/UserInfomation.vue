<template>
  <div v-if="user" class="user-info d-flex ga-3 align-center">
    <v-avatar >
      <v-img
        :src="user.photoURL"
      ></v-img>
    </v-avatar>
    
    <div>
      <router-link
        :to="{ name: 'UserInfo', params: { uid: user.uid }}"
      >
        {{ user.displayName }}
      </router-link>

      <div>
        <slot name="date"></slot>
      </div>
    </div>

    
  </div>
  
</template>

<script>
import getDocument from '../composables/getDocument'
export default {
  props: ['user'],
  setup(props) {
    const { error, document: user } = getDocument('users', props.user);

    return { user }
  }
}
</script>

<style>

</style>