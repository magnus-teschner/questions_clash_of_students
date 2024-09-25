const express = require('express');
const jwt = require('jsonwebtoken');
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
mailjet_private_key = "9b2b92a8e47833cfaeb1488d47dc1790";
backend = "127.0.0.1"

const mailjet = Mailjet.apiConnect(
  mailjet_public_key,
  mailjet_private_key
);

courseService = process.env.COURSESERVICE || "localhost";
coursePort = process.env.COURSEPORT || 5003;


//common functions
const axios = require('axios');

const makePutRequest = async (url, data = {}, headers = { 'Content-Type': 'application/json' }) => {
  try {
    const response = await axios.put(url, data, { headers });
    return { data: response.data, status: response.status };
  } catch (error) {
    return {
      error: true,
      data: error.response ? error.response.data : error.message,
      status: error.response ? error.response.status : 500
    };
  }
};

const makeGetRequest = async (url, headers = { 'Content-Type': 'application/json' }) => {
  try {
    const response = await axios.get(url, { headers });
    return { data: response.data, status: response.status };
  } catch (error) {
    return {
      error: true,
      data: error.response ? error.response.data : error.message,
      status: error.response ? error.response.status : 500
    };
  }
};

const makePostRequest = async (url, data = {}, headers = { 'Content-Type': 'application/json' }) => {
  try {
    const response = await axios.post(url, data, { headers });
    return { data: response.data, status: response.status };
  } catch (error) {
    return {
      error: true,
      data: error.response ? error.response.data : error.message,
      status: error.response ? error.response.status : 500
    };
  }
};

const config_mysql = {
  user: "admin",
  password: "admin",
  host: "127.0.0.1",
  database: "clashOfStudents"
};

app.use((req, res, next) => {
  if (!req.isAuthenticated() && req.method === 'GET' && !req.path.includes('reset-password') && req.path !== '/favicon.ico' && req.path !== '/log-in-prof' && req.path !== '/sign-up-prof' && req.path !== '/sign-up-student' && req.path !== '/log-in-student' && req.path !== '/') {
    req.session.returnTo = req.originalUrl;
  }
  next();
});

const con = mysql.createConnection(config_mysql);

passport.use('stud',
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
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

        else if (result[0].role == 'professor') {
          return done(null, false, { message: "No access for professors" });

        }

        const db_first = result[0].firstname;
        const db_last = result[0].lastname;
        const db_email = result[0].email;
        const db_password = result[0].password;
        const db_id = result[0].user_id;

        try {
          const match = await bcrypt.compare(password, db_password);
          if (!match) {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
          } else {
            let query_score = "SELECT score FROM scores WHERE user_id =?";
            const id_user = [db_id];
            console.log('ID USER', id_user)

            con.query(query_score, id_user, (err, userScore) => {
              if (err) {
                return done(err);
              }
              const db_score = userScore[0].score;
              let user = {
                user_id: db_id,
                firstname: db_first,
                lastname: db_last,
                email: db_email,
                score: db_score,
              };
              console.log(user)
              return done(null, user);
            });
          }
        } catch (bcryptError) {
          return done(bcryptError);
        }
      });

    } catch (err) {
      return done(err);
    }
  })
);

