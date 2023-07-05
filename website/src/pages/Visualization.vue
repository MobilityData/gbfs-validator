<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  computed,
  provide,
  h,
  render,
  shallowRef,
  watch
} from 'vue'
import { get, set } from '@vueuse/core'
import { Map, NavigationControl, Popup, LngLat } from 'maplibre-gl'
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox'
import { GeoJsonLayer } from '@deck.gl/layers'
import bboxPolygon from '@turf/bbox'
import {
  isMapboxURL,
  transformMapboxUrl
} from 'maplibregl-mapbox-request-transformer'

import VehiclePopup from '../components/VehiclePopup.vue'
import StationPopup from '../components/StationPopup.vue'
import GeofencingZonePopup from '../components/GeofencingZonePopup.vue'

const result = shallowRef([])
const summary = ref({})
const isLoading = ref(false)
const url = ref('')
const map = ref()
const container = ref()
const selected = ref(['stations', 'vehicles'])

let mapInstance
let vehiclesOverlay
let stationsOverlay
let geofencingOverlay

const MAPBOX_KEY = import.meta.env.VITE_MAPBOX_API_KEY

// https://github.com/rowanwins/maplibregl-mapbox-request-transformer
const transformRequest = (url = '', resourceType = '') => {
  if (isMapboxURL(url)) {
    return transformMapboxUrl(url, resourceType, MAPBOX_KEY)
  }
  return { url }
}

onMounted(() => {
  const initialState = { lng: 2.349014, lat: 48.864716, zoom: 11 }

  mapInstance = new Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    transformRequest,
    center: [initialState.lng, initialState.lat],
    zoom: initialState.zoom
  })

  mapInstance.on('load', () => {
    set(map, mapInstance)
  })

  mapInstance.addControl(new NavigationControl())

  // When specifying ?url=https://example.com/gbfs.json, start
  // directly a validation
  const url_query_param = new URL(location.href).searchParams.get('url')

  if (url_query_param) {
    set(url, url_query_param)
    return visualize()
  }
})

onUnmounted(() => {
  map.value?.remove()
})

function visualize() {
  set(result, [])
  set(isLoading, true)

  vehiclesOverlay && mapInstance.removeControl(vehiclesOverlay)
  stationsOverlay && mapInstance.removeControl(stationsOverlay)
  geofencingOverlay && mapInstance.removeControl(geofencingOverlay)

  fetch('/.netlify/functions/feed', {
    method: 'POST',
    body: JSON.stringify({
      url: get(url)
    })
  })
    .then((resp) => resp.json())
    .then((r) => {
      result.value = r.files
      summary.value = r.summary

      updateURL()
      populateData()
      set(isLoading, false)
    })
    .catch(() => {
      set(isLoading, false)
    })
}

function updateURL() {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set('url', get(url))
  history.pushState(
    null,
    '',
    window.location.pathname + '?' + searchParams.toString()
  )
}

function dataFromArray(f) {
  if (f?.body) {
    if (Array.isArray(f.body)) {
      return f.body.length && f.body[0].body?.data
    } else {
      return f.body.data
    }
  } else {
    return null
  }
}

const vehicles = computed(() => {
  if (get(result).length) {
    const vehiclesFile = get(result).find((f) =>
      ['free_bike_status', 'vehicle_status'].includes(f.type)
    )

    const data = dataFromArray(vehiclesFile)

    return data?.bikes || data?.vehicles
  } else {
    return null
  }
})

const vehiclesCountByType = computed(() => {
  if (get(vehicles)) {
    const countByType = get(vehicles).reduce((acc, v) => {
      if (acc[v.vehicle_type_id]) {
        acc[v.vehicle_type_id]++
      } else {
        acc[v.vehicle_type_id] = 1
      }

      return acc
    }, {})

    const types = Object.keys(countByType)

    return types
      .map((t) => `${countByType[t]} ${getVehicleType(t).form_factor}`)
      .join(' / ')
  } else {
    return null
  }
})

const stations = computed(() => {
  if (get(result).length) {
    const stationsFile = get(result).find(
      (f) => f.type === 'station_information'
    )

    return dataFromArray(stationsFile)?.stations
  } else {
    return null
  }
})

