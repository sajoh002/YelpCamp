const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const catchAsync = require("../utils/catchAsync");
const nationalParks = require("../controllers/nationalParks");
const { isLoggedIn, validateNationalPark, isAuthor } = require("../middleware");

const router = express.Router();

router
  .route("/")
  .get(catchAsync(nationalParks.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateNationalPark,
    catchAsync(nationalParks.createNationalPark)
  );

router.get("/new", isLoggedIn, nationalParks.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(nationalParks.showNationalPark))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateNationalPark,
    catchAsync(nationalParks.updateNationalPark)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(nationalParks.deleteNationalPark));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(nationalParks.renderEditForm)
);

module.exports = router;
