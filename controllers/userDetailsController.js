const { UserModel } = require("../models/user");
const { UserDetailsModel } = require("../models/userDetails");

const allowedRoles = ["user", "admin", "moderator"];

// simple reusable validator
const validateUserDetailsInput = ({ location, role, about, hobbies }) => {
  const errors = [];

  if (location !== undefined && typeof location !== "string") {
    errors.push("Location must be a string");
  }
  if (location && location.length > 100) {
    errors.push("Location cannot exceed 100 characters");
  }

  if (role !== undefined && !allowedRoles.includes(role)) {
    errors.push(`Role must be one of: ${allowedRoles.join(", ")}`);
  }

  if (about !== undefined && typeof about !== "string") {
    errors.push("About must be a string");
  }
  if (about && about.length > 500) {
    errors.push("About cannot exceed 500 characters");
  }

  if (hobbies !== undefined) {
    if (!Array.isArray(hobbies)) {
      errors.push("Hobbies must be an array of strings");
    } else if (!hobbies.every((h) => typeof h === "string")) {
      errors.push("Each hobby must be a string");
    } else if (hobbies.length > 20) {
      errors.push("You can add a maximum of 20 hobbies");
    }
  }

  return errors;
};

// CREATE
const createUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { location, role, about, hobbies } = req.body;

    const validationErrors = validateUserDetailsInput({
      location,
      role,
      about,
      hobbies,
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const existing = await UserDetailsModel.findOne({ userId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "UserDetails already exists for this user, use update instead",
      });
    }

    const userDetails = new UserDetailsModel({
      userId,
      location,
      role,
      about,
      hobbies,
    });
    await userDetails.save();

    res.status(201).json({
      success: true,
      message: "User details created successfully",
      userDetails,
    });
  } catch (err) {
    // Mongoose validation errors land here too (e.g. bad enum)
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error creating user details",
      error: err.message,
    });
  }
};

// UPDATE
const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { location, role, about, hobbies } = req.body;

    const validationErrors = validateUserDetailsInput({
      location,
      role,
      about,
      hobbies,
    });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const updated = await UserDetailsModel.findOneAndUpdate(
      { userId },
      { $set: { location, role, about, hobbies } },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "UserDetails not found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      userDetails: updated,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: messages,
      });
    }
    res.status(500).json({
      success: false,
      message: "Error updating user details",
      error: err.message,
    });
  }
};

// GET
const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;

    const userDetails = await UserDetailsModel.findOne({ userId });

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "UserDetails not found for this user",
      });
    }

    res.status(200).json({
      success: true,
      userDetails,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: err.message,
    });
  }
};

// DELETE
const deleteUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;

    const deleted = await UserDetailsModel.findOneAndDelete({ userId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "UserDetails not found for this user",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error deleting user details",
      error: err.message,
    });
  }
};

module.exports = {
  createUserDetails,
  updateUserDetails,
  getUserDetails,
  deleteUserDetails,
};
