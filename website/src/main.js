import Vue from 'vue'
import VueGtag from 'vue-gtag'
import App from './App.vue'
import {
  AlertPlugin,
  ButtonPlugin,
  CardPlugin,
  CollapsePlugin,
  FormCheckboxPlugin,
  FormGroupPlugin,
  FormInputPlugin,
  FormPlugin,
  FormSelectPlugin,
  LayoutPlugin,
  LinkPlugin,
  TabsPlugin,
  TooltipPlugin
} from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import 'maplibre-gl/dist/maplibre-gl.css'

import router from './router'

if (import.meta.env.VITE_GOOGLE_ANALYTICS_ID) {
  Vue.use(VueGtag, {
    config: { id: import.meta.env.VITE_GOOGLE_ANALYTICS_ID }
  })
}

Vue.config.productionTip = false
Vue.use(AlertPlugin)
Vue.use(ButtonPlugin)
Vue.use(CardPlugin)
Vue.use(CollapsePlugin)
Vue.use(FormCheckboxPlugin)
Vue.use(FormGroupPlugin)
Vue.use(FormInputPlugin)
Vue.use(FormPlugin)
Vue.use(FormSelectPlugin)
Vue.use(LayoutPlugin)
Vue.use(LinkPlugin)
Vue.use(TabsPlugin)
Vue.use(TooltipPlugin)

const app = Vue.createApp(App)

app.use(router)
app.mount('#app')
