const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("passport/private", { user: req.user });
// });
router.get("/signup", (req, res, next) => {
    // redirect to home if you are already logged in
    if (req.user) {
        res.redirect("/");

        // early return to stop the function since there's an error
        // prevent the rest of the code from running.
        return;
      }
      res.render("passport/signup");
});

//STEP #2: process the sign up form
router.post("/process-signup", (req, res, next) => {
    if (req.body.signupPassword === ""      ||
        req.body.signupPassword.length < 11 ||
        req.body.signupPassword.match(/[^a-z0-9]/i) === null
      ){                        //          |
                                // no special characters
          // display the form again if it is
          res.locals.errorMessage = "Password is invalid";
          res.render("passport/signup");
          // early return to stop the function since there's an error
          // prevent the rest of the code from running.
          return;
      }
      // query the database to see if the email is taken
      User.findOne({ email: req.body.signupEmail })
        .then((userFromDb) => {
          // userFromDb will be null if the email IS NOT taken

          // display the form again if the email is taken
          if (userFromDb !== null) {
            res.locals.errorMessage = "Email is Taken";
            res.render("passport/signup");

            // early return to stop the function since there's an error
            // prevent the rest of the code from running.
            return;
          }

          // generate a new salt for this user's password
          const salt = bcrypt.genSaltSync(10);

          // encrypted the password submitted from the form
          //                                             |
          const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

          const theUser = new User({
            fullName:   req.body.signupFullName,
            email:      req.body.signupEmail,
            encryptedPassword: scrambledPassword
          });

          // return the promise of the next database query
          // to continue the sequence
          return theUser.save();
        })
            .then(() => {
              // redirect to the home page on a successful sign up
              res.redirect("/");
            })
            .catch((err) => {
                next(err);
            });
}); // POST /process-signup




module.exports = router;
