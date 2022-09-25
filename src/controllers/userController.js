const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken')

const isValidType = function (value) {
    if (typeof value !== "string" || value.trim().length === 0) {
      return false;
    }
    return true;
  };
  


const createUser = async function (req, res) {
    try {

        const nameRegex = /^[a-z\s]+$/i
        const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/   //change regex
        const mobileRegex = /^([6-9]\d{9})$/
        const passwordRegex = /^(?!.\s)[A-Za-z\d@$#!%?&]{8,15}$/
        const pincodeRegex = /^[1-9][0-9]{6}$/

        let { title, name, email, phone, password, address } = req.body  // Destructuring

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Please Provide Details" })

        if (!title) return res.status(400).send({ status: false, message: "Please Provide Title" })
        let titles = ["Mr", "Mrs", "Miss"]
        if (!titles.includes(title)) return res.status(400).send({ status: false, message: `Title should be among  ${titles} or space is not allowed` })

        if (name) {
            if (!isValidType(name)) return res.status(400).send({ status: false, message: "Name type must be a string or required some data" })
          }


        if (!name) return res.status(400).send({ status: false, message: "Please Provide Name" })
        if (!nameRegex.test(name)) return res.status(400).send({ status: false, message: "Please Provide Valid Name" })


        if (!phone) return res.status(400).send({ status: false, message: "Please Provide Mobile" })
        if (!mobileRegex.test(phone)) return res.status(400).send({ status: false, message: "Please Provide Valid Mobile" })

        let duplicatePhone = await userModel.findOne({ phone })
        if (duplicatePhone) return res.status(400).send({ status: false, message: "phone is already registered!" })

        if (!email) return res.status(400).send({ status: false, message: "Please Provide Email" })
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: "Please Provide Valid Email" })


        let duplicateEmail = await userModel.findOne({ email })
        if (duplicateEmail) return res.status(400).send({ status: false, message: "email is already registered!" })


        if (!password) return res.status(400).send({ status: false, message: "Please Provide password" })
        if (!passwordRegex.test(password)) return res.status(400).send({ status: false, message: "Please Provide Valid password" })


        if (address) {              // Nested If used here
            if (Object.keys(address).length == 0) return res.status(400).send({ status: false, message: "Please enter your address!" })
            if (address.pincode.match(pincodeRegex)) return res.status(400).send({ status: false, message: "Please Provide Valid Pincode" })
        }

        const userCreation = await userModel.create(req.body)
        res.status(201).send({ status: true, message: 'Success', data: userCreation })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}


const userLogin = async function (req, res) {
    try {
        data = req.body
        userName = data.email
        password = data.password

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: 'please enter data' })
        }
        if (!userName) {
            return res.status(400).send({ status: false, message: 'Email is required' })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: 'password is required' })
        }
        let user = await userModel.findOne({ email: userName, password: password })
        if (!user) {
            return res.status(400).send({ status: false, message: 'username or password incorrect' })
        }
        let token = jwt.sign(
            {
                userId: user._id.toString(),
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 10 * 60 * 60
            }, 'project-3-group-36'

        )
        const decode = jwt.verify(token,'project-3-group-36')


        res.status(201).send({ status: true, message: 'token created successfully', data: decode,token })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}


module.exports = { createUser, userLogin }  // Destructuring & Exporting