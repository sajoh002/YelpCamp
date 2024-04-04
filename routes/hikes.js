const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const catchAsync = require("../utils/catchAsync");
const hikes = require("../controllers/hikes");
const { isLoggedIn, validateHike, isHikeAuthor } = require("../middleware");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateHike,
  catchAsync(hikes.createHike)
);

router.get("/new", isLoggedIn, hikes.renderNewForm);

router
  .route("/:hikeId")
  .get(catchAsync(hikes.showHike))
  .put(
    isLoggedIn,
    isHikeAuthor,
    upload.array("image"),
    validateHike,
    catchAsync(hikes.updateHike)
  )
  .delete(isLoggedIn, isHikeAuthor, catchAsync(hikes.deleteHike));

router.get(
  "/:hikeId/edit",
  isLoggedIn,
  isHikeAuthor,
  catchAsync(hikes.renderEditForm)
);

module.exports = router;
