const express = require('express')
//const bodyPareser = require('body-parser')
//const res = require('express/lib/response')
const cors = require('cors')
const mongo = require('./config/db')
//const UserRoute = require('./router/user')
//const ItemRoute = require('./router/item')
const routes = require('./router')

const router = express.Router()
const app = new express()

mongo(app)
app.use(cors())


// router.get('/',(req,res)=>{
//     res.send('hello world')
// })

//app.use(bodyPareser.json())
//app.use(bodyPareser.urlencoded({extended:true}))

app.use(express.json())
app.use(express.urlencoded({extended:false}))


routes(app)
//app.use('/user',UserRoute)
//app.use('/item',ItemRoute)

app.listen(3000,()=>{
    console.log('server listen at 3000')
    
})
    