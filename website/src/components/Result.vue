<template>
  <div class="result">
    <div v-if="isValidating" class="validating">Validating...</div>
    <div v-else>
      <div v-if="result.summary">
        <h2>Result</h2>
        <div>
          <div v-if="result.summary.hasErrors" class="alert danger">Invalid GBFS</div>
          <div v-else class="alert success">Valid !</div>
        </div>

        <div v-for="file in result.files" :key="file.filename">
          <SubResult :file="file"/>
        </div>
      </div>
      <div v-else-if="result" class="alert danger">{{ result }}</div>
    </div>
  </div>
</template>

<script>
import SubResult from './SubResult'

export default {
  name: 'Result',
  props: {
    isValidating: {
      type: Boolean,
      required: true
    },
    result: {
      type: [Object, Error, Boolean],
      required: true
    }
  },
  components: {
    SubResult
  }
}
</script>

<style>
.validating {
  text-align: center;
  margin: 50px 0;
  font-size: 2rem;
}
</style>
