const { AlbumModel } = require("../models/album");
const { isValidObjectId } = require("../services/validateObjectId");
const { UserModel } = require("../models/user");
const { validateAlbumInput } = require("../services/validateAlbumInput");
const { ImageModel } = require("../models/image");
const {
  isAlbumNameTaken,
  createAlbumRecord,
} = require("../services/albumServices");
const { cloudinary } = require("../utils/cloudinaryConfigs");
const createAlbum = async (req, res) => {
  try {
    const { name, description } = req.body;
    //validate the name and description by "validateAlbumInput" services
    //i/p-> {name,description}
    // o/p-> {valid:boolean, data: {},message:string}
    const validate = validateAlbumInput({ name, description });
    if (!validate.valid) {
      return res
        .status(422)
        .json({ success: false, message: validate.message });
    }
    //after the input validation check for duplicate name ip->{name,ownerId} op-> boolean
    const { name: validatedName, description: validatedDescription } =
      validate.data;
    const ownerId = req.user.userId;
    const nameTaken = await isAlbumNameTaken(validatedName, ownerId);
    if (nameTaken) {
      return res
        .status(409)
        .json({ success: false, message: "Album name already exists" });
    }
    //if the name not taken save it
    const album = await createAlbumRecord({
      name: validatedName,
      description: validatedDescription,
      ownerId,
    });
    res.status(201).json({ success: true, data: album });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateAlbum = async (req, res) => {
  try {
    const albumDetails = req.album; // already fetched + ownership verified by middleware

    const { description } = req.body;
    if (
      !description ||
      typeof description !== "string" ||
      description.trim() === ""
    ) {
      return res
        .status(422)
        .json({ success: false, message: "Validation error" });
    }

    albumDetails.description = description;
    await albumDetails.save();
    return res.status(200).json({
      success: true,
      data: albumDetails,
      message: "Album updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const addUsers = async (req, res) => {
  try {
    // album already fetched and ownership verified by checkAlbumAccessToChange middleware
    const albumDetails = req.album;

    // Step 1: validate that emails is a non-empty array
    const { emails } = req.body;
    if (!Array.isArray(emails)) {
      return res.status(422).json({
        success: false,
        message: "Emails must be an array",
      });
    }

    // Step 2: validate the format of each email in the array
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of emails) {
      if (typeof email !== "string" || !emailRegex.test(email)) {
        return res.status(422).json({
          success: false,
          message: `Invalid email: ${email}`,
        });
      }
    }

    // Step 3: check which of the given emails actually belong to registered users
    const users = await UserModel.find({ email: { $in: emails } });
    const foundEmails = new Set(users.map((u) => u.email));

    // Step 4: identify emails that don't correspond to any existing user
    const missingEmails = emails.filter((email) => !foundEmails.has(email));
    if (missingEmails.length > 0) {
      return res.status(404).json({
        success: false,
        message: "Some users do not exist",
        missingUsers: missingEmails,
      });
    }

    // // Step 5: merge new emails into sharedWith, removing duplicates via Set
    // albumDetails.sharedWith = [
    //   ...new Set([...albumDetails.sharedWith, ...emails]),
    // ];

    // Step 5: replace sharedWith with the exact set of emails sent
    albumDetails.sharedWith = [...new Set(emails)];

    // Step 6: persist the updated album document
    await albumDetails.save();

    // Step 7: respond with success and the updated album
    return res.status(200).json({
      success: true,
      message: "Users added successfully",
      data: albumDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const albumDetails = req.album; // already fetched + ownership verified by middleware
    // Get all images in the album
    const images = await ImageModel.find({ albumId: albumDetails._id });

    // Delete images from Cloudinary
    for (const image of images) {
      if (image.publicId) {
        const result = await cloudinary.uploader.destroy(image.publicId);

        if (result.result !== "ok") {
          return res.status(500).json({
            success: false,
            message: `Failed to delete image '${image.name}' from Cloudinary.`,
          });
        }
      }
    }
    //delete image documents and album document
    await Promise.all([
      ImageModel.deleteMany({ albumId: albumDetails._id }),
      albumDetails.deleteOne(),
    ]);

    return res.status(200).json({
      success: true,
      data: albumDetails._id,
      message: "Album deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const getAllAlbums = async (req, res) => {
  try {
    const { userId, email } = req.user;
    const albums = await AlbumModel.find({
      $or: [{ ownerId: userId }, { sharedWith: email }],
    });

    return res.status(200).json({
      success: true,
      data: albums,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
module.exports = {
  createAlbum,
  updateAlbum,
  addUsers,
  deleteAlbum,
  getAllAlbums,
};
