const express = require('express');
const path = require('path');
const multer = require("multer");
const app = express();
const port = 1999;
const port_question_service = 2000;
const storage = multer.memoryStorage();
const upload = multer({ storage });
const mysql = require('mysql2');
require('dotenv').config();
const Mailjet = require('node-mailjet');
const { v4: uuidv4 } = require('uuid');

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

const bcrypt = require('bcryptjs');
const { type } = require('os');

app.use(express.static('public'));
app.use(express.json());

app.set("views", 'public/views');
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

question_creator_service = process.env.QUESTIONCREATOR;
question_creator_service = "127.0.0.1";
mailjet_public_key = process.env.PUBLICMAIL;
mailjet_private_key = process.env.PRIVATEMAIL;
mailjet_public_key = "6a2924e64b4c454bbcdf6580e44e9ca2";
mailjet_private_key ="9b2b92a8e47833cfaeb1488d47dc1790";
backend = "127.0.0.1"



const mailjet = Mailjet.apiConnect(
    mailjet_public_key,
    mailjet_private_key
);


const config_mysql = {
  user: "admin",
  password: "admin",
  host: "127.0.0.1",
  database: "clashOfStudents"
};

app.use((req, res, next) => {
  if (!req.isAuthenticated() && req.method === 'GET' && req.path !== '/log-in-prof' && req.path !== '/log-in-student') {
    req.session.returnTo = req.originalUrl;
  }
  next();
});

const con = mysql.createConnection(config_mysql);






