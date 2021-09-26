const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {isLoggedIn} = require("../middleware");

const renderDonatePage = async (req, res) =>{
    res.render("donate/show", {title: "Donate/ todai"})
}

const donate = async(req, res) => {
    try {
        stripe.customers
          .create({
            name: req.body.name,
            email: req.body.email,
            source: req.body.stripeToken
          })
          .then(customer =>
            stripe.charges.create({
              amount: req.body.amount * 100,
              currency: "usd",
              customer: customer.id
            })
          )
          req.flash("success", "Successfully made a donation");
          res.redirect("/donate/confirmation")
      } catch (err) {
        console.log(err);
        req.flash("error", "Oops something went wrong! Please try again");
        res.redirect("/donate")
      }
}

const renderThankYou = async (req, res) => {
    res.render("donate/confirm", {title: "Thank you!/ todai"})
}

router.route("/")
    .get(isLoggedIn, catchAsync(renderDonatePage))
    .post(isLoggedIn, catchAsync(donate));

router.get("/confirmation", isLoggedIn, catchAsync(renderThankYou))

module.exports = router;