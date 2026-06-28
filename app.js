const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Listing = require('./models/listing.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const MONGO_URL = 'mongodb://127.0.0.1:27017/travelandPlan';

main()
  .then(() => console.log('Successfully connected'))
  .catch((err) => console.log('Connection failed', err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

// Index route - saari listings
app.get('/Listing', async (req, res) => {
  let allListings = await Listing.find({});
  res.render('Listing/index.ejs', { allListings });
});


//  create new post 

app.get("/Listing/new" , (req , res)=>{
    console.log(" new post create  ho sakta hai ");
  res.render("Listing/new.ejs" );

})


// Show route - ek listing
app.get('/Listing/:id', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('Listing/show.ejs', { listing });
});



// post request for new post 

app.post('/Listing/new', async(req, res) => {
  
  let {} = req.body;

});





app.listen(5000, () => {
  console.log('Server is running at port 5000');
});
