import Vue from 'vue'
import App from './App.vue'
import './plugins/iview.js'
import './plugins/axios.js'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
