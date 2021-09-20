const Post = require("../models/post");
const User = require("../models/user");
const Journal = require("../models/journal");
const ObjectID = require('mongodb').ObjectID;
const {getToday, getTimestamp} = require("../utils/getToday");

module.exports.renderJournal =  async (req, res) => {
    const today = getTimestamp()
    res.render("journals/write", {today, title: "Write / todai"});
}

module.exports.createJournal = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const journal = new Journal(req.body.journal);
    journal.author = req.user._id;
    user.journals.unshift(journal);
    await journal.save();
    await user.save();
    req.flash("success", "New journal saved!");
    res.redirect(`/u/${user.username}`)
}

module.exports.showJournal = async(req, res, next) => {
    const user = await User.findById(req.user._id);
    const {journalId} = req.params;
    if (!ObjectID.isValid(journalId)) {
        req.flash("error", "Journal not found!")
        return res.redirect(`/u/${user.username}#nav-journals`);
    } else {
        const journal = await Journal.findById(journalId);
        await journal.populate("author").execPopulate();
        if(!journal){
            req.flash("error", "Journal not found!")
            return res.redirect(`/u/${user.username}#nav-journals`);
        }
        res.render("journals/show", {journal, user});
    }
}

module.exports.renderEditJournal = async(req, res, next) => {
    const {journalId} = req.params;
    const journal = await Journal.findById(journalId);
    const user = await User.findById(req.user._id);
    if(!journal){
        req.flash("error", "Journal not found!")
        return res.redirect("/posts");
    }
    res.render("journals/edit", {journal});
}

module.exports.updateJournal = async (req,res) => {
    const {journalId} = req.params;
    const journal = await Journal.findById(journalId);
    journal.body = req.body.journal.body;
    journal.edited = true;
    await journal.save();
    journal.editedTime = new Date(journal.updatedAt).toLocaleString("en-US");
    await journal.save();
    req.flash("success", "Journal updated!");
    res.redirect(`/write/${journal._id}`)
}


module.exports.deleteJournal = async(req, res, next) => {
    const {journalId} = req.params;
    const user = await User.findById(req.user._id).populate("journals");
    const journal = await Journal.findById(journalId);
    await user.journals.pull(journalId)
    await user.save();
    await journal.remove();
    req.flash("success", "Journal deleted");
    res.redirect(`/u/${user.username}`);
}