passport.use('stud',
  new LocalStrategy({usernameField: 'email', passwordField: 'password'}, async (email, password, done) => {
      try {
          const query_retrieve = 'SELECT * FROM accounts WHERE email = ?';
          const values = [email, 1];
          
          
          con.query(query_retrieve, values, async (err, result) => {
              if (err) {
                  return done(err);
              }
  
              if (!result || result.length === 0) {
                  return done(null, false, { message: "Email not found" });
              }

              else if (result[0].isVerified == 0) {
                return done(null, false, { message: "Email not verified" });

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

              else if (result[0].isVerified == 0) {
                return done(null, false, { message: "Email not verified" });

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


async function sendVerificationEmail(firstname, lastname, email, token){
  const verificationLink = `http://${backend}/verify-email?token=${token}`;

  const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
          Messages: [
              {
                  From: {
                      Email: "clashofstudentes@gmail.com",
                      Name: "Clash of Students"
                  },
                  To: [
                      {
                          Email: email,
                          Name: `${firstname} ${lastname}`
                      }
                  ],
                  Subject: "Please verify your email address",
                  TextPart: `Hello ${firstname}, please verify your email by clicking the following link: ${verificationLink}`,
                  HTMLPart: `<p>Hello, please verify your email by clicking the following link:</p><a href="${verificationLink}">Verify Email</a>`
              }
          ]
      });

  try {
      const result = await request;
  } catch (err) {
      console.log(err.statusCode);
  }
};


app.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  
  try {
    let query = "SELECT * FROM accounts WHERE verificationToken = ?";
    const values = [token];

    con.query(query, values, async (err, result) => {
        if (err) {
            return res.status(500).send('Error querying the database.');
        }

        let user = result[0];
        if (!user) {
          return res.status(400).send('Invalid token.');
        }

        let updateQuery = "UPDATE accounts SET isVerified = 1 WHERE id = ?";
        const updateValues = [user.id];

        con.query(updateQuery, updateValues, (updateErr, updateResult) => {
            if (updateErr) {
                return res.status(500).send('Error updating the user.');
            }

            if (user.role == "professor") {
              return res.render("login", { user: req.user, error: undefined, target: "professor", verification: undefined });
            } else if (user.role == "student") {
              return res.render("login", { user: req.user, error: undefined, target: "student", verification: undefined });
            }
            
        });
    });
  } catch (error) {
      console.log(error);
      return res.status(500).send('Error verifying email.');
  }
});



app.delete('/delete-member', (req, res) => {
  const { course_id, user_email } = req.body;
  const query = `DELETE FROM course_members WHERE course_id = ? AND user_email = ?`;

  con.query(query, [course_id, user_email], (error, results) => {
      if (error) {
          return res.status(500).json({ error: 'Database query error' });
      }
      res.status(200).json({ message: 'Member deleted successfully' });
  });
});

app.get('/course-members', (req, res) => {
  const courseId = req.query.id;
  const email = req.user.email;
  const query = `SELECT * FROM course_members WHERE course_id = ?`;

  con.query(query, [courseId, email], (error, results) => {
      if (error) {
          return res.status(500).json({ error: 'Database query error' });
      }
      res.json(results);
  });
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
  
  fetch(`http://${question_creator_service}:${port_question_service}/programs/`, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => res.render("questions", { user: req.user, programs:data}))
  .catch(error => {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  });
});


app.get('/manage-questions', (req, res) => {
  if (!req.user){
    return res.render("show-manage-questions", { user: req.user, data: undefined});
  }
  let user = req.user;
  fetch(`http://${question_creator_service}:${port_question_service}/all_entrys/`, {
    method: 'GET',
    headers: {
      'user': user.email
    }
  })
  .then(response => response.json())
  .then(data => res.render("show-manage-questions", { user: req.user, data: data}))
  .catch(error => {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  });
});

app.get('/courses', (req, res) => {
  return res.render("courses", { user: req.user});
});


app.get('/manage-courses', async (req, res) => {
  try {
    const programsUrl = `http://${question_creator_service}:${port_question_service}/programs`;

    const programsResponse = await fetch(programsUrl, { method: 'GET' });
    const programs = await programsResponse.json();
    console.log(programs);

    const coursesPromises = programs.map(program => {
      const queryParams = new URLSearchParams({
        user: req.user.email,
        program: program.program_name
      });
      const coursesUrl = `http://${question_creator_service}:${port_question_service}/get_courses/?${queryParams}`;
      return fetch(coursesUrl, { method: 'GET' }).then(response => response.json());
    });

    const allCourses = await Promise.all(coursesPromises);

    const programsWithCourses = programs.map((program, index) => ({
      program_name: program.program_name,
      courses: allCourses[index]
    }));

    console.log(programsWithCourses[0].courses);

    res.render("manage-courses", { user: req.user, programsWithCourses });
  } catch (error) {
    console.error('Error:', error);
    res.render("manage-courses", { user: req.user, programsWithCourses: [] });
  }
});

app.delete('/delete-course', (req, res) => {
  if (!req.session.passport.user) {
    return res.status(401).send('No User signed in!');
  }

  const userId = req.user.email;
  const courseId = req.query.id;

  const query_delete = 'DELETE FROM course WHERE id = ? AND user = ?';
  const values = [courseId, userId];
  console.log(values);

  con.query(query_delete, values, (err, result) => {
    if (err) {
      console.error('Error deleting course:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Course not found or not authorized to delete this course');
    }

    return res.status(200).send('Course deleted successfully');
  });
});



app.get("/log-in-prof", (req, res) => {
  if (req.session.messages){
    const error = req.session.messages.length > 0 ? req.session.messages[req.session.messages.length - 1] : undefined;
    return res.render("login", { user: req.user, error: error, target: "professor", verification: undefined });
  } else {
    return res.render("login", { user: req.user, error: undefined, target: "professor", verification: undefined });
  }
  
});

app.get("/log-in-student", (req, res) => {
  if (req.session.messages){
    const error = req.session.messages.length > 0 ? req.session.messages[req.session.messages.length - 1] : undefined;
    return res.render("login", { user: req.user, error: error, target: "student", verification: undefined });
  } else {
    return res.render("login", { user: req.user, error: undefined, target: "student", verification: undefined });
  }
});


app.get('/', (req, res) => {
  return res.render("login", { user: req.user, error: undefined, target: undefined, verification: undefined });
});


/*
app.post(
  "/log-in-student",
  passport.authenticate("stud", {
    successRedirect: "/courses",
    failureRedirect: "/log-in-student",
    failureMessage: true
  })
);

app.post(
  "/log-in-prof",
  passport.authenticate("prof", {
    successRedirect: "/questions",
    failureRedirect: "/log-in-prof",
    failureMessage: true
  })
);

*/
app.post("/log-in-student", (req, res, next) => {
  const return_to_req = req.session.returnTo;
  passport.authenticate("stud", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/log-in-student");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const redirectTo = return_to_req || '/courses';
      delete req.session.returnTo;
      return res.redirect(redirectTo);
    });
  })(req, res, next);
});

app.post("/log-in-prof", (req, res, next) => {
  const return_to_req = req.session.returnTo;
  passport.authenticate("prof", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/log-in-prof");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const redirectTo = return_to_req || '/questions';
      delete req.session.returnTo;
      return res.redirect(redirectTo);
    });
  })(req, res, next); 
});



app.get('/sign-up-student', (req, res) => {
  return res.render("sign-up-student", {error: undefined});
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

          const verificationToken = uuidv4();

          bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
              // If the email is not in use, proceed with the insertion
              let query_insert = "INSERT INTO accounts (firstname, lastname, email, password, role, verificationToken) VALUES (?,?,?,?,?, ?)";
              const values_insert = [req.body.fname, req.body.lname, req.body.email, hashedPassword, "student", verificationToken];

              con.query(query_insert, values_insert, async (err) => {
                  if (err) {
                      return next(err);
                  }
                  await sendVerificationEmail(req.body.fname, req.body.lname, req.body.email, verificationToken);
                  return res.render("login", { user: req.user, error: undefined, target: "student", verification: 1 });
              });
            });   
      });
  } catch (error) {
      next(error);
  }
});

app.get('/sign-up-prof', (req, res) => {
  return res.render("sign-up-prof", {error: undefined});
});

