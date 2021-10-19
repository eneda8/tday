
const countries = require("../countries");
const User = require("../models/user");


module.exports.renderData = async (req, res) => {
    const user = await User.findById(req.user.id)
    const escapedCountry = escape(user.country.name);
    res.render("data/data", {countries, user, escapedCountry, title:"Data / todei"})
}

