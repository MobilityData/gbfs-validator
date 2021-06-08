<template>
  <b-container>
    <b-row class="mt-5 mb-5 text-center">
      <b-col>
        <h1>GBFS-Validator</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <Validator/>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <Footer/>
      </b-col>
    </b-row>
  </b-container>
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
