import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from './axios'
import socket from "./socket";

Vue.prototype.$socket = socket

//挂载axios
Vue.prototype.$http = axios

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

//修改全局css样式,包含富文本的样式.分页样式
import './css/all.css'

Vue.use(VueQuillEditor)

Vue.config.productionTip = false
new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')
