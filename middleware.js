const { nationalParkSchema, reviewSchema, sightSchema } = require("./schemas");
const NationalPark = require("./models/nationalPark");
const Sight = require("./models/sight");
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

module.exports.validateSight = (req, res, next) => {
  const { error } = sightSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isSightAuthor = async (req, res, next) => {
  const { id, sightId } = req.params;
  const nationalPark = await NationalPark.findById(id);
  const sight = await Sight.findById(sightId);
  if (!sight.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to do that!");
    return res.redirect(
      `/nationalParks/${nationalPark._id}/sights/${sight._id}`
    );
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, sightId, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not authorized to do that!");
    return res.redirect(`/nationalParks/${id}/sights/${sightId}`);
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
