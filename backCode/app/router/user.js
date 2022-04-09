const express = require('express')
const bcrypt = require('bcrypt')	//加密工具
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const router = express.Router()
const {secret}=require('../config/key')

//验证身份中间件
const isAdmin = (req,res,next)=>{
	//1.获取token
	//jwt
	const token = req.headers.authorization.split(' ').pop()
	let _id,username
	// console.log(jwt.verify(token,secret))

	jwt.verify(token, secret,async (error, decoded) => {
	    if (error) {
	       res.status(401).send('token不正确或过期，请重新登录')
	    }else{
			//1.获取id,username
			const {_id,username} = decoded
			
			//2.查询用户是否存在
			const user = await User.findById(_id)
			if(!user){
				return res.status(422).send('用户错误')
			}
			
			//3.查看username
			if(username !== user.username){
				res.status(422).send('用户错误')
			}else {
				//用户存在，查看权限
				if(user.isAdmin === '0'){
					res.status(409).send('没有权限')
				}else if(user.isAdmin ==='1'){
					// res.send('Admin')
					next()
				}
			}
		}
	    
	 })	
}

//获取用户列表
// router.get('/',isAdmin,async (req,res)=>{
	router.get('/',async (req,res)=>{
		console.log(req.query)
	// res.send('hello userRouter')
	const list = await User.find({username:{ $regex:req.query.username }})
	res.send(list)
})

//删除用户
router.post('/deluser',async(req,res) =>{
	console.log(req.body)
	const user = await User.deleteOne({_id:req.body._id})
	console.log(user)
	res.status(200).send({message:'删除成功'})
})

//test Art
router.get('/art',async(req,res)=>{
	 const list = await User.find()
	 res.send(list)
})

//注册
router.post('/register',async (req,res)=>{
	// req.body
	//查询是否用户名已存在
	console.log(req)
	const user = await User.findOne({username: req.body.username})
	if(user) {return res.status(409).send('用户名已存在')}
	//密码加密
	// req.body.password = setEncode(req.body.password)
	//新用户保存在数据库
	const newUser = await new User(req.body).save()
	res.status(200).send({message:'用户名：'+req.body.username+'，注册成功'})
})
	
//登录
router.post('/login',async(req,res)=>{
	const user = await User.findOne({username:req.body.username})
	//1.用户不存在
	if(!user){return res.status(422).send("该用户不存在")}
	//2.用户存在，判断密码
	
	//2.5解密
	let isPassword = bcrypt.compareSync(req.body.password,user.password)
	if(!isPassword) {return res.status(422).send('密码错误')}
	
	//密码正确返回token
	const { _id,username,avatar } = user
	const token =jwt.sign({_id,username},secret,{expiresIn:'24h'})
	res.status(200).send({token:token,message:username+'，登录成功',user:{username:username,avatar:avatar,userID:_id,sessionID:_id}})	//返回token
})

//获取用户信息
router.get('/getdetail',async(req,res)=>{
	const user = await User.findOne({username:req.query.username})
	console.log(user)
	// console.log(user)
	const { email,phone,slog,sex,avatar } = user
	res.status(200).send({email:email,phone:phone,slog:slog,sex:sex,avatar:avatar})
})

//更新用户信息
router.post('/detail',async(req,res)=>{
	console.log(req.body)
	const a =await User.updateOne({username:req.body.username},{
		email:req.body.email,
		phone:req.body.phone,
		slog:req.body.slog,
		sex:req.body.sex,
		avatar:req.body.avatar
	})
	res.status(200).send({message:'保存成功'})
})

//更新用户密码
router.post('/password',async(req,res)=>{
	console.log(req.body)
	const a =await User.updateOne({username:req.body.username},{
		password:req.body.password
	})
	console.log(a)
	res.status(200).send({message:'保存成功'})
})

module.exports = router