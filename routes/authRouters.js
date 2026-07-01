const { googleDetails } = require("../controllers/authControllers");

const express = require("express");
const router = express.Router();

router.post("/google", googleDetails);
module.exports = router;
