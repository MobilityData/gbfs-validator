<template>
  <div class="result">
    <div v-if="isValidating" class="validating">Validating...</div>
    <div v-else>
      <div v-if="result.summary">
        <h2>Result</h2>

        <div v-if="result.summary.versionUnimplemented" class="alert warning">
          Sorry, this version is not yet implemented or not detectable !
        </div>
        <div v-else>
          <div class="alert info">
            Detected version <b>{{ result.summary.version.detected }} </b> and validate with <a :href="`https://github.com/NABSA/gbfs/blob/v${result.summary.version.validated}/gbfs.md`"><b>{{ result.summary.version.validated}}</b></a>
          </div>

          <div>
            <div v-if="result.summary.hasErrors" class="alert danger">
              Invalid GBFS feed <br>
              <b>{{ result.summary.errorsCount }} errors</b>
            </div>
            <div v-else class="alert success">Valid !</div>
          </div>

          <div v-for="file in result.files" :key="file.filename">
            <SubResult :file="file" />
          </div>
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

<style scoped>
.validating {
  text-align: center;
  margin: 50px 0;
  font-size: 2rem;
}

.info {
  margin: 30px 0;
}
</style>
