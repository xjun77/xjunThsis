import Vue from 'vue'
import VueRouter from 'vue-router'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import AddArticle from '../components/addArticle.vue'
import toArticle from '../components/toArticle.vue'
//test
import Article from '../views/Article.vue'

import Chat from '../components/Chat.vue'

Vue.use(VueRouter)
//重复点击当前路径报错
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const routes = [
	{
		path: '/',
		redirect: './home'
	},
	{
		path: '/home',
		name: 'home',
		redirect: '/Article',
		component: About,
		children: [{
				path: '/addArticle',
				component: AddArticle
			},
			{
				path: '/updateArt',
				component: () => import('../components/updateArt.vue')
			},
			{
				path: '/Article',
				component: Article
			},
			{
				path: '/tochat',
				component: Chat
			},
			{
				path: '/chatromm',
				component: () => import('../components/chatroom.vue')
			},
			{
				path: '/personal',
				component: () => import('../components/personal.vue')
			},
			{
				path: '/search',
				component: () => import('../components/search.vue')
			},
			{
				path: '/typeof',
				component: () => import('../components/typeof.vue')
			},
			{
				path: '/getsum',
				component: () => import('../components/getsum.vue')
			},
			{
				path: '/toArticle',
				component: () => import('../components/toArticle.vue')
			}
		]
	},
	{
		path: '/login',
		name: 'login',
		component: Login
	},

	// {
	//   path: '/about',
	//   name: 'About',
	//   // route level code-splitting
	//   // this generates a separate chunk (about.[hash].js) for this route
	//   // which is lazy-loaded when the route is visited.
	//   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	// }
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

//挂载路由守卫
router.beforeEach((to, from, next) => {
	//to 将要访问的path
	//from 从哪个path来
	//next 下一步  next()放行 next('/login') 强制跳转
	const isToken = sessionStorage.elementToken ? true:false
	if(to.path == '/login'){
		next()
	}else{
		isToken ? next():next('/login')
	}
})

export default router
