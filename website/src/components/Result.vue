<template>
  <div class="result">
    <div v-if="isValidating" class="validating">Validating...</div>
    <div v-if="result.summary">
      <h2>Result</h2>
      <div>
        <div v-if="result.summary.hasErrors" class="alert danger">
          Invalid GBFS
        </div>
        <div v-else class="alert success">
          Valid !
        </div>
      </div>

      <div v-for="file in result.files" :key="file.filename">
        <SubResult :file="file" />
      </div>
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
      type: Object,
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

.alert {
  font-size: 1rem;
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.warning {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeeba;
}

.danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>
