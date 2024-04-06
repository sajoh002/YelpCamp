const mongoose = require("mongoose");
const Hike = require("./hike");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const NationalParkSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    description: String,
    state: String,
    price: String,
    pricePer: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    hikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hike",
      },
    ],
  },
  opts
);

NationalParkSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/nationalParks/${this._id}">${this.title}</a></strong>`;
});

NationalParkSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Hike.deleteMany({
      _id: {
        $in: doc.hikes,
      },
    });
  }
});

module.exports = mongoose.model("NationalPark", NationalParkSchema);
