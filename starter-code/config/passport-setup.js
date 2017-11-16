const passport = require("passport");

const UserModel = require("../models/user");

// Serialize (what user information do we save to the session?)
//-------------------------------------------------------------
// gets called when a user logs in (on our POST /process-login)
passport.serializeUser((userFromDb, cb) => {
  //  null is for saying "no errors occurred" during the serialize process
  //    |
    cb(null, userFromDb._id);
      //                  |
      // save only the "_id" of the user
});

// Deserialize (how do we retrieve the user details from the session?)
//--------------------------------------------------------------------
// gets called EVERY TIME you visit a page on the site while you're logged in.
// (that's so we can potentially personalize all pages)
passport.deserializeUser((idFromSession, cb) => {
    // find the user's document by the ID we saved in the session
    UserModel.findById(idFromSession)
      .then((userFromDb) => {
          // null is saying "no errors occurred" during the deseialize process
          //  |
          cb(null, userFromDb);
          //          |
          // send Passport the logged in user's info
      })
      .catch((err) => {
          cb(err);
      });
});

// STRATEGIES (npm packages that enable other methods of logging in)
