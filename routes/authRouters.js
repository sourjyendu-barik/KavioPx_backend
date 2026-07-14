const { googleDetails, devLogin } = require("../controllers/authControllers");

const express = require("express");
const router = express.Router();

router.post("/google", googleDetails);
//router.post("/developer", devLogin);
module.exports = router;
