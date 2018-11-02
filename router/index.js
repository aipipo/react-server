const express=require('express');
//引入md5加密
const md5=require('blueimp-md5');
const Users=require('../model/user');

const Router=express.Router;

const router=new Router();
router.use(express.urlencoded({extended:true}));

//登录
router.post('/login', async (req, res) => {
  //1. 收集用户提交信息
  const {username, password} = req.body;
  //2. 判断用户输入是否合法
  if (!username || !password) {
    //说明有数据不合法
    res.json({
      "code": 2,
      "msg": "用户输入不合法"
    });
    return;
  }
  //3. 去数据库中查找是否有指定用户和密码
  try {
    const data = await Users.findOne({username, password: md5(password)});
    
    if (data) {
      //说明用户找到了，登录成功，返回成功的响应
      res.json({
        "code": 0,
        "data": {
          "_id": data.id,
          "username": data.username,
          "type": data.type
        }
      })
    } else {
      //说明用户名或密码错误，返回失败的响应
      res.json({
        "code": 1,
        "msg": "用户名或密码错误"
      })
    }
  } catch (e) {
    res.json({
      "code": 3,
      "msg": "网络不稳定，请重新试试~"
    })
  }
  
})

//注册
router.post('/register',async (req, res) => {
  // 1. 收集用户提交信息
  const {username, password, type} = req.body;
  console.log(username, password, type);
  // 2. 判断用户输入是否合法
  if (!username || !password || !type) {
    //说明有数据不合法
    res.json({
      "code": 20,
      "msg": "用户输入不合法"
    });
    return;
  }
  // 3. 去数据库查找用户是否存在
  
  try {
    const data = await Users.findOne({username});
    
    if (data) {
      //返回错误
      res.json({
        "code": 1,
        "msg": "用户名已存在"
      });
    } else {
      const data = await Users.create({username, password: md5(password), type});
      //返回成功的响应
      res.json({
        code: 0,
        data: {
          _id: data.id,
          username: data.username,
          type: data.type
        }
      })
    }
  } catch (e) {
    //说明findOne / create方法出错了
    //返回失败的响应
    res.json({
      "code": 3,
      "msg": "网络不稳定，请重新试试~"
    })
  }
  
})


module.exports=router;




