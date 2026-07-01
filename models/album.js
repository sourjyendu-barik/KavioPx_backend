const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema({
  name: { type: String, required: true,trim:true },
  description: { type: String ,default:""},
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
},{timestamps:true});

const AlbumModel = mongoose.model("Album", AlbumSchema);
module.exports = { AlbumModel };
