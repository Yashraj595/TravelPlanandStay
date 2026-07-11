const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");
// const Listing = require('../models/listing.js');


const MONGO_URL = 'mongodb://127.0.0.1:27017/travelandPlan';

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
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((obj) => ({
    ...obj,
    owner: '6a51bea51fb07d87ee9cea56',
  }));
  await Listing.insertMany(initdata.data);
  console.log(" data was initialized ");
}

initDB();