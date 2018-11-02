const express = require('express');
//连接数据库
const db=require('./db');

const router =require('./router');

const app=express();

(async ()=>{
  await db;
  app.use(router);
})()

app.listen(4000,err=>{
  if (!err) {
      console.log('服务器启动成功');
  } else {
      console.log(err);
  }
});
