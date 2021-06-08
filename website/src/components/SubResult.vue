<template>
  <div class="result" v-if="file.hasErrors || (!file.exists && (file.recommanded || file.required))">
    <h3>{{ file.file }}</h3>

    <div v-if="file.recommanded && !file.exists">
      <b-alert variant="warning" show>
        Missing file. Recommanded
      </b-alert>
    </div>

    <div v-if="file.required && !file.exists">
      <b-alert variant="danger" show>
        <b>Missing</b> file and <b>required</b>
      </b-alert>
    </div>

    <div v-if="file.hasErrors">
      <div v-if="file.languages">
        <div v-for="lang in file.languages" :key="lang.lang">
          <div v-if="file.required && !lang.exists">
            <b-alert variant="danger" show>
              <b>Missing</b> file {{lang.lang}}/{{file.file}}
            </b-alert>
          </div>
          <div v-else-if="lang.errors">
            <b-alert variant="danger" show>
              <b>{{ file.errorsCount }} errors</b> in {{ lang.url }}
              <pre><code>{{ lang.errors }}</code></pre>
            </b-alert>
          </div>
        </div>
      </div>
      <b-alert v-else variant="danger" show>
        <b>{{ file.errorsCount }} errors</b> in {{ file.url }}
        <pre><code>{{ file.errors }}</code></pre>
      </b-alert>
    </div>
  </div>
  <div v-else>
    <h3>{{ file.file }}</h3>
    <b-alert variant="success" show>
      <div v-if="!file.exists && !file.required">
        <b>Missing</b> file but <b>not</b> required
      </div>
      <div v-else>
        <b>Valid</b> file
      </div>
    </b-alert>
  </div>
</template>

<script>
export default {
  name: 'SubResult',
  props: {
    file: {
      required: true
    }
  }
}
</script>
