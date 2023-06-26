<script setup>
import { computed } from 'vue'
const props = defineProps(['vehicle', 'pricingPlan'])

const keys = computed(() => {
  return Object.keys(props.vehicle).filter((k) => k != '_vehicleType')
})

const vehicleTypeKeys = computed(() => {
  return props.vehicle._vehicleType && Object.keys(props.vehicle._vehicleType)
})

const pricingPlanKeys = computed(() => {
  return props.pricingPlan && Object.keys(props.pricingPlan)
})
</script>

<template>
  <div>
    <h3>Vehicle</h3>
    <table>
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
      <tr v-for="key in keys" :key="key">
        <td>{{ key }}</td>
        <td v-if="key === 'vehicle_type_id'">
          <template v-if="props.vehicle._vehicleType">
            {{ props.vehicle[key] }}
            <table>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
              <tr v-for="vtKey in vehicleTypeKeys" :key="vtKey">
                <td>{{ vtKey }}</td>
                <td>{{ props.vehicle._vehicleType[vtKey] }}</td>
              </tr>
            </table>
          </template>
          <template v-else>
            {{ props.vehicle[key] }}
          </template>
        </td>
        <td v-else-if="key === 'pricing_plan_id'">
          <template v-if="props.pricingPlan">
            <table>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
              <tr v-for="ppKey in pricingPlanKeys" :key="ppKey">
                <td>{{ ppKey }}</td>
                <td>{{ pricingPlan[ppKey] }}</td>
              </tr>
            </table>
          </template>
          <template v-else>
            {{ props.vehicle[key] }}
          </template>
        </td>
        <td v-else>{{ props.vehicle[key] }}</td>
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
