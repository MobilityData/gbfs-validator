<template>
  <div class="subresult" v-if="file.hasErrors || (!file.exists && (file.recommanded || file.required))">
    <h5 class="mt-4 mb-3">{{ file.file }}</h5>

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

            <a v-if="file.schema" download @click="jsonAsBlob(file.schema, `${file.file}-schema.json`)" class="btn btn-primary btn-sm mb-2">Download schema</a>
             <a v-else-if="lang.schema" download @click="jsonAsBlob(lang.schema, `${file.file}-${lang.lang}-schema.json`)" class="btn btn-primary btn-sm mb-2">Download schema</a>

          <div v-if="file.required && !lang.exists">
            <b-alert variant="danger" show>
              <b>Missing</b> file {{lang.lang}}/{{file.file}}
            </b-alert>
          </div>
          <div v-else-if="lang.errors">
            <b-alert variant="danger" show>
              <div>
                <b-button v-b-toggle="`${lang.lang}/${file.file}`" variant="danger" size="sm">Show errors</b-button>
                &nbsp;<b>{{ file.errorsCount | formatNumber }} errors</b> in {{ lang.url }}
              </div>
              <b-collapse :id="`${lang.lang}/${file.file}`" class="mt-3">
                <pre><code>{{ lang.errors }}</code></pre>
              </b-collapse>
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
    <h5 class="mt-4 mb-3">{{ file.file }}</h5>
      
    <a v-if="file.schema" download @click="jsonAsBlob(file.schema, `${file.file}-schema.json`)" class="btn btn-primary btn-sm mb-2">Download schema</a>
    <a v-else-if="file.languages && file.languages[0] && file.languages[0].schema" download @click="jsonAsBlob(file.languages[0].schema, `${file.file}-schema.json`)" class="btn btn-primary btn-sm mb-2">Download schema</a>

    <b-alert v-if="!file.exists && !file.required" variant="warning" show>
      <b>Missing</b> file but <b>not</b> required
    </b-alert>
    <b-alert v-else variant="success" show>
      <b>Valid</b> file
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
  },
  methods: {
    jsonAsBlob(data, fileName) {
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.style = 'display: none'

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      })
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName
      a.click()

      window.URL.revokeObjectURL(url)
    }
  }
}
</script>
