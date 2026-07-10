const { AlbumModel } = require("../models/album");
const { isValidObjectId } = require("../services/validateObjectId");

// Reusable middleware to validate and load album
const loadAlbum = async (req, res, next) => {
  console.log("load working");
  try {
    const { albumId } = req.params;

    if (!isValidObjectId(albumId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid album id" });
    }

    const album = await AlbumModel.findById(albumId);

    if (!album) {
      return res
        .status(404)
        .json({ success: false, message: "Album not found" });
    }

    req.album = album;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// WRITE access (Owner only)
const checkAlbumAccessToChange = (req, res, next) => {
  console.log("check acees to change working");
  const { userId } = req.user;
  const album = req.album;

  const isOwner = album.ownerId.toString() === userId;

  if (!isOwner) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this album",
    });
  }

  req.isAlbumOwner = true;
  next();
};

// READ access (Owner or Shared User)
const checkAlbumAccess = (req, res, next) => {
  console.log("check access to view");
  const { userId, email } = req.user;
  const album = req.album;

  const isOwner = album.ownerId.toString() === userId;
  const isSharedUser = album.sharedWith.includes(email);

  if (!isOwner && !isSharedUser) {
    return res.status(403).json({
      success: false,
      message: "You do not have access to this album",
    });
  }

  req.isAlbumOwner = isOwner;
  next();
};

module.exports = {
  loadAlbum,
  checkAlbumAccess,
  checkAlbumAccessToChange,
};
