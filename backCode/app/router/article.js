const express = require("express");
const jwt = require("jsonwebtoken");
const Article = require("../model/Article");
const User = require("../model/User");
const Comment = require("../model/Comment");
const router = express.Router();
const { secret } = require("../config/key");

const qiniu = require("qiniu");

var accessKey = "zQQ5diIi9sMexQ2ynj8ZCofaXEOgRlSQTsv0Si7g";
var secretKey = "zaPVVUGR1q_IxzlGXQXrdI9Hqz2fg9bq93QugfPt";
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

var options = {
  scope: "nuotasuo",
  expires: 720000,
};
//看看七牛云或者 回退一下 该回去 全部回退吗 就保存之前
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

//验证身份中间件
const iscurrentUser = (req, res, next) => {
  //1.获取token
  //jwt
  const token = req.headers.authorization.split(" ").pop();
  let _id, username;
  // console.log(jwt.verify(token,secret))

  jwt.verify(token, secret, async (error, decoded) => {
    if (error) {
      res.status(401).send("token不正确或过期，请重新登录");
    } else {
      //1.获取id,username
      const { _id, username } = decoded;

      //2.查询用户是否存在
      const user = await User.findById(_id);
      if (!user) {
        return res.status(422).send("用户错误");
      }

      // //3.查看username
      // if(username !== user.username){
      // 	res.status(422).send('用户错误')
      // }else {
      // 	//用户存在，查看权限
      // 	if(user.isAdmin === '0'){
      // 		res.status(409).send('没有权限')
      // 	}else if(user.isAdmin ==='1'){
      // 		// res.send('Admin')
      // 		next()
      // 	}
      // }
      next();
    }
  });
};

//获取文章列表
router.get("/", async (req, res) => {
  // res.send('hello userRouter')
  // console.log(req.query)
  // if(req.query.current_page){
  // 	const page = req.query.current_page
  // }else{
  // 	const page = 1
  // }
  const page = req.query.current_page;
  const size = req.query.page_size;
  const pass = (parseInt(page) - 1) * parseInt(size); //跳过多少条数据
  const list = await Article.find(
    {},
    {
      ID: 1,
      title: 1,
      username: 1,
      avatar: 1,
      updateTIME: 1,
      tag: 1,
      photo_url: 1,
      _id: 0,
    }
  )
    .skip(pass)
    .limit(parseInt(size))
    .sort({ updateTIME: -1 }); //1:表示返回这个字段，0表示不返回
  const count = await Article.countDocuments();
  // console.log(count)
  // console.log(list)
  res.send({ count: count, list: list });
});
router.get("/all", async (req, res) => {
  console.log(req.query);
  const list = await Article.find(
    { title: { $regex: req.query.title } },
    {
      ID: 1,
      title: 1,
      username: 1,
      createTIME: 1,
      updateTIME: 1,
      tag: 1,
      photo_url: 1,
      _id: 0,
    }
  ).sort({ updateTIME: -1 }); //1:表示返回这个字段，0表示不返回
  const count = await Article.countDocuments();
  // console.log(count)
  // console.log(list)
  res.send({ count: count, list: list });
});
router.get("/current", async (req, res) => {
  console.log(req.query);
  const list = await Article.find(
    { username: { $regex: req.query.username } },
    {
      ID: 1,
      title: 1,
      username: 1,
      createTIME: 1,
      updateTIME: 1,
      tag: 1,
      photo_url: 1,
      _id: 0,
    }
  ).sort({ updateTIME: -1 }); //1:表示返回这个字段，0表示不返回
  const count = await Article.countDocuments();
  // console.log(count)
  // console.log(list)
  res.send({ count: count, list: list });
});

//删除文章
router.post("/delart", async (req, res) => {
  console.log(req.body);
  const art = await Article.deleteOne({ ID: req.body.ID });
  //同步删除评论
  const comment = await Comment.deleteMany({ artid: req.body.ID });
  console.log(comment);
  res.status(200).send({ message: "删除成功" });
});

//回传七牛云上传图片的token
router.get("/upload", async (req, res) => {
  res.send(uploadToken);
});

//上传文章
router.post("/uploadArt", async (req, res) => {
  //新文章保存在数据库
  // res.send(req.body)
  const newArt = await new Article(req.body).save();
  res.send(newArt.ID);
  // console.log(req.body)
});

//更新文章
router.post("/updateArt", async (req, res) => {
  //新文章保存在数据库
  console.log(req.body);
  // const newArt = await new Article(req.body).save()
  const a = await Article.updateOne(
    { ID: req.body.ID },
    {
      avatar: req.body.avatar,
      title: req.body.title,
      tag: req.body.tag,
      context: req.body.context,
      photo_url: req.body.photo_url,
      updateTIME: req.body.updateTIME,
    }
  );
  console.log(a);
  res.send(req.body.ID);
  // console.log(req.body)
});

//获取指定文章的内容
router.get("/getArtdetail", async (req, res) => {
  // console.log(req.query)
  if (req.query.aid) {
    const aid = req.query.aid;
    // console.log(aid)
    try {
      const artDetail = await Article.findOne({ ID: aid });
      if (!artDetail) {
        res.status(404).send("文章不存在");
      } else {
        res.send(artDetail);
      }
    } catch (e) {
      console.log(e);
      //TODO handle the exception
    }
  } else {
    res.send("error");
  }
});

//上传评论
router.post("/upComment", async (req, res) => {
  console.log(req.body);
  const newComment = await new Comment(req.body).save();
  res.send(newComment._id);
});
//上传评论回复
router.post("/upCommentReply", async (req, res) => {
  // console.log(req.body)
  const { artid, index, comment } = req.body;
  const theComment = await Comment.findOne({ artid: artid }).skip(index);
  const result = await theComment.updateOne({ $push: { reply: comment } });
  console.log(result);
  res.send("ok");
});

//获取评论
router.get("/getComments", async (req, res) => {
  const artid = req.query.aid;
  const commentList = await Comment.find({ artid: artid });
  res.send({ comments: commentList });
});

//获取评论
router.get("/getcom", async (req, res) => {
  console.log(req.query);
  const commentList = await Comment.find({
    title: { $regex: req.query.title },
  });
  res.send({ comments: commentList });
});

//删除评论
router.post("/delcom", async (req, res) => {
  console.log(req.body);
  const comment = await Comment.deleteOne({ _id: req.body._id });
  console.log(comment);
  res.status(200).send({ message: "删除成功" });
});

//删除二级评论
router.post("/delreply", async (req, res) => {
  console.log(req.body);
  const comment = await Comment.updateOne(
    { _id: req.body.commentid },
    { $pull: { reply: { _id: req.body._id } } }
  );
  console.log(comment);
  res.status(200).send({ message: "删除成功" });
});

module.exports = router;
