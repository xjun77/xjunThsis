// //自己创建的
// //vue.config.js 是一个可选的配置文件，如果项目的 (和 package.json 同级的) 根目录中存在这个文件，那么它会被 @vue/cli-service 自动加载。
// //你也可以使用 package.json 中的 vue 字段，但是注意这种写法需要你严格遵照 JSON 的格式来写。
const webpack = require('webpack')
module.exports = {
    configureWebpack: {
       plugins:[
		   new webpack.ProvidePlugin({
			   'window.Quill':'quill'
		   })
	   ]
     }
}