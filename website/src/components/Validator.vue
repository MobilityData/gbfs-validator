<template>
  <div class="content">
    <div class="input-bar">
      <input type="url" v-model="url" placeholder="https://exemple.com/gbfs.com" class="url-input">
      <button @click="valid" class="button">Valid me !</button>
    </div>

    <Result :isValidating="isValidating" :result="result"/>
  </div>
</template>

<script>
import Result from './Result'

export default {
  name: 'Validator',
  components: {
    Result
  },
  data() {
    return {
      result: false,
      isValidating: false,
      url: ''
    }
  },
  methods: {
    valid() {
      this.result = false
      this.isValidating = true

      fetch('/.netlify/functions/validator', {
        method: 'POST',
        body: this.url
      })
        .then(resp => resp.json())
        .then(result => {
          this.isValidating = false
          this.result = result
        })
        .catch(result => {
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
  width: 100%;
  max-width: 1000px;
  flex-grow: 1;
}

.input-bar {
  display: flex;
}

.button {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  padding: 6px 12px;
  padding: 0.375rem 0.75rem;
  font-size: 16px;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
    border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}

.url-input {
  width: 100%;
  padding: 0.375rem 0.75rem;
  margin-right: 10px;
  font-size: 1rem;
  line-height: 1.5;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
</style>
