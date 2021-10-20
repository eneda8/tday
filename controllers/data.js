
const countries = require("../countries");
const User = require("../models/user");
const {getToday} = require("../utils/getToday");


module.exports.renderData = async (req, res) => {
    const user = await User.findById(req.user.id)
    const escapedCountry = escape(user.country.name);
    const today = getToday();
    const longToday = new Date().toLocaleDateString( 'en-US', {year: 'numeric', month: 'long', day: 'numeric'});
    res.render("data/data", {countries, user, escapedCountry, today, longToday, title:"Data / todei"})
}

