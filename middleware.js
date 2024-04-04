const { nationalParkSchema, reviewSchema, hikeSchema } = require("./schemas");
const NationalPark = require("./models/nationalPark");
const Hike = require("./models/hike");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in to access.");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateNationalPark = (req, res, next) => {
  const { error } = nationalParkSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const nationalPark = await NationalPark.findById(id);
  if (!nationalPark.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to do that!");
    return res.redirect(`/nationalParks/${nationalPark._id}`);
  }
  next();
};

module.exports.validateHike = (req, res, next) => {
  const { error } = hikeSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isHikeAuthor = async (req, res, next) => {
  const { id, hikeId } = req.params;
  const nationalPark = await NationalPark.findById(id);
  const hike = await Hike.findById(hikeId);
  if (!hike.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to do that!");
    return res.redirect(`/nationalParks/${nationalPark._id}/hikes/${hike._id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, hikeId, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to do that!");
    return res.redirect(`/nationalParks/${id}/hikes/${hikeId}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
