const express = require('express')
const route = express.Router()
const {createUser, userLogin} = require("../controllers/userController")
const {createBooks, getBooks, getallBooksById,updatedocutment,deletebook} = require("../controllers/bookController")
const {authentication, authorisation1,authorisation2} = require('../middleware/auth')

route.post("/register" , createUser)

route.post("/login" , userLogin)

route.post("/books",authentication,authorisation1, createBooks)

route.get("/books",authentication ,getBooks)

route.get("/books/:bookId",authentication, getallBooksById)

route.put("/books/:bookId",authentication,authorisation2,updatedocutment)

route.delete("/books/:bookId",authentication,authorisation2,deletebook)
















module.exports=route