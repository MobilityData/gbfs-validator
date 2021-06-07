<template>
  <div class="result" v-if="file.hasErrors || (!file.exists && (file.recommanded || file.required))">
    <h3>{{ file.file }}</h3>

    <div v-if="file.recommanded && !file.exists">
      <div class="alert warning">
        Missing file. Recommanded
      </div>
    </div>

    <div v-if="file.required && !file.exists">
      <div class="alert danger">
        <b>Missing</b> file and <b>required</b>
      </div>
    </div>

    <div v-if="file.hasErrors">
      <div v-if="file.languages">
        <div v-for="lang in file.languages" :key="lang.lang">
          <div v-if="file.required && !lang.exists">
            <div class="alert danger">
              <b>Missing</b> file {{lang.lang}}/{{file.file}}
            </div>
          </div>
          <div v-else-if="lang.errors">
            <div class="alert danger">
              <b>{{ file.errorsCount }} errors</b> in {{ lang.url }}
              <pre><code>{{ lang.errors }}</code></pre>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert danger">
        <b>{{ file.errorsCount }} errors</b> in {{ file.url }}
        <pre><code>{{ file.errors }}</code></pre>
      </div>
    </div>
  </div>
  <div v-else>
    <h3>{{ file.file }}</h3>
    <div class="alert success">
      <div v-if="!file.exists && !file.required">
        <b>Missing</b> file but <b>not</b> required
      </div>
      <div v-else>
        <b>Valid</b> file
      </div>
    </div>
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