passport.use('prof',
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
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

        const db_id = result[0].user_id
        const db_first = result[0].firstname;
        const db_last = result[0].lastname;
        const db_email = result[0].email;
        const db_password = result[0].password;

        try {
          const match = await bcrypt.compare(password, db_password);
          if (!match) {
            return done(null, false, { message: "Incorrect password" })
          } else {
            let user = {user_id: db_id, firstname: db_first, lastname: db_last, email: db_email };
            return done(null, user);
          }
        } catch (bcryptError) {
          return done(bcryptError);
        }
      });

    } catch (err) {
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
      const db_id = result[0].user_id;
      const db_first = result[0].firstname;
      const db_last = result[0].lastname;
      const db_email = result[0].email;
      const db_role = result[0].role;

      if (db_role === 'student') {
        const query_score = "SELECT score FROM scores WHERE user_id = ?";
        const user_id = [db_id];
        con.query(query_score, user_id, (err, userScore) => {
          if (err) {
            return done(err);
          }

          const db_score = userScore.length > 0 ? userScore[0].score : 0;
          let user = { user_id: db_id, firstname: db_first, lastname: db_last, email: db_email, score: db_score };
          return done(null, user);
        });
      } else {
        let user = { user_id: db_id, firstname: db_first, lastname: db_last, email: db_email, score: null };
        return done(null, user);
      }
    });
  } catch (err) {
    done(err);
  }
});

async function sendVerificationEmail(firstname, lastname, email, token) {
  const verificationLink = `http://${backend}:${port}/verify-email?token=${token}`;

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


app.put('/rename-course', (req, res) => {
  const user_id = req.user.user_id;
  const course_id = req.body.course_id;
  const new_course_name = req.body;

  let url = `http://${courseService}:${coursePort}/rename-course`;

  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, course_id, new_course_name }),  // Übergabe der Daten
  })
    .then(response => {
      if (response.ok) {
        res.status(200).send('Course renamed successfully');
      } else {
        return response.text().then(text => res.status(response.status).send(text));
      }
    })
    .catch(error => {
      console.error('Error renaming course:', error);
      return res.status(500).send('Internal Server Error');
    });
});

app.put('/move-course', (req, res) => {
  const { course_id, new_program } = req.body;

  if (!req.session.passport.user) {
    return res.status(401).send('No User signed in!');
  }

  const userId = req.user.email;

  // Update the program in the course table
  const query_update_course = 'UPDATE course SET program_name = ? WHERE id = ? AND user = ?';
  const values_course = [new_program, course_id, userId];

  con.query(query_update_course, values_course, (err, result) => {
    if (err) {
      console.error('Error moving course:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Course not found or not authorized to move this course');
    }

    // Update the program in the questions table
    const query_update_questions = 'UPDATE questions SET program = ? WHERE course = (SELECT course_name FROM courses WHERE id = ?)';
    const values_questions = [new_program, course_id];
    console.log(values_questions);

    con.query(query_update_questions, values_questions, (err, result) => {
      if (err) {
        console.error('Error updating program in questions:', err);
        return res.status(500).send('Internal Server Error');
      }

      return res.status(200).send('Course moved and questions updated successfully');
    });
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
    .then(data => res.render("questions", { user: req.user, programs: data }))
    .catch(error => {
      console.error('Error:', error);
      return res.status(500).send('Internal Server Error');
    });
});


app.get('/manage-questions', (req, res) => {
  if (!req.user) {
    return res.render("show-manage-questions", { user: req.user, data: undefined });
  }
  let user = req.user;
  fetch(`http://${question_creator_service}:${port_question_service}/all_entrys/`, {
    method: 'GET',
    headers: {
      'user': user.email
    }
  })
    .then(response => response.json())
    .then(data => res.render("show-manage-questions", { user: req.user, data: data }))
    .catch(error => {
      console.error('Error:', error);
      return res.status(500).send('Internal Server Error');
    });
});

app.get('/courses', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const queryParams = new URLSearchParams({
    user_id: req.user.user_id
  });

  let url = `http://${courseService}:${coursePort}/courses/?${queryParams}`;

  fetch(url, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      // Data vom Microservice in der Antwort enthalten
      const enrolledCourses = data.enrolledCourses || [];
      const nonEnrolledCourses = data.nonEnrolledCourses || [];

      res.render('courses', {
        user: req.user,
        enrolledCourses: enrolledCourses,
        nonEnrolledCourses: nonEnrolledCourses
      });
    })
    .catch(error => {
      console.error('Error fetching courses from microservice:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
});

// Endpoint to handle course enrollment
app.post('/enroll-course', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  const user_id = req.user.user_id;
  const course_id = req.body.course_id;

  console.log(user_id, course_id, 'HIEERRR')

  let url = `http://${courseService}:${coursePort}/enroll-course`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, course_id }),
  })
    .then(response => {
      if (response.ok) {
        res.status(200).send('Enrolled successfully');
      } else {
        return response.text().then(text => res.status(500).send(text));
      }
    })
    .catch(error => {
      console.error('Error enrolling in course:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
});

// Endpoint to handle course unenrollment
app.post('/unenroll-course', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const user_id = req.user.user_id; 
  const course_id = req.body.course_id;

  let url = `http://${courseService}:${coursePort}/unenroll-course`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, course_id }),
  })
    .then(response => {
      if (response.ok) {
        res.status(200).send('Unenrolled successfully');
      } else {
        return response.text().then(text => res.status(500).send(text));
      }
    })
    .catch(error => {
      console.error('Error unenrolling from course:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
});

app.get('/course-progress', (req, res) => {
  if (!req.user) {
    return res.status(401).send('No User signed in!');
  }

  const userId = req.user.user_id;

  const query_progress = 'SELECT course_id, progress, course_score FROM course_members WHERE user_id = ?';

  con.query(query_progress, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching course progress:', err);
      return res.status(500).send('Internal Server Error');
    }

    res.status(200).json(results);
  });
});

