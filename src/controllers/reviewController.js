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

  try{
  const book = req.params.bookId

  if (!mongoose.isValidObjectId(book)) return res.status(400).send({ status: false, msg: "provide valid bookId" })

  let data = req.body
  if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "provide some data" })

  const exbook = await bookModel.findOne({ _id: book, isDeleted: false })

  if (!exbook) return res.status(404).send({ status: false, msg: "no data found" })

  const result = {}

  result.bookId = exbook.id.toString()

  const { reviewedBy, rating, review, isDeleted } = data
   if(reviewedBy){
       
    if(!reviewedBy){
            result.reviewedBy = 'Guest'
    }
  if (typeof reviewedBy  !== "string" || reviewedBy.trim().length === 0) return res.status(400).send({ status: false, msg: "type must be a string or required some data" })
 
   }

  result.reviewedBy = reviewedBy

  if (isDeleted) {
    if (typeof isDeleted !== "boolean") {
      return res.status(400).send({ status: false, msg: "isDeleted type must be boolean" })
    }
    result.isDeleted = isDeleted
  }
  if(!rating)return res.status(400).send({status:false,msg:"rating is required filed"})

  if (typeof rating != "number") return res.status(400).send({ status: false, msg: "rating shoud be in number only" })

  if (rating < 1 || rating > 5) return res.status(400).send({ status: false, msg: "rating should be between 1 to 5" })

  result.rating = rating

  if (!isValidType(review)) return res.status(400).send({ status: false, msg: "review must be in string" })
  result.review = review

  result.reviewedAt = new Date()

  const createdreviews = await reviewModel.create(result)
  const findcr = await reviewModel.findById(createdreviews._id).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1 })

  if (findcr) {
    const updatebook = await bookModel.findOneAndUpdate(
      { _id: createdreviews.bookId, isDeleted: false }, { $inc: { reviews: 1 } }, { new: true }
    )
         
    return res.status(201).send({ status: true, message: "Success", data: findcr })
  }

}
catch (err){
    return res.status(500).send({status:false,msg:"server" , error:err.message})
}

}
// **********************************************************update review**************************************************************


const updatereviews = async function (req, res) {
  try {

    const bookId = req.params.bookId

    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "provide valid bookId" })

    const existbook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!existbook) return res.status(404).send({ status: false, msg: "book not found or it is deleted" })

    const reviewId = req.params.reviewId

    if (!mongoose.isValidObjectId(reviewId)) return res.status(400).send({ status: false, msg: "provide valid reviewid" })

    const existreview = await reviewModel.findOne({ _id: reviewId, bookId: existbook._id, isDeleted: false })

    if (!existreview) return res.status(404).send({ status: false, msg: "review not found or deleted" })

    const data = req.body

    const { rating, review, reviewedBy } = data

    const result = {}
    if (reviewedBy) {
      if (!isValidType(reviewedBy)) return res.status(400).send({ status: false, msg: "type must be a string or required some data" })

      result.reviewedBy = reviewedBy
    }

    

    if(rating){

      if (typeof rating !== "number") return res.status(400).send({ status: false, msg: "rating shoud be in number only" })

      if (rating < 1 || rating > 5) return res.status(400).send({ status: false, msg: "rating should be between 1 to 5" })

      result.rating = rating
    }
    if (review) {
      if (!isValidType(review)) return res.status(400).send({ status: false, msg: "review must be in string" })
      result.review = review
    }
    result.reviewedAt = new Date()

    const updateReview = await reviewModel.findByIdAndUpdate({ _id: reviewId }, { $set: result }, { new: true }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 });

    
      return res.status(200).send({ status: true, message: "Success", data: updateReview });
    

  }
  catch (err) {
    res.status(500).send({ status: false, msg: "server error", error: err.message })
  }
}


// ***************************************************deleteapi***********************************************************************

const deletedReview = async function (req, res) {
  try {
    const bookId = req.params.bookId

    if (!mongoose.isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "provide valid bookId" })

    const existbook = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!existbook) return res.status(404).send({ status: false, msg: "book not found" })

    const reviweId = req.params.reviewId

    if (!mongoose.isValidObjectId(reviweId)) return res.status(400).send({ status: false, msg: "provide valid reviweId" })

    const existreview = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!existreview) return res.status(404).send({ status: false, msg: "book not found" })

    const deletedReviews = await reviewModel.findByIdAndUpdate({ _id: reviweId }, { $set: { isDeleted: true } }, { new: true })

    if (deletedReviews) {
      const updateBookReview = await bookModel.findOneAndUpdate(
        { _id:bookId, isDeleted: false }, { $inc: { reviews: -1 } }, { new: true }
      )
      return res.status(200).send({ status: true, message: 'Success', data: updateBookReview })
    }
  } catch (err) {
    return res.status(500).send({ status: false, msg: "server error", error: err.message })
  }

}



module.exports = { createreview, updatereviews,deletedReview }