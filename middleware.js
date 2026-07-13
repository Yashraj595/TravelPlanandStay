
module.exports.isLoggedIn = (req , res , next)=>{

   if (!req.isAuthenticated()) {

    req.session.redirectUrl = req.originalUrl;
     req.flash('error', 'You need to login first!');
     return res.redirect('/login');
   }

   next();

};

module.exports.saveRedirectUrl = (req, res, next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = ( req, res , next)=>{
  
}


module.exports.isReviewAuthor = async(req, res , next) =>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error" , " You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);

  }
  next();
}