app.get('/course-members', (req, res) => {
  const courseId = req.query.id;
  const userId = req.user.user_id;
  const query = `SELECT * FROM course_members WHERE course_id = ?`;

  con.query(query, [courseId, userId], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Database query error' });
    }
    res.json(results);
  });
});

app.get('/ranking', (req, res, next) => {
  const courseQuery = `SELECT DISTINCT course_name, course_id FROM courses`;

  const selectedCourse = req.query.course || 'all';

  let rankingQuery;
  let queryParams = [];

  if (selectedCourse === 'all') {
    // Gesamtranking (alle Kurse)
    rankingQuery = `
      SELECT a.user_id, a.firstname, a.lastname, s.score
      FROM accounts a
      JOIN scores s ON a.user_id = s.user_id
      ORDER BY s.score DESC
    `;
  } else {
    // Kursbasiertes Ranking
    rankingQuery = `
      SELECT a.user_id, a.firstname, a.lastname, cm.course_score, c.course_name
      FROM accounts a
      JOIN course_members cm ON a.user_id = cm.user_id
      JOIN courses c ON cm.course_id = c.course_id
      WHERE c.course_name = ?
      ORDER BY cm.course_score DESC
    `;
    queryParams = [selectedCourse];
  }

  con.query(courseQuery, [], (err, courses) => {
    if (err) {
      return next(err);
    }

    con.query(rankingQuery, queryParams, (err, rows) => {
      if (err) {
        return next(err);
      }

      let rankingList;
      if (selectedCourse === 'all') {
        // Alle Kurse
        rankingList = rows.sort((a, b) => b.score - a.score).map((user, index, sortedUsers) => {
          const rank = index > 0 && sortedUsers[index - 1].score === user.score ? sortedUsers[index - 1].rank : index + 1;
          return {
            user_id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            score: user.score,
            rank: rank
          };
        });
      } else {
        // Ausgewählter Kurs
        rankingList = rows.sort((a, b) => b.course_score - a.course_score).map((user, index, sortedUsers) => {
          const rank = index > 0 && sortedUsers[index - 1].course_score === user.course_score ? sortedUsers[index - 1].rank : index + 1;
          return {
            user_id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            course_score: user.course_score, 
            course_name: user.course_name, 
            rank: rank
          };
        });
      }

      res.render('ranking', {
        user: req.user,
        rankingList: rankingList,
        courses: courses,
        selectedCourse: selectedCourse 
      });
    });
  });
});

