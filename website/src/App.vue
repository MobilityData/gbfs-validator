<script setup>
import Footer from './components/Footer.vue'
</script>

<template>
  <div
    class="d-flex flex-column flex-grow-1 min-vh-100 justify-content-between"
  >
    <b-container>
      <b-row class="mt-5 mb-4">
        <b-col>
          <b-row class="mb-2">
            <b-col class="flex-grow-0">
              <b-link :to="{ name: 'home' }"
                ><img src="/gbfs_validator.jpg" alt=""
              /></b-link>
            </b-col>
            <b-col>
              <b-link
                :to="{ name: 'home' }"
                class="text-decoration-none text-dark"
                ><h1>gbfs-validator.mobilitydata.org</h1></b-link
              >
              <b-link
                :to="{ name: 'home' }"
                class="text-decoration-none text-dark"
                ><h2>A GBFS feed validator</h2></b-link
              >
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p>
                Validate any
                <a href="https://github.com/MobilityData/gbfs/">GBFS</a> feed
                online. Based on official
                <a href="https://github.com/MobilityData/gbfs-json-schema"
                  >GBFS json schemas</a
                >. <br />
                More details on
                <a href="https://github.com/MobilityData/gbfs-validator"
                  >https://github.com/MobilityData/gbfs-validator</a
                >.
              </p>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <router-view />
        </b-col>
      </b-row>
      <b-row>
        <b-col> </b-col>
      </b-row>
    </b-container>
    <Footer />
  </div>
</template>

<style>
html {
  position: relative;
  min-height: 100%;
}
body {
  margin-bottom: 60px;
}
</style>
