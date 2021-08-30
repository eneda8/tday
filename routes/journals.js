const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../utils/catchAsync");
const Journal = require("../models/journal");
const journals = require("../controllers/journals");
const {isLoggedIn, isJournalAuthor} = require("../middleware");

router.route("/")
    .get(isLoggedIn, journals.renderJournal)
    .post(isLoggedIn,catchAsync(journals.createJournal));

router.route("/:journalId/edit")
    .get(isLoggedIn, isJournalAuthor, catchAsync(journals.renderEditJournal));

router.route("/:journalId")
    .get(isLoggedIn, isJournalAuthor, catchAsync(journals.showJournal))
    .put(isLoggedIn, isJournalAuthor, catchAsync(journals.updateJournal))
    .delete(isLoggedIn, isJournalAuthor, catchAsync(journals.deleteJournal));

router.route("/:journalId/edit")
    .get(isLoggedIn, isJournalAuthor, catchAsync(journals.renderEditJournal));

module.exports = router;