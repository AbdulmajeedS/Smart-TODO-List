// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require('cookie-session');
const {emailExists} = require("./helper")

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(cookieSession ({name:'session', secret:'secret'}));


app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const res = require("express/lib/response");
const itemsRoutes = require("./routes/items");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/items", itemsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!r
// Separate them into separate routes files (see above).
app.get("/login", (req,res) => {
  res.render("login");
})

app.get("/profile", (req,res) => {

  //get user_id
  //get data from db
  // render out tamp with data from db

  res.render("profile");
})

app.post("/profile", (req,res) => {
  //get user_id
  //update user data
  //redirect /profile

  res.render("profile");
})

app.get("/register", (req,res) => {
  res.render("register");
})

app.post("/register", (req,res)=> {
  const email = req.body.email;
  const password = req.body.password;
 //create a new entry in the user table
 //if succesfull redirect it to '/login'
 //create a function to get items
  res.redirect("/login")
 })

app.get("/error-page", (req,res) => {
  res.render("error-page")
})
// app.get("/dashboard", (req, res) => {
//   res.render("dashboard");
//   //get request form db
// });



app.get("/", (req, res) => {
  const userID = req.session['user_id'];
  if (userID) {
    db.query(`SELECT * FROM items WHERE user_id = $1;`, [userID])
    .then((data) => {
      console.log(data)
      const items = data.rows;
      const user_id = items[0].user_id;
      res.render("index", { items, user_id:userID });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

  } else {
    res.render("index", {user_id:userID});
  }

  // res.render("index", template);

});


app.post("/login", async(req, res) => {
  console.log(req.body)
  // db.query('SELECT * FROM users;',(error,response) => {
  //   console.log(response)
  // })
  const email = req.body.email;
  const password = req.body.password;
  // check email and password and database
  const userExist = await emailExists(email,db);
  console.log(userExist);

  // set user id to the user id from database!
  // error if not found
  req.session["user_id"] = userExist.id;
  res.redirect("/");
});

app.get ("/logout",(req, res) =>  {
  req.session["user_id"] = null;
  res.redirect("/")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

//next step CRUD

