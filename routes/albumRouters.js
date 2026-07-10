const express = require("express");
const router = express.Router();
const {
  createAlbum,
  updateAlbum,
  addUsers,
  deleteAlbum,
  getAllAlbums,
} = require("../controllers/albumControllers");
const {
  checkAlbumAccessToChange,
  loadAlbum,
} = require("../middlewire/checkAlbumAccess");

router.post("/", createAlbum);
router.put("/:albumId", loadAlbum, checkAlbumAccessToChange, updateAlbum);
router.post("/:albumId/share", loadAlbum, checkAlbumAccessToChange, addUsers);
router.delete("/:albumId", loadAlbum, checkAlbumAccessToChange, deleteAlbum);
router.get("/", getAllAlbums);
module.exports = router;
