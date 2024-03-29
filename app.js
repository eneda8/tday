if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const express = require("express");
const path = require("path");
const favicon = require("serve-favicon")
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require('express-session');
const flash = require('connect-flash');
const castAggregation = require('mongoose-cast-aggregation');
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const MongoStore = require("connect-mongo");
const User = require("./models/user");

const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const deletedPostCommentRoutes = require("./routes/deletedPostComments");
const journalRoutes = require("./routes/journals");
const donateRoutes = require("./routes/donate");
const chartRoutes = require("./routes/charts");

const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


mongoose.plugin(castAggregation);

const app = express();

// app.enable("trust proxy");
// if(process.env.NODE_ENV == "production") {
//    app.use((req, res, next) => {
//     if (req.header('x-forwarded-proto') !== 'https')
//       res.redirect(`https://${req.header('host')}${req.url}`)
//     else
//       next()
//   })
// }



app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use(express.urlencoded({extended: true})); 
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
         res.send(200);
     } else {
         next();
     }
});


const secret = process.env.SECRET  || "81aa3b3f55029ad11b7f040b2064f31b7420633b"

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
});

const sessionConfig = {
    store,
    name: "cookie monster",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: 'lax',
        // secure: process.env.NODE_ENV === "production",
        httpOnly: false,
        expires: Date.now() + 1000 * 60 * 60 ,
        maxAge: 1000 * 60 * 60,
    }
}

// if (app.get("env") === "production") {
//     console.log("production environment")
//     app.set("trust proxy", 1); 
// }

app.use((req, res, next) => {
    const { headers: { cookie } } = req;
    if (cookie) {
        const values = cookie.split(';').reduce((res, item) => {
            const [name, value] = item.trim().split('=');
            return { ...res, [name]: value };
        }, {});
        res.locals.cookie = values;
    }
    else res.locals.cookie = {};
    next();
});


app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate(), {passReqToCallback: true}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://code.jquery.com",
    "https://app.termly.io",
    "https://cdn.segment.com"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://charts.mongodb.com",
    "https://global-mind.org/",
    "https://app.termly.io",
];
const fontSrcUrls = [
    "https://fonts.gstatic.com",
    "https://use.fontawesome.com",
    "https://fonts.googleapis.com"
];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            frameSrc: ["blob:", ...connectSrcUrls],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
                "https://images.unsplash.com",
                "https://source.unsplash.com/random",
                "https://i.imgur.com",
                "http://placeimg.com",
                "https://cdn.fakercloud.com",
                "https://avataaars.io",
                "https://picsum.photos",
                "https://fastly.picsum.photos"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use((req, res, next) => {
    if (!['/login', '/register', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
        req.session.previousReturnTo = req.session.returnTo; // store the previous url
        req.session.returnTo = req.originalUrl; // assign a new url
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use("/", indexRoutes);
app.use("/", userRoutes);
app.use("/write", journalRoutes);
app.use("/posts", postRoutes);
app.use("/posts/:id/comments", commentRoutes);
app.use("/comments", deletedPostCommentRoutes)
app.use("/donate", donateRoutes);
app.use("/charts", chartRoutes);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.all("*", (req, res, next) => {
    req.session.returnTo = req.session.previousReturnTo;
    next(new ExpressError("Page Not Found", 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh no, something went wrong!"
    res.status(statusCode).render("index/error", {err, title: "Error / t'day", style: "error"});
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serving on port ${port}`)
})
