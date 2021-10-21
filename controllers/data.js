
const countries = require("../countries");
const User = require("../models/user");
const {getToday} = require("../utils/getToday");


module.exports.renderTodayData = async (req, res) => {
    const user = await User.findById(req.user.id)
    const escapedCountry = escape(user.country.name);
    const today = getToday();
    const longToday = new Date().toLocaleDateString( 'en-US', {year: 'numeric', month: 'long', day: 'numeric'});
    res.render("data/today", {countries, user, escapedCountry, today, longToday, title:"Data - Today / todei"})
}

module.exports.renderAllData = async (req, res) => {
    const user = await User.findById(req.user.id)
    const escapedCountry = escape(user.country.name);
    res.render("data/all", {countries, user, escapedCountry, title:"Data - All / todei"})
}

module.exports.renderMyData = async (req, res) => {
    const user = await User.findById(req.user.id)
    const escapedCountry = escape(user.country.name);
    res.render("data/me", {countries, user, escapedCountry, today, longToday, title:"Data - Me / todei"})
}