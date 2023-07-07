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

function errorsSummary(errors) {
  const summary = {}
  for (const error of errors) {
    let instancePath = error.instancePath
      .replace(/\/\d+\//g, '/#/')
      .replace(/\/\d+$/g, '/#')

    if (!summary[instancePath]) {
      summary[instancePath] = new Set()
    }

    let message = error.message

    if (error.params && error.params.additionalProperty) {
      message += `: ${error.params.additionalProperty}`
    }

    summary[instancePath].add(message)
  }

  return summary
}

function otherSummary(others) {
  let summary = {}
  for (const other of others) {
    let key = other.key

    if (!summary[key]) {
      summary[key] = {}
    }

    if (!summary[key][other.path]) {
      summary[key][other.path] = { count: 1, message: other.message }
    } else {
      summary[key][other.path].count++
    }
  }

  summary = Object.entries(summary).map(([key, value]) => {
    let values = Object.entries(value).map(([path, { count, message }]) => {
      return {
        path,
        message,
        count
      }
    })

    return {
      key,
      message: values[0].message,
      values
    }
  })
  return summary
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

          <b-alert variant="danger" show v-if="lang.errors">
            <div>
              <b>{{ errorsCountFormated(lang.errors.length) }} schema errors</b>
              in <a :href="lang.url" target="_blank">{{ lang.url }}</a>
            </div>
            <div>
              <b-button
                v-b-toggle="`${lang.lang}/${file.file}/errorsSummary`"
                variant="danger"
                size="sm"
                class="mb-2"
                >Show errors summary</b-button
              >
            </div>
            <b-collapse
              :id="`${lang.lang}/${file.file}/errorsSummary`"
              class="mt-3"
            >
              <ul>
                <li
                  v-for="value in Object.entries(errorsSummary(lang.errors))"
                  v-bind:key="value[0]"
                >
                  #{{ value[0] }}
                  <span v-if="value[1].length === 1">
                    {{ value[1][0] }}
                  </span>
                  <span v-else>
                    <ul>
                      <li v-for="message in value[1]" v-bind:key="message">
                        {{ message }}
                      </li>
                    </ul>
                  </span>
                </li>
              </ul>
            </b-collapse>
            <div>
              <b-button
                v-b-toggle="`${lang.lang}/${file.file}/errors`"
                variant="danger"
                size="sm"
                >Show errors</b-button
              >
            </div>
            <b-collapse :id="`${lang.lang}/${file.file}/errors`" class="mt-3">
              <pre><code>{{ lang.errors }}</code></pre>
            </b-collapse>
          </b-alert>

          <b-alert
            variant="danger"
            show
            v-if="lang.otherErrors && lang.otherErrors.length"
          >
            <div>
              <b
                >{{ errorsCountFormated(lang.otherErrors.length) }} other
                errors</b
              >
              in <a :href="lang.url" target="_blank">{{ lang.url }}</a>
            </div>
            <div>
              <b-button
                v-b-toggle="`${lang.lang}/${file.file}/otherErrorsSummary`"
                variant="danger"
                size="sm"
                class="mb-2"
                >Show other errors summary</b-button
              >
            </div>
            <b-collapse
              :id="`${lang.lang}/${file.file}/otherErrorsSummary`"
              class="mt-3"
            >
              <ul>
                <li
                  v-for="item in otherSummary(lang.otherErrors)"
                  v-bind:key="item.key"
                >
                  {{ item.message }}
                  <a
                    :href="`https://github.com/MobilityData/gbfs-validator/blob/master/gbfs-validator/otherValidation/README.md#${item.key}`"
                    target="_blank"
                    >{{ item.key }}</a
                  >
                  <ul>
                    <li v-for="path in item.values" v-bind:key="path.path">
                      {{ path.path }} (x{{ path.count }})
                    </li>
                  </ul>
                </li>
              </ul>
            </b-collapse>

            <div>
              <b-button
                v-b-toggle="`${lang.lang}/${file.file}/otherErrors`"
                variant="danger"
                size="sm"
                >Show other errors</b-button
              >
            </div>
            <b-collapse
              :id="`${lang.lang}/${file.file}/otherErrors`"
              class="mt-3"
            >
              <pre><code>{{ lang.otherErrors }}</code></pre>
            </b-collapse>
          </b-alert>

          <b-alert
            variant="warning"
            show
            v-if="lang.otherWarnings && lang.otherWarnings.length"
          >
            <div>
              <b
                >{{ errorsCountFormated(lang.otherWarnings.length) }} other
                warnings</b
              >
              in <a :href="lang.url" target="_blank">{{ lang.url }}</a>
            </div>
            <div>
              <b-button
                v-b-toggle="`${lang.lang}/${file.file}/otherWarningsSummary`"
                variant="warning"
                size="sm"
                class="mb-2"
                >Show other warnings summary</b-button
              >
            </div>
            <b-collapse
              :id="`${lang.lang}/${file.file}/otherWarningsSummary`"
              class="mt-3"
            >
              <ul>
                <li
                  v-for="item in otherSummary(lang.otherWarnings)"
                  v-bind:key="item.key"
                >
                  {{ item.message }}
                  <a
                    :href="`https://github.com/MobilityData/gbfs-validator/blob/master/gbfs-validator/otherValidation/README.md#${item.key}`"
                    target="_blank"
                    >{{ item.key }}</a
                  >
                  <ul>
                    <li v-for="path in item.values" v-bind:key="path.path">
                      {{ path.path }} (x{{ path.count }})
                    </li>
                  </ul>
                </li>
              </ul>
            </b-collapse>
            <div>
              <b-button
                v-b-toggle="`${lang.lang}/${file.file}/otherWarnings`"
                variant="warning"
                size="sm"
                >Show other warnings</b-button
              >
            </div>
            <b-collapse
              :id="`${lang.lang}/${file.file}/otherWarnings`"
              class="mt-3"
            >
              <pre><code>{{ lang.otherWarnings }}</code></pre>
            </b-collapse>
          </b-alert>
        </div>
      </div>
      <b-alert v-else variant="danger" show>
        <b>{{ file.errorsCount }} errors</b> in {{ file.url }}
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
