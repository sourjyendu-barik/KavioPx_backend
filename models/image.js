const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: true,
    },
    name: { type: String, required: true },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
    person: { type: String, default: "" },
    isFavorite: { type: Boolean, default: false },
    comments: [{ type: String }],
    size: { type: Number, required: true },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const ImageModel = mongoose.model("Image", imageSchema);
module.exports = { ImageModel };
