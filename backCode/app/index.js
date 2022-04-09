const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongo = require('./config/db')
// const route = require('./router/user')
const routes = require('./router')

const router = express.Router()
const app = new express()

mongo(app)
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// router.get('/',(req,res)=>{
// 	res.send('hello world')
// })

// app.use('/user',route)
routes(app)

app.listen(3000,()=>{
	console.log('server listen at 3000')
})