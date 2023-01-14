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
        const passwordRegex = /^(?!.\s)[A-Za-z\d@$#!%?&]{8,15}$/
        

        let { name, username, email, password, role, status } = req.body  // Destructuring

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "Please Provide Details" })

        if (!username || !password || !email || !role ) {
            return res.status(400).send({ message: "Missing required fields" })
        }

        // Check if role is valid
    if (role !== "superadmin" && role !== "admin" && role !== "user") {
        return res.status(400).json({
            message: "Invalid role. Role must be superadmin, admin, or user."
        });
    }

        const existingUser = await userModel.findOne({ username })
        if (existingUser) {
            return res.status(400).send({ message: "Username already exists" })
        }

    
        if (name) {
            if (!isValidType(name)) return res.status(400).send({ status: false, message: "Name type must be a string or required some data" })
          }


        if (!name) return res.status(400).send({ status: false, message: "Please Provide Name" })
        if (!nameRegex.test(name)) return res.status(400).send({ status: false, message: "Please Provide Valid Name" })



        if (!email) return res.status(400).send({ status: false, message: "Please Provide Email" })
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: "Please Provide Valid Email" })


        let duplicateEmail = await userModel.findOne({ email })
        if (duplicateEmail) return res.status(400).send({ status: false, message: "email is already registered!" })


        if (!password) return res.status(400).send({ status: false, message: "Please Provide password" })
        if (!passwordRegex.test(password)) return res.status(400).send({ status: false, message: "Please Provide Valid password" })


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
        let token = jwt.sign({
            userId: user._id.toString()
        }, 'project-3-group-36', { expiresIn: '24h' });
        
        const decode = jwt.verify(token,'project-3-group-36')


        res.status(201).send({ status: true, message: 'token created successfully', data: decode,token })

    } catch (err) {
        return res.status(500).send({ status: false, Error: err.message })
    }
}


module.exports = { createUser, userLogin }  // Destructuring & Exporting