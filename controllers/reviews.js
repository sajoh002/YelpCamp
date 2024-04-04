const Hike = require("../models/hike");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { id, hikeId } = req.params;
  const hike = await Hike.findById(hikeId);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  hike.reviews.push(review);
  await review.save();
  await hike.save();
  req.flash("success", "Review Added!");
  res.redirect(`/nationalParks/${id}/hikes/${hike._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, hikeId, reviewId } = req.params;
  await Hike.findByIdAndUpdate(hikeId, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/nationalParks/${id}/hikes/${hikeId}`);
};
