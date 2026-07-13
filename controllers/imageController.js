const path = require("path");
const fs = require("fs");
const { cloudinary } = require("../utils/cloudinaryConfigs");
const { ImageModel } = require("../models/image");
const { isValidObjectId } = require("../services/validateObjectId");
const { validateImageInput } = require("../services/validateImageInput");
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".gif", ".jfif"];
const MAX_SIZE = 5 * 1024 * 1024;

// POST /albums/:albumId/images
const addImage = async (req, res) => {
  try {
    const albumId = req.album._id; // trusted, already validated + fetched by middleware
    const { tags, person, isFavorite } = req.body;
    // console.log(albumId, tags, person, isFavorite);
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const validate = validateImageInput({ tags, person, isFavorite });
    if (!validate.valid) {
      fs.unlinkSync(req.file.path);
      return res
        .status(422)
        .json({ success: false, message: validate.message });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      fs.unlinkSync(req.file.path);
      return res
        .status(400)
        .json({ success: false, message: "Invalid file type" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "albums",
    });
    //if in temp file any data there remove
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    // only set album cover url if it doesn't already have one
    if (!req.album.url) {
      req.album.url = result.secure_url;
      await req.album.save();
    }

    const image = await ImageModel.create({
      albumId,
      name: req.file.originalname,
      url: result.secure_url,
      publicId: result.public_id,
      size: req.file.size,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      person,
      isFavorite: isFavorite === "true",
      comments: [],
      uploadedAt: new Date(),
    });

    return res
      .status(201)
      .json({ success: true, message: "Image uploaded", data: image });
  } catch (error) {
    console.error(error);
    // cleanup temp file if it still exists after an unexpected failure
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /albums/:albumId/images
const getAllImagesInAlbum = async (req, res) => {
  try {
    const albumId = req.album._id;
    const images = await ImageModel.find({ albumId }).lean();
    return res.status(200).json({ success: true, data: images });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /albums/:albumId/images/favorites
const getFavoriteImagesInAlbum = async (req, res) => {
  try {
    const albumId = req.album._id;
    const favoriteImages = await ImageModel.find({
      albumId,
      isFavorite: true,
    }).lean();
    return res.status(200).json({ success: true, data: favoriteImages });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /albums/:albumId/images?tags=tag1,tag2
const getImagesByTags = async (req, res) => {
  try {
    const albumId = req.album._id;
    const { tags } = req.query;

    if (!tags) {
      return res
        .status(400)
        .json({ success: false, message: "tags query param is required" });
    }

    const tagArray = tags.split(",").map((t) => t.trim());

    const images = await ImageModel.find({
      albumId,
      tags: { $in: tagArray },
    }).lean();

    return res.status(200).json({ success: true, data: images });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /albums/:albumId/images/:imageId/favorite
const toggleFavoriteImage = async (req, res) => {
  try {
    const albumId = req.album._id;
    const { imageId } = req.params;
    const { isFavorite } = req.body;

    if (!isValidObjectId(imageId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid image id" });
    }

    let favorite = isFavorite;

    if (typeof favorite === "string") {
      if (!["true", "false"].includes(favorite)) {
        return res.status(422).json({
          success: false,
          message: "isFavorite must be true or false",
        });
      }

      favorite = favorite === "true";
    }

    if (typeof favorite !== "boolean") {
      return res.status(422).json({
        success: false,
        message: "isFavorite must be a boolean",
      });
    }

    const image = await ImageModel.findOneAndUpdate(
      { _id: imageId, albumId },
      { isFavorite: favorite },
      { returnDocument: "after" }, // instead of { new: true }
    );

    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found in this album" });
    }

    return res.status(200).json({ success: true, data: image });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /albums/:albumId/images/:imageId/comments
const addCommentToImage = async (req, res) => {
  try {
    const albumId = req.album._id;
    const { imageId } = req.params;
    const { comment } = req.body;

    if (!isValidObjectId(imageId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid image id" });
    }
    if (typeof comment !== "string" || !comment.trim()) {
      return res.status(422).json({
        success: false,
        message: "Comment must be a non-empty string",
      });
    }

    const image = await ImageModel.findOneAndUpdate(
      { _id: imageId, albumId },
      { $push: { comments: comment.trim() } },
      { new: true },
    );

    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found in this album" });
    }

    return res.status(200).json({ success: true, data: image });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /albums/:albumId/images/:imageId
const deleteImage = async (req, res) => {
  try {
    const albumId = req.album._id;
    const { imageId } = req.params;

    if (!isValidObjectId(imageId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid image id" });
    }

    const image = await ImageModel.findOne({ _id: imageId, albumId });
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found in this album" });
    }

    // remove from Cloudinary first, then DB
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }
    await image.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addImage,
  getAllImagesInAlbum,
  getFavoriteImagesInAlbum,
  getImagesByTags,
  toggleFavoriteImage,
  addCommentToImage,
  deleteImage,
};
