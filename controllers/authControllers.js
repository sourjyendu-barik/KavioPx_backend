const axios = require("axios");
const { UserModel } = require("../models/user");
const jwt = require("jsonwebtoken");
const { setSecureCookie } = require("../services/index");
const { oauth2client } = require("../utils/googleConfigs");
const googleDetails = async (req, res) => {
  // console.log("controllers reacheed");
  //console.log(req.body);
  try {
    const { code } = req.body;

    const googleRes = await oauth2client.getToken(code);
    //console.log("token ok", googleRes);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${googleRes.tokens.access_token}`,
        },
      },
    );

    //console.log(userRes.data);

    const { id, name, email, picture } = userRes.data;

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        name,
        email,
        googleId: id,
        profilePicture: picture,
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    setSecureCookie(res, token);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        joined: user.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Google Sign-In failed",
    });
  }
};

// controllers/authController.js (add this alongside googleDetails)
const devLogin = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Test user not found" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    setSecureCookie(res, token);

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Dev login failed" });
  }
};

module.exports = { googleDetails, devLogin };
