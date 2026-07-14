const router = require("express").Router();
const { checkMulter } = require("../middlewire/multerMiddleWire");
const {
  addImage,
  getAllImagesInAlbum,
  getFavoriteImagesInAlbum,
  getImagesByTags,
  toggleFavoriteImage,
  addCommentToImage,
  deleteImage,
} = require("../controllers/imageController");

const { upload } = require("../utils/multer.Configs");
const {
  checkAlbumAccessToChange,
  checkAlbumAccess,
  loadAlbum,
} = require("../middlewire/checkAlbumAccess");

// console.log({
//   checkAlbumAccess: typeof checkAlbumAccess,
//   checkMulter: typeof checkMulter,
//   addImage: typeof addImage,
//   upload: typeof upload,
//   uploadSingle: typeof upload.single,
// });

// console.log("upload=", upload);
router.post(
  "/:albumId/images",
  loadAlbum,
  checkAlbumAccessToChange,
  upload.single("image"),
  checkMulter,
  addImage,
);
// router.post("/:albumId/images", upload.single("image"), addImage);

//get routes
router.get(
  "/:albumId/images",
  loadAlbum,
  checkAlbumAccess,
  getAllImagesInAlbum,
);
router.get(
  "/:albumId/images/favorites",
  loadAlbum,
  checkAlbumAccess,
  getFavoriteImagesInAlbum,
);
router.get(
  "/:albumId/images/tags",
  loadAlbum,
  checkAlbumAccess,
  getImagesByTags,
);

router.put(
  "/:albumId/images/:imageId/favorite",
  loadAlbum,
  checkAlbumAccessToChange,
  toggleFavoriteImage,
);

router.post(
  "/:albumId/images/:imageId/comments",
  loadAlbum,
  checkAlbumAccess,
  addCommentToImage,
);

router.delete(
  "/:albumId/images/:imageId",
  loadAlbum,
  checkAlbumAccessToChange,
  deleteImage,
);
module.exports = router;
