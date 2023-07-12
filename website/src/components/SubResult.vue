<script setup>
import { defineProps } from 'vue'
import DownloadSchema from './DownloadSchema.vue'

const props = defineProps({
  file: {
    required: true
  }
})

function errorsCountFormated(value) {
  return new Intl.NumberFormat().format(value)
}
</script>

<template>
  <div
    class="subresult"
    v-if="
      file.hasErrors ||
      file.hasWarnings ||
      (!file.exists && (file.recommended || file.required))
    "
  >
    <div class="d-flex align-items-baseline">
      <h5 class="mt-4 mb-3">{{ file.file }}</h5>
      &nbsp;
      <download-schema :file="file" />
    </div>

    <div v-if="file.recommended && !file.exists">
      <b-alert variant="warning" show> Missing file. Recommended </b-alert>
    </div>

    <div v-if="file.required && !file.exists">
      <b-alert variant="danger" show>
        <b>Missing</b> file and <b>required</b>
      </b-alert>
    </div>

    <div v-if="file.hasErrors || file.hasWarnings">
      <div v-if="file.languages">
        <div v-for="lang in file.languages" :key="lang.lang">
          <div v-if="file.required && !lang.exists">
            <b-alert variant="danger" show>
              <b>Missing</b> file {{ lang.lang }}/{{ file.file }}
            </b-alert>
          </div>

          <b-alert variant="secondary" show>
            <b class="text-danger">
              {{
                errorsCountFormated(
                  lang.summary.errors.length + lang.summary.nonSchemaErrors.length
                )
              }}
              errors
            </b>
            and
            <b class="text-warning">
              {{ errorsCountFormated(lang.summary.nonSchemaWarnings.length) }}
              warnings
            </b>
            in <a :href="lang.url" target="_blank">{{ lang.url }}</a> .

            <div>
              <b-button
                v-b-toggle="`${lang.lang}/${file.file}/summary`"
                variant="dark"
                size="sm"
                class="mb-2"
                >Show summary</b-button
              >
            </div>
            <b-collapse :id="`${lang.lang}/${file.file}/summary`" class="mt-3">
              <b-alert variant="danger" show v-if="lang.summary.errors.length">
                <h4>Schemas errors summary</h4>
                <ul>
                  <li v-for="item in lang.summary.errors" v-bind:key="item.key">
                    {{ item.message }}

                    <ul>
                      <li v-for="path in item.values" v-bind:key="path.path">
                        <code>{{ path.path }}</code> (x{{ path.count }})
                      </li>
                    </ul>
                  </li>
                </ul>

                <details>
                  <summary>Show errors</summary>
                  <pre><code>{{ lang.errors }}</code></pre>
                </details>
              </b-alert>
              <b-alert
                variant="danger"
                show
                v-if="lang.summary.nonSchemaErrors.length"
              >
                <h4>Non-schemas errors summary</h4>
                <ul>
                  <li
                    v-for="item in lang.summary.nonSchemaErrors"
                    v-bind:key="item.key"
                  >
                    {{ item.message }}
                    <a
                      :href="`https://github.com/MobilityData/gbfs-validator/blob/master/gbfs-validator/otherValidation/README.md#${item.key}`"
                      target="_blank"
                      ><code>{{ item.key }}</code></a
                    >
                    <ul>
                      <li v-for="path in item.values" v-bind:key="path.path">
                        <code>{{ path.path }}</code> (x{{ path.count }})
                      </li>
                    </ul>
                  </li>
                </ul>

                <details>
                  <summary>Show errors</summary>
                  <pre><code>{{ lang.nonSchemaErrors }}</code></pre>
                </details>
              </b-alert>

              <b-alert
                variant="warning"
                show
                v-if="lang.summary.nonSchemaWarnings.length"
              >
                <h4>Non-schemas warnings summary</h4>
                <ul>
                  <li
                    v-for="item in lang.summary.nonSchemaWarnings"
                    v-bind:key="item.key"
                  >
                    {{ item.message }}
                    <a
                      :href="`https://github.com/MobilityData/gbfs-validator/blob/master/gbfs-validator/otherValidation/README.md#${item.key}`"
                      target="_blank"
                      ><code>{{ item.key }}</code></a
                    >
                    <ul>
                      <li v-for="path in item.values" v-bind:key="path.path">
                        <code>{{ path.path }}</code> (x{{ path.count }})
                      </li>
                    </ul>
                  </li>
                </ul>

                <details>
                  <summary>Show warnings</summary>
                  <pre><code>{{ lang.nonSchemaWarnings }}</code></pre>
                </details>
              </b-alert>
            </b-collapse>
          </b-alert>
        </div>
      </div>
      <b-alert v-else variant="danger" show>
        <b>{{ file.errorsCount }} errors</b> in
        <a :href="file.url" target="_blank">{{ file.url }}</a> .
        <pre><code>{{ file.errors }}</code></pre>
      </b-alert>
    </div>
  </div>
  <div v-else>
    <div class="d-flex align-items-baseline">
      <h5 class="mt-4 mb-3">{{ file.file }}</h5>
      &nbsp;
      <download-schema :file="file" />
    </div>

    <b-alert v-if="!file.exists && !file.required" variant="warning" show>
      <b>Missing</b> file but <b>not</b> required
    </b-alert>
    <b-alert v-else variant="success" show> <b>Valid</b> file </b-alert>
  </div>
</template>
