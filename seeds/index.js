const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 500; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "65f8e5b744bda5d950ced2d2",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      images: [
        {
          url: "https://res.cloudinary.com/dy4jgwfkr/image/upload/v1711320871/YelpCamp/spkn4uiva5vczxkrb6ae.png",
          filename: "YelpCamp/spkn4uiva5vczxkrb6ae",
        },
        {
          url: "https://res.cloudinary.com/dy4jgwfkr/image/upload/v1711320871/YelpCamp/mpwomghea2odgb177hpq.png",
          filename: "YelpCamp/mpwomghea2odgb177hpq",
        },
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum et cum consectetur, doloribus unde ipsam animi minus aspernatur magnam explicabo asperiores distinctio ipsum eveniet modi iusto facere! Numquam, exercitationem quo!",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
