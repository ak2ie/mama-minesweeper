<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6"> id: {{ msid }} </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export type DataType = {
  msid: string
}

export default Vue.extend({
  data(): DataType {
    return {
      msid: '',
    }
  },
  head() {
    return {
      title: 'マインスイーパ',
    }
  },
  mounted() {},
  created() {
    this.msid = this.$route.path.replace('/games/', '')
    if (this.msid.match(/[0-9a-zA-Z]+/)) {
      axios.get(
        `https://asia-northeast1-mama-ms.cloudfunctions.net/api/ms/${this.msid}`
      )
    }
  },
})
</script>
