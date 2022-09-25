const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const bookModel = require('../models/bookModel')
const userModel = require("../models/userModel")

const authentication = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) token = req.headers['X-api-key']
        if (!token) {
            return res.status(401).send({ status: false, msg: 'token is mandatory' })
        }
        let decodedToken = jwt.verify(token, 'project-3-group-36', function (error, decodedToken) {
            if (error) {
                return res.status(401).send({ status: false, msg: 'token is invalid' })
            } else {
                req.loggedInUserId = decodedToken.userId
                next()
            }
        })
    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}

const authorisation1 = async function (req, res, next) {
    try {
        data = req.body
        const userId = data.userId

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Please Provide Some Data" })

        if(!userId) return res.status(400).send({ status: false, msg: 'Please Provide UserId' })

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ status: false, msg: 'user id is not valid' })
        }
        let userById = await userModel.findById(userId)
        if (!userById) {
            return res.status(404).send({ status: false, msg: 'book id does not exist' })
        }

        if (req.loggedInUserId != userById._id) {
            return res.status(403).send({ status: false, msg: "user unauthorised" })
        }

        next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: "server error", error: err.message })
    }
}


const authorisation2 = async function (req, res, next) {
    try {

        let bookId = req.params.bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: 'book id is not valid' })
        }
        let book = await bookModel.findById({ _id: bookId })
        if (!book) {
            return res.status(404).send({ status: false, msg: 'book id does not exist' })
        }
        if (book.userId != req.loggedInUserId) {
            return res.status(404).send({ status: false, msg: 'user is not allowed to modified the book document' })
        }
        else {
            next()
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}


module.exports = { authentication, authorisation1, authorisation2 }