const { decode } = require('jsonwebtoken')
const jwt = require('jsonwebtoken')

const middlewareController = {
    // Verify Token
    verifyToken: (req, res, next) => {
        const token = req.headers.token
        if(token) {
            const accessToken = token.split(' ')[1]
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err) => {
                if(err) {
                    return res.status(403).json("Token is not valid!")
                }
                next()
            })
        }else {
            return res.status(401).json("You are not authentication!")
        }
    },
    // Verify Token and Admin
    verifyTokenAndAdmin: (req, res, next) => {
        const token = req.headers.token
        if(token) {
            const accessToken = token.split(' ')[1]
            try{
                const dataJWT = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY)
                // check data of jwt with params.
                if(dataJWT.id == req.params.id || dataJWT.admin){
                    next()
                } else {
                    return res.status(403).json("You are not allowed delete other user!")
                }
            }catch(err) {
                return res.status(401).send('unauthorized');
            }
        }else{
            return res.status("403").json("You are not authentication!")
        }
    }
}

module.exports = middlewareController