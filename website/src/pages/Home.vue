<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const state = reactive({
  url: ''
})

onMounted(() => {
  // When specifying ?url=https://example.com/gbfs.json, start
  // directly a validation
  const url_query_param = new URL(location.href).searchParams.get('url')

  if (url_query_param) {
    state.url = url_query_param

    router.push({ name: 'validator', query: { url: state.url } })
  }
})
</script>

<template>
  <div>
    <b-row class="justify-content-around">
      <b-col cols="8">
        <b-form-input
          type="url"
          v-model="state.url"
          placeholder="https://exemple.com/gbfs.json"
          size="lg"
        ></b-form-input>
      </b-col>
    </b-row>
    <b-row class="mt-3 justify-content-around">
      <b-col class="flex-grow-0 text-center">
        <b-button
          :to="{ name: 'validator', query: { url: state.url } }"
          variant="success"
          size="lg"
          style="white-space: nowrap"
          >Validate me !</b-button
        >
        or
        <b-link :to="{ name: 'visualization', query: { url: state.url } }"
          >visualization</b-link
        >
      </b-col>
    </b-row>
  </div>
</template>
