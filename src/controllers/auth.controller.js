const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { json } = require('express/lib/response');

let refreshTokens = [];

const authController = {
  // REGISTER
  registerUser: async (req, res, next) => {
    try {
      const salt = await bcrypt.genSalt(10);
      // Create new user
      const newUser = await new User({
        username: req.body.username,
        address: req.body.address,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, salt),
      });
      // Save user in db
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_ACCESS_KEY,
      { expiresIn: '20s' }
    );
  },
  // GENERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        admin: user.admin,
      },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: '5d' }
    );
  },
  // LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      // Check username
      if (!user) {
        return res.status(404).json("Can't found username!");
      }
      // Check password
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json('Invalid password!');
      }
      if (user && validPassword) {
        // Access Token
        const accessToken = authController.generateAccessToken(user);
        // Refresh Token
        const refreshToken = authController.generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        // Save refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          path: '/',
          sameSite: 'strict',
        });
        // Not display password
        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  // REFRESH
  requestRefreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).json('You are not authentication!');
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json('Token have been had by you!');
    }
    const dataJWT = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
    if (!dataJWT) {
      return res.status(403).json('Token is not valid!');
    }
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = authController.generateAccessToken(dataJWT);
    const newRefreshToken = authController.generateRefreshToken(dataJWT);
    refreshTokens.push(newRefreshToken);
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict',
    });
    res.status(200).json({ accessToken: newAccessToken });
  },
};

module.exports = authController;
