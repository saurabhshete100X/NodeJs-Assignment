const userModel = require("../models/userModel")

const { keyValue, objectValue } = require("../middleware/validator")


const createUser = async function (req, res) {
    try {

        // const nameRegex = /^[a-zA-Z\s]*$/
        // const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
        // const mobileRegex = /^([6-9]\d{9})$/
        // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
        // const pincodeRegex = /^[1-9][0-9]{5}$/

        // let { title, name, email, phone, password, address } = req.body  // Destructuring

        // if (!keyValue(req.body)) return res.status(400).send({ status: false, msg: "Please Provide Details" })

        // if (!title) return res.status(400).send({ status: false, msg: "Please Provide Title" })
        // let titles = ["Mr", "Mrs", "Miss"]
        // if (!titles.includes(title)) return res.status(400).send({ status: false, msg: `Title should be among  ${titles}` })


        // if (!name) return res.status(400).send({ status: false, msg: "Please Provide Name" })
        // if (name.match(nameRegex)) return res.status(400).send({ status: false, msg: "Please Provide Valid Name" })


        // if (!phone) return res.status(400).send({ status: false, msg: "Please Provide Mobile" })
        // if (phone.match(mobileRegex)) return res.status(400).send({ status: false, msg: "Please Provide Valid Mobile" })


        // if (!email) return res.status(400).send({ status: false, msg: "Please Provide Email" })
        // if (email.match(emailRegex)) return res.status(400).send({ status: false, msg: "Please Provide Valid Email" })


        // let duplicateEmail = await userModel.findOne({ email })
        // if (duplicateEmail) return res.status(400).send({ status: false, msg: "email is already registered!" })


        // if (!password) return res.status(400).send({ status: false, msg: "Please Provide Email" })
        // if (password.match(passwordRegex)) return res.status(400).send({ status: false, msg: "Please Provide Valid Email" })


        // if (address) {              // Nested If used here
        //     if (!keyValue(address)) return res.status(400).send({ status: false, msg: "Please enter your address!" })
        //     if (address.pincode.match(pincodeRegex)) return res.status(400).send({ status: false, msg: "Please Provide Valid Pincode" })
        // }

        const userCreation = await userModel.create(req.body)
        res.status(201).send({ status: true, message: 'Success', data: userCreation })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}

module.exports = { createUser }  // Destructuring & Exporting