<template>
  <div class="content">
    <input type="url" v-model="url">
    <button @click="valid">Valid !</button>
    <Result :isValidating="isValidating" :result="result" />
  </div>
</template>

<script>
import GBFS from 'gbfs-validator'
import Result from './Result'

export default {
  name: 'Validator',
  components: {
    Result
  },
  data () {
    return {
      result: {},
      isValidating: false,
      url: 'https://api.nextbike.net/maps/gbfs/v1/nextbike_la/gbfs.json'
    }
  },
  methods: {
    valid () {
      this.result = {}
      this.isValidating = true
      const gbfs = new GBFS(this.url)

      gbfs.validation()
        .then((result) => {
          this.isValidating = false
          this.result = result
        })
    }
  }
}
</script>

<style>
.content {
  margin: 0 auto;
  max-width: 1000px;
}
</style>
