<template>
  <div id="app">
    <h1>GBFS-Validator</h1>
    <Validator/>
    <Footer />
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
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  font-size: 1.4rem;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

h1 {
  text-align: center;
}
</style>
