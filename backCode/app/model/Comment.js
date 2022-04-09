const mongoose = require('mongoose')
const { Schema,model } = mongoose

const ReplySchema = new Schema({
	isdirect:{type:Boolean,require:true},
	fromwho:{type:String,require:true},
	fromId:{type:Number,require:true},
	toId:{type:Number,require:true},
	fromHeadImg:{type:String,require:true},
	towho:{type:String,require:true},
	comment:{type:String,require:true},
	time:{type:String,require:true},
})
const CommentSchema = new Schema({
	artid:{type:String,require:true},
	name:{type:String,require:true},
	title:{type:String,require:true},
	headImg:{type:String,require:true},
	comment:{type:String,require:true},
	time:{type:String,require:true},
	reply:[ReplySchema]
})

const Comment = model('Comment',CommentSchema)

module.exports = Comment