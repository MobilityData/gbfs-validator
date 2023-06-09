<script setup>
import { computed } from 'vue'
const props = defineProps(['station'])

const keys = computed(() => {
  return Object.keys(props.station)
})

const stationInfoKeys = computed(() => {
  return props.station._info && Object.keys(props.station._info)
})
</script>

<template>
  <div>
    <h3>Station</h3>
    <table>
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
      <tr v-for="key in keys" :key="key">
        <td>{{ key }}</td>
        <td v-if="key === '_info'">
          {{ props.station[key] }}
          <table>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
            <tr v-for="siKey in stationInfoKeys" :key="siKey">
              <td>{{ siKey }}</td>
              <td>{{ station._info[siKey] }}</td>
            </tr>
          </table>
        </td>
        <td v-else>{{ props.station[key] }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
table {
  border: 1px solid grey;
  border-collapse: collapse;
  width: 100%;
}

table th,
table td {
  padding: 0.3em;
  border: 1px solid lightgrey;
}

table td:first-child {
  font-weight: bold;
}
</style>
