import axios from 'axios'
import router from './router'
import {Message,Loading} from 'element-ui'

const http =axios.create({
	baseURL:'http://localhost:3000'
})
var loadinginstace

//添加token头部
http.interceptors.request.use(config => {
	// console.log(localStorage.elementToken)
	loadinginstace = Loading.service({
		lock: true,
		text:'Loading',
		spinner: 'el-icon-loading',
		background: 'rgba(0, 0, 0, 0.3)',
		customClass:"osloading",
		fullscreen: true 
	})
	if(sessionStorage.elementToken){
		config.headers.Authorization = sessionStorage.elementToken;
	}
	return config
	//最后必须return config
},error=>{
	loadinginstace.close()
})

//响应拦截
http.interceptors.response.use( 
res =>{
	// console.log(res)
	loadinginstace.close()
	if(res.data.message){
		Message.success(res.data.message)
	}
	// Message.success(res.data.message)
	return res
},err =>{
	loadinginstace.close()
	
	let errmessage = err.toString()
	console.log(errmessage)
	
	//无网络或者未响应
	if(errmessage == 'Error: Network Error'){
		Message.error(errmessage)
		return err
	}
	// console.log(err.response)
	if(err.response.status == 401){	//token过期或者不正确
	    sessionStorage.removeItem('elementToken')
		router.replace({path:'/login'})
	}
	if(err.response.data){
		Message.error(err.response.data)
	}
	return err.response
})

export default http