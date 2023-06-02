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
  TabsPlugin,
  TooltipPlugin
} from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

if (import.meta.env.VUE_APP_GOOGLE_ANALYTICS_ID) {
  Vue.use(VueGtag, {
    config: { id: import.meta.env.VUE_APP_GOOGLE_ANALYTICS_ID }
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
Vue.use(TabsPlugin)
Vue.use(TooltipPlugin)

Vue.createApp(App).mount('#app')
