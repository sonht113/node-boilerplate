const User = require('../models/User')
const bcrypt = require('bcrypt')

const authController = {
    // REGISTER
    registerUser: async (req, res, next) => {
        try {
            const salt = await bcrypt.genSalt(10)
            // Create new user
            const newUser = await new User({
                username: req.body.username,
                address: req.body.address,
                email: req.body.email,
                password: await bcrypt.hash(req.body.password, salt)
            })
            // Save user in db
            const user = await newUser.save()
            res.status(200).json(user)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    // LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({username: req.body.username})
            // Check username
            if(!user) {
                res.status(404).json("Can't found username!")
            }
            // Check password
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if(!validPassword) {
                res.status(404).json("Invalid password!")
            }
            if(user && validPassword) {
                res.status(200).json(user)
            }
        }catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = authController