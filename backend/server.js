const express = require('express');
const path = require('path');
const multer = require("multer");
const app = express();
const port = 80;
const storage = multer.memoryStorage();
const upload = multer({ storage });
const mysql = require('mysql2');

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const bcrypt = require('bcryptjs');

app.use(express.static('public'));
app.use(express.json());

app.set("views", 'public/views');
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

question_creator_service = process.env.QUESTIONCREATOR;


const config_mysql = {
  user: "admin",
  password: "admin",
  host: process.env.DB,
  database: "clashOfStudents"
};


const con = mysql.createConnection(config_mysql);

passport.use('stud',
  new LocalStrategy({usernameField: 'email', passwordField: 'password'}, async (email, password, done) => {
      try {
          const query_retrieve = 'SELECT * FROM accounts WHERE email = ?';
          const values = [email];
          
          
          con.query(query_retrieve, values, async (err, result) => {
              if (err) {
                  return done(err);
              }
  
              if (!result || result.length === 0) {
                  return done(null, false, { message: "Email not found" });
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

passport.use('prof',
  new LocalStrategy({usernameField: 'email', passwordField: 'password'}, async (email, password, done) => {
      try {
          const query_retrieve = 'SELECT * FROM accounts WHERE email = ? AND role = ?';
          const values = [email, "professor"];
          
          
          con.query(query_retrieve, values, async (err, result) => {
              if (err) {
                  return done(err);
              }
  
              if (!result || result.length === 0) {
                  return done(null, false, { message: "Email not found" });
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


app.get('/manage-questions', (req, res) => {
  /*
  fetch(`http://${question_creator_service}:80/all_entrys/`, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => res.render("show-manage-questions", { user: req.user, data: data}))
  .catch(error => {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  });
  */
  const data = [
    {
        "id": 4,
        "question_type": "image-description",
        "frage": "Was ist 5*5?",
        "answer_a": "25",
        "answer_b": null,
        "answer_c": null,
        "answer_d": null,
        "correct_answer": "25",
        "course": "AI",
        "lection": "4",
        "position": 5,
        "image_url": "2c9fc397-9d5b-4dbb-a57f-818009860cd6.png"
    },
    {
        "id": 5,
        "question_type": "multiple-choice-image",
        "frage": "Was ist auf diesem schönen Bild zu sehen?",
        "answer_a": "Haus",
        "answer_b": "Affe",
        "answer_c": "Swimming Pool",
        "answer_d": "Giraffe",
        "correct_answer": "Haus",
        "course": "AI",
        "lection": "5",
        "position": 7,
        "image_url": "208d6ba4-c0c4-458c-bb50-392c6a198deb.png"
    }
];
res.render("show-manage-questions", { user: req.user, data: data})

});

app.get('/courses', (req, res) => {
  res.render("courses", { user: req.user});
});


app.get("/log-in-prof", (req, res) => {
  if (req.session.messages){
    const error = req.session.messages.length > 0 ? req.session.messages[req.session.messages.length - 1] : undefined;
    res.render("login", { user: req.user, error: error, target: "professor" });
  } else {
    res.render("login", { user: req.user, error: undefined, target: "professor" });
  }
  
});

app.get("/log-in-student", (req, res) => {
  const error = req.session.messages.length > 0 ? req.session.messages[req.session.messages.length - 1] : undefined;
  res.render("login", { user: req.user, error: error, target: "student" });
});


app.get('/', (req, res) => {
  res.render("login", { user: req.user, error: undefined, target: undefined });
});


app.post(
  "/log-in-prof",
  passport.authenticate("prof", {
    successRedirect: "/questions",
    failureRedirect: "/log-in-prof",
    failureMessage: true
  })
);

app.post(
  "/log-in-student",
  passport.authenticate("stud", {
    successRedirect: "/courses",
    failureRedirect: "/log-in-student",
    failureMessage: true
  })
);

app.get('/sign-up-student', (req, res) => {
  res.render("sign-up-student", {error: undefined});
});

app.post("/sign-up-student", (req, res, next) => {
  try {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@student.reutlingen-university\.de$/;
      if (emailPattern.test(req.body.email) === false){
        return res.render("sign-up-student", { error: "Not a reutlingen university student email."} )

      }

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
              let query_insert = "INSERT INTO accounts (firstname, lastname, email, password, role) VALUES (?,?,?,?,?)";
              const values_insert = [req.body.fname, req.body.lname, req.body.email, hashedPassword, "student"];

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
  res.render("sign-up-prof", {error: undefined});
});

app.post("/sign-up-prof", (req, res, next) => {
  try {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@reutlingen-university\.de$/;
      if (emailPattern.test(req.body.email) === false){
        return res.render("sign-up-student", { error: "Not a reutlingen university professor email."} )

      }
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
              let query_insert = "INSERT INTO accounts (firstname, lastname, email, password, role) VALUES (?,?,?,?,?)";
              const values_insert = [req.body.fname, req.body.lname, req.body.email, hashedPassword, "professor"];

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

  const queryParams = new URLSearchParams({
    course: req.query.course,
    lection: req.query.lection,
    position: req.query.position
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
