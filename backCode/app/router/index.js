const UserRouter = require('./user')
const ArticleRouter = require('./article')

module.exports = app =>{
	app.use('/user',UserRouter)
	app.use('/article',ArticleRouter)
}