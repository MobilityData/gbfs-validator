<script setup>
import { computed } from 'vue'
const props = defineProps(['geofencingZone'])

const keys = computed(() => {
  return Object.keys(props.geofencingZone)
})
</script>

<template>
  <div>
    <h3>Geocenfing zone</h3>
    <table>
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
      <tr v-for="key in keys" :key="key">
        <td>{{ key }}</td>
        <td v-if="key === 'rules'">
          <div
            v-for="(rule, idx) in props.geofencingZone.rules"
            :key="`rule-${idx}`"
          >
            <b>Rule #{{ idx }}</b>

            <table>
              <tr v-for="(value, key) in rule" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </table>
          </div>
        </td>
        <td v-else>{{ props.geofencingZone[key] }}</td>
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
