const mongoose = require("mongoose");
const { Schema } = mongoose;

const userDetailsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
      default: "",
    },
    role: {
      type: String,
      trim: true,
      enum: {
        values: ["user", "admin", "moderator"],
        message: "Role must be one of: user, admin, moderator",
      },
      default: "user",
    },
    about: {
      type: String,
      trim: true,
      maxlength: [500, "About cannot exceed 500 characters"],
      default: "",
    },
    hobbies: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length <= 20;
        },
        message: "You can add a maximum of 20 hobbies",
      },
      default: [],
    },
  },
  { timestamps: true },
);
const UserDetailsModel = mongoose.model("UserDetails", userDetailsSchema);
module.exports = { UserDetailsModel };
