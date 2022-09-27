const bookModel = require("../models/bookModel")
const reviewModel = require("../models/reviewModel")
const mongoose = require("mongoose")


const isValidType = function (value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }
  return true;
};




const createreview = async function (req, res) {

  try {
    const book = req.params.bookId

    if (!mongoose.isValidObjectId(book)) return res.status(400).send({ status: false, message: "provide valid bookId" })

    let data = req.body
    if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "provide some data" })

    const exbook = await bookModel.findOne({ _id: book, isDeleted: false })

    if (!exbook) return res.status(404).send({ status: false, message: "No Book Found Or Deleted" })

    const result = {}

    result.bookId = exbook.id.toString()

    const { reviewedBy, rating, review, isDeleted, reviewedAt } = data
    if (reviewedBy) {
      if (!isValidType(reviewedBy)) return res.status(400).send({ status: false, message: "type must be a string or required some data" })
    }

    result.reviewedBy = reviewedBy

    if (isDeleted) {
      if (typeof isDeleted != "boolean") {
        return res.status(400).send({ status: false, message: "isDeleted type must be boolean" })
      }
      result.isDeleted = isDeleted
    }
    if (!rating) return res.status(400).send({ status: false, message: "Rating Is Required " })

    if (typeof rating != "number") return res.status(400).send({ status: false, message: "rating shoud be in number only" })

    if (rating < 1 || rating > 5) return res.status(400).send({ status: false, message: "rating should be between 1 to 5" })

    result.rating = rating

    if (!isValidType(review)) return res.status(400).send({ status: false, message: "review must be in string" })
    result.review = review

    if (!reviewedAt) return res.status(400).send({ status: false, message: "ReviewedAt Is Required" })


    result.reviewedAt = new Date()

    const createdreviews = await reviewModel.create(result)
    const reviewsData = await reviewModel.findById(createdreviews._id).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1,isDeleted:1 })

    if (reviewsData) {
      const updatebook = await bookModel.findOneAndUpdate(
        { _id: createdreviews.bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true }).lean()

      updatebook['reviewsData'] = reviewsData

      return res.status(201).send({ status: true, message: "Review creation is successful", data: updatebook })
    }

  }
  catch (err) {
    return res.status(500).send({ status: false, message: "server", error: err.message })
  }

}
// **********************************************************update review**************************************************************


const updatereviews = async function (req, res) {
  try {

    const bookId = req.params.bookId

    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "provide valid bookId" })

    const existbook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!existbook) return res.status(404).send({ status: false, message: "book not found or it is deleted" })

    const reviewId = req.params.reviewId

    if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, message: "provide valid reviewid" })

    const existreview = await reviewModel.findOne({ _id: reviewId, bookId: existbook._id, isDeleted: false })

    if (!existreview) return res.status(404).send({ status: false, message: "review not found or deleted" })

    const data = req.body

    if (Object.keys(data).length === 0) return res.status(400).send({ status: false, message: "Please Provide Some Data" })

    const { rating, review, reviewedBy } = data

    const result = {}
    if (reviewedBy) {
      if (!isValidType(reviewedBy)) return res.status(400).send({ status: false, message: "type must be a string or required some data" })

      result.reviewedBy = reviewedBy
    }
    if (rating) {

      if (typeof rating !== "number") return res.status(400).send({ status: false, message: "rating shoud be in number only" })

      if (rating < 1 || rating > 5) return res.status(400).send({ status: false, message: "rating should be between 1 to 5" })

      result.rating = rating
    }
    if (review) {
      if (!isValidType(review)) return res.status(400).send({ status: false, message: "review must be in string" })
      result.review = review
    }
    result.reviewedAt = new Date()

    const updateReview = await reviewModel.findByIdAndUpdate({ _id: reviewId }, { $set: result }, { new: true }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 });


    const obj = {}

    obj.updatedbook = existbook
    obj.review = updateReview

    return res.status(200).send({ status: true, message: "Success", data: obj });


  }
  catch (err) {
    res.status(500).send({ status: false, message: "server error", error: err.message })
  }
}


// ***************************************************deleteapi***********************************************************************

const deletedReview = async function (req, res) {
  try {
    const bookId = req.params.bookId

    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, message: "provide valid bookId" })

    const existbook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!existbook) return res.status(404).send({ status: false, message: "book not found or deleted" })

    const reviweId = req.params.reviewId

    if (!mongoose.isValidObjectId(reviweId)) return res.status(400).send({ status: false, message: "provide valid reviweId" })

    const existreview = await reviewModel.findOne({ _id: reviweId, isDeleted: false })
    if (!existreview) return res.status(404).send({ status: false, message: "review not found or deleted" })

    const deletedReviews = await reviewModel.findByIdAndUpdate({ _id: reviweId }, { $set: { isDeleted: true } }, { new: true })

    if (deletedReviews) {
      const updateBookReview = await bookModel.findOneAndUpdate(
        { _id: bookId, isDeleted: false }, { $inc: { reviews: -1 } }, { new: true }
      )
      return res.status(200).send({ status: true, message: 'Success', data: updateBookReview })
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: "server error", error: err.message })
  }

}



module.exports = { createreview, updatereviews, deletedReview }