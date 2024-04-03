const NationalPark = require("../models/nationalPark");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const nationalPark = await NationalPark.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  nationalPark.reviews.push(review);
  await review.save();
  await nationalPark.save();
  req.flash("success", "Review Added!");
  res.redirect(`/nationalParks/${nationalPark._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await NationalPark.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/nationalParks/${id}`);
};
