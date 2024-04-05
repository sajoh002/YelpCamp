const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const NationalPark = require("../models/nationalPark");
const { cloudinary } = require("../cloudinary");

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const nationalParks = await NationalPark.find({});
  res.render("nationalParks/index", { nationalParks });
};

module.exports.renderNewForm = (req, res) => {
  res.render("nationalParks/new");
};

module.exports.createNationalPark = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.nationalPark.title,
      limit: 1,
    })
    .send();
  const nationalPark = new NationalPark(req.body.nationalPark);
  nationalPark.geometry = geoData.body.features[0].geometry;
  nationalPark.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  nationalPark.author = req.user._id;
  await nationalPark.save();
  req.flash("success", "National Park Added!");
  res.redirect(`/nationalParks/${nationalPark._id}`);
};

module.exports.showNationalPark = async (req, res) => {
  const { id } = req.params;
  const nationalPark = await NationalPark.findById(id)
    .populate({
      path: "hikes",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!nationalPark) {
    req.flash("error", "Cannot find that National Park!");
    return res.redirect("/nationalParks/");
  }
  res.render("nationalParks/show", { nationalPark });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const nationalPark = await NationalPark.findById(id);
  if (!nationalPark) {
    req.flash("error", "Cannot find that National Park!");
    return res.redirect("/nationalParks/");
  }
  res.render("nationalParks/edit", { nationalPark });
};

module.exports.updateNationalPark = async (req, res) => {
  const { id } = req.params;
  const nationalPark = await NationalPark.findByIdAndUpdate(id, {
    ...req.body.nationalPark,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  nationalPark.images.push(...imgs);
  await nationalPark.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await nationalPark.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "National Park Updated!");
  res.redirect(`/nationalParks/${nationalPark._id}`);
};

module.exports.deleteNationalPark = async (req, res) => {
  const { id } = req.params;
  await NationalPark.findByIdAndDelete(id);
  req.flash("success", "National Park Deleted!");
  res.redirect("/nationalParks");
};
