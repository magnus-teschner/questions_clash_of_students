const express = require('express');
const path = require('path');
const multer = require("multer");
const app = express();
const port = 80;
const storage = multer.memoryStorage();
const upload = multer({ storage });
const mysql = require('mysql2');

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');

app.use(express.static('public'));
app.use(express.json());

app.set("views", 'public/views');
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

question_creator_service = process.env.QUESTIONCREATOR;

const con = mysql.createConnection({
	host     : 'localhost',
	user     : 'admin',
	password : 'admin',
	database : 'login'
});

passport.use(
  new LocalStrategy({usernameField: 'email', passwordField: 'password'}, async (email, password, done) => {
      try {
          const query_retrieve = 'SELECT * FROM accounts WHERE email = ?';
          const values = [email];
          
          
          con.query(query_retrieve, values, async (err, result) => {
              if (err) {
                  return done(err);
              }
  
              if (!result || result.length === 0) {
                  return done(null, false, { message: "Incorrect email" });
              }
  
              const db_first = result[0].firstname;
              const db_last = result[0].lastname;
              const db_email = result[0].email;
              const db_password = result[0].password;
  
              try {
                  const match = await bcrypt.compare(password, db_password);
                  if (!match) {
                      // passwords do not match!
                      return done(null, false, { message: "Incorrect password" })
                  } else {            
                      let user = { firstname: db_first, lastname: db_last, email: db_email };
                      return done(null, user);
                  }
              } catch (bcryptError) {
                  return done(bcryptError);
              }
          });
          
      } catch(err) {
          return done(err);
      }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
try {
  const query_retrieve = 'SELECT * FROM accounts WHERE email = ?';
  const values = [email];
  con.query(query_retrieve, values, (err, result) => {
      const db_first = result[0].firstname;
      const db_last = result[0].lastname;
      const db_email = result[0].email;

      
      let user = { firstname: db_first, lastname: db_last, email: db_email }
      return done(null, user);
  });
} catch(err) {
  done(err);
};
});


app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get('/questions', (req, res) => {
  res.render("questions", { user: req.user});
});

app.get('/courses', (req, res) => {
  res.render("courses", { user: req.user});
});

app.get('/', (req, res) => {
  res.render("login");
});

app.post(
  "/log-in-prof",
  passport.authenticate("local", {
    successRedirect: "/questions",
    failureRedirect: "/",
  })
);

app.post(
  "/log-in-student",
  passport.authenticate("local", {
    successRedirect: "/courses",
    failureRedirect: "/",
  })
);

app.get('/sign-up-student', (req, res) => {
  res.render("sign-up-student");
});

app.post("/sign-up-student", (req, res, next) => {
  try {
      let query_check = "SELECT * FROM accounts WHERE email = ?";
      const values_check = [req.body.email];

      con.query(query_check, values_check, (err, result) => {
          if (err) {
              return next(err);
          }

          if (result.length > 0) {
              return res.render("sign-up-student", { error: "Email already in use."} )
          }

          bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
              // If the email is not in use, proceed with the insertion
              let query_insert = "INSERT INTO accounts (firstname, lastname, email, password) VALUES (?,?,?,?)";
              const values_insert = [req.body.fname, req.body.lname, req.body.email, hashedPassword];

              con.query(query_insert, values_insert, (err) => {
                  if (err) {
                      return next(err);
                  }
                  res.redirect("/");
              });
            });   
      });
  } catch (error) {
      next(error);
  }
});

app.get('/sign-up-prof', (req, res) => {
  res.render("sign-up-prof");
});

app.post("/sign-up-prof", (req, res, next) => {
  try {
      let query_check = "SELECT * FROM accounts WHERE email = ?";
      const values_check = [req.body.email];

      con.query(query_check, values_check, (err, result) => {
          if (err) {
              return next(err);
          }

          if (result.length > 0) {
              return res.render("sign-up-prof", { error: "Email already in use."} )
          }

          bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
              // If the email is not in use, proceed with the insertion
              let query_insert = "INSERT INTO accounts (firstname, lastname, email, password) VALUES (?,?,?,?)";
              const values_insert = [req.body.fname, req.body.lname, req.body.email, hashedPassword];

              con.query(query_insert, values_insert, (err) => {
                  if (err) {
                      return next(err);
                  }
                  res.redirect("/");
              });
            });   
      });
  } catch (error) {
      next(error);
  }
});


app.post('/upload_min', upload.single('image'), (req, res) => {
  const formData = new FormData();
  const blob = new Blob([req.file.buffer], { mimetype: req.file.mimetype });
  formData.append('image', blob);
  formData.append('json', req.body.json)
  formData.append('mimetype', req.file.mimetype)

  fetch(`http://${question_creator_service}:80/upload_min/`, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });
});


app.post('/send', (req, res) => {
  console.log(req.body)
  fetch(`http://${question_creator_service}:80/send/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body)
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });
});


app.get('/get_question', (req, res) => {

  // Construct the query parameters
  const queryParams = new URLSearchParams({
    course: req.query.course,
    lection: req.query.lection,
    position: req.query.position
    // Add more parameters as needed
  });

  // Construct the URL with parameters
  let url = `http://${question_creator_service}:80/get_question/?${queryParams}`;

  // Make the GET request
  fetch(url, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });
});





app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
