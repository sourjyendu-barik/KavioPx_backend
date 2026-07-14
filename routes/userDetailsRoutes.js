const router = require("express").Router();
const {
  createUserDetails,
  getUserDetails,
  updateUserDetails,
  deleteUserDetails,
} = require("../controllers/userDetailsController");

router.post("/user-details", createUserDetails);
router.get("/user-details", getUserDetails);
router.put("/user-details", updateUserDetails);
router.delete("/user-details", deleteUserDetails);

module.exports = router;
