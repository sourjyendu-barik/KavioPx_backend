const { AlbumModel } = require("../models/album");

const isAlbumNameTaken = async (name, ownerId, excludeId = null) => {
  //By this while creating new album the duplicate name check happens
  const query = {
    name: name,
    ownerId,
  };
  //we will use this same function for update , so it will prevent the same name confusion while updtae
  //By this way while update the usercant give same name that alreday exist
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingAlbum = await AlbumModel.findOne(query);
  //!! use for strict true/false
  console.log("exsotance check working");
  return !!existingAlbum;
};

const createAlbumRecord = async ({ name, description, ownerId }) => {
  console.log("Createalbum working");
  const album = new AlbumModel({ name, description, ownerId });
  await album.save();

  return album;
};

module.exports = { isAlbumNameTaken, createAlbumRecord };
