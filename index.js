const express = require("express");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const csrfProtection = csrf({cookie:true})
app.use(express.urlencoded({extended: true}));

const port = process.env.PORT || 3000;

app.set("view engine", "pug");

const users = [
  {
    id: 1,
    firstName: "Jill",
    lastName: "Jack",
    email: "jill.jack@gmail.com"
  }
];

app.get("/", (req, res) => {
  // res.send("Hello World!");
  res.render('index', {users})
});

app.get("/create", csrfProtection, (req, res) => {
  res.render('create', { csrfToken: req.csrfToken() });
})

app.post("/create", csrfProtection, (req, res) => {
  const errors = [];
  if(!firstName){
    errors.push('Please provide a first name.')
  }
  if(!lastName){
    errors.push("Please provide a last name.")
  }
  if(!email){
    errors.push("Please provide an email.")
  }
  if(!password){
    errors.push("Please provide a password.")
  }

  res.render('create', { csrfToken: req.csrfToken() });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
