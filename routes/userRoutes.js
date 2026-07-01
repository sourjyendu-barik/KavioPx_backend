const express = require("express");
const router = express.Router();
const { myData, logout } = require("../controllers/userConroller");
router.post("/logout", logout);
router.get("/me", myData);
module.exports = router;
