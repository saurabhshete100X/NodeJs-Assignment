const express = require('express')
const route = express.Router()
const {createUser, userLogin} = require("../controllers/userController")


route.post("/register" , createUser)

route.post("/login" , userLogin)














module.exports=route