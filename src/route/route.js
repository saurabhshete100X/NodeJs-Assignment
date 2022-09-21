const express = require('express')
const route = express.Router()
const {createUser, userLogin} = require("../controllers/userController")
const getbooksbyid = require("../controllers/bookController")


route.post("/register" , createUser)

route.post("/login" , userLogin)
















module.exports=route