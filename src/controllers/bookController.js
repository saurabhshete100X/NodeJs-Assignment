const bookModel = require("../models/bookModel")
const mongoose = require("mongoose")

const { keyValue } = require("../middleware/validator")    // IMPORTING VALIDATORS ( Destructuring Method )
const ISBNRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/
const isValidDate = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/

const createBooks = async function (req, res) {
    try {
        data = req.body

        const { title, excerpt, userId, ISBN, category, subcategory, reviews, releasedAt } = data

        if (!keyValue(data)) return res.status(400).send({ status: false, msg: "Please Provide Details" })
        if (!title) return res.starus(400).send({ status: false, msg: "Please Provide Title" })
        if (!excerpt) return res.status(400).send({ status: false, msg: "Please Provide Excerpt" })
        if (!userId) return res.status(400).send({ status: false, msg: "Please Provide Excerpt" })

        if (!mongoose.Types.ObjectId.isValid(userId)) {                                                                // userId Validation
            return res.status(403).send({ status: false, msg: "Please Provide Valid userId" })
        }
        if (!ISBN) return res.status(400).send({ status: false, msg: "Please Provide ISBN" })
        if (!ISBNRegex.test(ISBN)) return res.status(400).send({ status: false, msg: "Please Provide Valid ISBN" })
        let duplicateISBN = await bookModel.findOne({ ISBN })                                                    // DB Call
        if (duplicateISBN) return res.status(400).send({ status: false, msg: "ISBN is already registered!" })   // Duplicate Validation


        if (!category) return res.status(400).send({ status: false, msg: "Please Provide Category" })
        if (!subcategory) return res.status(400).send({ status: false, msg: "Please Provide Subcategory" })
        if (!reviews) return res.status(400).send({ status: false, msg: "Please Provide Reviews" })
        if (isValidDate.test(releasedAt)) return res.status(400).send({ status: false, msg: "Please enter releasedAt in the right format(YYYY/MM/DD)!" })


        const bookCreation = await bookModel.create(data)
        res.status(201).send({ status: true, msg: "Book Created Successfully", data: bookCreation })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.msg })
    }
}

module.exports = { createBooks } // Destructuring & Exporting