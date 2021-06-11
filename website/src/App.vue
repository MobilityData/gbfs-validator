<template>
  <div>
    <b-container>
      <b-row class="mt-5 mb-4">
        <b-col>
          <b-row class="mb-2">
            <b-col class="flex-grow-0">
              <img src="/gbfs_validator.jpg" alt="">
            </b-col>
            <b-col>
              <h1>gbfs-validator.netlify.com</h1>
              <h2>A GBFS feed validator</h2>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p>Validate any <a href="https://github.com/NABSA/gbfs/">GBFS</a> feed online. Based on official <a href="https://github.com/MobilityData/gbfs-json-schema">GBFS json schemas</a>. <br>
          More details on <a href="https://github.com/fluctuo/gbfs-validator">https://github.com/fluctuo/gbfs-validator</a>.</p>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <Validator/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>

        </b-col>
      </b-row>
    </b-container>
    <Footer/>
  </div>
</template>

<script>
import Validator from './components/Validator'
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    Validator,
    Footer
  }
}
</script>

<style>
html {
  position: relative;
  min-height: 100%;
}
body {
  margin-bottom: 60px;
}
</style>
