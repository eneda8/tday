const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Journal = require("../models/journal");
const journals = require("../controllers/journals");
const {isLoggedIn, isJournalAuthor, setPostedToday} = require("../middleware");

router.route("/")
    .get(isLoggedIn, setPostedToday, catchAsync(journals.renderJournal))
    .post(isLoggedIn,catchAsync(journals.createJournal));

router.route("/:journalId")
    .get(isLoggedIn, setPostedToday, isJournalAuthor, catchAsync(journals.showJournal))
    .put(isLoggedIn, setPostedToday, isJournalAuthor, catchAsync(journals.updateJournal))
    .delete(isLoggedIn, setPostedToday, isJournalAuthor, catchAsync(journals.deleteJournal));

router.route("/:journalId/edit")
    .get(isLoggedIn, setPostedToday, isJournalAuthor, catchAsync(journals.renderEditJournal));

module.exports = router;