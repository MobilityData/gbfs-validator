<template>
  <div class="content">
    <div class="input-bar">
      <input type="url" v-model="url" placeholder="https://exemple.com/gbfs.com" class="url-input">
      <button @click="valid" class="button">Valid me !</button>
    </div>

    <div class="options alert info">
      <h3>Options</h3>
      <p>Version</p>
      <select name="version" id="version" v-model="options.version">
        <option :value="null" selected>auto-detection</option>
        <option value="2.2">2.2</option>
        <option value="2.1">2.1</option>
        <option value="2.0">2.0</option>
        <option value="1.0">1.0</option>
      </select>
      <p>Allows you to force files requirements.</p>
      <label for="freefloating">
        <input type="checkbox" name="freefloating" id="freefloating" v-model="options.freefloating">&nbsp;Free-floating
      </label>
      <label for="docked">
        <input type="checkbox" name="docked" id="docked" v-model="options.docked">&nbsp;Docked
      </label>
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
      url: '',
      options: {
        freefloating: false,
        docked: false,
        version: null
      }
    }
  },
  methods: {
    valid() {
      this.result = false
      this.isValidating = true

      fetch('/.netlify/functions/validator', {
        method: 'POST',
        body: JSON.stringify({
          url: this.url,
          options: this.options
        })
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
  margin-bottom: 10px;
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

.options h3 {
  font-weight: bold;
  font-size: 1.5em;
  margin: 10px 0;
}
</style>
