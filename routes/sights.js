const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const catchAsync = require("../utils/catchAsync");
const sights = require("../controllers/sights");
const { isLoggedIn, validateSight, isSightAuthor } = require("../middleware");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateSight,
  catchAsync(sights.createSight)
);

router.get("/new", isLoggedIn, sights.renderNewForm);

router
  .route("/:sightId")
  .get(catchAsync(sights.showSight))
  .put(
    isLoggedIn,
    isSightAuthor,
    upload.array("image"),
    validateSight,
    catchAsync(sights.updateSight)
  )
  .delete(isLoggedIn, isSightAuthor, catchAsync(sights.deleteSight));

router.get(
  "/:sightId/edit",
  isLoggedIn,
  isSightAuthor,
  catchAsync(sights.renderEditForm)
);

module.exports = router;
