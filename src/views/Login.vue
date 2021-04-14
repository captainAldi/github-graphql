<template>
  <div>
    <h1>Enter your Token</h1>
    <br>
    <v-text-field
      label="Github Token"
      required
      v-model="dataToken"
    ></v-text-field>

    <v-btn
      @click="login"
    >
      Login
    </v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      dataToken: ''
    }
  },
  methods: {
    ...mapActions({
      setAlert  : 'alert/set',
      setDialog : 'dialog/set',
      setAuth   : 'auth/set'
    }),

    async login() {
      await this.setAuth(this.dataToken)
      await localStorage.setItem('token', this.dataToken)
      this.$router.push('/')
    }
  }
}
</script>

<style>

</style>