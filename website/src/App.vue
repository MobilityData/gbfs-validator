<template>
  <div id="app">
    <h1>GBFS-Validator</h1>
    <Validator/>
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

.alert {
  font-size: 1rem;
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.warning {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeeba;
}

.danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb;
}
</style>
