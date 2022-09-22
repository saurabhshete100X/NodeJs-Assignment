const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const mongoose = require("mongoose")
const reviweModel = require("../models/reviewModel")


const createBooks = async function (req, res) {
    try {
        const ISBNRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
        const isValidDate = /^\d{4}\--(0[1-9]|1[012])\--(0[1-9]|[12][0-9]|3[01])$/
        data = req.body

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt, isDeleted } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Please Provide Details" })
        if (!title) return res.status(400).send({ status: false, msg: "Please Provide Title" })
        let duplicateTitle = await bookModel.findOne({ title })                                                    // DB Call
        if (duplicateTitle) return res.status(400).send({ status: false, msg: "title is already registered!" })   // Duplicate Validation
        if (!excerpt) return res.status(400).send({ status: false, msg: "Please Provide Excerpt" })
        if (!userId) return res.status(400).send({ status: false, msg: "Please Provide userId" })

        if (!mongoose.Types.ObjectId.isValid(userId)) {                                                                // userId Validation
            return res.status(403).send({ status: false, msg: "Please Provide Valid userId" })
        }
        if (!ISBN) return res.status(400).send({ status: false, msg: "Please Provide ISBN" })
        if (!ISBNRegex.test(ISBN)) return res.status(400).send({ status: false, msg: "Please Provide Valid ISBN" })
        let duplicateISBN = await bookModel.findOne({ ISBN })                                                    // DB Call
        if (duplicateISBN) return res.status(400).send({ status: false, msg: "ISBN is already registered!" })   // Duplicate Validation

        if (!category) return res.status(400).send({ status: false, msg: "Please Provide Category" })
        if (!subcategory) return res.status(400).send({ status: false, msg: "Please Provide Subcategory" })
        if (isValidDate.test(releasedAt)) return res.status(400).send({ status: false, msg: "Please enter releasedAt in the right format(YYYY/MM/DD)!" })
        if (isDeleted === true) {
            data.deletedAt = new Date()
        }

        const bookCreation = await bookModel.create(data)
        res.status(201).send({ status: true, msg: "Book Created Successfully", data: bookCreation })

    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}


const getBooks = async function (req, res) {
    try {
        let data = req.query;
   
          const {userId,category,subcategory} = data
        if (Object.keys(data).length == 0) {
            let findBookwithoutfilter = await bookModel.find({ isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
            return res.status(200).send({ status: true, data: findBookwithoutfilter })
        }
        if (!(userId || category || subcategory )) {
            return res.status(400).send({ satus: false, message: "provide valid filters" })
        }
        if (userId) {
            
            if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "userId is not valid" })

            let alluser = await userModel.findById(userId)

            if (!alluser) return res.status(404).send({ status: false, msg: "user not found" })

        }
        const allbooks = { ...data, isDeleted: false }

        const getallbooks = await bookModel.find(allbooks).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })

        if (getallbooks.length == 0) return res.status(404).send({ satus: false, message: "No book is found" })

        return res.status(200).send({ status: true, message: 'Books list', data: getallbooks })


    } catch (err) {
        return res.status(500).send({ status: false, msg: "server error", error: err.message })
    }
}

// get all book by id

const getallBooksById = async function (req, res) {

    try {
        let bookId = req.params.bookId

        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ satus: false, message: "bookId is not valid" })

        let allbook = await bookModel.findById(bookId)
        if (!allbook) return res.status(404).send({ satus: false, msg: "book not found" })

        let result = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!result) return res.status(404).send({ status: false, message: "bookId does not Exist" })

        let Book = result._id;

        const review = await reviweModel.find({ bookId: Book }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })

        responsedata = {
            _id: result._id,
            title: result.title,
            excerpt: result.excerpt,
            userId: result.userId,
            category: result.category,
            subcategory: result.subcategory,
            isDeleted: result.isDeleted,
            reviews: result.reviews,
            releasedAt: result.releasedAt,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
            reviewsData: review
        }
        return res.status(200).send({ status: true, data: responsedata })
    } catch (err) {
        res.status(500).send({ status: false, msg: "server error", error: err.message })

    }
}

// ***********************************************put api************************************************************************8

const updatedocutment = async function (req, res) {
    try {

        const isValidDate = /^\d{4}\--(0[1-9]|1[012])\--(0[1-9]|[12][0-9]|3[01])$/

        const bodydata = req.body
        let bookId = req.params.bookId

        const { title, excerpt, releasedAt, ISBN } = bodydata

        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "please provide valid bookId" })
        if (Object.keys(bodydata).length == 0) return res.status(400).send({ satus: false, msg: "for updation data is required" })

        if (!(title || excerpt || releasedAt || ISBN)) {
            return res.status(400).send({ satus: false, message: "only update title, excerpt, releasedAt, ISBN" })
        }
        let noData = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!noData) return res.status(404).send({ satus: false, msg: "no books found" })
        
        let duplicateTitle = await bookModel.findOne({ title })
        if (duplicateTitle) return res.status(400).send({ status: false, msg: "title is already registered!" })

        let duplicateISBN = await bookModel.findOne({ ISBN })
        if (duplicateISBN) return res.status(400).send({ status: false, msg: "ISBN is already registered!" })

        if (isValidDate.test(releasedAt)) return res.status(400).send({ status: false, msg: "Please enter releasedAt in the right format(YYYY-MM-DD)!" })

        const updateBook = await bookModel.findByIdAndUpdate({ _id: noData._id }, { $set: bodydata }, { new: true })

        return res.status(200).send({ satus: false, message: "book updated sucessfully", data: updateBook })

    } catch (err) {
        return res.status(500).send({ status: false, msg: "server error", Error: err.message })
    }
}
// ************************************************delete by id*****************************************************************

const deletebook = async function (req, res) {
    try {
        const  bookId = req.params.bookId

        if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ satus: false, msg: "provide valid object Id" })

        let dbcall = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!dbcall) return res.status(404).send({ satus: false, msg: "no books found" })

         const updateBook = await bookModel.findOneAndUpdate({ _id: bookId }, { isDeleted: true, deletedAt: new Date() }, { new: true })

        return res.status(200).send({ status: true, message: "data deleted sucessfully" })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: "server error", error: err.message })
    }
}
module.exports = { createBooks, getBooks, getallBooksById, updatedocutment, deletebook }