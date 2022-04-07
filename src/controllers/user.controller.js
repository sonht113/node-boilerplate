const User = require("../models/User")


const userController = {
    // GET ALL USER
    getAllUser: async (req, res) => {
      try{
        const users = await User.find()
        return res.status(200).json(users)
      }catch(err) {
        return res.status(500).json(err)
      }
    },
    // DELETE USER
    deleteUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id)
            // const user = await User.findByIdAndDelete(req.params.id)
            return res.status(200).json("Delete succesfully!")
        }catch(err) {
            return res.status(500).json(err)
        }
    }
}

module.exports = userController
