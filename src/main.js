import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Paginate from 'vuejs-paginate'
import VueMeta from 'vue-meta'

import App from './App.vue'
import router from './router'
import store from './store'

import dateFilter from '@/filters/date_filter'
import currencyFilter from '@/filters/currency_filter'
import localizeFilter from '@/filters/localize_filter'
import tooltipDirective from '@/directives/tooltip_directive'
import messagePlugin from '@/utils/message_plugin'
import titlePlugin from '@/utils/title_plugin'
import Loader from '@/components/app/Loader'

import './registerServiceWorker'
import 'materialize-css/dist/js/materialize.min'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.config.productionTip = false

Vue.use(messagePlugin)
Vue.use(titlePlugin)
Vue.use(Vuelidate)
Vue.use(VueMeta)
Vue.filter('date', dateFilter)
Vue.filter('currency', currencyFilter)
Vue.filter('localize', localizeFilter)
Vue.directive('tooltip', tooltipDirective)
Vue.component('Loader', Loader)
Vue.component('Paginate', Paginate)

firebase.initializeApp({
    apiKey: 'apiKey',
    authDomain: 'authDomain',
    databaseURL: 'https://vue-crm-blank.firebaseio.com',
    projectId: 'vue-crm-blank',
    storageBucket: 'vue-crm-blank.appspot.com',
    messagingSenderId: 'messagingSenderId',
    appId: 'appId',
    measurementId: 'measurementId',
})

let app

firebase.auth().onAuthStateChanged(() => {
    if (!app) {
        app = new Vue({
            router,
            store,
            render: h => h(App),
        }).$mount('#app')
    }
})
