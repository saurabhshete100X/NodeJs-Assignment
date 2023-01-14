const express = require('express')
const route = express.Router()
const {createUser, userLogin} = require("../controllers/userController")
const {createBooks, getBooks, getallBooksById,updatedocutment,deletebook} = require("../controllers/bookController")
const {authentication, authorisation1,authorisation2,} = require('../middleware/auth')
const {createreview,updatereviews,deletedReview}  = require("../controllers/reviewController")

/// userapi
route.post("/register" , createUser)

route.post("/login" , userLogin)

// protected routes
// route.get("/users", authentication, authorisation1, getUsers);

// route.put("/users/:userId", authentication, authorisation1, updateUser);

// route.delete("/users/:userId", authentication, authorisation1, deleteUser);

// // Bookapi

// route.post("/books",authentication,authorisation1,createBooks)

// route.get("/books",authentication ,getBooks)

// route.get("/books/:bookId",authentication, getallBooksById)

// route.put("/books/:bookId",authentication,authorisation2,updatedocutment)

// route.delete("/books/:bookId",authentication,authorisation2,deletebook)

// // reviewapi
// route.post("/books/:bookId/review",createreview)

// route.put ("/books/:bookId/review/:reviewId",updatereviews)

// route.delete("/books/:bookId/review/:reviewId",deletedReview)

















module.exports=route