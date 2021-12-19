const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//------------------------- LANDING -------------------------
module.exports.renderLandingPage = (req, res) => {
    if(req.user){
        return res.redirect("/home");
    } else {
        res.render("index/landing", {title: "t'day"});
    }
}

// ---------------------ABOUT ---------------------------------------
module.exports.renderAbout = (req, res) => {
    res.render("index/about", {title: "About / t'day"})
}

module.exports.renderTerms = (req, res) => {
    res.render("index/terms", {title: "Terms of Use / t'day"})
}

module.exports.renderPrivacy = (req, res) => {
    res.render("index/privacy", {title: "Privacy Policy / t'day"})
}

module.exports.renderCookies = (req, res) => {
    res.render("index/cookies", {title: "Cookie Policy / t'day"})
}

module.exports.renderContact = (req, res) => {
    res.render("index/contact", {title: "Contact Us / t'day"})
}

module.exports.postContact = async (req, res) => {
    try{
        const {email, subject, message} =req.body;
        const msg = {
            to: "support@tday.co",
            from: "support@tday.co",
            subject: `Message from ${email} re: ${subject}`,
            text: message,
        }
        await sgMail.send(msg)
        const msgToUser = {
            to: email,
            from: "noreply@tday.co",
            subject: "We've received your message",
            text: "Hi there, Just writing to let you know that we've received your message. We'll get back to you as soon as we can (typically within 24 hours). Talk to you soon! - the t'day team",
            html: `Hi there, <br> <br> Just writing to let you know that we've received your message. <br> <br> We'll get back to you as soon as we can (typically within 24 hours). <br> <br>Talk to you soon! <br><strong>- the t'day team</strong>`,
        }
        await sgMail.send(msgToUser);
        req.flash("success", "Email Sent! We'll get back to you as soon as we can.");
        return res.redirect("/contact");
    } catch(e){
        console.log(e);
        req.flash("error", "Oops something went wrong.. Please try again later or email us directly at support@tday.co.");
        return res.redirect("/")
    }
}