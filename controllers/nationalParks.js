const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const NationalPark = require("../models/nationalPark");
const { cloudinary } = require("../cloudinary");

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const states = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virgina",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

module.exports.index = async (req, res) => {
  const nationalParks = await NationalPark.find({});
  res.render("nationalParks/index", { nationalParks });
};

module.exports.renderNewForm = (req, res) => {
  res.render("nationalParks/new", { states });
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
    .populate("sights")
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
  res.render("nationalParks/edit", { nationalPark, states });
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
