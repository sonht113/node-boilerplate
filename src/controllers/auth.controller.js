const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenService = require('../services/token.service')
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
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
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
        const accessToken = tokenService.generateAccessToken(user);
        // Refresh Token
        const refreshToken = tokenService.generateRefreshToken(user);
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
    const newAccessToken = tokenService.generateAccessToken(dataJWT);
    const newRefreshToken = tokenService.generateRefreshToken(dataJWT);
    refreshTokens.push(newRefreshToken);
    console.log(refreshTokens)
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'strict',
    });
    res.status(200).json({ accessToken: newAccessToken });
  },
  // LOG OUT
  logoutUser: async (req, res) => {
    res.clearCookie('refreshToken');
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
    return res.status(200).json("Log out successfully!")
  }
};

module.exports = authController;
