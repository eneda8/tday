const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Journal = require("../models/journal");
const journals = require("../controllers/journals");
const {isLoggedIn, isVerified, isJournalAuthor, correctCookies, setPostedToday} = require("../middleware");

router.route("/")
    .get(isLoggedIn, isVerified, correctCookies, setPostedToday, catchAsync(journals.renderJournal))
    .post(isLoggedIn,isVerified, catchAsync(journals.createJournal));

router.route("/:journalId")
    .get(isLoggedIn, correctCookies, setPostedToday, isVerified, isJournalAuthor, catchAsync(journals.showJournal))
    .put(isLoggedIn, correctCookies, setPostedToday, isVerified, isJournalAuthor, catchAsync(journals.updateJournal))
    .delete(isLoggedIn, correctCookies, setPostedToday, isVerified, isJournalAuthor, catchAsync(journals.deleteJournal));

router.route("/:journalId/edit")
    .get(isLoggedIn, correctCookies, setPostedToday, isVerified, isJournalAuthor, catchAsync(journals.renderEditJournal));

module.exports = router;