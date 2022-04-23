const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const { secret } = require('../config/key')
const router = express.Router()

// const secret = 'register-rule'


//验证身份-中间件
const isAdmin = async(req,res,next)=>{
    // console.log(req.headers.authorization)
      //获取token
    //   const token = req.headers.authorization.split(' ')[1]
    //   const id = token.split('.')[0]
    //   const username  = token.split('.')[1]
    //   console.log(id,username)
        //jwt-token
        const token = req.headers.authorization.split(' ').pop()
        console.log( jwt.verify(token,secret))
        const { _id, username} = jwt.verify(token,secret)
      //  console.log(_id)
      //查询用户是否存在
      const user = await User.findById(_id)
      if(!user){ 
          return res.status(422).send('用户错误')
      }
      //查看username
      if(username !== user.username){
          res.status(422).send('用户错误')
      }
      else{
          //用户存在 查看权限
          if(user.isAdmin === '0'){
              res.status(409).send('没有权限')
          }
          else if(user.isAdmin === '1'){
          //res.send('Admin')
          next()
         }
      }
   }

//获取用户列表
router.get('/',isAdmin,async(req,res)=>{
    // res.send('hello userRouter ')
    const list = await User.find()
    res.send(list)
})

//注册
router.post('/register',async(req,res)=>{
    //res.body
    const user = await User.findOne({username: req.body.username})
    if(user){ 
        return res.status(409).send('该用户已存在')
    }
    const newUser = await new User(req.body).save()
    res.send(newUser)

})

//登录
router.post('/login',async(req,res)=>{
    //查询用户是否存在
    const user = await User.findOne({username:req.body.username})
   
    if(!user){ return res.status(422).send('该用户不存在')}
    //用户存在 判断密码
    //  if(req.body.username !== user.username || req.body.password !== user.password  ){
    //   return res.status(422).send('账号或密码错误')}
    // }else{
    //     res.send('token')
    // }
 //解密
  let isPassword = await bcrypt.compareSync(req.body.password, user.password)
 
  if(!isPassword){ return res.status(422).send('密码错误')}
//返回token
//const token = user._id + '.' + user.username
const { _id, username } = user
const token = jwt.sign({_id,username},secret,{expiresIn:'24h'})
res.send(token)
})

//验证
router.get('/verify',async(req,res)=>{
    console.log(req.headers.authorization)
   //获取token
    // const token = req.headers.authorization.split(' ')[1]
    // const id = token.split('.')[0]
    // const username  = token.split('.')[1]
    // console.log(id,username)
    // //查询用户是否存在
    // const user = await User.findById(id)
    // if(!user){ 
    //     return res.status(422).send('用户错误')
    // }
    // //查看username
    // if(username !== user.username){
    //     res.status(422).send('用户错误')
    // }
    // else{
    //     //用户存在 查看权限
    //     if(user.isAdmin === '0'){
    //         res.status(409).send('没有权限')
    //     }
    //     else if(user.isAdmin === '1'){
    //     res.send('Admin')
    //    }
    // }
    

    
})


 

module.exports = router