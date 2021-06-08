<template>
  <div>
    <b-row>
      <b-col>
        <b-form-input type="url" v-model="url" placeholder="https://exemple.com/gbfs.com"></b-form-input>
      </b-col>
      <b-col class="flex-grow-0">
        <b-button @click="valid" variant="success" style="white-space: nowrap;">Valid me !</b-button>
      </b-col>
    </b-row>

    <b-card class="mt-4">
      <b-tabs content-class="mt-3">
        <b-tab title="Options" active>
          <b-form-group
            id="input-group-version"
            label="Version"
            label-for="input-version"
          >
            <b-form-select id="input-version" :options="versions" v-model="options.version"></b-form-select>
          </b-form-group>

          <b-form-group
            id="input-group-requirement"
            label="Allows you to force files requirements"
            label-for="input-requirement"
            class="mt-3"
          >
            <b-form-checkbox id="input-freefloating" v-model="options.freefloating">&nbsp;Free-floating</b-form-checkbox>
            <b-form-checkbox id="input-docked" v-model="options.docked">&nbsp;Docked</b-form-checkbox>
          </b-form-group>
        </b-tab>
      </b-tabs>
    </b-card>

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
      },
      versions: [
        { value: null, text: 'auto-detection' },
        { value: '2.2', text: 'v2.2' },
        { value: '2.1', text: 'v2.1' },
        { value: '2.0', text: 'v2.0' },
        { value: '1.1', text: 'v1.1' },
        { value: '1.0', text: 'v1.0' }
      ]
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
