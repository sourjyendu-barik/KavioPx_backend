const { UserModel } = require("../models/user");

const findUsersSuggestion = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res
        .status(200)
        .json({ data: [], success: true, message: "No data provided" });
    }
    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const search = escapeRegex(q.trim());
    //const restrictedUserIds = ["6a586862cf7f960ee72f275e"];
    const users = await UserModel.find({
      //_id: { $nin: restrictedUserIds },
      email: {
        $regex: `^${search}`,
        $options: "i", // case-insensitive
      },
    })
      .select("email -_id")
      .limit(10)
      .lean();

    //extract emails
    const emails = users.map((user) => user.email);
    return res.status(200).json({ data: emails, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "server error while fetching emails",
      error: error.message,
    });
  }
};

module.exports = { findUsersSuggestion };
