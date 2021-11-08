
//------------------------- LANDING -------------------------
module.exports.renderLandingPage = (req, res) => {
    if(req.user){
        return res.redirect("/home");
    } else {
        let today =new Date().toLocaleString('en-us', {weekday:'long'});
        res.render("landing", {today, title: "t'day"});
    }
}

// ---------------------ABOUT ---------------------------------------
module.exports.renderAbout = (req, res) => {
    res.render("about", {title: "About / t'day"})
}


