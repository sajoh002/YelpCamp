const Sight = require("../models/sight");
const NationalPark = require("../models/nationalPark");
const { cloudinary } = require("../cloudinary");

const types = [
  "Campground",
  "Hike/Trail",
  "Lake",
  "Lodge",
  "Mountain",
  "Ranger Station",
  "Visitor Center",
  "Loop/Drive",
];

const difficulty = ["Easy", "Moderate", "Hard"];

module.exports.renderNewForm = async (req, res) => {
  const nationalPark = await NationalPark.findById(req.params.id);
  res.render("sights/new", { nationalPark, types, difficulty });
};

module.exports.createSight = async (req, res, next) => {
  const nationalPark = await NationalPark.findById(req.params.id);
  const sight = new Sight(req.body.sight);
  sight.geometry = {
    type: "Point",
    coordinates: [
      req.body.coordinates.longitude,
      req.body.coordinates.latitude,
    ],
  };
  sight.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  sight.author = req.user._id;
  nationalPark.sights.push(sight);
  await sight.save();
  await nationalPark.save();
  req.flash("success", "Sight Added!");
  res.redirect(`/nationalParks/${nationalPark._id}/sights/${sight._id}`);
};

module.exports.showSight = async (req, res) => {
  const { id, sightId } = req.params;
  const nationalPark = await NationalPark.findById(id);
  const sight = await Sight.findById(sightId)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!sight) {
    req.flash("error", "Cannot find that Sight!");
    return res.redirect(`/nationalParks/${id}`);
  }
  res.render("sights/show", { nationalPark, sight });
};

module.exports.renderEditForm = async (req, res) => {
  const { id, sightId } = req.params;
  const nationalPark = await NationalPark.findById(id);
  const sight = await Sight.findById(sightId);
  if (!sight) {
    req.flash("error", "Cannot find that Sight!");
    return res.redirect(`/nationalParks/${id}`);
  }
  res.render("sights/edit", { nationalPark, sight, types, difficulty });
};

module.exports.updateSight = async (req, res) => {
  const { id, sightId } = req.params;
  const sight = await Sight.findByIdAndUpdate(sightId, {
    ...req.body.sight,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  sight.images.push(...imgs);
  await sight.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await sight.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Sight Updated!");
  res.redirect(`/nationalParks/${id}/sights/${sight._id}`);
};

module.exports.deleteSight = async (req, res) => {
  const { id, sightId } = req.params;
  await NationalPark.findByIdAndUpdate(id, { $pull: { sights: sightId } });
  await Sight.findByIdAndDelete(sightId);
  req.flash("success", "Sight Deleted!");
  res.redirect(`/nationalParks/${id}`);
};