app.post("/sign-up-prof", (req, res, next) => {
  try {
    
    /*
      const emailPattern = /^[a-zA-Z0-9._%+-]+@reutlingen-university\.de$/;
      if (emailPattern.test(req.body.email) === false){
        return res.render("sign-up-student", { error: "Not a reutlingen university professor email."} )

    
      }
        */
      
      let query_check = "SELECT * FROM accounts WHERE email = ?";
      const values_check = [req.body.email];

      con.query(query_check, values_check, (err, result) => {
          if (err) {
              return next(err);
          }

          if (result.length > 0) {
              return res.render("sign-up-prof", { error: "Email already in use."} )
          }

          const verificationToken = uuidv4();

          bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
              // If the email is not in use, proceed with the insertion
              let query_insert = "INSERT INTO accounts (firstname, lastname, email, password, role, verificationToken) VALUES (?,?,?,?,?,?)";
              const values_insert = [req.body.fname, req.body.lname, req.body.email, hashedPassword, "professor", verificationToken];

              con.query(query_insert, values_insert, async (err) => {
                  if (err) {
                      return next(err);
                  }
                  await sendVerificationEmail(req.body.fname, req.body.lname, req.body.email, verificationToken);
                  return res.render("login", { user: req.user, error: undefined, target: "professor", verification: 1 });
              });
            });   
      });
  } catch (error) {
      next(error);
  }
});


app.post('/upload_min', upload.single('image'), (req, res) => {
  if (!req.session.passport.user){
    return res.status(500).send('No User signed in!')
  }

  let userData = {
    user: req.session.passport.user,
    ...JSON.parse(req.body.json)
  };
  userData = JSON.stringify(userData);
  const formData = new FormData();
  const blob = new Blob([req.file.buffer], { mimetype: req.file.mimetype });
  formData.append('image', blob);
  formData.append('json', userData)
  formData.append('mimetype', req.file.mimetype)

  fetch(`http://${question_creator_service}:${port_question_service}/upload_min/`, {
    method: 'POST',
    body: formData
  })
  .then(response => res.send(response))
  .catch(error => {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  });
});


app.post('/send', (req, res) => {
  if (!req.session.passport.user){
    return res.status(500).send('No User signed in!')
  }
  const userData = {
    user: req.session.passport.user,
    ...req.body
  };
  fetch(`http://${question_creator_service}:${port_question_service}/send/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  });
});

app.post('/add_course', (req, res) => {
  if (!req.session.passport.user){
    return res.status(500).send('No User signed in!')
  }
  const userData = {
    user: req.session.passport.user,
    ...req.body
  };
  fetch(`http://${question_creator_service}:${port_question_service}/add_course/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  });
});



app.post('/update', (req, res) => {
  if (!req.session.passport.user){
    return res.status(500).send('No User signed in!')
  }

  const userData = {
    user: req.session.passport.user,
    ...req.body
  };
  fetch(`http://${question_creator_service}:${port_question_service}/change/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  })
  .then(response => res.redirect('/manage-questions'))
  .catch(error => {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  });
});



app.post('/update_img', upload.single('image'), (req, res) => {
  if (!req.session.passport.user){
    return res.status(500).send('No User signed in!')
  }

  let userData = {
    user: req.session.passport.user,
    ...JSON.parse(req.body.json)
  };
  userData = JSON.stringify(userData);
  const formData = new FormData();
  const blob = new Blob([req.file.buffer], { mimetype: req.file.mimetype });
  formData.append('image', blob);
  formData.append('json', userData)
  formData.append('mimetype', req.file.mimetype)

  fetch(`http://${question_creator_service}:${port_question_service}/change-img/`, {
    method: 'POST',
    body: formData
  })
  .then(response => res.redirect('/manage-questions'))
  .catch(error => {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  });
});



app.get('/get_question', (req, res) => {

  const queryParams = new URLSearchParams({
    course: req.query.course,
    lection: req.query.lection,
    position: req.query.position
  });
  // Construct the URL with parameters
  let url = `http://${question_creator_service}:${port_question_service}/get_question/?${queryParams}`;

  // Make the GET request
  fetch(url, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  });
});


app.get('/get_courses', (req, res) => {
  const queryParams = new URLSearchParams({
    user: req.user.email,
    program: req.query.program
  });

  // Construct the URL with parameters
  let url = `http://${question_creator_service}:${port_question_service}/get_courses/?${queryParams}`;

  // Make the GET request
  fetch(url, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  });
});



app.get('/programs', (req, res) => {

  // Construct the URL with parameters
  let url = `http://${question_creator_service}:${port_question_service}/programs`;

  // Make the GET request
  fetch(url, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  });
});


app.get('/get_positions', (req, res) => {
  const queryParams = new URLSearchParams({
    user: req.user.email,
    program: req.query.program,
    course: req.query.course,
    lection: req.query.lection

  });

  // Construct the URL with parameters
  let url = `http://${question_creator_service}:${port_question_service}/get_positions/?${queryParams}`;

  // Make the GET request
  fetch(url, {
    method: 'GET',
  })
  .then(response => response.json())
  .then(data => res.send(data))
  .catch(error => {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  });
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});