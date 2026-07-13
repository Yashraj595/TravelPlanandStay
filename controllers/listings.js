const Listing = require('../models/listing.js');

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render('Listing/index.ejs', { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render('Listing/new.ejs');
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: { path: 'author' },
    })
    .populate('owner');

  // BUG FIX: pehle listing na milne par bhi res.render() aage chal jaata
  // (redirect ke baad bhi) -> "Cannot set headers after they are sent" error.
  if (!listing) {
    req.flash('error', 'Listing you requested does not exist!');
    return res.redirect('/Listing');
  }

  res.render('Listing/show.ejs', { listing });
};

module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body);
  newListing.owner = req.user._id;

  // BUG FIX: multer ke through aayi file yaha wire ki gayi hai.
  // Pehle upload middleware route me lagaya hi nahi gaya tha,
  // isliye image kabhi save hi nahi hoti thi.
  if (req.file) {
    const { path: url, filename } = req.file;
    newListing.image = { url, filename };
  }

  await newListing.save();

  req.flash('success', 'New Listing Created!');
  res.redirect('/Listing');
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash('error', 'Listing you requested does not exist!');
    return res.redirect('/Listing');
  }

  res.render('Listing/edit.ejs', { listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // BUG FIX: pehle "id" ko use hone ke baad const se declare kiya gaya tha
  // (temporal dead zone) -> ReferenceError. Ownership check bhi ab
  // isOwner middleware me route level par hota hai (route file dekhein).
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body }, { new: true });

  if (req.file) {
    const { path: url, filename } = req.file;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash('success', 'Listing Updated!');
  res.redirect(`/Listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/Listing');
};
