const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
// const Listing = require('../models/listing.js');
  require('dotenv').config({ path: '../.env' });

const MONGO_URL = process.env.ATLASDB;

main()
  .then(() => {
    console.log('Successfully connected');
  })
  .catch((err) => {
    console.log('Connection failed');
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async()=>{
  // await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: '6a51c84a5b31d76fa88ecb38',
  }));
  await Listing.insertMany(initdata.data);
  console.log(" data was initialized ");
}

initDB();