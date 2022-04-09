const mongoose = require('mongoose')
const { Schema,model } = mongoose
// const Schema = mongoose.Schema
// const model = mongoose.model

const ArticleSchema = new Schema({
	ID:{type:String,require:true,unique:true},
	username:{type:String,require:true},
	avatar:{type:String,require:true},
	title:String,
	tag:[String],
	context:String,
	updateTIME:String,
	createTIME:String,
	photo_url:String,
	isOpen:{type:String,default:'0'}	//身份 1->私密 0->公开
})

mongoose.set('useCreateIndex', true)
const Article = model('Article',ArticleSchema)

module.exports = Article