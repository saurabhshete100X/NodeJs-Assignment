const express = require('express')
const route = express.Router()
const {createUser, userLogin} = require("../controllers/userController")
const {createBooks } = require("../controllers/bookController")


route.post("/register" , createUser)

route.post("/login" , userLogin)

route.post("/books", createBooks)












module.exports=route