const express = require("express");
const router = express.Router();
const { myData, logout } = require("../controllers/userConroller");
const { findUsersSuggestion } = require("../controllers/findUserController");
router.post("/logout", logout);
router.get("/me", myData);
router.get("/findEmail", findUsersSuggestion);
module.exports = router;