app.get('/manage-courses', async (req, res) => {
  try {
    const user = req.user;
    const programsUrl = `http://${question_creator_service}:${port_question_service}/programs`;

    const programsResponse = await fetch(programsUrl, { method: 'GET' });
    const programs = await programsResponse.json();

    const coursesPromises = programs.map(program => {
      console.log(user);
      const queryParams = new URLSearchParams({
        user: user.email,
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


    res.render("manage-courses", { user: req.user, programsWithCourses });
  } catch (error) {
    console.error('Error:', error);
    res.render("manage-courses", { user: req.user, programsWithCourses: [] });
  }
});

app.delete('/delete-course', (req, res) => {
  const user_id = req.user.user_id;
  const course_id = req.body.course_id;

  let url = `http://${courseService}:${coursePort}/delete-course`;

  fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_id, course_id }),
  })
    .then(response => {
      if (response.ok) {
        res.status(200).send('Course deleted successfully');
      } else {
        return response.text().then(text => res.status(response.status).send(text));
      }
    })
    .catch(error => {
      console.error('Error deleting course:', error);
      return res.status(500).send('Internal Server Error');
    });
});


app.get("/log-in-prof", (req, res) => {
  if (req.session.messages) {
    const error = req.session.messages.length > 0 ? req.session.messages[req.session.messages.length - 1] : undefined;
    return res.render("login", { user: req.user, error: error, target: "professor", verification: undefined });
  } else {
    return res.render("login", { user: req.user, error: undefined, target: "professor", verification: undefined });
  }

});

