const mongoose = require("mongoose");
const Review = require("./review");
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
    price: Number,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  opts
);

NationalParkSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/nationalParks/${this._id}">${this.title}</a></strong>`;
});

// NationalParkSchema.post("findOneAndDelete", async function (doc) {
//   if (doc) {
//     await Review.deleteMany({
//       _id: {
//         $in: doc.reviews,
//       },
//     });
//   }
// });

module.exports = mongoose.model("NationalPark", NationalParkSchema);
