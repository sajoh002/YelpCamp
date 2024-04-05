const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Hike = require("../models/hike");
const NationalPark = require("../models/nationalPark");
const { cloudinary } = require("../cloudinary");

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.renderNewForm = async (req, res) => {
  const nationalPark = await NationalPark.findById(req.params.id);
  res.render("hikes/new", { nationalPark });
};

module.exports.createHike = async (req, res, next) => {
  const nationalPark = await NationalPark.findById(req.params.id);
  const geoData = await geocoder
    .forwardGeocode({
      query: `${req.body.hike.title}, ${nationalPark.title}`,
      limit: 1,
    })
    .send();
  const hike = new Hike(req.body.hike);
  hike.geometry = geoData.body.features[0].geometry;
  hike.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  hike.author = req.user._id;
  nationalPark.hikes.push(hike);
  await hike.save();
  await nationalPark.save();
  req.flash("success", "Hike Added!");
  res.redirect(`/nationalParks/${nationalPark._id}/hikes/${hike._id}`);
};

module.exports.showHike = async (req, res) => {
  const { id, hikeId } = req.params;
  const nationalPark = await NationalPark.findById(id);
  const hike = await Hike.findById(hikeId).populate("author");
  if (!hike) {
    req.flash("error", "Cannot find that Hike!");
    return res.redirect(`/nationalParks/${id}`);
  }
  res.render("hikes/show", { nationalPark, hike });
};

module.exports.renderEditForm = async (req, res) => {
  const { id, hikeId } = req.params;
  const nationalPark = await NationalPark.findById(id);
  const hike = await Hike.findById(hikeId);
  if (!hike) {
    req.flash("error", "Cannot find that Hike!");
    return res.redirect(`/nationalParks/${id}`);
  }
  res.render("hikes/edit", { nationalPark, hike });
};

module.exports.updateHike = async (req, res) => {
  const { id, hikeId } = req.params;
  const hike = await Hike.findByIdAndUpdate(hikeId, {
    ...req.body.hike,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  hike.images.push(...imgs);
  await hike.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await hike.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Hike Updated!");
  res.redirect(`/nationalParks/${id}/hikes/${hike._id}`);
};

module.exports.deleteHike = async (req, res) => {
  const { id, hikeId } = req.params;
  await NationalPark.findByIdAndUpdate(id, { $pull: { hikes: hikeId } });
  await Hike.findByIdAndDelete(hikeId);
  req.flash("success", "Hike Deleted!");
  res.redirect(`/nationalParks/${id}`);
};
