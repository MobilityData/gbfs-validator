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
        Missing file. Required
      </div>
    </div>

    <div v-if="file.hasErrors">
      <div v-if="file.languages">
        <div v-for="lang in file.languages" :key="lang.lang">
          <div v-if="file.required && !lang.exists">
            <div class="alert danger">
            <h4>Missing file {{lang.lang}}/{{file.file}}</h4>
            </div>
          </div>
          <div v-else-if="lang.errors">
            <div class="alert danger">
            <h4>Errors in {{ lang.url }}</h4>
              <pre><code>{{ lang.errors }}</code></pre>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert danger">
        <h4>Errors in {{ file.url }}</h4>
        <pre><code>{{ file.errors }}</code></pre>
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
