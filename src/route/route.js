const express = require('express')
const route = express.Router()
const {createUser, userLogin} = require("../controllers/userController")
const {createBooks, getBooks, getallBooksById,updatedocutment,deletebook} = require("../controllers/bookController")
//const {authorisation} = require('../middleware/auth')

route.post("/register" , createUser)

route.post("/login" , userLogin)

route.post("/books", createBooks)

route.get("/books", getBooks)

route.get("/books/:bookId", getallBooksById)

route.put("/books/:bookId", updatedocutment)

route.delete("/books/:bookId",deletebook)
















module.exports=route