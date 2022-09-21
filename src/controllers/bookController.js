const bookModel = require("../models/bookModel")
const userModel = require("../models/userModel")
const mongoose = require("mongoose")




const createBooks = async function (req, res) {
    try {
        const ISBNRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
        const isValidDate = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/ // regex not work, deletedat date missing
        data = req.body

        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

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


        const bookCreation = await bookModel.create(data)
        res.status(201).send({ status: true, msg: "Book Created Successfully", data: bookCreation })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.msg })
    }
}


const getBooks = async function (req, res) {
    try {
        let data = req.query;
        const { userId, category, subcategory } = data

        if (Object.keys(data) == 0) {
            let findBookwithoutfilter = await bookModel.find({ isDeleted: false })
            return res.status(200).send({ status:true,data: findBookwithoutfilter })
        }
        let user = await userModel.findById(userId)
        if(!user){
            return res.status(404).send({ status: false, message: 'user not found'})
        }
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "userId is not valid" })

        let alldata = { ...data, isDeleted: false }

        const getallbooks = await bookModel.find(alldata).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 });

        if (getallbooks.length == 0) return res.status(404).send({ satus: false, message: "No book is found" })

        getallbooks.sort()

        return res.status(200).send({ status: true, message: 'Books list', data: getallbooks })


    } catch (err) {
        res.status(500).send({ status: false, msg: "server error", error: err.message })
    }
}

// get all book by id

const getallBooksById = async function (req, res) {

    try {
        let bookId = req.params.bookId

        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.satus(400).send({ satus: false, message: "bookId is not valid" })

        let result = await bookModel.findOne({ _id: bookId, isDeleted: false })

        if (!result) return res.satus(404).send({ status: false, message: "bookId does not Exist" })

        let Book = result._id.toString();

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
            reviewsData: review
        }
        return res.status(200).send({ status: true, data: responsedata })
    } catch (err) {
        res.status(500).send({ status: false, msg: "server error", error: err.message })

    }
}

module.exports = { createBooks, getBooks, getallBooksById } // Destructuring & Exporting