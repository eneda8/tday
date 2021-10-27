
const countries = require("../countries");
const User = require("../models/user");
const {getToday} = require("../utils/getToday");


module.exports.renderTodayData = async (req, res) => {
    const user = await User.findById(req.user.id)
    const escapedCountry = escape(user.country.name);
    const today = getToday();
    const longToday = new Date().toLocaleDateString( 'en-US', {year: 'numeric', month: 'long', day: 'numeric'});
    res.render("data/today", {countries, user, escapedCountry, today, longToday, title:"Data - Today / t'day"})
}

module.exports.renderAllData = async (req, res) => {
    const user = await User.findById(req.user.id)
    const escapedCountry = escape(user.country.name);
    const {dbQuery} = res.locals;
    delete res.locals.dbQuery
    res.render("data/all", {countries, user, escapedCountry, dbQuery, title:"Data - All / t'day"})
}

module.exports.renderMyData = async (req, res) => {
    const user = await User.findById(req.user.id)
    const today = getToday();
    res.render("data/me", {countries, user, today, title:"Data - Me / t'day"})
}