const hasStationsDetails = computed(() => {
  if (get(result).length) {
    const stationsFile = get(result).find(
      (f) => f.file === 'station_status.json'
    )

    return !!stationsFile.body?.data
  } else {
    return false
  }
})

const vehiclesInStations = computed(() => {
  if (get(stations)) {
    return `${get(stations).reduce((acc, s) => {
      acc += getStationStatus(s.station_id)?.num_bikes_available || 0

      return acc
    }, 0)} vehicles`
  } else {
    return null
  }
})

const vehicleTypes = computed(() => {
  if (get(result)) {
    const vehicleTypesFile = get(result).find((f) => f.type === 'vehicle_types')

    return dataFromArray(vehicleTypesFile)?.vehicle_types
  } else {
    return null
  }
})

const vehicleTypesFormFactor = computed(() => {
  if (get(vehicleTypes)) {
    return [...new Set(get(vehicleTypes).map((vt) => vt.form_factor))]
  } else {
    return null
  }
})

const geofencingZone = computed(() => {
  if (get(result).length) {
    const geofencingZoneFile = get(result).find(
      (f) => f.file === 'geofencing_zones.json'
    )

    return dataFromArray(geofencingZoneFile)?.geofencing_zones
  } else {
    return null
  }
})

const getVehicleType = function (vehicleTypeId) {
  if (get(result)) {
    const vehicleTypesFile = get(result).find(
      (f) => f.file === 'vehicle_types.json'
    )

    return dataFromArray(vehicleTypesFile)?.vehicle_types.find(
      (vt) => vt.vehicle_type_id === vehicleTypeId
    )
  }
}

const getPricingPlan = function (pricingPlanId) {
  if (get(result)) {
    const pricingPlansFile = get(result).find(
      (f) => f.file === 'system_pricing_plans.json'
    )

    return dataFromArray(pricingPlansFile)?.plans.find(
      (pp) => pp.plan_id === pricingPlanId
    )
  }
}

const getStationStatus = function (stationId) {
  if (get(result)) {
    const stationStatusFile = get(result).find(
      (f) => f.file === 'station_status.json'
    )

    return dataFromArray(stationStatusFile)?.stations.find(
      (vt) => vt.station_id === stationId
    )
  }
}

