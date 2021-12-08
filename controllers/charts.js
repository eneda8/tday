const countries = require("../countries");
const User = require("../models/user");
const Post = require("../models/post");
const {getToday} = require("../utils/getToday");

module.exports.renderTodaysCharts = async (req, res) => {
    const user = await User.findById(req.user.id)
    const escapedCountry = escape(user.country.name);
    const today = getToday(user);
    const {dbQuery} = res.locals;
    delete res.locals.dbQuery
    dbQuery['date'] = getToday();
    const count = await Post.countDocuments({"date": getToday(user)})
    res.render("charts/today", {countries, user, today, escapedCountry, count, dbQuery, title:"Charts - Today / t'day"})
}

module.exports.renderAllCharts = async (req, res) => {
    const user = await User.findById(req.user.id)
    const escapedCountry = escape(user.country.name);
    const {dbQuery, userQuery} = res.locals;
    delete res.locals.dbQuery
    delete res.locals.userQuery;
    const count = await User.countDocuments();
    res.render("charts/all", {countries, user, escapedCountry, count, dbQuery, userQuery, title:"Charts - All / t'day"})
}

module.exports.renderMyCharts = async (req, res) => {
    const user = await User.findById(req.user.id)
    const today = getToday(user);
    res.render("charts/me", {countries, user, today, title:"Charts - Me / t'day"})
}