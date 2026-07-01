const { UserModel } = require("../models/user");

const myData = async (req, res) => {
  //console.log("user is", req.user);
  const user = await UserModel.findById(req.user.userId);
  // console.log("user total data is ", user);
  res.status(200).json({
    success: true,
    user: {
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    },
  });
};

const logout = (req, res) => {
  // res.clearCookie("access_token", {
  //   httpOnly: true,
  // });
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = { logout, myData };
