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

function errors(req, res, next){
  const { firstName, lastName, email, password, confirmedPassword } = req.body;
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
  if(password !== confirmedPassword) {
    errors.push("The provided values for the password and password confirmation fields did not match.");
  }
  req.errors = errors;
  next();
}

app.get("/", (req, res) => {
  // res.send("Hello World!");
  console.log(users);
  res.render('index', {users})
});

app.get("/create", csrfProtection, (req, res) => {
  res.render('create', { errors: [], csrfToken: req.csrfToken() });
})

app.post("/create", csrfProtection, errors, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword, errors } = req.body;

  if (errors.length > 0) {
    // console.log(errors);
    res.render('create',{ errors,
      firstName,
      lastName,
      email,
      password,
      csrfToken: req.csrfToken() });
      return;
  }
  users.push({ firstName, lastName, email, id: users.length + 2 })
  res.redirect(302, '/');
})

app.get("/create-interesting", csrfProtection, (req, res) => {
  res.render("create-interesting", { errors: [], csrfToken: req.csrfToken()});
})

app.post("/create-interesting", csrfProtection, errors, (req, res) => {
  const { firstName, lastName, email, password, confirmedPassword, errors } = req.body;

  if (errors.length > 0) {
    res.render('create',{ errors,
      firstName,
      lastName,
      email,
      password,
      csrfToken: req.csrfToken() });
      return;
  }
  users.push({ firstName, lastName, email, id: users.length + 2 })
  res.redirect(302, '/');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
