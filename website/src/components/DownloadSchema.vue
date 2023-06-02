<script setup>
import { defineProps } from 'vue'
import { BIconDownload } from 'bootstrap-vue'

const props = defineProps(['file'])

function jsonAsBlob(data, fileName) {
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
</script>

<template>
  <div>
    <a
      v-if="file.schema"
      href="#"
      @click.prevent="jsonAsBlob(file.schema, `${file.file}-schema.json`)"
      v-b-tooltip.hover
      title="Download the validation schema"
    >
      <b-icon-download />
    </a>
    <a
      v-else-if="
        file.languages && file.languages[0] && file.languages[0].schema
      "
      @click.prevent="
        jsonAsBlob(file.languages[0].schema, `${file.file}-schema.json`)
      "
      href="#"
      v-b-tooltip.hover
      title="Download the validation schema"
    >
      <b-icon-download />
    </a>
  </div>
</template>
