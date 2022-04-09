const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //加密库
const { Schema, model } = mongoose;
// const Schema = mongoose.Schema
// const model = mongoose.model

const UserSchema = new Schema({
  username: { type: String, require: true },
  password: {
    type: String,
    require: true,
    set(val) {
      return bcrypt.hashSync(val, 10); //加密等级：10
    },
  },
  avatar: { type: String, default: "http://cdn.xjun.cloud/avator-default.png" },
  name: { type: String },
  isAdmin: { type: String, default: "0" }, //身份 1->管理员 0->普通用户
  email: { type: String },
  phone: { type: Number },
  slog: { type: String },
  sex: { type: String },
});

const User = model("User", UserSchema);

module.exports = User;
