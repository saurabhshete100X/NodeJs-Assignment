const express = require('express')
const route = express.Router()
const {createUser, userLogin} = require("../controllers/userController")
const {createBooks, getBooks, getallBooksById} = require("../controllers/bookController")
//const {authorisation} = require('../middleware/auth')

route.post("/register" , createUser)

route.post("/login" , userLogin)

route.post("/books", createBooks)

route.get("/books", getBooks)

route.get("/books/:bookId", getallBooksById)
















module.exports=route