function populateData() {
  if (get(selected).includes('geofencing') && get(geofencingZone)) {
    const geojson = {
      type: 'FeatureCollection',
      features: get(geofencingZone).features.map((f) => {
        return {
          type: 'Feature',
          properties: {
            ...f.properties
          },
          geometry: f.geometry
        }
      })
    }

    const geofencingLayer = new GeoJsonLayer({
      id: 'geofencingZone',
      pickable: true,
      stroked: true,
      getLineColor: () => {
        return [33, 158, 188]
      },
      getLineWidth: 3,
      lineWidthUnits: 'pixels',
      getFillColor: () => {
        return [162, 210, 255, 128]
      },
      data: geojson,
      onClick: (info) => {
        const t = h(GeofencingZonePopup, {
          geofencingZone: info.object.properties
        })
        const d = document.createElement('div')

        render(t, d)

        new Popup()
          .setLngLat(new LngLat(...info.coordinate))
          .setHTML(d.innerHTML)
          .setMaxWidth(400)
          .addTo(mapInstance)
      }
    })
    geofencingOverlay = new DeckOverlay({
      layers: [geofencingLayer]
    })

    mapInstance.fitBounds(bboxPolygon(geojson))
    mapInstance.addControl(geofencingOverlay)
  }

  if (
    get(selected).includes('vehicles') &&
    get(vehicles) &&
    get(vehicles).length
  ) {
    const geojson = {
      type: 'FeatureCollection',
      features: get(vehicles).map((v) => ({
        type: 'Feature',
        properties: {
          ...v,
          _vehicleType: {
            ...getVehicleType(v.vehicle_type_id)
          }
        },
        geometry: {
          coordinates: [v.lon, v.lat],
          type: 'Point'
        }
      }))
    }
    const vehiclesLayer = new GeoJsonLayer({
      id: 'vehicles',
      pointType: 'circle',
      pickable: true,
      getPointRadius: 10,
      pointRadiusMinPixels: 3,
      stroked: false,
      getFillColor: (info) => {
        switch (info.properties._vehicleType.form_factor) {
          case 'bicycle':
          case 'cargo_bicycle':
            return [106, 76, 147]

          case 'scooter':
          case 'scooter_standing':
          case 'scooter_seated':
            return [25, 130, 196]

          case 'moped':
            return [138, 201, 38]

          case 'car':
            return [255, 202, 58]

          default:
            return [180, 180, 180]
        }
      },
      data: geojson,
      onClick: (info) => {
        const t = h(VehiclePopup, {
          vehicle: info.object.properties,
          pricingPlan: getPricingPlan(info.object.properties.pricing_plan_id)
        })
        const d = document.createElement('div')

        render(t, d)

        new Popup()
          .setLngLat(new LngLat(...info.coordinate))
          .setHTML(d.innerHTML)
          .setMaxWidth(400)
          .addTo(mapInstance)
      }
    })

    vehiclesOverlay = new DeckOverlay({
      layers: [vehiclesLayer]
    })

    mapInstance.fitBounds(bboxPolygon(geojson))
    mapInstance.addControl(vehiclesOverlay)
  }

  if (
    get(selected).includes('stations') &&
    get(stations) &&
    get(stations).length
  ) {
    const geojson = {
      type: 'FeatureCollection',
      features: get(stations).map((s) => {
        return {
          type: 'Feature',
          properties: {
            ...s,
            _info: { ...getStationStatus(s.station_id) }
          },
          geometry: {
            coordinates: [s.lon, s.lat],
            type: 'Point'
          }
        }
      })
    }
    const stationLayer = new GeoJsonLayer({
      id: 'stations',
      pointType: 'circle',
      pickable: true,
      getPointRadius: 10,
      pointRadiusMinPixels: 3,
      stroked: false,
      getFillColor: (info) => {
        if (info.properties._info.num_bikes_available > 5) {
          return [6, 156, 86]
        } else if (info.properties._info.num_bikes_available > 0) {
          return [255, 152, 14]
        } else {
          return [211, 33, 44]
        }
      },
      data: geojson,
      onClick: (info) => {
        const t = h(StationPopup, {
          station: info.object.properties
        })
        const d = document.createElement('div')

        render(t, d)

        new Popup()
          .setLngLat(new LngLat(...info.coordinate))
          .setHTML(d.innerHTML)
          .setMaxWidth(400)
          .addTo(mapInstance)
      }
    })
    stationsOverlay = new DeckOverlay({
      layers: [stationLayer]
    })

    mapInstance.fitBounds(bboxPolygon(geojson))
    mapInstance.addControl(stationsOverlay)
  }
}

watch(selected, () => {
  vehiclesOverlay && mapInstance.removeControl(vehiclesOverlay)
  stationsOverlay && mapInstance.removeControl(stationsOverlay)
  geofencingOverlay && mapInstance.removeControl(geofencingOverlay)

  populateData()
})

provide('map', map)
</script>

