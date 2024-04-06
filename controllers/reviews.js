const Sight = require("../models/sight");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { id, sightId } = req.params;
  const sight = await Sight.findById(sightId);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  sight.reviews.push(review);
  await review.save();
  await sight.save();
  req.flash("success", "Review Added!");
  res.redirect(`/nationalParks/${id}/sights/${sight._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, sightId, reviewId } = req.params;
  await Sight.findByIdAndUpdate(sightId, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/nationalParks/${id}/sights/${sightId}`);
};
