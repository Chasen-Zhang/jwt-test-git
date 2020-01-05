const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const {
    SECRET
} = require('../conf/constants')
const util = require('util')
const verify = util.promisify(jwt.verify)
router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

// 模拟登陆
router.post('/login', async (ctx, next) =>{
    const { userName, password } = ctx.request.body
    let userInfo =null
    if(userName ==='zhangsan' && password ==='abc'){
        // 获取用户信息
        userInfo = {
            userId: 1,
            userName: 'zhangsan',
            nickName: '张三',
            gender: 1 
        }
    }
    // 加密用户信息
    let token
    if (userInfo) {
        token = jwt.sign(userInfo, SECRET, {
            expiresIn: '1h'
        })
    }
    if (userInfo == null) {
        ctx.body = {
            errno: -1,
            msg: '登录失败'
        }
        return
    }
    ctx.body = {
        errno: 0,
        data: token
    }
})

// 获取用户信息
router.get('/getUserInfo', async (ctx, next) => {
    const token = ctx.header.authorization
    try {
        const payload = await verify(token.split(' ')[1], SECRET)
        ctx.body = {
            erron: 0,
            userInfo: payload
        }
    } catch (error) {
        ctx.body = {
            errno: -1,
            msg: 'verify token failed'
        }
    }
    
})
module.exports = router