<template>
  <div>
    <b-row>
      <b-col>
        <b-form-input
          type="url"
          v-model="url"
          placeholder="https://exemple.com/gbfs.json"
        ></b-form-input>
      </b-col>
      <b-col class="flex-grow-0">
        <b-button
          @click="visualize"
          variant="success"
          style="white-space: nowrap"
          :disabled="isLoading"
          >Visualize !</b-button
        >
      </b-col>
    </b-row>
    <b-row class="mt-3" v-if="summary.versionUnimplemented"
      ><b-col>
        <b-alert variant="danger" show class="mb-0">
          Sorry, this version is not yet implemented or not detectable !
        </b-alert>
      </b-col></b-row
    >
    <b-row class="mt-3">
      <b-col cols="6">
        <b-alert variant="primary" show>
          <h4 class="alert-heading">
            {{ stations ? stations.length : '-' }}
            <small v-if="hasStationsDetails" class="text-muted">{{
              vehiclesInStations
            }}</small>
          </h4>
          <span>Stations</span>
        </b-alert>
      </b-col>
      <b-col cols="6">
        <b-alert variant="primary" show>
          <h4 class="alert-heading">
            {{ vehicles ? vehicles.length : '-' }}
            <small
              v-if="vehicleTypes && vehicleTypes.length > 1"
              class="text-muted"
              >{{ vehiclesCountByType }}</small
            >
          </h4>
          <span>Dockless vehicles</span>
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <div class="map-wrap">
          <div id="map" class="map" ref="container"></div>

          <div class="map-overlay top left">
            <div class="map-overlay-inner">
              <ul class="list-unstyled mb-0">
                <b-form-checkbox-group
                  id="checkbox-group-2"
                  v-model="selected"
                  name="flavour-2"
                >
                  <li>
                    <b-form-checkbox name="selected-stations" value="stations"
                      >&nbsp;Stations</b-form-checkbox
                    >
                  </li>
                  <li>
                    <b-form-checkbox name="selected-stations" value="vehicles"
                      >&nbsp;Dockless</b-form-checkbox
                    >
                  </li>
                  <li>
                    <b-form-checkbox name="selected-stations" value="geofencing"
                      >&nbsp;Geofencing</b-form-checkbox
                    >
                  </li>
                </b-form-checkbox-group>
              </ul>
            </div>
          </div>

          <div class="map-overlay bottom right">
            <div class="map-overlay-inner" v-if="vehicles">
              <h5>Dockless vehicles</h5>
              <ul class="list-unstyled mb-0">
                <li
                  v-for="vtff in vehicleTypesFormFactor"
                  :key="vtff"
                  class="d-flex align-items-center"
                >
                  <span
                    class="vehicle-type d-inline-block"
                    :class="`vehicle-type-${vtff.toLowerCase()}`"
                  ></span>
                  {{ vtff }}
                </li>
                <li v-if="!vehicleTypesFormFactor">
                  <span
                    class="vehicle-type d-inline-block vehicle-type-unknown"
                  ></span>
                  unknown
                </li>
              </ul>
            </div>

            <div class="map-overlay-inner">
              <h5>Stations</h5>
              <ul class="list-unstyled mb-0">
                <li class="d-flex align-items-center">
                  <span class="station-vehicles green"></span>>5 vehicles
                </li>
                <li class="d-flex align-items-center">
                  <span class="station-vehicles orange"></span>>0
                </li>
                <li class="d-flex align-items-center">
                  <span class="station-vehicles red"></span>No vehicles
                </li>
              </ul>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<style lang="scss" scoped>
.map-wrap {
  position: relative;
  width: 100%;
  height: 800px;
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}

.map-overlay {
  position: absolute;
  width: 200px;
  margin: 10px;
  z-index: 10;
  border-radius: 4px;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);

  &.bottom {
    bottom: 0;
  }

  &.right {
    right: 0;
  }

  &.left {
    left: 0;
  }
  &.top {
    top: 0;
  }

  .map-overlay-inner {
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    padding: 10px;
  }
}

.vehicle-type {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-color: rgb(255, 89, 94);
  margin-right: 10px;

  &.vehicle-type-bicycle,
  &.vehicle-type-scooter_cargo_bicycle {
    background-color: rgb(106, 76, 147);
  }

  &.vehicle-type-scooter,
  &.vehicle-type-scooter_standing,
  &.vehicle-type-scooter_seated {
    background-color: rgb(25, 130, 196);
  }

  &.vehicle-type-moped {
    background-color: rgb(138, 201, 38);
  }

  &.vehicle-type-car {
    background-color: rgb(255, 202, 58);
  }

  &.vehicle-type-unknown {
    background-color: rgb(180, 180, 180);
  }
}

.station-vehicles {
  display: inline-block;
  width: 18px;
  height: 18px;
  background-color: rgb(200, 200, 200);
  margin-right: 10px;

  &.green {
    background-color: rgb(6, 156, 86);
  }

  &.orange {
    background-color: rgb(255, 152, 14);
  }

  &.red {
    background-color: rgb(211, 33, 44);
  }
}
</style>

<style>
.maplibregl-popup {
  z-index: 2;
}

.maplibregl-popup-content {
  max-width: 500px;
  max-height: 500px;
  overflow-y: scroll;
  overflow-wrap: anywhere;
}
</style>