app.get("/log-in-student", (req, res) => {
  if (req.session.messages) {
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
  let return_to_req = req.session.returnTo;
  console.log(return_to_req);
  passport.authenticate("stud", (err, user, info) => {
    if (err) {
      return next(err);
    }
    console.log(user);
    if (!user) {
      req.session.messages = [info ? info.message : 'Invalid credentials'];
      console.log("redirect")
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
  console.log(return_to_req);
  passport.authenticate("prof", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.session.messages = [info ? info.message : 'Invalid credentials'];
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
  return res.render("sign-up-student", { error: undefined });
});

app.post("/sign-up-student", async (req, res, next) => {
  try {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@student.reutlingen-university\.de$/;
    if (emailPattern.test(req.body.email) === false) {
      return res.render("sign-up-student", { error: "Not a reutlingen university student email." })

    }

    let query_check = "SELECT * FROM accounts WHERE email = ?";
    const values_check = [req.body.email];

    con.query(query_check, values_check, (err, result) => {
      if (err) {
        return next(err);
      }

      if (result.length > 0) {
        return res.render("sign-up-student", { error: "Email already in use." })
      }

      const verificationToken = uuidv4();

      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        // If the email is not in use, proceed with the insertion
        let query_insert = "INSERT INTO accounts (firstname, lastname, email, password, role, verificationToken) VALUES (?,?,?,?,?, ?)";
        const values_insert = [req.body.fname, req.body.lname, req.body.email, hashedPassword, "student", verificationToken];

        con.query(query_insert, values_insert, async (err) => {
          if (err) {
            return next(err);
          }

          con.query("SELECT LAST_INSERT_ID() as id", (err, idResult) => {
            if (err) {
              return next(err);
            }
            // Get the ID of the newly inserted account
            const accountId = idResult[0].id;

            let query_insert_score = "INSERT INTO scores (user_id, score) VALUES (?,?)";
            const values_insert_score = [accountId, 0];

            con.query(query_insert_score, values_insert_score, async (err) => {
              if (err) {
                return next(err);
              }
              try {
                await sendVerificationEmail(req.body.fname, req.body.lname, req.body.email, verificationToken);
                return res.render("login", { user: req.user, error: undefined, target: "student", verification: 1 });
              } catch (emailError) {
                return next(emailError);
              }
            });
          });
        });
      });
    });
  } catch (error) {
    next(error);
  }
});

app.get('/sign-up-prof', (req, res) => {
  return res.render("sign-up-prof", { error: undefined });
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
        return res.render("sign-up-prof", { error: "Email already in use." })
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
  if (!req.session.passport.user) {
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
  if (!req.session.passport.user) {
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
  if (!req.session.passport.user) {
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
  if (!req.session.passport.user) {
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
  if (!req.session.passport.user) {
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

app.get('/api/questions/:user/:program/:course/:lection/:position', (req, res) => {
  const { user, program, course, lection, position } = req.params;

  const query = `
    SELECT * FROM questions
    WHERE user = ? AND program = ? AND course = ? AND lection = ? AND position = ?
  `;

  console.log(user, program, course, lection, position);

  con.query(query, [user, program, course, lection, position], (err, result) => {
    if (err) {
      console.error('Error fetching question:', err);
      return res.status(500).send('Internal Server Error');
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(result[0]);
  });
});


//
async function sendResetPasswordEmail(email, token) {
  const resetLink = `http://${backend}:${port}/reset-password/${token}`;

  const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: "your_email@gmail.com",
            Name: "Your App Name"
          },
          To: [
            {
              Email: email,
              Name: "User"
            }
          ],
          Subject: "Password Reset",
          TextPart: `You are receiving this because you (or someone else) have requested to reset the password for your account.
          Please click on the following link, or paste it into your browser to complete the process:
          ${resetLink}`,
          HTMLPart: `<p>You are receiving this because you (or someone else) have requested to reset the password for your account.</p>
          <p>Please click on the following link, or paste it into your browser to complete the process:</p>
          <a href="${resetLink}">Reset Password</a>`
        }
      ]
    });

  try {
    await request;
  } catch (err) {
    console.log(err.statusCode);
    throw err;
  }
}




app.get('/reset-password-request', (req, res) => {
  res.render('request-reset', { user: req.user });
});

app.post('/send-reset-email', (req, res, next) => {
  const email = req.body.email;
  const token = uuidv4();
  console.log(token);

  const query_update = 'UPDATE accounts SET verificationToken = ? WHERE email = ?';
  const values_update = [token, email];

  con.query(query_update, values_update, async (err) => {
    if (err) {
      console.error('Error updating database:', err);
      return res.status(500).send('Internal Server Error');
    }

    try {
      await sendResetPasswordEmail(email, token);
      res.render('success');
    } catch (emailError) {
      return next(emailError);
    }
  });
});

app.get('/reset-password/:token', (req, res) => {
  con.query('SELECT * FROM accounts WHERE verificationToken = ?',
    [req.params.token], (err, user) => {
      if (err || !user.length) return res.status(400).send('Password reset token is invalid or has expired.');
      res.render('reset-password', { token: req.params.token });
    });
});

app.post('/reset-password', (req, res) => {
  const { token, password, 'confirm-password': confirmPassword } = req.body;

  if (password !== confirmPassword) return res.status(400).send('Passwords do not match.');

  con.query('SELECT * FROM accounts WHERE verificationToken = ?',
    [token], (err, user) => {
      if (err || !user.length) return res.status(400).send('Password reset token is invalid or has expired.');

      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).send('Error hashing password.');

        con.query('UPDATE accounts SET password = ?, verificationToken = NULL WHERE email = ?',
          [hashedPassword, user[0].email], (err) => {
            if (err) return res.status(500).send('Error updating password.');
            res.render('success_change');
          });
      });
    });
});

// JWT secret key
const secretKey = 'yourSecretKey';

// Endpoint to generate a JWT token
app.post('/jwt', (req, res) => {
  const { program, course, professorEmail } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Construct the JWT payload
  const payload = {
    email: req.user.email,
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    program: program,
    course: course,
    professor_email: professorEmail
  };

  // Generate the token
  const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });

  // Send the token back as the response
  res.json({ result: token });
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});