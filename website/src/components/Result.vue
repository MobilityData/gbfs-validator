<script setup>
import { computed, defineProps } from 'vue'
import SubResult from './SubResult.vue'

const props = defineProps({
  isValidating: {
    type: Boolean,
    required: true
  },
  result: {
    type: [Object, Error, Boolean],
    required: true
  }
})

const errorsCountFormated = computed(() => {
  return new Intl.NumberFormat().format(props.result.summary.errorsCount)
})
</script>

<template>
  <div class="result">
    <div v-if="isValidating" class="validating">Validating...</div>
    <div v-else>
      <div v-if="result.summary">
        <h3 class="mt-4 mb-4">Result</h3>

        <b-alert v-if="result.summary.versionUnimplemented" variant="danger" show>
          Sorry, the validator failed to parse this file. Please check that the URL is available and points to a
          <a href="https://github.com/MobilityData/gbfs/blob/master/gbfs.md#gbfsjson" target='_blank'
            rel='noreferrer'>gbfs.json</a> file. If you have any questions, please write to <a
            href='mailto:sharedmobility@mobilitydata.org' target='_blank' rel='noreferrer'>
            sharedmobility@mobilitydata.org
          </a>. Thank you
        </b-alert>
        <div v-else>
          <b-alert variant="info" show>
            Detected version <b>{{ result.summary.version.detected }} </b> and
            validate with
            <a :href="`https://github.com/MobilityData/gbfs/blob/v${result.summary.version.validated}/gbfs.md`"><b>{{
              result.summary.version.validated }}</b></a>
          </b-alert>

          <div>
            <b-alert v-if="result.summary.hasErrors" variant="danger" show>
              Invalid GBFS feed <br />
              <!-- hasErrors can be json errors or required file presence errors. errorsCountFormated is only json errors.
              We want to display that the feed is invalid in all cases but not the number of errors if it's 0. -->
              <b v-if="errorsCountFormated > 0">{{ errorsCountFormated }} errors</b>
            </b-alert>
            <b-alert v-else variant="success" show>Valid !</b-alert>
          </div>
          <h4 class="mt-3 mb-3">Detail per files</h4>
          <div v-for="file in result.files" :key="file.filename">
            <SubResult :file="file" />
          </div>
        </div>
      </div>
      <b-alert v-else-if="result" variant="danger" show>{{ result }}</b-alert>
    </div>
  </div>
</template>

<style scoped>
.result {
  margin-bottom: 80px;
}

.validating {
  text-align: center;
  margin: 50px 0;
  font-size: 2rem;
}

.info {
  margin: 30px 0;
}
</style>
